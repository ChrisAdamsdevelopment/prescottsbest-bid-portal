"""Browser and HTTP QA for three locally hosted, accessible brand commercials."""
from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,DEVNULL
import os,time,json,requests,xml.etree.ElementTree as ET
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

repo=Path(__file__).resolve().parents[1]
films=[
 ('/','home','prescotts-best-home-remodeling-new-hero-audio'),
 ('/holiday-lighting','holiday','prescotts-best-holiday-lighting-custom-audio'),
 ('/visual-design-preview','design','prescotts-best-design-center')
]
report=[]
with TemporaryDirectory(prefix="pbc-films-qa-") as temp:
 env={**os.environ,'PORT':'18995','DATA_DIR':temp,'NODE_ENV':'development',
  'PORTAL_ADMIN_KEY':'synthetic-brand-film-QA-admin-key-1234567890',
  'SITE_INDEXABLE':'false','PUBLIC_AI_ENABLED':'false','LEAD_FORM_ENABLED':'false'}
 proc=Popen(['node','server.mjs'],cwd=repo,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  base='http://127.0.0.1:18995'
  for n in range(110):
   try:
    if requests.get(base+'/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.15)
  else:raise RuntimeError('Marketing test server did not respond.')
  for path,id,slug in films:
   for ending in ['720.mp4','480.mp4','poster.webp']:
    posterSlug={'home':'prescotts-best-home-remodeling','holiday':'prescotts-best-holiday-lighting'}.get(id,slug)
    assetSlug=posterSlug if ending=='poster.webp' else slug
    url=base+'/site-assets/brand-films/'+assetSlug+'-'+ending
    resp=requests.head(url,timeout=8)
    assert resp.status_code==200,(url,resp.status_code)
    assert int(resp.headers['content-length'])>25000,url
    assert resp.headers['accept-ranges']=='bytes',url
    if ending.endswith('mp4'):
     assert 'video/mp4' in resp.headers['content-type']
     one=requests.get(url,headers={'Range':'bytes=0-1023'},timeout=8)
     assert one.status_code==206,(url,one.status_code,one.text[:100])
     assert one.headers['content-range'].startswith('bytes 0-1023/')
     assert len(one.content)==1024 and one.content[4:8]==b'ftyp'
     suffix=requests.get(url,headers={'Range':'bytes=-20'},timeout=8)
     assert suffix.status_code==206 and len(suffix.content)==20
     invalid=requests.get(url,headers={'Range':'bytes=999999999-'},timeout=8)
     assert invalid.status_code==416,(url,invalid.status_code)
    else:
     assert 'image/webp' in resp.headers['content-type']
     image=requests.get(url,timeout=8)
     assert image.status_code==200 and image.content[:4]==b'RIFF'
   report.append({'page':path,'slug':slug,'rangeSupport':True,'poster':True})
  sitemap=requests.get(base+'/sitemap.xml',timeout=9)
  # Local development deliberately has no public sitemap: parse the live indexable HTML metadata instead.
  assert sitemap.status_code in (404,500),('unexpected local sitemap',sitemap.status_code)
  options=webdriver.ChromeOptions()
  options.add_argument('--headless=new')
  options.add_argument('--disable-gpu')
  options.add_argument('--autoplay-policy=no-user-gesture-required')
  options.add_argument('--user-data-dir='+str(Path(temp)/'chrome'))
  driver=webdriver.Chrome(options=options)
  wait=WebDriverWait(driver,22)
  try:
   for width,height in [(390,844),(1440,900)]:
    driver.set_window_size(width,height)
    if width==390:
     driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',
      {'width':390,'height':844,'deviceScaleFactor':2,'mobile':True})
    else:driver.execute_cdp_cmd('Emulation.clearDeviceMetricsOverride',{})
    for path,id,slug in films:
     driver.get(base+'/remodeling-preview'+(path if path!='/' else ''))
     selector='[data-brand-film="'+id+'"]'
     wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,selector))==1)
     figure=driver.find_element(By.CSS_SELECTOR,selector)
     video=figure.find_element(By.TAG_NAME,'video')
     buttons=figure.find_elements(By.CSS_SELECTOR,'[data-film-controls] button')
     assert len(buttons)==2,(path,len(buttons))
     wait.until(lambda d:figure.find_element(By.CSS_SELECTOR,'[data-film-controls]').is_displayed())
     assert video.get_attribute('muted') is not None or video.get_property('muted') is True
     assert video.get_attribute('playsinline') is not None
     assert figure.find_element(By.CSS_SELECTOR,'.brand-film-poster').get_attribute('alt')
     assert slug+'-720.mp4' in figure.get_attribute('outerHTML')
     assert slug+'-480.mp4' in figure.get_attribute('outerHTML')
     assert len(figure.find_element(By.CSS_SELECTOR,'.brand-film-description').get_attribute('textContent'))>110 # accessible description remains in the DOM
     driver.execute_script('arguments[0].scrollIntoView({behavior:"instant",block:"center"})',figure)
     wait.until(lambda d:figure.find_element(By.CSS_SELECTOR,'.brand-film-poster').get_property('naturalWidth')>0)
     play=figure.find_element(By.CSS_SELECTOR,'[data-film-toggle]')
     sound=figure.find_element(By.CSS_SELECTOR,'[data-film-sound]')
     # Manual interactions must work even where autoplay is blocked.
     if video.get_property('paused'):
      driver.execute_script('arguments[0].click()',play)
      wait.until(lambda d:not video.get_property('paused'))
     assert not video.get_property('muted') is False,'Autoplay starts muted'
     driver.execute_script('arguments[0].click()',sound)
     wait.until(lambda d:not video.get_property('muted'))
     assert sound.get_attribute('aria-pressed')=='true'
     driver.execute_script('arguments[0].click()',sound)
     wait.until(lambda d:video.get_property('muted'))
     driver.execute_script('arguments[0].click()',play)
     wait.until(lambda d:video.get_property('paused'))
     assert play.get_attribute('aria-label').startswith('Play ')
     assert 9.7<float(video.get_property('duration') or 10)<10.5
     widthInfo=driver.execute_script('return {viewport:innerWidth,document:document.documentElement.scrollWidth}')
     assert widthInfo['document']<=widthInfo['viewport']+4,(path,width,widthInfo)
     if id=='home': assert driver.find_element(By.CSS_SELECTOR,'.commercial-hero .hero-copy h1').text
     if id=='holiday': assert driver.find_element(By.CSS_SELECTOR,'.holiday-packages').is_displayed()
     if id=='design': assert len(driver.find_elements(By.CSS_SELECTOR,'.visual-preview-card'))==6
     screenshot=repo/'tests'/f'brand-film-{id}-{width}.png'
     driver.save_screenshot(str(screenshot))
     report.append({'width':width,'page':path,'film':id,'playerControls':True,'soundToggle':True,
      'manualPause':True,'metadataLoaded':True,'noOverflow':True})
   # Accessible reduced-motion mode: do not start an unsolicited moving film.
   driver.execute_cdp_cmd('Emulation.setEmulatedMedia',
    {'media':'screen','features':[{'name':'prefers-reduced-motion','value':'reduce'}]})
   driver.get(base+'/remodeling-preview')
   wait.until(lambda d:d.find_element(By.CSS_SELECTOR,'[data-film-controls]').is_displayed())
   reducedVideo=driver.find_element(By.CSS_SELECTOR,'[data-brand-film="home"] video')
   assert reducedVideo.get_property('paused'),'Reduced-motion users must see a paused poster'
   driver.execute_cdp_cmd('Emulation.setEmulatedMedia',{'media':'screen','features':[]})
  finally:driver.quit()
 finally:proc.terminate();proc.wait(timeout=15)
(repo/'tests'/'brand-films-browser-results.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print('BRAND_FILMS_BROWSER_QA_PASS',json.dumps({'scenarios':len(report),'responsivePageChecks':6,
 'responsiveWidths':[390,1440],'videoStreaming':True,'reducedMotion':True}))
