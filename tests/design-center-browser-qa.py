"""Full browser QA for cross-category Design Center and corrected holiday-light editor."""
from pathlib import Path
from tempfile import TemporaryDirectory
from subprocess import Popen,DEVNULL
import os,time,json,requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
results=[]
with TemporaryDirectory(prefix='pbc-design-center-qa-') as temp:
 env={**os.environ,'PORT':'18993','DATA_DIR':temp,'NODE_ENV':'development',
  'SITE_INDEXABLE':'false','PUBLIC_AI_ENABLED':'false','LEAD_FORM_ENABLED':'false',
  'PORTAL_ADMIN_KEY':'synthetic-design-center-key-1234567890'}
 process=Popen(['node','server.mjs'],cwd=root,env=env,stdout=DEVNULL,stderr=DEVNULL)
 try:
  url='http://127.0.0.1:18993'
  for n in range(120):
   try:
    if requests.get(url+'/healthz',timeout=1).ok:break
   except requests.RequestException:time.sleep(.12)
  else:raise RuntimeError('Local server did not start')
  options=webdriver.ChromeOptions()
  options.add_argument('--headless=new')
  options.add_argument('--disable-gpu')
  options.add_argument('--user-data-dir='+str(Path(temp)/'chrome'))
  driver=webdriver.Chrome(options=options)
  wait=WebDriverWait(driver,18)
  try:
   def go(path):
    driver.get(url+'/remodeling-preview'+path)
   def el(css):return driver.find_element(By.CSS_SELECTOR,css)
   def press(css):
    driver.execute_script('arguments[0].click()',el(css))
   def choose(css,value):
    driver.execute_script("const e=arguments[0];e.value=arguments[1];e.dispatchEvent(new Event('change',{bubbles:true}));",el(css),value)
   def point(x,y,kind='pointerdown'):
    canvas=el('#holiday-canvas')
    driver.execute_script("""
     const c=arguments[0],r=c.getBoundingClientRect();
     c.dispatchEvent(new PointerEvent(arguments[3],{
       pointerId:1,pointerType:'mouse',isPrimary:true,bubbles:true,
       clientX:r.left+r.width*arguments[1],clientY:r.top+r.height*arguments[2]
     }));
    """,canvas,x,y,kind)
   for width,height in [(390,844),(1440,900)]:
    driver.set_window_size(width,height)
    if width==390:driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',
      {'width':390,'height':844,'deviceScaleFactor':2,'mobile':True})
    else:driver.execute_cdp_cmd('Emulation.clearDeviceMetricsOverride',{})
    go('')
    assert driver.find_element(By.CSS_SELECTOR,'.holiday-home-feature').is_displayed()
    home=driver.page_source
    assert home.index('holiday-home-feature')<home.index('storm-home-banner')
    assert 'Design lights on my home' in home
    go('/visual-design-preview')
    wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,'.visual-preview-card'))==6)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.design-center-nav-item'))>=8
    go('/deck-building-outdoor-carpentry')
    press('.design-center-nav-item[href*="kitchen-remodeling#wood-stain-boards"]')
    wait.until(lambda d:'/kitchen-remodeling' in d.current_url)
    assert el('#wood-stain-boards').is_displayed()
    press('.design-center-nav-item[href*="custom-cabinetry#hardware-exterior"]')
    wait.until(lambda d:'/custom-cabinetry' in d.current_url)
    assert el('#hardware-exterior').is_displayed()
    go('/holiday-lighting/design?package=welcome')
    wait.until(lambda d:'Clean sample house ready' in d.find_element(By.ID,'holiday-preview-status').text)
    assert el('#holiday-package').get_attribute('value')=='welcome'
    assert el('#holiday-download').get_attribute('disabled') is not None
    assert len(driver.find_elements(By.CSS_SELECTOR,'#holiday-strand-list li'))==1
    assert 'No light runs yet' in el('#holiday-strand-list').text
    image_before=driver.execute_script("return document.getElementById('holiday-canvas').toDataURL('image/png')")
    # First run, default red/white preset
    press('#holiday-tool-draw')
    assert el('#holiday-tool-draw').get_attribute('aria-pressed')=='true'
    point(.20,.50);point(.42,.38)
    assert el('#holiday-finish').is_enabled()
    press('#holiday-finish')
    assert el('#holiday-tool-select').get_attribute('aria-pressed')=='true'
    assert len(driver.find_elements(By.CSS_SELECTOR,'#holiday-strand-list li'))==1
    assert el('#holiday-download').is_enabled()
    # A separate second run gets its own multicolor palette.
    press('#holiday-tool-draw')
    choose('#holiday-tone','festive')
    point(.55,.43);point(.78,.51)
    press('#holiday-finish')
    assert len(driver.find_elements(By.CSS_SELECTOR,'#holiday-strand-list li'))==2
    assert 'candy' in driver.find_elements(By.CSS_SELECTOR,'#holiday-strand-list li')[0].text
    assert 'festive' in driver.find_elements(By.CSS_SELECTOR,'#holiday-strand-list li')[1].text
    # Select and recolor just the first run. Second must retain its own color.
    press('#holiday-strand-list li:first-child [data-run-select]')
    choose('#holiday-tone','cool')
    rows=driver.find_elements(By.CSS_SELECTOR,'#holiday-strand-list li')
    assert len(rows)==2 and 'cool' in rows[0].text and 'festive' in rows[1].text
    # Remove one run, undo, redo, then undo to restore both.
    press('#holiday-strand-list li:nth-child(2) [data-run-delete]')
    assert len(driver.find_elements(By.CSS_SELECTOR,'#holiday-strand-list li'))==1
    press('#holiday-undo')
    assert len(driver.find_elements(By.CSS_SELECTOR,'#holiday-strand-list li'))==2
    press('#holiday-redo')
    assert len(driver.find_elements(By.CSS_SELECTOR,'#holiday-strand-list li'))==1
    press('#holiday-undo')
    assert len(driver.find_elements(By.CSS_SELECTOR,'#holiday-strand-list li'))==2
    # Editing a node must preserve two independent runs.
    press('#holiday-strand-list li:first-child [data-run-select]')
    point(.20,.50);point(.23,.47,'pointermove');point(.23,.47,'pointerup')
    assert len(driver.find_elements(By.CSS_SELECTOR,'#holiday-strand-list li'))==2
    # Before/after toggles actual house photo vs colored runs.
    image_with=driver.execute_script("return document.getElementById('holiday-canvas').toDataURL('image/png')")
    assert image_with!=image_before
    press('#holiday-before')
    assert el('#holiday-before').get_attribute('aria-pressed')=='true'
    original=driver.execute_script("return document.getElementById('holiday-canvas').toDataURL('image/png')")
    assert original!=image_with
    press('#holiday-before')
    assert el('#holiday-before').get_attribute('aria-pressed')=='false'
    # Users can save the selected holiday style to the same inspiration list.
    press('#holiday-add-idea')
    count=driver.execute_script('return window.pbcInspirationList.read().filter(x=>x.explorerId==="holiday-lighting").length')
    assert count==1,('holiday idea count',count)
    assert 'My Ideas' in driver.page_source
    go('/visual-design-preview#my-inspiration-list')
    wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,'#my-inspiration-list .inspiration-item'))>=1)
    assert 'holiday lighting' in el('#my-inspiration-list').text.lower()
    go('/schedule?preview=1&from=inspiration')
    wait.until(lambda d:len(d.find_elements(By.CSS_SELECTOR,'.inspiration-form-summary .inspiration-item'))>=1)
    assert 'holiday lighting' in el('.inspiration-form-summary').text.lower()
    assert el('#lead-name').get_attribute('value')==''
    bounds=driver.execute_script('return {viewport:window.innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll("body *")].filter(x=>x.getBoundingClientRect().right>window.innerWidth+3).slice(0,12).map(x=>({tag:x.tagName,cls:x.className,id:x.id,right:Math.round(x.getBoundingClientRect().right)}))}')
    assert bounds['scroll']<=bounds['viewport']+3,('page overflow',width,bounds)
    go('/holiday-lighting/design')
    wait.until(lambda d:'Clean sample house ready' in d.find_element(By.ID,'holiday-preview-status').text)
    press('#holiday-tool-draw');point(.21,.52);point(.40,.39);press('#holiday-finish')
    press('#holiday-reset')
    assert el('#holiday-download').get_attribute('disabled') is not None
    press('#holiday-undo')
    assert el('#holiday-download').is_enabled()
    assert len(driver.find_elements(By.CSS_SELECTOR,'#holiday-strand-list li'))==1
    assert driver.execute_script('return document.documentElement.scrollWidth<=window.innerWidth+3'),('editor overflow',width)
    driver.save_screenshot(str(root/'tests'/f'design-center-holiday-{width}.png'))
    driver.execute_script('arguments[0].scrollIntoView({block:"start"})',el('#holiday-editor-tools'))
    driver.save_screenshot(str(root/'tests'/f'design-center-editor-tools-{width}.png'))
    driver.execute_script('arguments[0].scrollIntoView({block:"start"})',el('#holiday-preview'))
    driver.save_screenshot(str(root/'tests'/f'design-center-preview-canvas-{width}.png'))
    results.append({'width':width,'homeHolidayProminent':True,'crossNav':True,'cleanStart':True,
     'independentRuns':True,'recolorSingleRun':True,'undoRedo':True,'move':True,
     'beforeAfter':True,'savedHolidayIdeaToInquiry':True,'clearUndo':True,'noOverflow':True})
  finally:driver.quit()
 finally:process.terminate();process.wait(timeout=12)
(root/'tests'/'design-center-browser-results.json').write_text(json.dumps(results,indent=2),encoding='utf8')
print('DESIGN_CENTER_EDITOR_BROWSER_PASS',json.dumps(results))
