"""Build a redacted exact-REV2 pilot fixture from the emailed garage test. No private credentials or raw photos are committed."""
from pathlib import Path
from decimal import Decimal,ROUND_HALF_UP
import json
base=Path(r'D:\PrescottsBestConstruction')
est=base/'05_WEBSITE_AND_TECH'/'PBC_ESTIMATOR_APP'
portal=base/'05_WEBSITE_AND_TECH'/'PBC_BID_PORTAL'
job=json.loads((est/'server/.bridge-jobs.json').read_text(encoding='utf-8'))['records']['13a21fd8-5440-4b39-b7fb-90e5811e6bfb']['job']
items=[{'label':x['description'],'amount':round(x['qty']*x['unitCost'],2)} for x in job['items']]
assert len(items)==11
direct=round(sum(x['amount'] for x in items),2)
reserve=round(direct*.1,2)
fee=float((Decimal(str(direct+reserve))*Decimal('.15')).quantize(Decimal('.01'),rounding=ROUND_HALF_UP))
total=round(direct+reserve+fee,2)
assert (direct,reserve,fee,total)==(3005.0,300.5,495.83,3801.33)
proposal={
 'title':'TEST — Garage Side-Entry Door & Light Switch (REV 2)',
 'revision':'REV 2 — INTERACTIVE PILOT',
 'projectRef':'synthetic-garage-rev2-interactive-pilot',
 'customerName':'Demo Homeowner',
 'location':'Prescott Valley, AZ',
 'scope':job.get('scope','')[:3400],
 'terms':'COPIED FROM EMAILED TEST REV 2: The base figures are illustrative, not approved construction pricing. Verify site measurements, door handing, framing/header, garage door clearance, panel access, qualified electrician, permit requirements, tax, supplier costs and signed contract before real work. Optional upgrades on the demo interface are NEW hypothetical scenarios, not part of the emailed quote.',
 'mode':'cost_plus','direct':direct,'contingency':reserve,'fee':fee,'total':total,
 'items':items,'photos':[],'demo':True,'expiresInDays':14}
out=portal/'examples'/'garage-rev2-interactive-pilot.json'
out.write_text(json.dumps(proposal,indent=2)+'\n',encoding='utf-8')
print('SOURCE_REV2_VERIFIED',len(items),'LINES',direct,reserve,fee,total)
print('FIXTURE',out)
