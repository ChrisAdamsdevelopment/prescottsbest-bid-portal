from pathlib import Path
import os, subprocess, time, json, urllib.request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

root=Path(__file__).resolve().parents[1]
out=root/"tests"/"real-project-mobile-qa-20261118"
out.mkdir(exist_ok=True)
env={**os.environ, "NODE_ENV":"development","PORT":"19661",
     "SITE_INDEXABLE":"false","LEAD_FORM_ENABLED":"false",
     "DATA_DIR":str(root/".local-data")}
proc=subprocess.Popen(["node","server.mjs"],cwd=root,env=env,
                      stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
driver=None
results=[]
try:
    for _ in range(70):
        try:
            urllib.request.urlopen("http://127.0.0.1:19661/healthz",timeout=1)
            break
        except Exception: time.sleep(.15)
    else: raise RuntimeError("local web server failed startup")
    opts=Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--force-device-scale-factor=1")
    opts.add_argument("--window-size=1280,900")
    driver=webdriver.Chrome(options=opts)
    pages=[
        ("home","/remodeling-preview"),
        ("projects","/remodeling-preview/projects"),
        ("casings","/remodeling-preview/projects/precision-window-casings"),
        ("crystal","/remodeling-preview/projects/crystal-creek-accessible-remodel"),
        ("finish","/remodeling-preview/finish-carpentry"),
        ("bathroom","/remodeling-preview/bathroom-remodeling")
    ]
    for width in [320,360,375,390,414,430,768,1280]:
        driver.set_window_size(1440,1000)
        driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':width,'height':900,'deviceScaleFactor':1,'mobile':width<768})
        driver.execute_cdp_cmd('Emulation.setTouchEmulationEnabled',{'enabled':width<768})
        for label,path in pages:
            driver.get("http://127.0.0.1:19661"+path)
            time.sleep(.13)
            dims=driver.execute_script("""return {
                viewport:document.documentElement.clientWidth,
                scroll:document.documentElement.scrollWidth,
                body:document.body.scrollWidth,
                buttons:[...document.querySelectorAll('.instagram-embed-load')].length,
                iframeBefore:[...document.querySelectorAll('.instagram-embed-target iframe')].length,
                title:document.title,
                h1:document.querySelector('h1')?.innerText
            }""")
            overflow=max(dims["scroll"],dims["body"])-dims["viewport"]
            row={"width":width,"page":label,"overflow":overflow,**dims}
            if overflow>2:
                row['offenders']=driver.execute_script("""const w=document.documentElement.clientWidth;return [...document.querySelectorAll('body *')].filter(e=>{let r=e.getBoundingClientRect();return r.width>0&&(r.right>w+4||r.left<-4)}).slice(0,14).map(e=>({tag:e.tagName,cls:String(e.className).slice(0,80),right:Math.round(e.getBoundingClientRect().right),left:Math.round(e.getBoundingClientRect().left)}))""")
            if width in (320,390,768) and label in ("casings","crystal","projects","home"):
                driver.save_screenshot(str(out/f"{label}-{width}.png"))
            if label in ("casings","crystal") and width in (320,390):
                buttons=driver.find_elements(By.CSS_SELECTOR,".instagram-embed-load")
                if buttons:
                    driver.execute_script("arguments[0].click()",buttons[0])
                    time.sleep(.4)
                    row["clickIframe"]=driver.execute_script(
                        "return document.querySelectorAll('.instagram-embed-target iframe').length")
                    row["iframeWidth"]=driver.execute_script(
                        "return document.querySelector('.instagram-embed-target iframe')?.getBoundingClientRect().width")
                    row["overflowAfterClick"]=driver.execute_script(
                        "return document.documentElement.scrollWidth-document.documentElement.clientWidth")
                    driver.execute_script("arguments[0].scrollIntoView({block:'start'})",buttons[0]);time.sleep(.12)
                    driver.save_screenshot(str(out/f"{label}-{width}-embed.png"))
            results.append(row)
    failures=[r for r in results if r["overflow"]>2 or r.get("overflowAfterClick",0)>2
              or (r["page"] in ("casings","crystal") and r.get("iframeBefore",0)!=0)
              or (r["page"] in ("casings","crystal") and r["width"] in (320,390) and r.get("clickIframe",0)!=1)]
    (out/"results.json").write_text(json.dumps({"rows":results,"failures":failures},indent=2),encoding="utf8")
    print(json.dumps({"rows":len(results),"failures":failures,
                      "sample":results[:4],"out":str(out)},ensure_ascii=False),flush=True)
finally:
    if driver: driver.quit()
    proc.terminate()
    try:proc.wait(timeout=8)
    except subprocess.TimeoutExpired:proc.kill()
