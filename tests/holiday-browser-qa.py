"""End-to-end local QA. Real house photos never leave the test computer."""
from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen, DEVNULL
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from PIL import Image,ImageDraw
import requests,os,json,time
root=Path(__file__).resolve().parents[1]
checks=[]
with TemporaryDirectory(prefix='pbc-holiday-qa-') as tmp:
 tmp=Path(tmp)
 img=Image.new('RGB',(1200,760),(88,133,162))
 drawer=ImageDraw.Draw(img)
 drawer.polygon([(130,345),(600,130),(1080,350)],fill=(70,71,73))
 drawer.rectangle((200,345,1040,700),fill=(223,193,159))
 drawer.rectangle((320,445,500,690),fill=(84,104,117))
 drawer.rectangle((720,455,920,690),fill=(85,99,104))
 imagefile=tmp/'test-house.jpg';img.save(imagefile)
 env={**os.environ,'PORT':'18976','DATA_DIR':str(tmp/'localstore'),
  'NODE_ENV':'development','SITE_INDEXABLE':'false','PUBLIC_AI_ENABLED':'true','GEMINI_API_KEY':'synthetic-browser-only-key','LEAD_FORM_ENABLED':'false'}
 process=Popen(['node','--import','./tests/fake-gemini-fetch.mjs','server.mjs'],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  base='http://127.0.0.1:18976'
  for _ in range(60):
   try:
    if requests.get(base+'/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.1)
  options=webdriver.ChromeOptions();options.add_argument('--headless=new');options.add_argument('--window-size=390,900')
  options.add_argument('--disable-extensions')
  options.add_experimental_option('prefs',{'download.default_directory':str(tmp),'download.prompt_for_download':False,'download.directory_upgrade':True})
  driver=webdriver.Chrome(options=options)
  try:
   driver.execute_cdp_cmd('Page.setDownloadBehavior',{'behavior':'allow','downloadPath':str(tmp)})
   for width in (390,1440):
    driver.set_window_size(width,900)
    driver.get(base+'/remodeling-preview/holiday-lighting/design?package=welcome')
    WebDriverWait(driver,15).until(lambda x:'Sample concept home loaded' in x.find_element(By.ID,'holiday-preview-status').text)
    assert driver.find_element(By.ID,'holiday-package').get_attribute('value')=='welcome'
    assert driver.find_element(By.ID,'holiday-download').is_enabled()
    assert driver.find_element(By.ID,'holiday-product').get_attribute('value')=='c9'
    driver.execute_script('arguments[0].value="rope";arguments[0].dispatchEvent(new Event("change",{bubbles:true}))',driver.find_element(By.ID,'holiday-product'))
    assert 'rope lighting' in driver.find_element(By.ID,'holiday-worksheet').text.lower()
    assert not driver.find_element(By.ID,'holiday-ai-ask').is_enabled()
    driver.execute_script('arguments[0].click()',driver.find_element(By.ID,'holiday-ai-consent'))
    assert driver.find_element(By.ID,'holiday-ai-ask').is_enabled()
    driver.execute_script('arguments[0].click()',driver.find_element(By.ID,'holiday-ai-ask'))
    WebDriverWait(driver,8).until(lambda x:'Suggestions are for inspiration' in x.find_element(By.ID,'holiday-ai-status').text)
    assert 'For your project' in driver.find_element(By.ID,'holiday-ai-answer').text
    assert driver.execute_script('return document.documentElement.scrollWidth<=window.innerWidth+3'),('overflow',width)
    before=driver.execute_script('return document.getElementById("holiday-canvas").toDataURL()')
    sel=driver.find_element(By.ID,'holiday-tone')
    driver.execute_script('arguments[0].value="festive";arguments[0].dispatchEvent(new Event("change",{bubbles:true}))',sel)
    after=driver.execute_script('return document.getElementById("holiday-canvas").toDataURL()')
    assert before!=after,('palette not applied',width)
    driver.find_element(By.ID,'holiday-feet').send_keys('125')
    driver.execute_script('arguments[0].click()',driver.find_element(By.CSS_SELECTOR,'.holiday-addons input[value="garage"]'))
    assert 'Garage outline' in driver.find_element(By.ID,'holiday-worksheet').text
    assert 'no price example for this specialty light type' in driver.find_element(By.ID,'holiday-worksheet').text.lower()
    checks.append(f'{width}px demo-home preset, style preview, package and research cost')
    photo=driver.find_element(By.ID,'holiday-photo');photo.send_keys(str(imagefile))
    WebDriverWait(driver,8).until(lambda x:'Photo loaded only on this device' in x.find_element(By.ID,'holiday-preview-status').text)
    assert driver.find_element(By.ID,'holiday-download').get_attribute('disabled') is not None
    canvas=driver.find_element(By.ID,'holiday-canvas')
    for px,py in [(0.2,0.42),(0.5,0.2),(0.8,0.44)]:
     driver.execute_script("""
       const c=arguments[0],b=c.getBoundingClientRect();
       c.dispatchEvent(new PointerEvent('pointerdown',{clientX:b.left+b.width*arguments[1],
         clientY:b.top+b.height*arguments[2],bubbles:true}));
     """,canvas,px,py)
    assert driver.find_element(By.ID,'holiday-download').is_enabled()
    assert driver.find_element(By.ID,'holiday-json').is_enabled()
    driver.execute_script('arguments[0].click()',driver.find_element(By.ID,'holiday-json'))
    WebDriverWait(driver,6).until(lambda x:(tmp/'prescottsbest-holiday-crew-concept.json').exists())
    record=json.loads((tmp/'prescottsbest-holiday-crew-concept.json').read_text(encoding='utf8'))
    assert record['customerPhotoIncluded'] is False
    assert record['contractPrice'] is None
    assert record['hasPhoto'] is True
    assert len(record['points'])==3
    assert record['approximateRunFt']==125
    assert record['preferredProduct']=='rope'
    assert len(record['annotatedSegments'])==2
    assert record['annotatedSegments'][0]['provisionalFeet']>0
    checks.append(f'{width}px photo stays local; user trace and non-binding crew worksheet downloadable')
    driver.execute_script('arguments[0].click()',driver.find_element(By.ID,'holiday-reset'))
    assert driver.find_element(By.ID,'holiday-download').get_attribute('disabled') is not None
    checks.append(f'{width}px clearing trace disables download')
    driver.get(base+'/remodeling-preview/holiday-lighting')
    assert 'Classic Roofline' in driver.page_source
    assert 'not current offers' in driver.page_source
    checks.append(f'{width}px seasonal landing packages and non-binding disclosure')
    (tmp/'prescottsbest-holiday-crew-concept.json').unlink()
   assert requests.get(base+'/proposal',timeout=5).status_code==200
   assert 'Disallow: /' in requests.get(base+'/robots.txt',timeout=5).text
   checks.append('existing private proposal and noindex remain intact')
  finally:
   driver.quit()
 finally:
  process.terminate();process.wait(timeout=8)
out=root/'tests'/'holiday-browser-qa-results.json'
out.write_text(json.dumps({'pass':len(checks),'checks':checks},indent=2),encoding='utf8')
print('HOLIDAY_BROWSER_QA_PASS',len(checks),flush=True)
