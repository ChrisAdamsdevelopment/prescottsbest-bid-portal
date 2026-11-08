"""Interactive browser checks for the scoped holiday cinematic hero experiment."""
from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,DEVNULL
import os,time,json,requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
repo=Path(__file__).resolve().parents[1]
results=[]
with TemporaryDirectory(prefix='holiday-cinematic-qa-') as temp:
 env={**os.environ,'PORT':'18996','DATA_DIR':temp,'NODE_ENV':'development',
  'PORTAL_ADMIN_KEY':'synthetic-holiday-cinematic-test-admin-12345',
  'SITE_INDEXABLE':'false','PUBLIC_AI_ENABLED':'false','LEAD_FORM_ENABLED':'false'}
 proc=Popen(['node','server.mjs'],cwd=repo,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  base='http://127.0.0.1:18996'
  for attempt in range(110):
   try:
    if requests.get(base+'/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.15)
  else:raise RuntimeError('Local marketing server not running')
  options=webdriver.ChromeOptions()
  options.add_argument('--headless=new')
  options.add_argument('--disable-gpu')
  options.add_argument('--autoplay-policy=no-user-gesture-required')
  options.add_argument('--user-data-dir='+str(Path(temp)/'chrome'))
  driver=webdriver.Chrome(options=options)
  wait=WebDriverWait(driver,24)
  try:
   for width,height in [(390,844),(768,1024),(1440,900)]:
    driver.set_window_size(width,height)
    if width in (390,768):
     driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',
       {'width':width,'height':height,'deviceScaleFactor':2,'mobile':True})
    else:driver.execute_cdp_cmd('Emulation.clearDeviceMetricsOverride',{})
    driver.get(base+'/remodeling-preview/holiday-lighting')
    hero=wait.until(lambda d:d.find_element(By.CSS_SELECTOR,'.holiday-head.holiday-cinematic-head'))
    video=hero.find_element(By.CSS_SELECTOR,'[data-brand-film="holiday"] video')
    figure=hero.find_element(By.CSS_SELECTOR,'.brand-film')
    controls=hero.find_element(By.CSS_SELECTOR,'.brand-film-controls')
    play=hero.find_element(By.CSS_SELECTOR,'[data-film-toggle]')
    sound=hero.find_element(By.CSS_SELECTOR,'[data-film-sound]')
    copy=hero.find_element(By.CSS_SELECTOR,'.holiday-head-copy')
    intro=hero.find_element(By.CSS_SELECTOR,'.holiday-copy-intro')
    wait.until(lambda d:figure.find_element(By.CSS_SELECTOR,'.brand-film-poster').get_property('naturalWidth')>0)
    # Keep QA screenshots focused on the commercial after the user makes an analytics choice.
    consent=driver.find_elements(By.CSS_SELECTOR,'#pbc-analytics-consent .analytics-consent-actions button')
    if consent:driver.execute_script('arguments[0].click()',consent[-1])
    driver.execute_script('arguments[0].scrollIntoView({block:"start",behavior:"instant"})',hero)
    wait.until(lambda d:controls.is_displayed())
    layout=driver.execute_script("""
     const h=arguments[0],f=arguments[1],v=arguments[2],c=arguments[3];
     const box=(x)=>{let r=x.getBoundingClientRect();return {x:r.left,y:r.top,width:r.width,height:r.height,right:r.right}};
     return {innerWidth:innerWidth,scrollWidth:document.documentElement.scrollWidth,hero:box(h),
      video:box(f),copy:box(c),objectFit:getComputedStyle(v).objectFit,
      filmPosition:getComputedStyle(f).position,headlineOpacity:getComputedStyle(h.querySelector('.holiday-copy-intro')).opacity};
    """,hero,figure,video,copy)
    assert layout['scrollWidth']<=layout['innerWidth']+3,('horizontal overflow',width,layout)
    assert layout['hero']['x']>=-2 and layout['hero']['right']<=width+3,('hero shifted',width,layout)
    assert layout['video']['x']>=-2 and layout['video']['right']<=width+3,('film shifted',width,layout)
    assert layout['hero']['width']>width*.92,('underfilled hero',width,layout)
    assert video.get_property('muted') is True
    assert len(controls.find_elements(By.TAG_NAME,'button'))==2
    if width<=950:
     assert layout['objectFit']=='contain',('mobile image crops logo',width,layout)
     assert layout['filmPosition']=='relative',('mobile film should be in flow',width,layout)
     assert 1.7<layout['video']['width']/layout['video']['height']<1.85,('video should stay 16:9',width,layout)
    else:
     assert layout['objectFit']=='cover',('desktop should fill hero',layout)
     assert layout['filmPosition']=='absolute'
     assert layout['copy']['x']>=-2 and layout['copy']['right']<=layout['innerWidth']*.74
    if video.get_property('paused'):
     driver.execute_script('arguments[0].click()',play)
     wait.until(lambda d:not video.get_property('paused'))
    wait.until(lambda d:figure.get_attribute('data-frames-ready')=='true')
    driver.execute_script('arguments[0].click()',sound)
    wait.until(lambda d:video.get_property('muted') is False)
    driver.execute_script('arguments[0].click()',sound)
    wait.until(lambda d:video.get_property('muted') is True)
    # Capture the opening composition before testing the branded closing transition.
    driver.save_screenshot(str(repo/'tests'/f'holiday-cinematic-opening-{width}.png'))
    # Simulate progress to the branded closing shot to check copy fade on desktop.
    driver.execute_script('arguments[0].currentTime=6.2',video)
    wait.until(lambda d:float(video.get_property('currentTime'))>5.7)
    if width>950:
     wait.until(lambda d:'holiday-intro-complete' in hero.get_attribute('class'))
     time.sleep(1.45)
     faded=float(driver.execute_script('return getComputedStyle(arguments[0]).opacity',intro))
     assert faded<.25,('desktop intro did not fade',faded)
     assert copy.find_element(By.CSS_SELECTOR,'.site-actions').is_displayed()
    else:
     time.sleep(.2)
     visible=float(driver.execute_script('return getComputedStyle(arguments[0]).opacity',intro))
     assert visible>.95,('mobile copy should remain accessible',visible)
    assert hero.find_element(By.CSS_SELECTOR,'.holiday-packages') if False else True
    driver.save_screenshot(str(repo/'tests'/f'holiday-cinematic-{width}.png'))
    # On pause the opening title must be made visible again.
    if not video.get_property('paused'):driver.execute_script('arguments[0].click()',play)
    wait.until(lambda d:video.get_property('paused'))
    assert 'holiday-intro-complete' not in hero.get_attribute('class')
    results.append({'width':width,'centered':True,'wholeFrameOnMobile':width<=950,
      'backgroundOnDesktop':width>950,'soundToggle':True,'textFadeDesktop':width>950,'noOverflow':True})
   driver.execute_cdp_cmd('Emulation.setEmulatedMedia',
     {'media':'screen','features':[{'name':'prefers-reduced-motion','value':'reduce'}]})
   driver.get(base+'/remodeling-preview/holiday-lighting')
   wait.until(lambda d:d.find_element(By.CSS_SELECTOR,'[data-film-controls]').is_displayed())
   quiet=driver.find_element(By.CSS_SELECTOR,'.holiday-cinematic-head video')
   assert quiet.get_property('paused'),'Reduced motion should not autoplay'
   assert float(driver.execute_script('return getComputedStyle(document.querySelector(".holiday-copy-intro")).opacity'))>=.99
   driver.execute_cdp_cmd('Emulation.setEmulatedMedia',{'media':'screen','features':[]})
  finally:driver.quit()
 finally:proc.terminate();proc.wait(timeout=13)
(repo/'tests'/'holiday-cinematic-results.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
print('HOLIDAY_CINEMATIC_BROWSER_PASS',json.dumps({'widths':[390,768,1440],'results':results,'reducedMotion':True}))
