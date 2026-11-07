"""Convert six previously saved hardware guide PNGs into 36 selectable hardware thumbnails.

Source PNGs remain unchanged. Only crops of object examples are published. No photos are generated.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
import json,sys
repo=Path(__file__).resolve().parents[1]
sources=Path(sys.argv[1]) if len(sys.argv)>1 else Path(r'D:\PrescottsBestConstruction\ASSETS\GENERATED_CONCEPTS_INBOX')
target=repo/'public'/'site-assets'/'visual-explorer'/'cabinet-hardware'
target.mkdir(parents=True,exist_ok=True)
source_files=[
 ('matte_back.png','matte-black','Matte black'),
 ('brushed_nickel.png','brushed-nickel','Brushed nickel'),
 ('satin_brass.png','satin-brass','Satin brass'),
 ('old_rubbed_bronze.png','oil-rubbed-bronze','Oil-rubbed bronze'),
 ('antique_brass.png','antique-brass','Antique brass'),
 ('rustic_iron.png','rustic-iron','Rustic iron')
]
rows=[
 ('hinge',160,535,[('concealed','Concealed-style soft-close hinge'),('butt','Exposed square-corner butt hinge'),('decorative','Decorative surface-mount hinge')]),
 ('exterior',688,970,[('knob','Round cabinet knob'),('cup','Cup or bin pull'),('bar','Straight bar pull')])
]
cols=[(26,475),(489,960),(978,1420)]
images=[]
for file,finish,name in source_files:
 source=Image.open(sources/file).convert('RGB')
 if source.size!=(1448,1086):raise SystemExit('Unexpected hardware board geometry: '+file)
 for category,top,bottom,types in rows:
  for i,(item,label) in enumerate(types):
   left,right=cols[i]
   cropped=source.crop((left,top,right,bottom))
   for suffix,size,q in [('',(640,480),89),('-thumb',(320,240),79)]:
    output=target/(category+'-'+finish+'-'+item+suffix+'.webp')
    # Preserve object proportions, move pixel boundaries into a white RGB canvas.
    image=ImageOps.contain(cropped,size,Image.Resampling.LANCZOS)
    board=Image.new('RGB',size,'#faf9f6')
    board.paste(image,((size[0]-image.width)//2,(size[1]-image.height)//2))
    board.save(output,'WEBP',quality=q,method=6)
    if output.stat().st_size<250:raise RuntimeError('Suspicious tiny output '+output.name)
    images.append({'path':str(output.relative_to(repo)).replace('\\','/'),'width':size[0],'height':size[1],
      'bytes':output.stat().st_size,'category':category,'finish':name,'style':label,'source':file})
# Compose a review contact sheet, private project plan only (never public)
examples=[f'exterior-{finish}-bar.webp' for _,finish,_ in source_files]+[f'hinge-{finish}-concealed.webp' for _,finish,_ in source_files]
sample=Image.new('RGB',(1260,1760),'#eef0ee')
draw=ImageDraw.Draw(sample)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',19)
for n,item in enumerate(examples):
 x=15+(n%2)*625;y=10+(n//2)*285
 pic=Image.open(target/item).resize((580,220),Image.Resampling.LANCZOS)
 sample.paste(pic,(x,y))
 draw.text((x,y+224),item,fill='#1c2a21',font=font)
contact=sources/'_hardware_crops_review_12.jpg'
sample.save(contact,quality=86)
print(json.dumps({'sourceBoards':6,'uniqueHardwareChoices':36,'webpFiles':len(images),
 'sampleContactSheet':str(contact),'files':images},indent=2))
