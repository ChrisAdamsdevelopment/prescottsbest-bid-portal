from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,DEVNULL
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import requests,time,json,os
root=Path(__file__).resolve().parents[1]
results=[]
with TemporaryDirectory(prefix='pbc-concept-images-') as tmp:
 env={**os.environ,'PORT':'18891','DATA_DIR':tmp,'PORTAL_ADMIN_KEY':'synthetic-browser-test-key-0123456789','NODE_ENV':'development','SITE_INDEXABLE':'false','LEAD_FORM_ENABLED':'false'}
 proc=Popen(['node','server.mjs'],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  base='http://127.0.0.1:18891'
  for i in range(90):
   try:
    if requests.get(base+'/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.1)
  options=webdriver.ChromeOptions();options.add_argument('--headless=new');options.add_argument('--window-size=1440,950')
  options.add_argument('--user-data-dir='+str(Path(tmp)/'chrome'))
  driver=webdriver.Chrome(options=options)
  try:
   pages=['/remodeling-preview','/remodeling-preview/bathroom-remodeling','/remodeling-preview/kitchen-remodeling','/remodeling-preview/shower-conversions','/remodeling-preview/room-conversions','/remodeling-preview/finish-carpentry']
   for path in pages:
    driver.get(base+path)
    WebDriverWait(driver,12).until(lambda d:len(d.find_elements(By.CSS_SELECTOR,'.hero-visual img,.service-concept img'))>0)
    imgs=driver.find_elements(By.CSS_SELECTOR,'.hero-visual img,.service-concept img')
    assert all(driver.execute_script('return arguments[0].complete && arguments[0].naturalWidth>200',x) for x in imgs),path
    assert 'Design inspiration' in driver.page_source,path
    assert driver.execute_script('return document.documentElement.scrollWidth<=window.innerWidth+3'),path
    results.append('Desktop '+path+' image load and label OK')
   driver.get(base+'/remodeling-preview')
   driver.save_screenshot(str(root/'.concept-home-desktop.png'))
   driver.set_window_size(390,844)
   driver.get(base+'/remodeling-preview')
   imgs=driver.find_elements(By.CSS_SELECTOR,'.hero-visual img,.concept-card-media img')
   for x in imgs:
    driver.execute_script('arguments[0].scrollIntoView({block:"center"})',x)
    WebDriverWait(driver,8).until(lambda v:v.execute_script('return arguments[0].complete && arguments[0].naturalWidth>200',x))
   assert driver.execute_script('return document.documentElement.scrollWidth<=window.innerWidth+3'),'Mobile overflow'
   assert driver.find_element(By.CSS_SELECTOR,'.hero-visual figcaption').is_displayed()
   driver.execute_script('window.scrollTo(0,0)')
   driver.save_screenshot(str(root/'.concept-home-mobile.png'))
   results.append('390px mobile homepage images + explicit caption OK')
   driver.get(base+'/remodeling-preview/bathroom-remodeling')
   WebDriverWait(driver,8).until(lambda v:v.find_element(By.CSS_SELECTOR,'.service-concept img').get_attribute('naturalWidth')!='0')
   assert driver.find_element(By.CSS_SELECTOR,'.service-concept figcaption').is_displayed()
   assert driver.execute_script('return document.documentElement.scrollWidth<=window.innerWidth+3')
   driver.save_screenshot(str(root/'.concept-bathroom-mobile.png'))
   results.append('390px mobile bathroom visual and disclosure OK')
   for width in (390,1440):
    driver.set_window_size(width,900)
    for path in ['/remodeling-preview/about','/remodeling-preview/schedule']:
     driver.get(base+path)
     image=driver.find_element(By.CSS_SELECTOR,'.editorial-concept img')
     driver.execute_script('arguments[0].scrollIntoView({block:"center"})',image)
     WebDriverWait(driver,8).until(lambda v:v.execute_script('return arguments[0].complete && arguments[0].naturalWidth>200',image))
     caption=driver.find_element(By.CSS_SELECTOR,'.editorial-concept figcaption')
     assert caption.is_displayed() and 'AI-generated' in caption.text,path
     assert driver.execute_script('return document.documentElement.scrollWidth<=window.innerWidth+3'),path
     if width==390:
      driver.save_screenshot(str(root/('.editorial-about-mobile.png' if path.endswith('about') else '.editorial-contact-mobile.png')))
     results.append(str(width)+'px '+path+' concept image and honest labeling OK')
   driver.get(base+'/remodeling-preview/process')
   assert len(driver.find_elements(By.CSS_SELECTOR,'.site-card-icon'))>=4
   results.append('process stage icons remain present')
  finally:driver.quit()
 finally:proc.terminate();proc.wait(timeout=8)
(root/'tests'/'concept_browser_report.json').write_text(json.dumps({'status':'PASS','checks':results},indent=2),encoding='utf8')
print('PASS',len(results),'BROWSER_CHECKS',flush=True)
