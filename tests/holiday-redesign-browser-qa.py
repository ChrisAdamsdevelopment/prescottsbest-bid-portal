"""Visual and interaction QA for the redesigned holiday landing hero."""
from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,DEVNULL,STDOUT
import os,time,json,requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=[]
with TemporaryDirectory(prefix='pbc-holiday-rebuild-') as tmp:
 env={**os.environ,'PORT':'18997','DATA_DIR':tmp,'NODE_ENV':'development',
      'PORTAL_ADMIN_KEY':'local-synthetic-test-key-holiday-redesign-12345',
      'SITE_INDEXABLE':'false','PUBLIC_AI_ENABLED':'false','LEAD_FORM_ENABLED':'false'}
 server_log=open(root/'tests'/'holiday-redesign-server.log','w',encoding='utf-8')
 server=Popen(['node','server.mjs'],cwd=root,env=env,stdout=server_log,stderr=STDOUT)
 try:
  base='http://127.0.0.1:18997'
  for _ in range(100):
   try:
    if requests.get(base+'/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.15)
  else:raise RuntimeError('Local server failed to start')
  print('SERVER_START',server.poll(),requests.get(base+'/healthz',timeout=2).status_code,flush=True)
  opt=webdriver.ChromeOptions()
  opt.add_argument('--headless=new')
  opt.add_argument('--disable-gpu')
  opt.add_argument('--autoplay-policy=no-user-gesture-required')
  opt.add_argument('--user-data-dir='+str(Path(tmp)/'chrome'))
  browser=webdriver.Chrome(options=opt)
  wait=WebDriverWait(browser,25)
  try:
   for width,height in [(360,780),(390,844),(768,1024),(1440,900)]:
    browser.set_window_size(width,height)
    if width<=768:
     browser.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':True})
    else:browser.execute_cdp_cmd('Emulation.clearDeviceMetricsOverride',{})
    print('BEFORE_PAGE',width,server.poll(),requests.get(base+'/healthz',timeout=2).status_code,flush=True)
    browser.get(base+'/remodeling-preview/holiday-lighting')
    hero=wait.until(lambda b:b.find_element(By.CSS_SELECTOR,'.holiday-cinematic-head'))
    video=hero.find_element(By.CSS_SELECTOR,'video[data-brand-video]')
    film=hero.find_element(By.CSS_SELECTOR,'.brand-film')
    scene=hero.find_element(By.CSS_SELECTOR,'.holiday-cinema-scene')
    message=hero.find_element(By.CSS_SELECTOR,'.holiday-cinema-message')
    copy=hero.find_element(By.CSS_SELECTOR,'.holiday-head-copy')
    wait.until(lambda b:film.find_element(By.CSS_SELECTOR,'img.brand-film-poster').get_property('naturalWidth')>0)
    consent=browser.find_elements(By.CSS_SELECTOR,'#pbc-analytics-consent .analytics-consent-actions button')
    if consent:browser.execute_script('arguments[0].click()',consent[-1])
    browser.execute_script('window.scrollTo(0,0)')
    layout=browser.execute_script("""
     const rect=x=>{const r=x.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
     return {win:innerWidth,doc:document.documentElement.scrollWidth,hero:rect(arguments[0]),
      scene:rect(arguments[1]),film:rect(arguments[2]),copy:rect(arguments[3]),
      h1:rect(arguments[0].querySelector('h1')),button:rect(arguments[0].querySelector('.site-button')),
      fit:getComputedStyle(arguments[4]).objectFit};""",hero,scene,film,copy,video)
    assert layout['doc']<=width+3,('horizontal overflow',width,layout)
    assert layout['scene']['x']>=-2 and layout['scene']['right']<=width+3,('scene shift',width,layout)
    assert layout['film']['w']>width*.95,('video squeezed',width,layout)
    assert layout['button']['y']>layout['scene']['y']+layout['scene']['h']-2,('buttons over film',width,layout)
    if width<=620:
     assert 1.72<=layout['film']['w']/layout['film']['h']<=1.85,('film cropped/incorrect ratio',width,layout)
     assert layout['fit']=='contain',('mobile video is cropped',width,layout)
    browser.save_screenshot(str(root/'tests'/f'holiday-redesign-opening-{width}.png'))
    hero.screenshot(str(root/'tests'/f'holiday-redesign-fullhero-{width}.png'))
    if video.get_property('paused'):
     browser.execute_script('arguments[0].click()',hero.find_element(By.CSS_SELECTOR,'[data-film-toggle]'))
    wait.until(lambda b:not video.get_property('paused'))
    browser.execute_script('arguments[0].currentTime=5.2',video)
    wait.until(lambda b:'holiday-intro-complete' in hero.get_attribute('class'))
    time.sleep(1.2)
    fade=float(browser.execute_script('return getComputedStyle(arguments[0]).opacity',message))
    assert fade<.2,('timed text did not fade',width,fade)
    assert copy.find_element(By.TAG_NAME,'h1').is_displayed(),('primary H1 missing',width)
    links=[x.get_attribute('href') for x in copy.find_elements(By.CSS_SELECTOR,'.site-button')]
    assert any('/holiday-lighting/design' in x for x in links)
    assert any('/schedule' in x for x in links)
    browser.save_screenshot(str(root/'tests'/f'holiday-redesign-playing-{width}.png'))
    if width==1440:
     browser.execute_script('arguments[0].currentTime=9.1',video)
     time.sleep(.3)
     hero.screenshot(str(root/'tests'/'holiday-redesign-lastframe-1440.png'))
    browser.execute_script('arguments[0].click()',hero.find_element(By.CSS_SELECTOR,'[data-film-toggle]'))
    wait.until(lambda b:video.get_property('paused'))
    assert 'holiday-intro-complete' in hero.get_attribute('class'),('timed message reappeared on pause',width)
    out.append({'width':width,'fit':layout['fit'],'overflow':False,'videoWidth':round(layout['film']['w']),'messageFade':round(fade,2),'links':True})
   browser.execute_cdp_cmd('Emulation.setEmulatedMedia',{'media':'screen','features':[{'name':'prefers-reduced-motion','value':'reduce'}]})
   browser.get(base+'/remodeling-preview/holiday-lighting')
   quiet=wait.until(lambda b:b.find_element(By.CSS_SELECTOR,'.holiday-cinematic-head video'))
   assert quiet.get_property('paused'),'Autoplay must respect reduced motion'
  finally:browser.quit()
 finally:server.terminate();server.wait(timeout=12)
(root/'tests'/'holiday-redesign-results.json').write_text(json.dumps(out,indent=2),encoding='utf-8')
print('HOLIDAY_REDESIGN_BROWSER_PASS',json.dumps({'checks':out,'reducedMotion':True}))
