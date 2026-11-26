import os,subprocess,tempfile,time,urllib.request
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
r=Path(__file__).resolve().parents[1]
paths=['/service-areas','/service-areas/prescott','/service-areas/prescott-valley','/service-areas/chino-valley','/service-areas/dewey-humboldt']
with tempfile.TemporaryDirectory() as d:
 p=subprocess.Popen(['node','server.mjs'],cwd=r,env=dict(os.environ,PORT='19827',DATA_DIR=d,NODE_ENV='test'))
 try:
  base='http://127.0.0.1:19827'
  for i in range(40):
   try:urllib.request.urlopen(base+'/remodeling-preview/service-areas',timeout=1);break
   except Exception:time.sleep(.2)
  opts=Options()
  for flag in ['--headless=new','--disable-gpu','--no-sandbox']:opts.add_argument(flag)
  driver=webdriver.Chrome(options=opts)
  try:
   for width in (1440,390):
    driver.set_window_size(width,1000)
    for path in paths:
     driver.get(base+'/remodeling-preview'+path)
     driver.execute_script("document.querySelectorAll('.city-page img,.city-directory img').forEach(x=>x.loading='eager')")
     WebDriverWait(driver,15).until(lambda d:d.execute_script("return [...document.querySelectorAll('.city-page img,.city-directory img')].every(x=>x.complete&&x.naturalWidth>0)"))
     assert driver.execute_script('return document.documentElement.scrollWidth <= innerWidth+2'), (path,width,'overflow')
     assert driver.execute_script('return document.querySelectorAll("h1").length===1'), (path,'h1')
     print(path,width,'PASS',flush=True)
     if width==1440:driver.save_screenshot(str(r/('city-'+path.split('/')[-1]+'-1440.png')))
  finally:driver.quit()
 finally:p.terminate();p.wait(timeout=10)
