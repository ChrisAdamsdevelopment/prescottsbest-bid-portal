from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,DEVNULL
import requests,time,os,json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
results=[]
with TemporaryDirectory(prefix='pbc-visual-qa-') as temp:
 env={**os.environ,'PORT':'18953','DATA_DIR':temp,'NODE_ENV':'development',
  'PORTAL_ADMIN_KEY':'synthetic-visual-test-admin-key-12345678',
  'SITE_INDEXABLE':'false','LEAD_FORM_ENABLED':'false','PUBLIC_AI_ENABLED':'false'}
 proc=Popen(['node','server.mjs'],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  base='http://127.0.0.1:18953'
  for i in range(110):
   try:
    if requests.get(base+'/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.12)
  else:raise RuntimeError('Local server failed to start')
  opts=webdriver.ChromeOptions()
  opts.add_argument('--headless=new')
  opts.add_argument('--user-data-dir='+str(Path(temp)/'browser'))
  opts.add_argument('--disable-gpu')
  browser=webdriver.Chrome(options=opts)
  try:
   for width,height in [(390,844),(1440,900)]:
    browser.set_window_size(width,height)
    if width==390:
     browser.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':2,'mobile':True})
    else:
     browser.execute_cdp_cmd('Emulation.clearDeviceMetricsOverride',{})
    browser.get(base+'/remodeling-preview/custom-cabinetry')
    browser.execute_script('localStorage.removeItem("pbc-visual-look:cabinet-finishes");localStorage.removeItem("pbc-visual-look:sewing-storage")')
    browser.refresh()
    WebDriverWait(browser,12).until(lambda b:len(b.find_elements(By.CSS_SELECTOR,'[data-visual-explorer]'))==2)
    home=browser.find_element(By.CSS_SELECTOR,'[data-visual-explorer="cabinet-finishes"]')
    craft=browser.find_element(By.CSS_SELECTOR,'[data-visual-explorer="sewing-storage"]')
    assert '/cabinet-light-black.webp' in home.find_element(By.CSS_SELECTOR,'[data-visual-main]').get_attribute('src')
    target=home.find_element(By.CSS_SELECTOR,'[data-visual-axis="tone"][data-visual-value="dark"]')
    browser.execute_script('arguments[0].click()',target)
    assert target.get_attribute('aria-pressed')=='true'
    assert '/cabinet-dark-black.webp' in home.find_element(By.CSS_SELECTOR,'[data-visual-main]').get_attribute('src')
    brass=home.find_element(By.CSS_SELECTOR,'[data-visual-axis="pull"][data-visual-value="brass"]')
    browser.execute_script('arguments[0].click()',brass)
    assert '/cabinet-dark-brass.webp' in home.find_element(By.CSS_SELECTOR,'[data-visual-main]').get_attribute('src')
    save=home.find_element(By.CSS_SELECTOR,'[data-visual-save]')
    browser.execute_script('arguments[0].click()',save)
    assert 'Saved on this device' in home.find_element(By.CSS_SELECTOR,'[data-visual-feedback]').text
    open_control=craft.find_element(By.CSS_SELECTOR,'[data-visual-axis="state"][data-visual-value="open"]')
    browser.execute_script('arguments[0].click()',open_control)
    assert '/sewing-warm-open.webp' in craft.find_element(By.CSS_SELECTOR,'[data-visual-main]').get_attribute('src')
    browser.refresh()
    WebDriverWait(browser,12).until(lambda b:len(b.find_elements(By.CSS_SELECTOR,'[data-visual-explorer]'))==2)
    home=browser.find_element(By.CSS_SELECTOR,'[data-visual-explorer="cabinet-finishes"]')
    assert '/cabinet-dark-brass.webp' in home.find_element(By.CSS_SELECTOR,'[data-visual-main]').get_attribute('src'),'saved look persists'
    browser.get(base+'/remodeling-preview/deck-building-outdoor-carpentry')
    WebDriverWait(browser,12).until(lambda b:len(b.find_elements(By.CSS_SELECTOR,'[data-visual-explorer]'))==1)
    deck=browser.find_element(By.CSS_SELECTOR,'[data-visual-explorer="deck-inspiration"]')
    chosen=deck.find_element(By.CSS_SELECTOR,'[data-visual-value="pine"]')
    browser.execute_script('arguments[0].click()',chosen)
    assert '/deck-pine-home-wood-stairs.webp' in deck.find_element(By.CSS_SELECTOR,'[data-visual-main]').get_attribute('src')
    horizontal=browser.execute_script('return {scroll:document.documentElement.scrollWidth,viewport:window.innerWidth}')
    assert horizontal['scroll']<=horizontal['viewport']+3,horizontal
    browser.execute_script('arguments[0].scrollIntoView({block:"center"})',deck.find_element(By.CSS_SELECTOR,'[data-visual-main]'))
    WebDriverWait(browser,15).until(lambda b:b.execute_script('const x=document.querySelector("[data-visual-explorer=deck-inspiration] [data-visual-main]");return !!(x&&x.complete&&x.naturalWidth>0)'))
    loaded=browser.execute_script('return [...document.images].filter(x=>x.src.includes("visual-explorer")).map(x=>({src:x.src,complete:x.complete,ok:x.naturalWidth>0}))')
    assert loaded and all(x['ok'] for x in loaded),loaded
    browser.save_screenshot(str(Path(temp)/('visual-explorer-'+str(width)+'.png')))
    results.append({'width':width,'height':height,'cabinetSaved':True,'sewingOpen':True,'deckChanged':True,'noOverflow':horizontal})
  finally:browser.quit()
 finally:proc.terminate();proc.wait(timeout=12)
(root/'tests'/'visual-explorer-browser-result.json').write_text(json.dumps({'result':'PASS','checks':results},indent=2),encoding='utf8')
print('VISUAL_EXPLORER_BROWSER_PASS',json.dumps(results))
