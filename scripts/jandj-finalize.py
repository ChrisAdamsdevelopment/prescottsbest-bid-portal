from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'marketing/jandj-project.mjs'
p.write_text(p.read_text(encoding='utf-8').replace('width="1648" height="928"','width="1672" height="941"'),encoding='utf-8')
p=r/'marketing/site.mjs'
p.write_text(p.read_text(encoding='utf-8').replace("jandjPath?'1648'","jandjPath?'1672'").replace("jandjPath?'928'","jandjPath?'941'"),encoding='utf-8')
