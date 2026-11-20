from pathlib import Path
import json, os, subprocess, tempfile, time, urllib.request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

root=Path(__file__).resolve().parents[1]
out=root/'tests'/'trust-browser-smoke-20261120'
out.mkdir(parents=True,exist_ok=True)
with tempfile.TemporaryDirectory(prefix='pbc-trust-browser-') as folder:
 env={**os.environ,'NODE_ENV':'development','PORT':'19662','SITE_INDEXABLE':'false',
      'LEAD_FORM_ENABLED':'true','DATA_DIR':folder,
      'RESEND_API_KEY':'','LEAD_FROM_EMAIL':'','SMTP_HOST':'','SMTP_PASS':''}
 server=subprocess.Popen(['node','server.mjs'],cwd=root,env=env,
                         stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 driver=None
 rows=[]
 try:
  for _ in range(70):
   try:
    if urllib.request.urlopen('http://127.0.0.1:19662/healthz',timeout=1).status==200:break
   except: time.sleep(.15)
  else:raise RuntimeError('Server did not boot')
  opts=Options()
  opts.add_argument('--headless=new')
  opts.add_argument('--disable-gpu')
  opts.add_argument('--window-size=1280,900')
  driver=webdriver.Chrome(options=opts)
  pages=[('home','/remodeling-preview'),('contact','/remodeling-preview/schedule'),
   ('projects','/remodeling-preview/projects'),
   ('crystal','/remodeling-preview/projects/crystal-creek-accessible-remodel'),
   ('casing','/remodeling-preview/projects/precision-window-casings')]
  for width in [390,1280]:
   driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',
     {'width':width,'height':900,'deviceScaleFactor':1,'mobile':width<768})
   for name,path in pages:
    driver.get('http://127.0.0.1:19662'+path)
    result=driver.execute_script('''return {
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      h1:document.querySelector('h1')?.textContent,
      form:!!document.querySelector('#inquiry-form'),
      realProjectLinks:[...document.querySelectorAll('a[href*="/projects/"]')].length,
      noticeVisible:!!document.querySelector('#lead-unavailable')&&!document.querySelector('#lead-unavailable').hidden,
      subButton:document.querySelector('#inquiry-form button[type=submit]')?.textContent
     }''')
    rows.append({'width':width,'page':name,**result})
    if width==390 and name in ('home','contact','projects'):
     driver.save_screenshot(str(out/f'{name}-{width}.png'))
    if result['overflow']>3:raise AssertionError(f'Overflow {name} {width}: {result["overflow"]}')
    if name=='contact':
     for _ in range(25):
      if driver.find_element(By.CSS_SELECTOR,'#inquiry-form button[type=submit]').text=='Send my project request':break
      time.sleep(.08)
     assert driver.find_element(By.CSS_SELECTOR,'#inquiry-form button[type=submit]').text=='Send my project request'
     assert driver.find_element(By.ID,'lead-unavailable').get_attribute('hidden') is not None
    if name=='home':
     text=driver.page_source
     assert 'precision-window-casings' in text and 'crystal-creek-accessible-remodel' in text
  driver.get('http://127.0.0.1:19662/remodeling-preview/schedule')
  driver.find_element(By.ID,'lead-name').send_keys('Synthetic browser QA')
  driver.find_element(By.ID,'lead-email').send_keys('synthetic-qa@example.org')
  driver.find_element(By.ID,'lead-project').send_keys('Bathroom remodeling')
  driver.execute_script('arguments[0].click()',driver.find_element(By.ID,'lead-consent'))
  driver.execute_script('arguments[0].click()',driver.find_element(By.CSS_SELECTOR,'#inquiry-form button[type=submit]'))
  for _ in range(45):
   notice=driver.find_element(By.ID,'lead-message').text
   if 'reference PBC-' in notice or 'reference:' in notice:break
   time.sleep(.1)
  assert 'PBC-' in notice,notice
  rows.append({'page':'synthetic-local-form','submitted':True,'result':notice})
  (out/'results.json').write_text(json.dumps({'rows':rows,'pass':True},indent=2),encoding='utf-8')
  print(json.dumps({'tested':len(rows),'form_saved':True,'overflows':0,'out':str(out)}))
 finally:
  if driver:driver.quit()
  server.terminate()
  try:server.wait(timeout=5)
  except subprocess.TimeoutExpired:server.kill()
