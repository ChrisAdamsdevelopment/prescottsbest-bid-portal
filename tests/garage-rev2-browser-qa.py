from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,DEVNULL
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import requests,os,time,json,base64
root=Path(__file__).resolve().parents[1]
photo=Path(r'D:\PrescottsBestConstruction\08_TEST_CASES\Garage_Side_Door_Light_Switch\Garage_Realistic_Proposed_Finish_REV2.jpg')
fixture=json.loads((root/'examples/garage-rev2-interactive-pilot.json').read_text(encoding='utf8'))
fixture['photos']=[{'kind':'after','label':'REV 2 garage side-door finished-view concept, not built work','mimeType':'image/jpeg','base64':base64.b64encode(photo.read_bytes()).decode('ascii')}]
key='synthetic-garage-pilot-qa-admin-key-000000001'
checks=[]
with TemporaryDirectory(prefix='pbc-garage-rev2-') as tmp:
 port=18923;base='http://127.0.0.1:'+str(port)
 env={**os.environ,'PORT':str(port),'DATA_DIR':tmp,'PORTAL_ADMIN_KEY':key,'NODE_ENV':'development','SITE_INDEXABLE':'false','LEAD_FORM_ENABLED':'false'}
 proc=Popen(['node','server.mjs'],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  for i in range(80):
   try:
    if requests.get(base+'/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.1)
  admin={'Authorization':'Bearer '+key}
  r=requests.post(base+'/api/admin/publish',headers=admin,json=fixture,timeout=8)
  assert r.status_code==201,(r.status_code,r.text[:350])
  fragment=r.json()['linkFragment']
  options=webdriver.ChromeOptions()
  options.add_argument('--headless=new');options.add_argument('--window-size=390,844')
  options.add_argument('--user-data-dir='+str(Path(tmp)/'chrome'))
  driver=webdriver.Chrome(options=options)
  try:
   driver.get(base+'/'+fragment)
   WebDriverWait(driver,9).until(lambda v:len(v.find_elements(By.CSS_SELECTOR,'.configurator'))==1)
   assert len(driver.find_elements(By.CSS_SELECTOR,'.lines tbody tr'))==14
   assert '$3,801.33' in driver.find_element(By.CSS_SELECTOR,'.config-totals').text
   photo_el=driver.find_element(By.CSS_SELECTOR,'.photo img')
   WebDriverWait(driver,9).until(lambda v:v.execute_script('return arguments[0].complete&&arguments[0].naturalWidth>100',photo_el))
   checks.append('Original 11 item REV2 baseline and original concept visible')
   fields=driver.find_elements(By.CSS_SELECTOR,'.configurator fieldset')
   assert len(fields)==2
   for field in fields:
    radios=field.find_elements(By.CSS_SELECTOR,'label input')
    assert len(radios)==2
    driver.execute_script('arguments[0].click()',radios[1])
   WebDriverWait(driver,6).until(lambda v:'$4,326.31' in v.find_element(By.CSS_SELECTOR,'.config-totals').text)
   assert driver.execute_script('return document.documentElement.scrollWidth<=window.innerWidth+3')
   checks.append('Mobile options recalculate cost-plus hypothetical changes without horizontal overflow')
   driver.execute_script("arguments[0].scrollIntoView({block:'center'})",driver.find_element(By.CSS_SELECTOR,'.config-summary button'))
   driver.save_screenshot(str(root/'.garage-rev2-interactive-mobile.png'))
   driver.find_element(By.CSS_SELECTOR,'.config-summary button').click()
   WebDriverWait(driver,7).until(lambda v:'Saved for contractor review' in v.find_element(By.CSS_SELECTOR,'.config-summary .status').text)
   audit=requests.get(base+'/api/admin/proposals',headers=admin,timeout=6).json()
   assert len(audit['questions'])==1
   assert 'REV 2 INTERACTIVE TEST' in audit['questions'][0]['message']
   assert audit['proposals'][0]['total']==3801.33
   checks.append('Saved preference request is logged; immutable original estimate unchanged')
   driver.set_window_size(1440,950)
   driver.get(base+'/')
   assert len(driver.find_elements(By.CSS_SELECTOR,'.configurator'))==1
   driver.save_screenshot(str(root/'.garage-rev2-interactive-desktop.png'))
   checks.append('Desktop presentation available under private session')
  finally:driver.quit()
 finally:proc.terminate();proc.wait(timeout=8)
(root/'tests/garage_rev2_browser_report.json').write_text(json.dumps({'status':'PASS','checks':checks},indent=2),encoding='utf8')
print('GARAGE_REV2_QA_PASS',len(checks),checks,flush=True)
