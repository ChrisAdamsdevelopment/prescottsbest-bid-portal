"""Import approved three Prescott's Best brand films as responsive, optimized web video.

Source audio remains present but muted by default in the website player. Source MP4 files
in the user's generated inbox are never modified or copied into the public repository.
"""
from pathlib import Path
from PIL import Image
import subprocess, json,sys,hashlib,os
source=Path(r'D:\PrescottsBestConstruction\ASSETS\GENERATED_CONCEPTS_INBOX')
repo=Path(__file__).resolve().parents[1]
out=repo/'public'/'site-assets'/'brand-films'
out.mkdir(parents=True,exist_ok=True)
films=[
 ('homepage_video.mp4','prescotts-best-home-remodeling',3.25),
 ('custom_lighting_video.mp4','prescotts-best-holiday-lighting',6.50),
 ('see_it_before_we_build_it_video.mp4','prescotts-best-design-center',6.50)
]
def run(cmd):
 p=subprocess.run(cmd,stdout=subprocess.PIPE,stderr=subprocess.PIPE,encoding='utf8',errors='replace')
 if p.returncode:raise RuntimeError('Failed: '+' '.join(map(str,cmd))+'\n'+p.stderr[-2700:])
 return p
report=[]
for original,slug,timing in films:
 src=source/original
 assert src.is_file(),str(src)
 item={'slug':slug,'source':original,'originalBytes':src.stat().st_size,
       'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'assets':[]}
 for width,quality in [(1280,25),(854,27)]:
  suffix='720' if width==1280 else '480'
  output=out/(slug+'-'+suffix+'.mp4')
  run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(src),
       '-map','0:v:0','-map','0:a:0?','-vf',f'scale={width}:-2:flags=lanczos',
       '-c:v','libx264','-preset','fast','-crf',str(quality),
       '-profile:v','high','-level','4.1','-pix_fmt','yuv420p',
       '-c:a','aac','-b:a','80k','-ac','2',
       '-movflags','+faststart','-max_muxing_queue_size','1024',str(output)])
  info=json.loads(run(['ffprobe','-v','quiet','-show_entries',
   'format=duration,size:stream=codec_name,codec_type,width,height',
   '-of','json',str(output)]).stdout)
  v=[x for x in info['streams'] if x['codec_type']=='video'][0]
  assert v['codec_name']=='h264' and v['width']==width
  assert 9.8<float(info['format']['duration'])<10.4
  item['assets'].append({'file':output.name,'bytes':output.stat().st_size,
     'width':v['width'],'height':v['height'],'duration':info['format']['duration'],
     'audioIncluded':any(x['codec_type']=='audio' for x in info['streams'])})
 # The still poster is shipped as WebP even if the video is disabled or blocked.
 temporary=out/(slug+'-frame.png')
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(timing),
  '-i',str(src),'-frames:v','1',str(temporary)])
 poster=Image.open(temporary).convert('RGB')
 if poster.size!=(1280,720):raise RuntimeError('Wrong source poster dimensions')
 dest=out/(slug+'-poster.webp')
 poster.save(dest,'WEBP',quality=83,method=6)
 temporary.unlink()
 item['poster']={'file':dest.name,'bytes':dest.stat().st_size,'time':timing,'width':1280,'height':720}
 report.append(item)
 print('READY',slug,'720',item['assets'][0]['bytes'],'480',item['assets'][1]['bytes'],
       'poster',dest.stat().st_size,flush=True)
# Keep import metadata in the private project plans directory, not the public repository.
audit=Path(r'D:\PrescottsBestConstruction\07_PROJECT_PLANS\VIDEO_ASSET_MANIFEST_2026-11-08.json')
audit.parent.mkdir(parents=True,exist_ok=True)
audit.write_text(json.dumps(report,indent=2),encoding='utf8')
print('FILMS_IMPORTED',len(report),'PUBLIC_FILES',sum(len(x['assets'])+1 for x in report),
      'TOTAL_BYTES',sum(y['bytes'] for x in report for y in x['assets'])+
       sum(x['poster']['bytes'] for x in report),flush=True)
