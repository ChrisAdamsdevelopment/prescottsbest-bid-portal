"""Install approved voice-guide M4As verbatim from persistent generated inbox."""
from pathlib import Path
import shutil,subprocess,json,hashlib
root=Path(r'D:\PrescottsBestConstruction\05_WEBSITE_AND_TECH\PBC_BID_PORTAL')
inbox=Path(r'D:\PrescottsBestConstruction\Assets\GENERATED_CONCEPTS_INBOX')
out=root/'public/site-assets/audio-guides'
out.mkdir(parents=True,exist_ok=True)
names={
 'holiday_instructions_audio.m4a':'holiday-lighting-designer-instructions-v1.m4a',
 'designcenter_instructions_audio.m4a':'design-center-instructions-v1.m4a',
 'budget_explorer_audio_instructions.m4a':'budget-explorer-instructions-v1.m4a',
}
for original,final in names.items():
 src=inbox/original
 dest=out/final
 assert src.exists(),f'Missing recording: {src}'
 p=subprocess.run(['ffprobe','-v','error','-show_entries',
   'format=duration:stream=codec_type,codec_name,channels,sample_rate','-of','json',str(src)],
   capture_output=True,text=True,check=True)
 info=json.loads(p.stdout)
 assert len(info['streams'])==1 and info['streams'][0]['codec_type']=='audio' and info['streams'][0]['codec_name']=='aac', info
 assert 10<float(info['format']['duration'])<180, info
 shutil.copyfile(src,dest)
 assert hashlib.sha256(src.read_bytes()).digest()==hashlib.sha256(dest.read_bytes()).digest()
 assert dest.stat().st_size<3_000_000
 print('AUDIO_INSTALLED',original,'=>',final,
   'duration_s',round(float(info['format']['duration']),2),
   'bytes',dest.stat().st_size,'verbatim_copy',True,flush=True)
print('THREE_RECORDINGS_READY',flush=True)
