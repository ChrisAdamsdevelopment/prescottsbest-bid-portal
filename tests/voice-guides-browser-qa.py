"""Read-only responsive QA of three audio instruction controls before publication."""
from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,STDOUT
import os,time,json,requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
checks=[]
pages=[('/holiday-lighting/design','holiday-designer','holiday-lighting-designer-instructions-v1.m4a'),('/visual-design-preview','design-center','design-center-instructions-v1.m4a'),('/estimate','budget-explorer','budget-explorer-instructions-v1.m4a')]
with TemporaryDirectory(prefix='pbc-guide-test-') as temp:
 env={**os.environ,'PORT':'18992','DATA_DIR':temp,'NODE_ENV':'development',
  'PORTAL_ADMIN_KEY':'synthetic-local-voice-guide-key-12345678',
  'SITE_INDEXABLE':'false','PUBLIC_AI_ENABLED':'false','LEAD_FORM_ENABLED':'false'}
 log=open(root/'tests'/'voice-guides-server.log','w',encoding='utf-8')
 server=Popen(['node','server.mjs'],cwd=root,env=env,stdout=log,stderr=STDOUT)
 try:
  base='http://127.0.0.1:18992'
  for _ in range(100):
   try:
    if requests.get(base+'/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.12)
  else:raise RuntimeError('Server did not start')
  # Audio must stream with byte ranges, particularly for seeking on Android/iOS.
  for _,_,filename in pages:
   url=base+'/site-assets/audio-guides/'+filename
   h=requests.head(url,timeout=10)
   assert h.status_code==200,(filename,h.status_code)
   assert 'audio/mp4' in h.headers.get('content-type',''),filename
   assert h.headers.get('accept-ranges')=='bytes',filename
   assert int(h.headers.get('content-length','0'))>100_000,filename
   part=requests.get(url,headers={'Range':'bytes=0-1023'},timeout=10)
   assert part.status_code==206 and len(part.content)==1024,(filename,part.status_code)
   assert part.content[4:8]==b'ftyp',filename
   assert part.headers.get('content-range','').startswith('bytes 0-1023/'),filename
   suffix=requests.get(url,headers={'Range':'bytes=-32'},timeout=10)
   assert suffix.status_code==206 and len(suffix.content)==32,filename
   print('RECORDED_AUDIO_STREAM_PASS',filename,flush=True)
  opts=webdriver.ChromeOptions()
  opts.add_argument('--headless=new');opts.add_argument('--disable-gpu')
  opts.add_argument('--user-data-dir='+str(Path(temp)/'chrome'))
  driver=webdriver.Chrome(options=opts)
  wait=WebDriverWait(driver,20)
  try:
   for width,height in [(390,844),(1440,900)]:
    driver.set_window_size(width,height)
    if width==390:driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':True})
    else:driver.execute_cdp_cmd('Emulation.clearDeviceMetricsOverride',{})
    for path,key,filename in pages:
     driver.get(base+'/remodeling-preview'+path)
     el=wait.until(lambda d:d.find_element(By.CSS_SELECTOR,'[data-voice-guide="'+key+'"]'))
     assert el.get_attribute('data-guide-audio').endswith('/'+filename)
     btn=el.find_element(By.CSS_SELECTOR,'[data-guide-open]')
     panel=el.find_element(By.CSS_SELECTOR,'.voice-guide-panel')
     assert not panel.is_displayed(),('panel visible before click',path)
     assert btn.get_attribute('aria-expanded')=='false'
     driver.execute_script('arguments[0].scrollIntoView({block:"center",behavior:"instant"})',btn)
     btn.click()
     wait.until(lambda d:panel.is_displayed())
     assert btn.get_attribute('aria-expanded')=='true'
     wait.until(lambda d:'Playing recorded instructions' in el.find_element(By.CSS_SELECTOR,'[data-guide-status]').text)
     replay=el.find_element(By.CSS_SELECTOR,'[data-guide-restart]')
     pause=el.find_element(By.CSS_SELECTOR,'[data-guide-pause]')
     assert replay.is_displayed()
     assert el.find_element(By.CSS_SELECTOR,'[data-guide-close]').is_displayed()
     assert pause.is_enabled(),('recorded playback not active',path)
     driver.execute_script('arguments[0].scrollIntoView({block:"center",behavior:"instant"})',pause)
     pause.click()
     assert pause.text=='Resume'
     pause.click()
     assert pause.text=='Pause'
     replay.click()
     wait.until(lambda d:'Playing recorded instructions' in el.find_element(By.CSS_SELECTOR,'[data-guide-status]').text)
     assert btn.get_attribute('aria-expanded')=='true'
     details=el.find_element(By.CSS_SELECTOR,'details.voice-guide-transcript')
     summary=details.find_element(By.TAG_NAME,'summary')
     driver.execute_script('arguments[0].scrollIntoView({block:"center",behavior:"instant"})',summary)
     summary.click()
     assert details.get_attribute('open') is not None
     assert len(details.find_elements(By.CSS_SELECTOR,'ol li'))==4
     driver.execute_script('arguments[0].scrollIntoView({block:"center",behavior:"instant"})',el)
     data=driver.execute_script("""
      let r=arguments[0].getBoundingClientRect();
      return {width:innerWidth,doc:document.documentElement.scrollWidth,
       x:r.x,right:r.right,guideWidth:r.width,
       status:arguments[0].querySelector('[data-guide-status]').textContent,
       scriptLoaded:!![...document.scripts].find(s=>s.src.includes('voice-guides.js'))};
     """,el)
     assert data['doc']<=width+3,('horizontal overflow',width,path,data)
     assert data['x']>=-2 and data['right']<=width+3,('guide shifted',width,path,data)
     assert data['scriptLoaded']
     el.screenshot(str(root/'tests'/f'voice-guide-{key}-{width}.png'))
     el.find_element(By.CSS_SELECTOR,'[data-guide-close]').click()
     wait.until(lambda d:not panel.is_displayed())
     assert btn.get_attribute('aria-expanded')=='false'
     checks.append({'page':path,'width':width,'panel':'works','transcript':'four steps',
      'noOverflow':True,'recordedAudioStatus':data['status']})
     print('VOICE_GUIDE_UI_PASS',path,width,flush=True)
  finally:driver.quit()
 finally:server.terminate();server.wait(timeout=12);log.close()
(root/'tests'/'voice-guides-browser-results.json').write_text(json.dumps(checks,indent=2),encoding='utf8')
print('VOICE_GUIDE_BROWSER_PASS',len(checks),flush=True)
