// Cabinet hardware inspiration cropped from six locally supplied reference boards.
// Product examples are not specifications, purchase-ready SKUs or guaranteed hardware compatibility.
const finishes=[
 {value:'matte-black',label:'Matte black'},
 {value:'brushed-nickel',label:'Brushed nickel'},
 {value:'satin-brass',label:'Satin brass'},
 {value:'oil-rubbed-bronze',label:'Oil-rubbed bronze'},
 {value:'antique-brass',label:'Antique brass'},
 {value:'rustic-iron',label:'Rustic iron'}
];
const outside=[
 {value:'knob',label:'Round knob',name:'Round cabinet knob',detail:'A compact knob for cabinet doors and smaller drawers.'},
 {value:'cup',label:'Cup/bin pull',name:'Cup-style drawer pull',detail:'A recessed-feel cup profile often used on drawers.'},
 {value:'bar',label:'Straight bar pull',name:'Straight bar cabinet pull',detail:'A clean linear handle for cabinet fronts and drawers.'}
];
const hinges=[
 {value:'concealed',label:'Concealed hinge',name:'Concealed European-style hinge',detail:'Usually hidden when the door is shut; soft-close depends on the actual hinge model.'},
 {value:'butt',label:'Exposed butt hinge',name:'Square-corner exposed butt hinge',detail:'Visible hinge leaves suited to compatible door and frame construction.'},
 {value:'decorative',label:'Decorative hinge',name:'Decorative surface-mount hinge',detail:'Visible decorative plates for a traditional or rustic look, where compatible.'}
];
const file=(type,finish,style,suffix='')=>
 '/site-assets/visual-explorer/cabinet-hardware/'+type+'-'+finish+'-'+style+suffix+'.webp';
const variants=(type,styles)=>finishes.flatMap(f=>styles.map(s=>({
 file:file(type,f.value,s.value),
 thumb:file(type,f.value,s.value,'-thumb'),
 width:640,height:480,thumbWidth:320,
 name:s.name+' — '+f.label,
 alt:'Close-up design reference showing '+s.name.toLowerCase()+' in a '+f.label.toLowerCase()+
    ' finish against a light studio background; cabinet hardware appearance example.',
 caption:s.name+' in '+f.label+'. '+s.detail,
 choice:{finish:f.value,style:s.value}
})));
export const hardwareVisualConfigs={
 'hardware-exterior':{
  id:'hardware-exterior',
  kicker:'KNOBS • CUP PULLS • BAR HANDLES',
  heading:'Choose what you touch: exterior cabinet hardware',
  description:'Compare three handle shapes across six finishes. Select a knob, cup pull or bar pull, then change the finish to see an individual close-up. Save the look you prefer before your consultation.',
  axes:[
   {id:'style',title:'Outside hardware style',options:outside.map(({value,label})=>({value,label}))},
   {id:'finish',title:'Finish appearance',options:finishes}
  ],
  variants:variants('exterior',outside),
  note:'Pictures are design inspiration, not manufacturer models, stock listings or exact color matches. Confirm pull length and drilling centers, mounting thickness, material, finish samples and availability before ordering.'
 },
 'hardware-hinges':{
  id:'hardware-hinges',
  kicker:'INSIDE THE CABINET DOOR',
  heading:'See how cabinet-door hinges differ',
  description:'Hinges control door movement and determine what you see when a cabinet opens. Explore concealed European-style, visible butt and decorative surface-mount hinge examples in six finish families.',
  axes:[
   {id:'style',title:'Hinge type',options:hinges.map(({value,label})=>({value,label}))},
   {id:'finish',title:'Illustrative hardware finish',options:finishes}
  ],
  variants:variants('hinge',hinges),
  note:'Hinges are not interchangeable just because they look similar. Overlay or inset geometry, face-frame or frameless construction, door size, opening angle, soft-close mechanism and available finishes all need approval for the real cabinet. Concealed hinges are usually not visible when closed.'
 }
};
