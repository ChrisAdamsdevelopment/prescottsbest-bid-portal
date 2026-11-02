from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen, DEVNULL
import os,time,requests,json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
checks=[]
with TemporaryDirectory(prefix="pbc-brand-ui-") as tmp:
 env={**os.environ,"PORT":"18887","DATA_DIR":tmp,"PORTAL_ADMIN_KEY":"synthetic-browser-key-0000000000000000",
 "LEAD_FORM_ENABLED":"false","SITE_INDEXABLE":"false","NODE_ENV":"development"}
 proc=Popen(["node","server.mjs"],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  base="http://127.0.0.1:18887"
  for n in range(70):
   try:
    if requests.get(base+"/healthz",timeout=1).ok:break
   except requests.RequestException:time.sleep(.1)
  opt=webdriver.ChromeOptions()
  opt.add_argument("--headless=new");opt.add_argument("--window-size=390,844")
  opt.add_argument("--user-data-dir="+str(Path(tmp)/"chrome"))
  driver=webdriver.Chrome(options=opt)
  try:
   driver.get(base+"/remodeling-preview")
   WebDriverWait(driver,9).until(lambda x:x.find_element(By.CSS_SELECTOR,".mobile-menu").is_displayed())
   assert not driver.find_element(By.CSS_SELECTOR,".desktop-nav").is_displayed()
   details=driver.find_element(By.CSS_SELECTOR,".mobile-menu")
   details.find_element(By.TAG_NAME,"summary").click()
   assert details.get_attribute("open") is not None
   assert details.find_element(By.TAG_NAME,"nav").is_displayed()
   assert details.find_element(By.LINK_TEXT,"Our work").is_displayed()
   driver.save_screenshot(str(root/".phase3-brand-mobile.png"))
   checks.append("390px mobile dropdown opens with accessible navigation links")
   details.find_element(By.TAG_NAME,"summary").click()
   assert details.get_attribute("open") is None
   width=driver.execute_script("return [document.documentElement.scrollWidth,window.innerWidth]")
   assert width[0]<=width[1]+2,f"Unexpected horizontal overflow: {width}"
   checks.append("mobile layout has no horizontal page overflow")
   driver.set_window_size(1440,1000)
   driver.get(base+"/remodeling-preview/about")
   assert driver.find_element(By.CSS_SELECTOR,".desktop-nav").is_displayed()
   assert not driver.find_element(By.CSS_SELECTOR,".mobile-menu").is_displayed()
   driver.save_screenshot(str(root/".phase3-brand-desktop.png"))
   checks.append("desktop navigation renders without mobile menu")
   assert "favicon.ico" in driver.page_source and "og:image" in driver.page_source
   checks.append("favicon and sharing metadata present")
   driver.get(base+"/remodeling-preview/estimate")
   from selenium.webdriver.support.ui import Select
   Select(driver.find_element(By.ID,"project")).select_by_value("bath-full")
   driver.execute_script("arguments[0].click()",driver.find_element(By.CSS_SELECTOR,"#budget-form button[type=submit]"))
   WebDriverWait(driver,8).until(lambda x:"$14,000" in x.find_element(By.ID,"budget-result").text)
   assert driver.find_element(By.XPATH,"//button[contains(text(),'Print / save')]").is_displayed()
   assert driver.find_element(By.XPATH,"//button[contains(text(),'Copy budget')]").is_displayed()
   checks.append("research-only budget can be printed and copied")
  finally:driver.quit()
 finally:proc.terminate();proc.wait(timeout=8)
(root/"tests"/"brand_browser_report.json").write_text(json.dumps({"status":"PASS","checks":checks},indent=2),encoding="utf-8")
print("BRAND_BROWSER_QA_PASS",checks,flush=True)
