"""End-to-end responsive and playback QA, against isolated local PBC website."""
from pathlib import Path
import os,subprocess,time,json,urllib.request
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

root=Path(__file__).resolve().parents[1]
out=root/'tests'/'native-project-media-browser-20261120'
out.mkdir(exist_ok=True)
env={**os.environ,'NODE_ENV':'development','PORT':'19677','SITE_INDEXABLE':'false',
 'LEAD_FORM_ENABLED':'false','DATA_DIR':str(root/'.local-data-native-test')}
proc=subprocess.Popen(['node','server.mjs'],cwd=root,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
driver=None
rows=[]
base='http://127.0.0.1:19677'
try:
  for _ in range(60):
    try:urllib.request.urlopen(base+'/healthz',timeout=1);break
    except Exception:time.sleep(.2)
  else:raise RuntimeError('Local server did not start')
  for stem in ('window-casing-workbench','crystal-creek-shower-construction'):
    req=urllib.request.Request(base+'/site-assets/real-projects/'+stem+'-480.mp4',headers={'Range':'bytes=0-1023'})
    with urllib.request.urlopen(req,timeout=5) as response:
      assert response.status==206,(stem,response.status)
      assert len(response.read())==1024,stem
      assert response.headers.get('Content-Type')=='video/mp4'
      assert response.headers.get('Accept-Ranges')=='bytes'
    head=urllib.request.Request(base+'/site-assets/real-projects/'+stem+'-720.mp4',method='HEAD')
    with urllib.request.urlopen(head,timeout=5) as response:
      assert response.status==200 and response.headers.get('Content-Type')=='video/mp4'
  opts=Options();opts.page_load_strategy='eager'
  for arg in ['--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1450,900']:
    opts.add_argument(arg)
  driver=webdriver.Chrome(options=opts);driver.set_page_load_timeout(20)
  for width in [320,360,375,390,414,430,768,1280]:
    driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':width,'height':850,'deviceScaleFactor':1,'mobile':width<768})
    driver.execute_cdp_cmd('Emulation.setTouchEmulationEnabled',{'enabled':width<768})
    for label,path in [('casings','precision-window-casings'),('crystal','crystal-creek-accessible-remodel')]:
      driver.get(base+'/remodeling-preview/projects/'+path)
      time.sleep(.12)
      dims=driver.execute_script("""return {
        width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
        body:document.body.scrollWidth, videos:document.querySelectorAll('video.real-project-video').length,
        iframes:document.querySelectorAll('.real-media-card iframe').length,
        galleries:document.querySelectorAll('[data-project-gallery]').length,
        galleryPhotos:document.querySelectorAll('.real-gallery-slide img').length,
        videosFit:[...document.querySelectorAll('.real-project-video')].every(v=>v.getBoundingClientRect().width<=v.parentElement.getBoundingClientRect().width+1),
        galleryFit:[...document.querySelectorAll('.real-gallery-track')].every(v=>v.getBoundingClientRect().width<=v.parentElement.getBoundingClientRect().width+1)
      }""")
      row={'width':width,'page':label,**dims,'overflow':max(dims['scroll'],dims['body'])-dims['width']}
      if width in (320,390,1280):
        video=driver.find_element(By.CSS_SELECTOR,'video.real-project-video')
        driver.execute_script('arguments[0].scrollIntoView({block:"center"})',video)
        time.sleep(.12)
        driver.save_screenshot(str(out/f'{label}-{width}.png'))
      if width in (390,1280):
        video=driver.find_element(By.CSS_SELECTOR,'video.real-project-video')
        driver.execute_script('arguments[0].scrollIntoView({block:"center"})',video)
        try:
          row['playState']=driver.execute_async_script("""const v=arguments[0],done=arguments[arguments.length-1];
            v.muted=true;v.play().then(()=>done({played:true,src:v.currentSrc,ready:v.readyState})).
             catch(e=>done({played:false,error:String(e),src:v.currentSrc}));""",video)
          time.sleep(1.0)
          row['playingTime']=driver.execute_script('return document.querySelector("video.real-project-video").currentTime')
          driver.execute_script('document.querySelector("video.real-project-video").pause()')
          row['topAfterPlay']=driver.current_url
        except Exception as err:row['playError']=str(err)[:220]
      if label=='crystal' and width in (320,390,1280):
        next=driver.find_element(By.CSS_SELECTOR,'[data-gallery-next]')
        driver.execute_script('arguments[0].scrollIntoView({block:"center"})',next)
        driver.execute_script('arguments[0].click()',next)
        time.sleep(.6)
        row['galleryStatusAfterNext']=driver.find_element(By.CSS_SELECTOR,'[data-gallery-status]').text
        row['galleryScrollLeft']=driver.execute_script('return document.querySelector(".real-gallery-track").scrollLeft')
        row['galleryPhotosLoaded']=len(driver.find_elements(By.CSS_SELECTOR,'.real-gallery-slide img'))
      rows.append(row)
  failures=[r for r in rows if r['overflow']>2 or r['iframes'] or r['videos']!=1 or not r['videosFit']
            or not r['galleryFit'] or (r['page']=='crystal' and r['galleryPhotos']!=20)
            or (r['page']=='casings' and r['galleryPhotos']!=0)
            or ('playState' in r and (not r['playState']['played'] or r.get('playingTime',0)<=0))
            or ('galleryStatusAfterNext' in r and (r['galleryStatusAfterNext']!='Photo 2 of 20' or r['galleryScrollLeft']<=0))]
  (out/'results.json').write_text(json.dumps({'rows':rows,'failures':failures},indent=2),encoding='utf8')
  print(json.dumps({'checks':len(rows),'failures':failures,'playback':[
    {'page':r['page'],'width':r['width'],'state':r.get('playState'),'time':r.get('playingTime')}
    for r in rows if 'playState' in r],'out':str(out)},ensure_ascii=False),flush=True)
finally:
  if driver:driver.quit()
  proc.terminate()
  try:proc.wait(timeout=5)
  except subprocess.TimeoutExpired:proc.kill()
