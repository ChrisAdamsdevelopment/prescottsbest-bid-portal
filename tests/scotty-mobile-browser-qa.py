from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,DEVNULL
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import requests,os,time,json
root=Path(__file__).resolve().parents[1]
results=[]
with TemporaryDirectory(prefix='pbc-scotty-') as tmp:
 env={**os.environ,'PORT':'18949','DATA_DIR':tmp,
   'PORTAL_ADMIN_KEY':'synthetic-scotty-mobile-test-key-0123456789',
   'NODE_ENV':'development','SITE_INDEXABLE':'false','LEAD_FORM_ENABLED':'false',
   'PUBLIC_AI_ENABLED':'true','GEMINI_API_KEY':'local-mock-only'}
 proc=Popen(['node','--import','./tests/fake-gemini-fetch.mjs','server.mjs'],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  base='http://127.0.0.1:18949'
  for i in range(90):
   try:
    if requests.get(base+'/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.1)
  opts=webdriver.ChromeOptions()
  opts.add_argument('--headless=new')
  opts.add_argument('--user-data-dir='+str(Path(tmp)/'browser'))
  opts.add_argument('--disable-gpu')
  driver=webdriver.Chrome(options=opts)
  try:
   for width,height in [(390,844),(1440,900)]:
    driver.set_window_size(width,height)
    if width==390:
     driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':2,'mobile':True})
    else:
     driver.execute_cdp_cmd('Emulation.clearDeviceMetricsOverride',{})
    driver.get(base+'/remodeling-preview/')
    driver.execute_script('arguments[0].click()',driver.find_element(By.ID,'scotty-open'))
    WebDriverWait(driver,15).until(lambda x:x.find_element(By.ID,'scotty-panel').is_displayed())
    dialog=driver.find_element(By.ID,'scotty-panel')
    geom=driver.execute_script('const p=arguments[0].getBoundingClientRect();return {w:p.width,h:p.height,top:p.top,innerWidth:innerWidth,innerHeight:innerHeight}',dialog)
    if width==390:
     assert geom['w']>=geom['innerWidth']-3,geom
     assert geom['h']>=geom['innerHeight']-3,geom
    else:assert geom['w']>=500 and geom['h']>=550,geom
    WebDriverWait(driver,12).until(lambda x:'ready' in x.find_element(By.ID,'scotty-status').text.lower())
    cb=driver.find_element(By.ID,'scotty-consent')
    driver.execute_script('arguments[0].click()',cb)
    field=driver.find_element(By.ID,'scotty-question')
    field.send_keys('How can I prepare for a kitchen remodel?')
    WebDriverWait(driver,8).until(lambda x:x.find_element(By.ID,'scotty-send').is_enabled())
    driver.execute_script('arguments[0].click()',driver.find_element(By.ID,'scotty-send'))
    WebDriverWait(driver,16).until(lambda x:'New answer from Scotty' in x.find_element(By.ID,'scotty-response-announcement').text)
    messages=driver.find_elements(By.CSS_SELECTOR,'#scotty-chat-log .scotty-reply')
    assert len(messages)==1
    assert 'For your project' in messages[0].text,messages[0].text
    assert driver.find_element(By.ID,'scotty-jump').is_displayed()
    visible=driver.execute_script('const r=arguments[0].getBoundingClientRect(), l=arguments[1].getBoundingClientRect(); return {replyTop:r.top,logTop:l.top,logBottom:l.bottom,within:r.top>=l.top-3&&r.top<l.bottom}',messages[0],driver.find_element(By.ID,'scotty-chat-log'))
    assert visible['within'],visible
    driver.save_screenshot(str(root/('scotty-qa-'+str(width)+'.png')))
    driver.execute_script('arguments[0].click()',driver.find_element(By.ID,'scotty-close'))
    assert driver.find_element(By.ID,'scotty-panel').get_attribute('hidden') is not None
    driver.execute_script('arguments[0].click()',driver.find_element(By.ID,'scotty-open'))
    assert len(driver.find_elements(By.CSS_SELECTOR,'#scotty-chat-log .scotty-reply'))==1
    results.append({'width':width,'height':height,'geometry':geom,'answerVisible':visible,'chatRestored':True})
  finally:driver.quit()
 finally:proc.terminate();proc.wait(timeout=10)
(root/'tests'/'scotty_browser_report.json').write_text(json.dumps({'status':'PASS','results':results},indent=2),encoding='utf8')
print('SCOTTY_BROWSER_PASS',json.dumps(results),flush=True)
