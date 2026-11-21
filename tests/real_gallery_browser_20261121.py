"""Real-media mobile/browser acceptance against the isolated local marketing site."""
from pathlib import Path
import json,time,urllib.request
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
root=Path(__file__).resolve().parents[1]
out=root/"tests"/"real-gallery-browser-20261121"
out.mkdir(exist_ok=True)
base="http://127.0.0.1:34121"
with urllib.request.urlopen(base+"/remodeling-preview/projects/gallery",timeout=7) as response:
 assert response.status==200
req=urllib.request.Request(base+"/site-assets/real-gallery/andrew-craftsmanship-with-sound.mp4",headers={"Range":"bytes=0-1023"})
with urllib.request.urlopen(req,timeout=7) as response:
 assert response.status==206
 assert response.headers.get("Accept-Ranges")=="bytes"
 assert response.headers.get("Content-Type")=="video/mp4"
 assert len(response.read())==1024
opts=Options()
opts.page_load_strategy="eager"
for arg in ("--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--window-size=1440,900"):
 opts.add_argument(arg)
driver=webdriver.Chrome(options=opts)
driver.set_page_load_timeout(24)
rows=[]
try:
 for width in (320,360,390,430,768,1024,1280):
  driver.execute_cdp_cmd("Emulation.setDeviceMetricsOverride",{"width":width,"height":850,"deviceScaleFactor":1,"mobile":width<768})
  driver.execute_cdp_cmd("Emulation.setTouchEmulationEnabled",{"enabled":width<768})
  for label,path in (("home","/"),("projects","/projects"),("gallery","/projects/gallery"),("video","/projects/andrew-at-work"),("kitchen","/kitchen-remodeling")):
   driver.get(base+"/remodeling-preview"+("" if path=="/" else path))
   time.sleep(.14)
   data=driver.execute_script("""return {
      w:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
      body:document.body.scrollWidth, videos:document.querySelectorAll('.pbc-reel-player video').length,
      compares:document.querySelectorAll('[data-pbc-compare]').length,
      photoCards:document.querySelectorAll('[data-pbc-photo]').length,
      galleryScripts:document.querySelectorAll('script[src="/real-gallery.js"]').length,
      videoFit:[...document.querySelectorAll('.pbc-reel-player video')].every(v=>v.getBoundingClientRect().width<=v.parentElement.getBoundingClientRect().width+2),
      source:document.querySelector('.pbc-reel-player video source')?.getAttribute('src')||'',
      realImage:document.querySelector('.pbc-real-home-pictures img,.pbc-real-hero-image img')?.getAttribute('src')||''
    }""")
   data.update({"viewport":width,"page":label,"overflow":max(data["scroll"],data["body"])-data["w"]})
   if label=="gallery":
    assert data["compares"]==6 and data["photoCards"]==10
    slider=driver.find_element(By.CSS_SELECTOR,"[data-pbc-compare] input")
    driver.execute_script("arguments[0].scrollIntoView({block:'center'});arguments[0].value='78';arguments[0].dispatchEvent(new Event('input',{bubbles:true}));",slider)
    data["slider"]=driver.execute_script("return document.querySelector('[data-pbc-compare]').style.getPropertyValue('--compare')")
    if width in (390,1280):
     photo=driver.find_element(By.CSS_SELECTOR,"[data-pbc-photo]")
     driver.execute_script("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",photo)
     data["lightboxOpen"]=driver.execute_script("return !!document.querySelector('[data-pbc-lightbox]').open")
     driver.find_element(By.CSS_SELECTOR,"[data-pbc-close]").click()
     data["lightboxClosed"]=not driver.execute_script("return !!document.querySelector('[data-pbc-lightbox]').open")
    if width in (390,1280):
     driver.execute_script("document.getElementById('before-after').scrollIntoView({block:'start'})")
     time.sleep(.15)
     driver.save_screenshot(str(out/f"gallery-compare-{width}.png"))
   if label in ("home","gallery","video") and width in (390,1280):
    video=driver.find_element(By.CSS_SELECTOR,".pbc-reel-player video")
    driver.execute_script("arguments[0].scrollIntoView({block:'center'})",video)
    time.sleep(.15)
    if label=="gallery":
     driver.save_screenshot(str(out/f"gallery-video-{width}.png"))
    if label=="home":
     driver.save_screenshot(str(out/f"home-video-{width}.png"))
    try:
     data["playState"]=driver.execute_async_script("""const v=arguments[0],done=arguments[arguments.length-1];v.muted=true;v.play().then(()=>done('played')).catch(e=>done(String(e)));""",video)
     time.sleep(.65)
     data["playingSeconds"]=driver.execute_script("return arguments[0].currentTime",video)
     driver.execute_script("arguments[0].pause()",video)
     data["stayedOnSite"]=driver.current_url.startswith(base)
    except Exception as ex:data["playError"]=str(ex)[:150]
   rows.append(data)
 failures=[x for x in rows if x["overflow"]>3 or not x["videoFit"] or
   (x["page"] in ("home","gallery","video") and x["videos"]!=1) or
   (x["page"]=="gallery" and (x["slider"]!="78%" or x["galleryScripts"]!=1)) or
   ("lightboxOpen" in x and (not x["lightboxOpen"] or not x["lightboxClosed"])) or
   ("playState" in x and (x["playState"]!="played" or x.get("playingSeconds",0)<=0 or not x["stayedOnSite"]))]
 (out/"results.json").write_text(json.dumps({"checks":len(rows),"failures":failures,"rows":rows},indent=2),encoding="utf-8")
 print(json.dumps({"checks":len(rows),"failure_count":len(failures),"failures":failures,"video_play_checks":[{"page":x["page"],"viewport":x["viewport"],"play":x.get("playState"),"seconds":x.get("playingSeconds")} for x in rows if "playState" in x],"out":str(out)}),flush=True)
 assert not failures,"See browser QA JSON"
finally:
 driver.quit()
