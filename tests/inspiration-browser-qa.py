"""End-to-end design inspiration selection and inquiry flow on an isolated local server.

Uses synthetic inquiry data only, with outbound mail provider env removed.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,DEVNULL
import json,os,time,requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait,Select

root=Path(__file__).resolve().parents[1]
results=[]
with TemporaryDirectory(prefix="pbc-inspiration-e2e-") as tmp:
 env={**os.environ,'PORT':'19013','DATA_DIR':tmp,'NODE_ENV':'development',
  'PORTAL_ADMIN_KEY':'synthetic-inspiration-test-admin-key-12345678',
  'LEAD_FORM_ENABLED':'true','SITE_INDEXABLE':'false','PUBLIC_AI_ENABLED':'false'}
 for key in ['RESEND_API_KEY','LEAD_FROM_EMAIL','SMTP_HOST','SMTP_USER','SMTP_PASS','SMTP_FROM']:
  env.pop(key,None)
 process=Popen(['node','server.mjs'],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  host='http://127.0.0.1:19013'
  for attempt in range(110):
   try:
    if requests.get(host+'/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.15)
  else:raise RuntimeError('Could not start isolated local server')
  opts=webdriver.ChromeOptions()
  opts.add_argument('--headless=new')
  opts.add_argument('--disable-gpu')
  opts.add_argument('--user-data-dir='+str(Path(tmp)/'browser-profile'))
  chrome=webdriver.Chrome(options=opts)
  wait=WebDriverWait(chrome,16)
  try:
   for width,height in [(390,844),(1440,900)]:
    chrome.set_window_size(width,height)
    if width==390:chrome.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':2,'mobile':True})
    else:chrome.execute_cdp_cmd('Emulation.clearDeviceMetricsOverride',{})
    chrome.get(host+'/remodeling-preview/kitchen-remodeling')
    wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,'[data-visual-explorer]'))==6)
    chrome.execute_script('localStorage.removeItem("pbc-inspiration-list-v1")')
    chrome.refresh()
    wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,'[data-visual-explorer]'))==6)
    selected=chrome.find_element(By.CSS_SELECTOR,'[data-visual-explorer="kitchen-finish-comparison"]')
    image=selected.find_element(By.CSS_SELECTOR,'[data-visual-main]')
    chrome.execute_script('arguments[0].scrollIntoView({block:"center"})',image)
    wait.until(lambda d:image.get_property('naturalWidth')>0)
    tag=selected.find_element(By.CSS_SELECTOR,'[data-inspiration-tag]')
    chrome.execute_script('arguments[0].click()',tag)
    assert tag.get_attribute('aria-pressed')=='true'
    assert len(chrome.execute_script('return window.pbcInspirationList.read()'))==1
    gray=selected.find_element(By.CSS_SELECTOR,'[data-visual-axis="counter"][data-visual-value="gray"]')
    chrome.execute_script('arguments[0].click()',gray)
    assert 'matched-kitchen-light-gray.webp' in image.get_attribute('src')
    chrome.execute_script('arguments[0].click()',tag)
    assert len(chrome.execute_script('return window.pbcInspirationList.read()'))==2

    chrome.get(host+'/remodeling-preview/custom-cabinetry')
    wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,'[data-visual-explorer]'))==4)
    hardware=chrome.find_element(By.CSS_SELECTOR,'[data-visual-explorer="hardware-exterior"]')
    style=hardware.find_element(By.CSS_SELECTOR,'[data-visual-axis="style"][data-visual-value="cup"]')
    finish=hardware.find_element(By.CSS_SELECTOR,'[data-visual-axis="finish"][data-visual-value="satin-brass"]')
    chrome.execute_script('arguments[0].click()',style)
    chrome.execute_script('arguments[0].click()',finish)
    chrome.execute_script('arguments[0].click()',hardware.find_element(By.CSS_SELECTOR,'[data-inspiration-tag]'))
    assert len(chrome.execute_script('return window.pbcInspirationList.read()'))==3

    chrome.get(host+'/remodeling-preview/deck-building-outdoor-carpentry')
    wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,'[data-visual-explorer]'))==1)
    deck=chrome.find_element(By.CSS_SELECTOR,'[data-visual-explorer="deck-inspiration"]')
    pine=deck.find_element(By.CSS_SELECTOR,'[data-visual-axis="scene"][data-visual-value="pine"]')
    chrome.execute_script('arguments[0].click()',pine)
    chrome.execute_script('arguments[0].click()',deck.find_element(By.CSS_SELECTOR,'[data-inspiration-tag]'))
    assert len(chrome.execute_script('return window.pbcInspirationList.read()'))==4

    chrome.get(host+'/remodeling-preview/visual-design-preview#my-inspiration-list')
    wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,'#my-inspiration-list .inspiration-item'))==4)
    first=chrome.find_element(By.CSS_SELECTOR,'#my-inspiration-list .inspiration-note')
    chrome.execute_script('arguments[0].value="Love the natural wood and lighter stone";arguments[0].dispatchEvent(new Event("change",{bubbles:true}))',first)
    entries=chrome.execute_script('return window.pbcInspirationList.read()')
    assert any('Love the natural wood' in x['note'] for x in entries)
    removes=chrome.find_elements(By.CSS_SELECTOR,'#my-inspiration-list .inspiration-remove')
    chrome.execute_script('arguments[0].click()',removes[1])
    assert len(chrome.execute_script('return window.pbcInspirationList.read()'))==3
    assert len(chrome.find_elements(By.CSS_SELECTOR,'#my-inspiration-list .inspiration-item'))==3
    panel=chrome.find_element(By.CSS_SELECTOR,'#my-inspiration-list')
    send=panel.find_element(By.CSS_SELECTOR,'a[href*="/schedule"]')
    chrome.execute_script('arguments[0].click()',send)
    wait.until(lambda d:'/schedule' in d.current_url)
    wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,'.inspiration-form-summary .inspiration-item'))==3)
    assert chrome.find_element(By.ID,'lead-visual-preview').is_selected()
    assert len(chrome.execute_script('return window.pbcInspirationList.payload()'))==3
    sizing=chrome.execute_script('return {viewport:window.innerWidth,scroll:document.documentElement.scrollWidth}')
    assert sizing['scroll']<=sizing['viewport']+3,sizing
    result={'viewport':width,'matchedImages':True,'threeSectionsTagged':True,'multiChoices':True,'notesAndRemove':True,
      'listOnContactForm':True,'noHorizontalOverflow':True}
    if width==390:
     chrome.find_element(By.ID,'lead-name').send_keys('Synthetic Inspiration QA')
     chrome.find_element(By.ID,'lead-email').send_keys('synthetic-inspiration@example.org')
     Select(chrome.find_element(By.ID,'lead-project')).select_by_visible_text('Kitchen remodeling')
     chrome.find_element(By.ID,'lead-notes').send_keys('This is a synthetic local integration test, not a customer inquiry.')
     chrome.execute_script('arguments[0].click()',chrome.find_element(By.ID,'lead-consent'))
     chrome.execute_script('const old=window.fetch.bind(window); window.fetch=async (...args)=>{const r=await old(...args);if(String(args[0]).includes("/api/public/inquiry"))window.__inspirationResponse=await r.clone().json();return r}')
     wait.until(lambda d:d.find_element(By.CSS_SELECTOR,'#inquiry-form button[type="submit"]').text=='Send project request')
     chrome.execute_script('arguments[0].click()',chrome.find_element(By.CSS_SELECTOR,'#inquiry-form button[type="submit"]'))
     wait.until(lambda d:bool(d.execute_script('return window.__inspirationResponse')))
     response=chrome.execute_script('return window.__inspirationResponse')
     assert response.get('recorded') is True,response
     assert response.get('inspirationCount')==3,response
     assert response.get('notificationStatus')=='failed',response
     result['submittedLocally']=True
     result['validatedInspirationCount']=3
    results.append(result)
  finally:chrome.quit()
 finally:process.terminate();process.wait(timeout=15)
(root/'tests'/'inspiration-browser-results.json').write_text(json.dumps(results,indent=2),encoding='utf8')
print('INSPIRATION_BROWSER_QA_PASS',json.dumps(results))
