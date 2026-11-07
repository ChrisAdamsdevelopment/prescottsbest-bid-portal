"""Browser QA: cabinet hardware knobs, pulls and hinges on kitchen and cabinetry service pages."""
from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,DEVNULL
import json,os,time,requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
results=[]
with TemporaryDirectory(prefix="pbc-hardware-qa-") as temp:
 env={**os.environ,"PORT":"18989","DATA_DIR":temp,"NODE_ENV":"development",
      "PORTAL_ADMIN_KEY":"synthetic-hardware-test-key-1234567890",
      "SITE_INDEXABLE":"false","LEAD_FORM_ENABLED":"false","PUBLIC_AI_ENABLED":"false"}
 proc=Popen(["node","server.mjs"],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  host="http://127.0.0.1:18989"
  for i in range(100):
   try:
    if requests.get(host+"/healthz",timeout=1).ok:break
   except requests.RequestException:time.sleep(.12)
  else:raise RuntimeError("Test HTTP server not available")
  opt=webdriver.ChromeOptions()
  opt.add_argument("--headless=new")
  opt.add_argument("--disable-gpu")
  opt.add_argument("--user-data-dir="+str(Path(temp)/"chrome"))
  driver=webdriver.Chrome(options=opt)
  wait=WebDriverWait(driver,17)
  try:
   for width,height in [(390,844),(1440,900)]:
    driver.set_window_size(width,height)
    if width==390:driver.execute_cdp_cmd("Emulation.setDeviceMetricsOverride",{"width":390,"height":844,"deviceScaleFactor":2,"mobile":True})
    else:driver.execute_cdp_cmd("Emulation.clearDeviceMetricsOverride",{})
    driver.get(host+"/remodeling-preview/kitchen-remodeling")
    wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,'[data-visual-explorer]'))==6)
    assert driver.find_element(By.CSS_SELECTOR,'a[href="#hardware-exterior"]').is_displayed()
    assert driver.find_element(By.CSS_SELECTOR,'a[href="#hardware-hinges"]').is_displayed()
    exterior=driver.find_element(By.CSS_SELECTOR,'[data-visual-explorer="hardware-exterior"]')
    hinges=driver.find_element(By.CSS_SELECTOR,'[data-visual-explorer="hardware-hinges"]')
    cup=exterior.find_element(By.CSS_SELECTOR,'[data-visual-axis="style"][data-visual-value="cup"]')
    brass=exterior.find_element(By.CSS_SELECTOR,'[data-visual-axis="finish"][data-visual-value="satin-brass"]')
    driver.execute_script("arguments[0].click()",cup)
    driver.execute_script("arguments[0].click()",brass)
    img=exterior.find_element(By.CSS_SELECTOR,'[data-visual-main]')
    assert 'exterior-satin-brass-cup.webp' in img.get_attribute('src')
    driver.execute_script('arguments[0].scrollIntoView({block:"center"})',img)
    wait.until(lambda d:img.get_property("naturalWidth")>0)
    assert img.get_attribute('alt').lower().find('satin brass')>=0
    decorative=hinges.find_element(By.CSS_SELECTOR,'[data-visual-axis="style"][data-visual-value="decorative"]')
    bronze=hinges.find_element(By.CSS_SELECTOR,'[data-visual-axis="finish"][data-visual-value="oil-rubbed-bronze"]')
    driver.execute_script("arguments[0].click()",decorative)
    driver.execute_script("arguments[0].click()",bronze)
    hinge_img=hinges.find_element(By.CSS_SELECTOR,'[data-visual-main]')
    assert 'hinge-oil-rubbed-bronze-decorative.webp' in hinge_img.get_attribute('src')
    driver.execute_script('arguments[0].scrollIntoView({block:"center"})',hinge_img)
    wait.until(lambda d:hinge_img.get_property("naturalWidth")>0)
    assert 'not interchangeable' in hinges.text
    save=hinges.find_element(By.CSS_SELECTOR,'[data-visual-save]')
    driver.execute_script("arguments[0].click()",save)
    key=driver.execute_script('return localStorage.getItem("pbc-visual-look:hardware-hinges")')
    assert '"decorative"' in key and '"oil-rubbed-bronze"' in key,key
    goto=hinges.find_element(By.CSS_SELECTOR,'[data-visual-request]')
    driver.execute_script("arguments[0].click()",goto)
    wait.until(lambda d:'/schedule' in d.current_url)
    wait.until(lambda d:d.find_element(By.ID,'lead-visual-preview').is_selected())
    notes=driver.find_element(By.ID,'lead-notes').get_attribute('value')
    assert 'Decorative surface-mount hinge' in notes and 'Oil-rubbed bronze' in notes,notes
    for path in ['/kitchen-remodeling','/custom-cabinetry']:
     driver.get(host+'/remodeling-preview'+path)
     wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,'[data-visual-explorer]'))==(6 if path=='/kitchen-remodeling' else 4))
     assert len(driver.find_elements(By.CSS_SELECTOR,'[data-visual-explorer="hardware-exterior"]'))==1
     assert len(driver.find_elements(By.CSS_SELECTOR,'[data-visual-explorer="hardware-hinges"]'))==1
     sizes=driver.execute_script('return {viewport:window.innerWidth,document:document.documentElement.scrollWidth}')
     assert sizes['document']<=sizes['viewport']+3,(path,sizes)
    results.append({"width":width,"hardwareImagesLoaded":True,"exteriorStyleAndFinish":True,
                    "hingeTypeAndFinish":True,"localStorageSave":True,"requestPassesToInquiry":True,
                    "bothServices":True,"noHorizontalOverflow":True})
  finally:driver.quit()
  # The strict public image allowlist must serve every optimized crop and thumbnail.
  files=sorted((root/'public'/'site-assets'/'visual-explorer'/'cabinet-hardware').glob('*.webp'))
  assert len(files)==72,len(files)
  for f in files:
   url=host+'/site-assets/visual-explorer/cabinet-hardware/'+f.name
   response=requests.get(url,timeout=10)
   assert response.status_code==200,(f.name,response.status_code)
   assert response.content[:4]==b'RIFF',f.name
 finally:proc.terminate();proc.wait(timeout=15)
(root/'tests'/'hardware-browser-results.json').write_text(json.dumps(results,indent=2),encoding='utf8')
print('HARDWARE_BROWSER_QA_PASS',json.dumps({'viewportTests':len(results),'staticFiles':72,'checks':results}))
