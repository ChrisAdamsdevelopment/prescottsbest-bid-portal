from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,DEVNULL
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import requests,os,time,json
root=Path(__file__).resolve().parents[1]
checks=[]
with TemporaryDirectory(prefix='pbc-guide-') as tmp:
 env={**os.environ,'PORT':'18945','DATA_DIR':tmp,
   'PORTAL_ADMIN_KEY':'synthetic-browser-guide-admin-key-0123456789',
   'NODE_ENV':'development','SITE_INDEXABLE':'false','LEAD_FORM_ENABLED':'false',
   'PUBLIC_AI_ENABLED':'true','GEMINI_API_KEY':'local-mock-only'}
 proc=Popen(['node','--import','./tests/fake-gemini-fetch.mjs','server.mjs'],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  base='http://127.0.0.1:18945'
  for i in range(90):
   try:
    if requests.get(base+'/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.1)
  opts=webdriver.ChromeOptions();opts.add_argument('--headless=new')
  opts.add_argument('--user-data-dir='+str(Path(tmp)/'browser'))
  driver=webdriver.Chrome(options=opts)
  try:
   for width in (390,1440):
    driver.set_window_size(width,900)
    driver.get(base+'/remodeling-preview/project-guide')
    WebDriverWait(driver,12).until(lambda x:'Ready.' in x.find_element(By.ID,'guide-status').text)
    assert driver.find_element(By.ID,'guide-submit').get_attribute('disabled') is not None
    driver.find_element(By.CSS_SELECTOR,'.guide-prompt').click()
    WebDriverWait(driver,8).until(lambda x:len(x.find_element(By.ID,'guide-question').get_attribute('value'))>4)
    assert driver.find_element(By.ID,'guide-submit').get_attribute('disabled') is not None
    consent=driver.find_element(By.ID,'guide-consent')
    driver.execute_script("arguments[0].scrollIntoView({block:'center'})",consent)
    driver.execute_script('arguments[0].click()',consent)
    assert driver.find_element(By.ID,'guide-submit').is_enabled()
    send=driver.find_element(By.ID,'guide-submit')
    driver.execute_script("arguments[0].scrollIntoView({block:'center'})",send)
    driver.execute_script('arguments[0].click()',send)
    WebDriverWait(driver,12).until(lambda x:len(x.find_elements(By.CSS_SELECTOR,'.guide-turn'))==2)
    assert 'For your project' in driver.find_elements(By.CSS_SELECTOR,'.guide-turn')[-1].text
    assert driver.find_element(By.ID,'guide-read').is_enabled()
    assert driver.find_element(By.ID,'guide-copy').is_enabled()
    assert driver.execute_script('return document.documentElement.scrollWidth<=window.innerWidth+3')
    checks.append(f'{width}px: consent, mock Gemini answer, read-aloud control and no overflow')
    if width==390:
     driver.execute_script('window.scrollTo(0,0)')
     driver.save_screenshot(str(root/'.guide-mobile.png'))
    else:
     driver.save_screenshot(str(root/'.guide-desktop.png'))
    driver.execute_script('arguments[0].click()',driver.find_element(By.ID,'guide-clear'))
    assert len(driver.find_elements(By.CSS_SELECTOR,'.guide-turn'))==0
    assert not driver.find_element(By.ID,'guide-copy').is_enabled()
    checks.append(f'{width}px: Start over clears conversation')
  finally:driver.quit()
 finally:proc.terminate();proc.wait(timeout=8)
(root/'tests'/'ai_guide_browser_report.json').write_text(json.dumps({'status':'PASS','checks':checks},indent=2),encoding='utf8')
print('AI_GUIDE_BROWSER_PASS',len(checks),flush=True)
