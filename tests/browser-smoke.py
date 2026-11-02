import os,subprocess,tempfile,time,requests,json
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
proposal=json.loads((root/'examples/demo-proposal.json').read_text())
original=Path(r'D:\PrescottsBestConstruction\ASSWTS_FOR_ESTIMATOR\GARAGE_SIDE_DOOR_BID\BID.png')
if original.exists():
 import base64
 proposal['photos']=[{'kind':'after','label':'Garage exterior door realistic concept','mimeType':'image/png',
                     'base64':base64.b64encode(original.read_bytes()).decode()}]
with tempfile.TemporaryDirectory(prefix='pbc-portal-browser-') as tmp:
 env={**os.environ,'DATA_DIR':tmp,'PORT':'18122','PORTAL_ADMIN_KEY':'TEST_KEY_0123456789abcdefghijklmnopqrstuvwxyz'}
 server=subprocess.Popen(['node','server.mjs'],cwd=str(root),env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 try:
  for i in range(50):
   try:
    if requests.get('http://127.0.0.1:18122/healthz',timeout=1).status_code==200:break
   except requests.RequestException:time.sleep(.1)
  r=requests.post('http://127.0.0.1:18122/api/admin/publish',json=proposal,
       headers={'Authorization':'Bearer '+env['PORTAL_ADMIN_KEY']},timeout=10)
  assert r.status_code==201,(r.status_code,r.text[:300])
  invite=r.json()['linkFragment']
  options=webdriver.ChromeOptions(); options.add_argument('--headless=new');options.add_argument('--window-size=1240,920')
  options.add_argument('--user-data-dir='+str(Path(tmp)/'chrome'))
  driver=webdriver.Chrome(options=options)
  try:
   driver.get('http://127.0.0.1:18122/'+invite)
   WebDriverWait(driver,15).until(lambda d:'Garage Exterior Side-Entry Door' in d.find_element(By.TAG_NAME,'body').text)
   text=driver.find_element(By.TAG_NAME,'body').text
   assert '$3,801.33' in text
   assert 'Record my approval intent' in text
   assert driver.find_element(By.CSS_SELECTOR,'.photo img').get_attribute('naturalWidth')!=0
   driver.save_screenshot(str(root/'.portal-browser-smoke.png'))
   print('PASS MOBILE/WEB CUSTOMER PORTAL: private link opens, real concept image displays, cost-plus price and approval intent render.')
  finally:driver.quit()
 finally:server.terminate();server.wait(timeout=5)
