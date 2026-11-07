from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen, DEVNULL
import json,os,time,requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
checks=[]
with TemporaryDirectory(prefix='pbc-preview-qa-') as temp:
 env={**os.environ,'PORT':'18961','DATA_DIR':temp,'NODE_ENV':'development',
      'PORTAL_ADMIN_KEY':'synthetic-visual-preview-key-0123456789',
      'SITE_INDEXABLE':'false','LEAD_FORM_ENABLED':'false','PUBLIC_AI_ENABLED':'false'}
 proc=Popen(['node','server.mjs'],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  base='http://127.0.0.1:18961/remodeling-preview'
  for n in range(100):
   try:
    if requests.get('http://127.0.0.1:18961/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.1)
  else:raise RuntimeError('Test server did not start')
  options=webdriver.ChromeOptions()
  options.add_argument('--headless=new')
  options.add_argument('--disable-gpu')
  options.add_argument('--user-data-dir='+str(Path(temp)/'chrome-profile'))
  driver=webdriver.Chrome(options=options)
  wait=WebDriverWait(driver,14)
  try:
   for width,height in [(390,844),(1024,768),(1440,900)]:
    driver.set_window_size(width,height)
    if width==390:
     driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':2,'mobile':True})
    else:
     driver.execute_cdp_cmd('Emulation.clearDeviceMetricsOverride',{})
    driver.get(base+'/visual-design-preview')
    wait.until(lambda b:len(b.find_elements(By.CSS_SELECTOR,'.visual-preview-card'))==3)
    card=driver.find_element(By.CSS_SELECTOR,'.visual-preview-card img')
    driver.execute_script('arguments[0].scrollIntoView({block:"center"})',card)
    wait.until(lambda b: b.find_element(By.CSS_SELECTOR,'.visual-preview-card img').get_property('naturalWidth')>0)
    cards=[(x.text,x.get_attribute('href')) for x in driver.find_elements(By.CSS_SELECTOR,'.visual-preview-card .site-button')]
    assert len(cards)==3,cards
    assert any('custom-cabinetry' in href for _,href in cards)
    assert any('holiday-lighting/design' in href for _,href in cards)
    # Prechecked visual-preview request with a real category, not submitted automatically.
    driver.get(base+'/schedule?preview=1&project=Custom%20cabinetry%20and%20built-ins')
    wait.until(lambda b:b.find_element(By.ID,'lead-visual-preview').is_selected())
    category=driver.find_element(By.ID,'lead-project').get_attribute('value')
    assert category=='Custom cabinetry and built-ins',category
    assert driver.find_element(By.ID,'lead-name').get_attribute('value')==''
    # Clicking the cabinetry idea forwards chosen style to contact form only in this session.
    driver.get(base+'/custom-cabinetry')
    wait.until(lambda b:len(b.find_elements(By.CSS_SELECTOR,'[data-visual-explorer]'))==2)
    container=driver.find_element(By.CSS_SELECTOR,'[data-visual-explorer="cabinet-finishes"]')
    control=container.find_element(By.CSS_SELECTOR,'[data-visual-axis="tone"][data-visual-value="medium"]')
    driver.execute_script('arguments[0].click()',control)
    chosen=container.find_element(By.CSS_SELECTOR,'[data-visual-axis="pull"][data-visual-value="brass"]')
    driver.execute_script('arguments[0].click()',chosen)
    goto=container.find_element(By.CSS_SELECTOR,'[data-visual-request]')
    driver.execute_script('arguments[0].click()',goto)
    wait.until(lambda b:'/schedule' in b.current_url)
    wait.until(lambda b:b.find_element(By.ID,'lead-visual-preview').is_selected())
    note=driver.find_element(By.ID,'lead-notes').get_attribute('value')
    assert 'Medium wood' in note and 'Brushed brass' in note,note
    # Existing holiday tool stays accessible and separate from visual-preview inquiry.
    driver.get(base+'/holiday-lighting')
    assert len(driver.find_elements(By.CSS_SELECTOR,'.visual-preview-promo'))>=1
    holiday=driver.find_element(By.CSS_SELECTOR,'.visual-preview-promo a[href*="holiday-lighting/design"]')
    assert holiday.is_displayed()
    driver.get(base+'/estimate')
    option_text=driver.find_element(By.ID,'project').text
    assert 'Decks & outdoor carpentry' not in option_text
    assert 'Custom cabinetry & built-ins' not in option_text
    sizing=driver.execute_script('return {scroll:document.documentElement.scrollWidth,viewport:window.innerWidth}')
    assert sizing['scroll']<=sizing['viewport']+3,sizing
    checks.append({'width':width,'hubImages':3,'requestPreselected':True,'savedLookTransferred':True,'holidayToolLinked':True,'budgetSafe':True,'pageOverflow':sizing})
  finally:driver.quit()
 finally:proc.terminate();proc.wait(timeout=10)
(root/'tests'/'visual-preview-browser-results.json').write_text(json.dumps({'result':'PASS','checks':checks},indent=2),encoding='utf8')
print('VISUAL_PREVIEW_BROWSER_PASS',json.dumps(checks))
