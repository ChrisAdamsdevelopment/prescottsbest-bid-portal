from pathlib import Path
from subprocess import Popen,DEVNULL
from tempfile import TemporaryDirectory
import os,time,json,requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait,Select
root=Path(__file__).resolve().parents[1]
report={'tests':[]}
try:
 with TemporaryDirectory(prefix='pbc-phase2-qa-') as tmp:
  port=18854
  env={**os.environ,'PORT':str(port),'DATA_DIR':tmp,'PORTAL_ADMIN_KEY':'synthetic-test-only-secret-key-0123456789','LEAD_FORM_ENABLED':'false','SITE_INDEXABLE':'false','NODE_ENV':'development'}
  server=Popen(['node','server.mjs'],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
  try:
   base='http://127.0.0.1:'+str(port)
   for _ in range(75):
    try:
     if requests.get(base+'/healthz',timeout=1).ok:break
    except requests.RequestException:time.sleep(.1)
   o=webdriver.ChromeOptions()
   o.add_argument('--headless=new')
   o.add_argument('--window-size=1440,960')
   o.add_argument('--user-data-dir='+str(Path(tmp)/'chrome'))
   driver=webdriver.Chrome(options=o)
   try:
    driver.get(base+'/remodeling-preview/start-here')
    Select(driver.find_element(By.ID,'plan-type')).select_by_value('bathroom')
    Select(driver.find_element(By.ID,'plan-priority')).select_by_value('access')
    Select(driver.find_element(By.ID,'plan-timing')).select_by_value('months')
    Select(driver.find_element(By.ID,'plan-condition')).select_by_value('unknown')
    driver.execute_script("arguments[0].click()",driver.find_element(By.CSS_SELECTOR,'#planning-form button[type=submit]'))
    WebDriverWait(driver,8).until(lambda d:'personalized starting checklist' in d.find_element(By.ID,'planning-result').text.lower())
    assert 'accessibility' in driver.find_element(By.ID,'planning-result').text.lower() or 'Priority:' in driver.find_element(By.ID,'planning-result').text
    driver.save_screenshot(str(root/'.phase2-planner-desktop.png'))
    report['tests'].append('guided planner generated nonpersonal checklist')
    driver.get(base+'/remodeling-preview/schedule')
    WebDriverWait(driver,8).until(lambda d:d.find_element(By.ID,'lead-unavailable').is_displayed())
    assert not driver.find_element(By.ID,'inquiry-form').is_displayed()
    assert driver.find_element(By.ID,'lead-unavailable').is_displayed()
    assert 'planning worksheet' in driver.find_element(By.ID,'lead-notes').get_attribute('value')
    report['tests'].append('disabled lead form hidden; direct contact fallback visible; session note preserved')
    driver.set_window_size(390,844)
    driver.get(base+'/remodeling-preview')
    WebDriverWait(driver,8).until(lambda d:d.find_element(By.CSS_SELECTOR,'.mobile-actions').is_displayed())
    assert driver.find_element(By.CSS_SELECTOR,'.mobile-actions a').get_attribute('href').startswith('tel:')
    driver.save_screenshot(str(root/'.phase2-home-mobile.png'))
    report['tests'].append('mobile sticky call/estimate/contact navigation visible')
    for path in ['/privacy','/about','/projects','/concierge','/accessibility','/resources/hiring-a-remodeling-contractor']:
     r=requests.get(base+'/remodeling-preview'+path,timeout=5)
     assert r.status_code==200 and '<h1>' in r.text and 'noindex' in r.headers.get('X-Robots-Tag','')
    report['tests'].append('six added homeowner pages return 200 with noindex')
    report['status']='PASS'
   finally:driver.quit()
  finally:server.terminate();server.wait(timeout=8)
except Exception as exc:
 report['status']='FAIL'
 report['error']=str(exc)
finally:
 (root/'tests/phase2_browser_report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
 print(json.dumps(report),flush=True)
