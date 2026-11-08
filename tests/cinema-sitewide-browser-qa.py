"""Sitewide cinematic hero/browser QA: actual layout, timed captions, usable controls."""
from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,STDOUT
import os,time,json,requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
routes=[('/', 'home','.cinema-home'),('/visual-design-preview','design','.cinema-design'),('/holiday-lighting','holiday','.holiday-cinematic-head')]
records=[]
with TemporaryDirectory(prefix='pbc-cinema-three-') as tmp:
 env={**os.environ,'PORT':'18998','DATA_DIR':tmp,'NODE_ENV':'development',
  'PORTAL_ADMIN_KEY':'cinema-local-synthetic-admin-key-123456789',
  'SITE_INDEXABLE':'false','PUBLIC_AI_ENABLED':'false','LEAD_FORM_ENABLED':'false'}
 log=open(root/'tests'/'cinema-sitewide-server.log','w',encoding='utf-8')
 server=Popen(['node','server.mjs'],cwd=root,env=env,stdout=log,stderr=STDOUT)
 try:
  base='http://127.0.0.1:18998'
  for i in range(120):
   try:
    if requests.get(base+'/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.15)
  else:raise RuntimeError('Test server failed')
  opts=webdriver.ChromeOptions()
  opts.add_argument('--headless=new')
  opts.add_argument('--disable-gpu')
  opts.add_argument('--autoplay-policy=no-user-gesture-required')
  opts.add_argument('--user-data-dir='+str(Path(tmp)/'chrome'))
  driver=webdriver.Chrome(options=opts)
  wait=WebDriverWait(driver,24)
  try:
   for width,height in [(360,780),(390,844),(768,1000),(1440,900)]:
    driver.set_window_size(width,height)
    if width<=768:driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':True})
    else:driver.execute_cdp_cmd('Emulation.clearDeviceMetricsOverride',{})
    for page,slug,heroSelector in routes:
     print('CHECK',width,slug,flush=True)
     driver.get(base+'/remodeling-preview'+page.rstrip('/'))
     hero=wait.until(lambda d:d.find_element(By.CSS_SELECTOR,heroSelector))
     film=hero.find_element(By.CSS_SELECTOR,'[data-brand-film="'+slug+'"]')
     scene=hero.find_element(By.CSS_SELECTOR,'.cinema-scene' if slug!='holiday' else '.holiday-cinema-scene')
     caption=hero.find_element(By.CSS_SELECTOR,'.cinema-message' if slug!='holiday' else '.holiday-cinema-message')
     video=film.find_element(By.CSS_SELECTOR,'video')
     controls=film.find_element(By.CSS_SELECTOR,'.brand-film-controls')
     wait.until(lambda d:film.find_element(By.CSS_SELECTOR,'.brand-film-poster').get_property('naturalWidth')>0)
     choices=driver.find_elements(By.CSS_SELECTOR,'#pbc-analytics-consent .analytics-consent-actions button')
     if choices:driver.execute_script('arguments[0].click()',choices[-1])
     driver.execute_script('window.scrollTo(0,0)')
     boxes=driver.execute_script("""
      const box=e=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
      const h=arguments[0],s=arguments[1],f=arguments[2],v=arguments[3];
      return {win:innerWidth,sw:document.documentElement.scrollWidth,hero:box(h),scene:box(s),film:box(f),
        h1:box(h.querySelector('h1')),cta:box(h.querySelector('.site-actions a')),
        fit:getComputedStyle(v).objectFit,controls:getComputedStyle(f.querySelector('.brand-film-controls')).display};""",hero,scene,film,video)
     assert boxes['sw']<=width+3,('horizontal overflow',slug,width,boxes)
     assert boxes['scene']['x']>=-2 and boxes['scene']['right']<=width+3,('offcenter',slug,width,boxes)
     assert boxes['film']['w']>=width*.94,('squeezed',slug,width,boxes)
     assert boxes['cta']['y']>=boxes['scene']['bottom']-2,('CTA overlaying moving footage',slug,width,boxes)
     assert film.find_elements(By.CSS_SELECTOR,'[data-film-toggle] svg'),('not icon-only',slug,width)
     if width<=620:
      assert boxes['fit']=='contain',('mobile video crop',slug,width,boxes)
      assert 1.73<boxes['film']['w']/boxes['film']['h']<1.82,('video aspect',slug,width,boxes)
     assert hero.find_element(By.CSS_SELECTOR,'h1').is_displayed()
     if slug=='design':
      nav=driver.find_element(By.CSS_SELECTOR,'.design-center-nav')
      assert driver.execute_script('return arguments[0].getBoundingClientRect().top',nav)>=boxes['hero']['bottom']-2
      assert 'My Ideas' not in nav.text and ' 0' not in nav.text,nav.text
      assert len(nav.find_elements(By.CSS_SELECTOR,'a.design-center-nav-item'))==8
      if width in (390,1440):
       driver.execute_script('arguments[0].scrollIntoView({block:"start",behavior:"instant"})',nav)
       driver.save_screenshot(str(root/'tests'/f'cinema-design-navigation-{width}.png'))
       driver.execute_script('arguments[0].scrollIntoView({block:"start",behavior:"instant"})',scene)
     hero.screenshot(str(root/'tests'/f'cinema-{slug}-opening-{width}.png'))
     play=film.find_element(By.CSS_SELECTOR,'[data-film-toggle]')
     mute=film.find_element(By.CSS_SELECTOR,'[data-film-sound]')
     if video.get_property('paused'):driver.execute_script('arguments[0].click()',play)
     wait.until(lambda d:not video.get_property('paused'))
     assert play.get_attribute('aria-label').startswith('Pause ')
     driver.execute_script('arguments[0].click()',mute)
     wait.until(lambda d:video.get_property('muted') is False)
     assert mute.get_attribute('aria-label').startswith('Turn off')
     driver.execute_script('arguments[0].click()',mute)
     wait.until(lambda d:video.get_property('muted') is True)
     driver.execute_script('arguments[0].scrollIntoView({block:"start",behavior:"instant"})',scene)
     if video.get_property('paused'):driver.execute_script('arguments[0].click()',play)
     wait.until(lambda d:not video.get_property('paused'))
     driver.execute_script('arguments[0].currentTime=5.3',video)
     wait.until(lambda d:'holiday-intro-complete' in hero.get_attribute('class'))
     time.sleep(1.2)
     op=float(driver.execute_script('return getComputedStyle(arguments[0]).opacity',caption))
     assert op<.22,('message failed to fade',slug,width,op)
     assert hero.find_element(By.CSS_SELECTOR,'h1').is_displayed()
     driver.execute_script('arguments[0].currentTime=9.2',video)
     time.sleep(.15)
     if width in (390,1440):hero.screenshot(str(root/'tests'/f'cinema-{slug}-final-{width}.png'))
     driver.execute_script('arguments[0].click()',play)
     wait.until(lambda d:video.get_property('paused'))
     assert 'holiday-intro-complete' in hero.get_attribute('class'),('caption reappeared on pause',slug,width)
     records.append({'page':page,'width':width,'layout':'centered','timedFade':True,'controls':True,'mobileUncropped':width<=620})
    print('WIDTH_PASS',width,flush=True)
   driver.execute_cdp_cmd('Emulation.setEmulatedMedia',{'media':'screen','features':[{'name':'prefers-reduced-motion','value':'reduce'}]})
   for page,slug,_ in routes:
    driver.get(base+'/remodeling-preview'+page.rstrip('/'))
    v=wait.until(lambda d:d.find_element(By.CSS_SELECTOR,'[data-brand-film="'+slug+'"] video'))
    assert v.get_property('paused'),('reduced motion autoplayed',slug)
   print('REDUCED_MOTION_PASS',flush=True)
  finally:driver.quit()
 finally:server.terminate();server.wait(timeout=12);log.close()
(root/'tests'/'cinema-sitewide-browser-results.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
print('CINEMA_SITEWIDE_BROWSER_PASS',len(records),flush=True)
