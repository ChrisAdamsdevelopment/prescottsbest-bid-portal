"""Make approved six kitchen match-pair variants from existing original 1672x941 PNGs.
Originals stay on D: unchanged. No new generation.
"""
from pathlib import Path
from PIL import Image
import json,sys
folder=Path(sys.argv[1]) if len(sys.argv)>1 else Path(r'D:\PrescottsBestConstruction\ASSETS\GENERATED_CONCEPTS_INBOX')
repo=Path(__file__).resolve().parents[1]
out=repo/'public'/'site-assets'/'visual-explorer'/'B03-matched-kitchen'
out.mkdir(parents=True,exist_ok=True)
assets=[
 ('darkest_light_kitchen.png','matched-kitchen-light-pale'),
 ('lightest_kitchen.png','matched-kitchen-light-gray'),
 ('lightest_medium_kitchen.png','matched-kitchen-medium-pale'),
 ('darkest_medium_kitchen.png','matched-kitchen-medium-gray'),
 ('dark_kitchen.png','matched-kitchen-dark-pale'),
 ('lightest_dark_kitchen.png','matched-kitchen-dark-gray')
]
files=[]
for original,slug in assets:
 src=folder/original
 image=Image.open(src)
 if image.size!=(1672,941):raise RuntimeError(f'Wrong source dimension: {src}, {image.size}')
 for suffix,width,quality in [('',1440,84),('-thumb',640,76)]:
  resized=image.convert('RGB').resize((width,round(width*941/1672)),Image.Resampling.LANCZOS)
  dest=out/(slug+suffix+'.webp')
  resized.save(dest,'WEBP',quality=quality,method=6)
  files.append({'name':dest.name,'size':resized.size,'bytes':dest.stat().st_size,'original':original})
print(json.dumps({'success':len(files)==12,'files':files},indent=2))
