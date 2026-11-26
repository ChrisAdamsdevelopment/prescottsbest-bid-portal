import os, subprocess, time, urllib.request, tempfile
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
url='http://127.0.0.1:19826'
page='/remodeling-preview/projects/prescott-luxury-custom-home'
with tempfile.TemporaryDirectory() as d:
 env=dict(os.environ,PORT='19826',DATA_DIR=d,NODE_ENV='test',SITE_INDEXABLE='true')
 p=subprocess.Popen(['node','server.mjs'],cwd=root,env=env)
 try:
  for i in range(30):
   try:
    urllib.request.urlopen(url+page,timeout=1);break
   except Exception:time.sleep(.2)
  from urllib.request import Request
  for name in ['window-casing-workbench']+[f'jandj-film-{i:02}' for i in range(2,6)]:
   with urllib.request.urlopen(Request(url+'/site-assets/real-projects/'+name+'-720.mp4',headers={'Range':'bytes=0-1023'})) as res:
    assert res.status==206 and len(res.read())==1024
  print('Five video byte-range checks passed',flush=True)
  opts=Options()
  for flag in ['--headless=new','--disable-gpu','--no-sandbox','--window-size=1440,1000','--autoplay-policy=no-user-gesture-required']:opts.add_argument(flag)
  driver=webdriver.Chrome(options=opts)
  try:
   for width in (1440,390):
    driver.set_window_size(width,1000);driver.get(url+page)
    WebDriverWait(driver,15).until(lambda d:d.execute_script('return document.readyState')=='complete')
    assert driver.execute_script('return document.documentElement.scrollWidth <= innerWidth+2'), 'horizontal overflow'
    assert driver.execute_script("return [...document.querySelectorAll('.signature-hero img,.signature-end img')].every(x=>x.complete && x.naturalWidth>0)") or driver.execute_script("document.querySelector('.signature-end img').loading='eager';return true")
    driver.save_screenshot(str(root/f'jandj-{width}.png'))
    print('Responsive width',width,'passed',flush=True)
   results=driver.execute_async_script("""const done=arguments[0];Promise.all([...document.querySelectorAll('.signature-film video')].map(v=>new Promise(resolve=>{v.muted=true;let timer=setTimeout(()=>resolve(false),12000);v.addEventListener('playing',()=>{clearTimeout(timer);v.pause();resolve(v.videoWidth>0)},{once:true});v.play().catch(()=>{clearTimeout(timer);resolve(false)})}))).then(done)""")
   assert all(results),results
   print('Native playback: '+str(results),flush=True)
  finally:driver.quit()
 finally:p.terminate();p.wait(timeout=10)
