"""Safe browser QA for immediate public budgets and non-server email fallback. No email is sent."""
from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,DEVNULL
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import requests,os,time,json
root=Path(__file__).resolve().parents[1]
results=[]
with TemporaryDirectory(prefix='pbc-prices-contact-') as temp:
 env={**os.environ,'PORT':'18996','DATA_DIR':temp,'NODE_ENV':'development',
      'SITE_INDEXABLE':'false','PUBLIC_AI_ENABLED':'false','LEAD_FORM_ENABLED':'false'}
 process=Popen(['node','server.mjs'],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  url='http://127.0.0.1:18996'
  for i in range(75):
   try:
    if requests.get(url+'/healthz',timeout=1).ok:break
   except Exception:time.sleep(.1)
  opt=webdriver.ChromeOptions();opt.add_argument('--headless=new')
  opt.add_argument('--disable-extensions')
  driver=webdriver.Chrome(options=opt)
  try:
   for width in [390,1440]:
    driver.set_window_size(width,900)
    driver.get(url+'/remodeling-preview/estimate')
    WebDriverWait(driver,12).until(lambda b:'$16,100' in b.find_element(By.ID,'budget-result').text)
    assert '$43,800' in driver.find_element(By.ID,'budget-result').text
    first=driver.find_element(By.CSS_SELECTOR,'.budget-results strong').text
    assert len(first)>5
    assert not driver.execute_script('return document.documentElement.scrollWidth>innerWidth+3')
    results.append(f'{width}: initial ballpark visible without input')
    project=driver.find_element(By.ID,'project')
    driver.execute_script('arguments[0].value="kitchen-refresh";arguments[0].dispatchEvent(new Event("change",{bubbles:true}));',project)
    WebDriverWait(driver,8).until(lambda b:'Kitchen refresh' in b.find_element(By.ID,'budget-result').text)
    assert driver.find_element(By.CSS_SELECTOR,'.budget-results strong').text!=first
    details=driver.find_element(By.CSS_SELECTOR,'details.budget-breakdown')
    driver.execute_script('arguments[0].open=true',details)
    assert 'Fixed price example' in details.text and 'Cost-plus example' in details.text
    results.append(f'{width}: selectors recalculate while preserving optional bid-method detail')
    next_link=driver.find_element(By.CSS_SELECTOR,'#budget-result a.site-button.primary')
    driver.execute_script('arguments[0].scrollIntoView({block:"center"});arguments[0].click()',next_link)
    WebDriverWait(driver,8).until(lambda b:b.find_element(By.ID,'inquiry-form').is_displayed())
    assert 'Open email draft to Chris' in driver.page_source
    assert 'chris@prescottsbestconstruction.com' in driver.page_source
    assert 'tel:+19283500940' in driver.page_source
    note=driver.find_element(By.ID,'lead-notes').get_attribute('value')
    assert 'Kitchen refresh' in note and 'budget' in note.lower(),note
    driver.find_element(By.ID,'lead-name').send_keys('SYNTHETIC TEST PERSON')
    driver.find_element(By.ID,'lead-email').send_keys('test@example.org')
    driver.execute_script("""
       Object.defineProperty(navigator,'clipboard',{configurable:true,value:{
       writeText: async text => {window.__last_copied_request = text;} }});
    """)
    driver.execute_script('arguments[0].click()',driver.find_element(By.ID,'lead-copy'))
    WebDriverWait(driver,6).until(lambda b:'copied' in b.find_element(By.ID,'lead-message').text.lower())
    assert 'SYNTHETIC TEST PERSON' in driver.execute_script('return window.__last_copied_request')
    assert driver.execute_script('return document.documentElement.scrollWidth<=innerWidth+3')
    results.append(f'{width}: form visible, preserved budget draft, email to Chris, phone link, copy fallback')
  finally:driver.quit()
 finally:process.terminate();process.wait(timeout=10)
out=root/'tests'/'pricing-contact-browser-qa-results.json'
out.write_text(json.dumps({'passed':len(results),'results':results},indent=2),encoding='utf8')
print('PRICING_CONTACT_BROWSER_PASS',len(results),flush=True)
