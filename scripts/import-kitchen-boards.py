from pathlib import Path
from PIL import Image
import sys,json
repo=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1]) if len(sys.argv)>1 else Path(r'D:\PrescottsBestConstruction\ASSETS\GENERATED_CONCEPTS_INBOX')
dest=repo/'public'/'site-assets'/'visual-explorer'/'kitchen-design-boards'
dest.mkdir(parents=True,exist_ok=True)
pairs=[
 ('Kitchen Remodeling Inspiration Board-1.png','kitchen-board-light-and-materials'),
 ('Prescott Kitchen Remodeling Inspiration Board-2.png','kitchen-board-warm-wood'),
 ('Kitchen Remodeling Inspiration Board-3.png','kitchen-board-dark-wood'),
 ('Kitchen Remodel Finishes Inspiration Board-4.png','kitchen-board-finishes-hardware'),
 ('Kitchen Remodeling Finish Inspiration Board-5.png','kitchen-board-cabinet-doors'),
 ('Kitchen Remodeling Finish Inspiration Board-6-(2).png','kitchen-board-mixed-wood')
]
output=[]
for file,slug in pairs:
 image=Image.open(source/file).convert('RGB')
 if image.size!=(1536,1024):raise RuntimeError('Incorrect image dimensions '+file)
 for suffix,width,quality in [('',1200,84),('-thumb',480,77)]:
  sized=image.resize((width,round(width*2/3)),Image.Resampling.LANCZOS)
  target=dest/(slug+suffix+'.webp')
  sized.save(target,'WEBP',quality=quality,method=6)
  output.append({'file':target.name,'bytes':target.stat().st_size,'source':file})
print(json.dumps({'count':len(output),'assets':output},indent=2))
