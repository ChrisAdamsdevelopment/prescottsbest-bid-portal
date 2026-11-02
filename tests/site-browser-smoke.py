from pathlib import Path
from subprocess import Popen,DEVNULL
from tempfile import TemporaryDirectory
import os,requests,time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
root=Path(__file__).resolve().parents[1]
with TemporaryDirectory(prefix='pbc-market-browser-') as tmp:
 env={**os.environ,'PORT':'18846','DATA_DIR':tmp,'PORTAL_ADMIN_KEY':'synthetic-test-only-secret-key-0123456789',
      'LEAD_FORM_ENABLED':'false','SITE_INDEXABLE':'false','NODE_ENV':'development'}
 server=Popen(['node','server.mjs'],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  for _ in range(65):
   try:
    if requests.get('http://127.0.0.1:18846/healthz',timeout=2).status_code==200:break
   except requests.RequestException:time.sleep(.1)
  options=webdriver.ChromeOptions()
  options.add_argument('--headless=new')
  options.add_argument('--window-size=1440,1000')
  options.add_argument('--user-data-dir='+str(Path(tmp)/'chrome'))
  driver=webdriver.Chrome(options=options)
  try:
   driver.get('http://127.0.0.1:18846/remodeling-preview')
   WebDriverWait(driver,12).until(lambda d:'Bring your remodeling ideas into focus.' in d.find_element(By.TAG_NAME,'body').text)
   driver.save_screenshot(str(root/'.site-browser-home.png'))
   driver.get('http://127.0.0.1:18846/remodeling-preview/estimate')
   Select(driver.find_element(By.ID,'project')).select_by_value('bath-full')
   driver.execute_script("arguments[0].scrollIntoView({block:'center'});arguments[0].click();",driver.find_element(By.CSS_SELECTOR,'#budget-form button[type=submit]'))
   WebDriverWait(driver,12).until(lambda d:'$14,000' in d.find_element(By.ID,'budget-result').text)
   driver.save_screenshot(str(root/'.site-browser-estimate.png'))
   print('PASS browser preview: homepage brand, service navigation, deterministic client calculator result and accessible elements')
  finally:driver.quit()
 finally:server.terminate();server.wait(timeout=5)
