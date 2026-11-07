"""Mobile and desktop browser QA for B03 kitchen inspiration and wood stain board selectors."""
from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,DEVNULL
import json,os,time,requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
report=[]
with TemporaryDirectory(prefix="pbc-kitchen-qa-") as scratch:
 env={**os.environ,
  "PORT":"18979","DATA_DIR":scratch,"NODE_ENV":"development",
  "PORTAL_ADMIN_KEY":"synthetic-kitchen-qa-admin-key-12345678",
  "SITE_INDEXABLE":"false","LEAD_FORM_ENABLED":"false","PUBLIC_AI_ENABLED":"false"}
 proc=Popen(["node","server.mjs"],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  host="http://127.0.0.1:18979"
  for i in range(100):
   try:
    if requests.get(host+"/healthz",timeout=1).ok:break
   except requests.RequestException:time.sleep(.12)
  else:raise RuntimeError("Test web server not ready")
  options=webdriver.ChromeOptions()
  options.add_argument("--headless=new")
  options.add_argument("--disable-gpu")
  options.add_argument("--user-data-dir="+str(Path(scratch)/"chrome"))
  chrome=webdriver.Chrome(options=options)
  try:
   for width,height in [(390,844),(1440,900)]:
    chrome.set_window_size(width,height)
    if width==390:chrome.execute_cdp_cmd("Emulation.setDeviceMetricsOverride",{"width":390,"height":844,"deviceScaleFactor":2,"mobile":True})
    else:chrome.execute_cdp_cmd("Emulation.clearDeviceMetricsOverride",{})
    chrome.get(host+"/remodeling-preview/kitchen-remodeling")
    wait=WebDriverWait(chrome,15)
    wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,"[data-visual-explorer]"))==2)
    kitchen=chrome.find_element(By.CSS_SELECTOR,'[data-visual-explorer="kitchen-inspiration"]')
    wood=chrome.find_element(By.CSS_SELECTOR,'[data-visual-explorer="wood-stain-boards"]')
    medium=kitchen.find_element(By.CSS_SELECTOR,'[data-visual-axis="tone"][data-visual-value="medium"]')
    chrome.execute_script("arguments[0].click()",medium)
    assert medium.get_attribute("aria-pressed")=="true"
    detail=kitchen.find_element(By.CSS_SELECTOR,'[data-visual-axis="view"][data-visual-value="detail"]')
    chrome.execute_script("arguments[0].click()",detail)
    img=kitchen.find_element(By.CSS_SELECTOR,"[data-visual-main]")
    assert "kitchen-medium-detail.webp" in img.get_attribute("src")
    chrome.execute_script('arguments[0].scrollIntoView({block:"center"})',img)
    wait.until(lambda d:img.get_property("naturalWidth")>0)
    hickory=wood.find_element(By.CSS_SELECTOR,'[data-visual-axis="species"][data-visual-value="hickory"]')
    chrome.execute_script("arguments[0].click()",hickory)
    wimg=wood.find_element(By.CSS_SELECTOR,"[data-visual-main]")
    assert "hickory-stain-reference.webp" in wimg.get_attribute("src")
    chrome.execute_script('arguments[0].scrollIntoView({block:"center"})',wimg)
    wait.until(lambda d:wimg.get_property("naturalWidth")>0)
    button=kitchen.find_element(By.CSS_SELECTOR,"[data-visual-request]")
    chrome.execute_script("arguments[0].click()",button)
    wait.until(lambda d:"/schedule" in d.current_url)
    wait.until(lambda d:d.find_element(By.ID,"lead-visual-preview").is_selected())
    notes=chrome.find_element(By.ID,"lead-notes").get_attribute("value")
    assert "Warm medium wood" in notes and "Finish close-up" in notes,notes
    chrome.get(host+"/remodeling-preview/kitchen-remodeling")
    wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,"[data-visual-explorer]"))==2)
    widths=chrome.execute_script("return {viewport:window.innerWidth,document:document.documentElement.scrollWidth}")
    assert widths["document"]<=widths["viewport"]+3,widths
    report.append({"viewportWidth":width,"kitchenFinishSwitch":True,"closeupSwitch":True,"woodSpeciesSwitch":True,
                   "imagesLoaded":True,"intentCarriesIntoForm":True,"horizontalOverflow":False})
  finally:chrome.quit()
 finally:proc.terminate();proc.wait(timeout=15)
(root/"tests"/"kitchen-browser-results.json").write_text(json.dumps(report,indent=2),encoding="utf8")
print("KITCHEN_BROWSER_QA_PASS",json.dumps(report))
