// Approved visual-inspiration comparisons sourced from the project's local generated-concepts inbox.
// Files here are optimized published derivatives; source originals remain private on the project drive.
// These are concept examples, not documented completed construction jobs or product-specific finish samples.
const mk=(folder,slug,name,alt,caption,choice)=>({
  file:'/site-assets/visual-explorer/'+folder+'/'+slug+'.webp',
  thumb:'/site-assets/visual-explorer/'+folder+'/'+slug+'-thumb.webp',
  name,alt,caption,choice
});
export const visualExplorers={
 'cabinet-finishes':{
  id:'cabinet-finishes',
  heading:'See the same cabinetry in six different finishes',
  kicker:'EXPLORE CABINET FINISHES',
  description:'Compare a similar built-in wall in three wood-tone families and two hardware colors. Choose the combination you like, then save the description for your consultation.',
  axes:[
   {id:'tone',title:'Wood finish appearance',options:[{value:'light',label:'Light wood'},{value:'medium',label:'Medium wood'},{value:'dark',label:'Dark espresso'}]},
   {id:'pull',title:'Hardware finish',options:[{value:'black',label:'Matte black'},{value:'brass',label:'Brushed brass'}]}
  ],
  variants:[
   mk('B01-cabinet-finish','cabinet-light-black','Light wood with black pulls','Light natural wood home office built-in cabinets with matte black handles, a central desk, shelving and drawers.','Light wood-tone built-ins with matte black pulls.',{tone:'light',pull:'black'}),
   mk('B01-cabinet-finish','cabinet-light-brass','Light wood with brass pulls','Light natural wood home office built-in cabinets with brass-color handles, a central desk, shelving and drawers.','Light wood-tone built-ins with brushed brass-color pulls.',{tone:'light',pull:'brass'}),
   mk('B01-cabinet-finish','cabinet-medium-black','Medium wood with black pulls','Warm medium wood-tone built-in office cabinetry with black handles, a desk nook and display shelving.','Medium warm wood-tone built-ins with matte black pulls.',{tone:'medium',pull:'black'}),
   mk('B01-cabinet-finish','cabinet-medium-brass','Medium wood with brass pulls','Warm medium wood-tone built-in office cabinetry with brass-color hardware, desk nook and display shelving.','Medium warm wood-tone built-ins with brass-color pulls.',{tone:'medium',pull:'brass'}),
   mk('B01-cabinet-finish','cabinet-dark-black','Dark wood with black pulls','Deep espresso wood-tone built-in office cabinetry with matte black handles and a central writing desk.','Deep espresso wood-tone built-ins with matte black pulls.',{tone:'dark',pull:'black'}),
   mk('B01-cabinet-finish','cabinet-dark-brass','Dark wood with brass pulls','Deep espresso wood-tone home office built-in with brass-color cabinet handles and central desk.','Deep espresso wood-tone built-ins with brass-color pulls.',{tone:'dark',pull:'brass'})
  ],
  note:'Screen colors are design inspiration, not physical stain samples. Wood species, finish, cabinet construction and hardware are confirmed from actual products before ordering.'
 },
 'sewing-storage':{
  id:'sewing-storage',
  heading:'Watch a concealed craft station open for everyday use',
  kicker:'HIDDEN STORAGE IDEAS',
  description:'Compare the same compact sewing workstation with the storage closed and opened. Explore three wood-tone looks while keeping the basic station layout familiar.',
  axes:[
   {id:'tone',title:'Storage finish appearance',options:[{value:'warm',label:'Warm brown'},{value:'weathered',label:'Weathered brown'},{value:'espresso',label:'Dark espresso'}]},
   {id:'state',title:'How would you use it?',options:[{value:'closed',label:'Cabinets closed'},{value:'open',label:'Ready for sewing'}]}
  ],
  variants:[
   mk('B02-sewing-storage','sewing-warm-closed','Warm wood craft station, closed','Warm wood-tone built-in sewing station with closed storage panels and drawers in a neutral room.','Warm wood-tone sewing station with the storage closed.',{tone:'warm',state:'closed'}),
   mk('B02-sewing-storage','sewing-warm-open','Warm wood craft station, open','Warm wood-tone built-in sewing station opened to reveal a sewing work surface, task lighting and supplies.','Warm wood-tone sewing station with a work surface and storage opened.',{tone:'warm',state:'open'}),
   mk('B02-sewing-storage','sewing-weathered-closed','Weathered wood craft station, closed','Weathered medium-brown wood-tone sewing station with tall closed storage and a central work area.','Weathered medium-brown sewing station in its tidy, closed position.',{tone:'weathered',state:'closed'}),
   mk('B02-sewing-storage','sewing-weathered-open','Weathered wood craft station, open','Weathered medium-brown sewing station with doors open and an illuminated sewing workstation visible.','Weathered medium-brown sewing station opened for sewing and organizing.',{tone:'weathered',state:'open'}),
   mk('B02-sewing-storage','sewing-espresso-closed','Espresso craft station, closed','Dark espresso built-in sewing station with closed upper panels, side cupboard and drawers.','Dark espresso sewing station with closed storage.',{tone:'espresso',state:'closed'}),
   mk('B02-sewing-storage','sewing-espresso-open','Espresso craft station, open','Dark espresso built-in sewing station opened to show a lit work surface, sewing machine and organized storage.','Dark espresso sewing station with the work surface visible.',{tone:'espresso',state:'open'})
  ],
  note:'Opening configurations are illustrative. Door swing, outlet access, sewing-machine dimensions, worktop height and ventilation are measured and designed for each real room.'
 },
 'deck-inspiration':{
  id:'deck-inspiration',
  heading:'Six ways an outdoor living space can feel',
  kicker:'DECK & OUTDOOR LIVING INSPIRATION',
  description:'Explore different deck sizes and settings for Prescott-area homes. Choose an idea close to your property, then discuss the actual structure, railing, drainage, and permits with a contractor.',
  axes:[
   {id:'scene',title:'Choose a deck setting',options:[
    {value:'lodge',label:'Lodge & fire pit'},
    {value:'entry',label:'Simple entry deck'},
    {value:'covered',label:'Covered outdoor lounge'},
    {value:'view',label:'Hillside view deck'},
    {value:'pergola',label:'Shaded pergola'},
    {value:'pine',label:'Pine-country deck'}
   ]}
  ],
  variants:[
   mk('B06-deck-inspiration','deck-stone-lodge-firepit','Stone lodge deck with fire pit','Twilight concept of a large multilevel wood deck and seating around a fire pit at a lodge-style mountain home.','Lodge-inspired multi-level deck with outdoor seating and fire feature.',{scene:'lodge'}),
   mk('B06-deck-inspiration','deck-stucco-entry-stairs','Small stucco-home entry deck','Small raised deck with three steps, railings and chairs outside a Southwest stucco home.','Practical entry deck with steps and simple railings.',{scene:'entry'}),
   mk('B06-deck-inspiration','deck-covered-patio-kitchen','Covered outdoor living deck','Covered wood-finish patio with seating, ceiling lights and an outdoor kitchen beside a Southwestern home.','Covered outdoor lounge concept with seating and cooking area.',{scene:'covered'}),
   mk('B06-deck-inspiration','deck-hillside-view-rail','Hillside deck with dark railing','Modern hillside deck with slim dark railings, relaxed seating and views of mountain terrain.','View-oriented deck with slim-profile dark railings.',{scene:'view'}),
   mk('B06-deck-inspiration','deck-white-pergola-shade','White pergola over a deck','Light-colored pergola over a wood-finish deck with steps and dining space by a Southwest home.','Open pergola over a deck for outdoor dining.',{scene:'pergola'}),
   mk('B06-deck-inspiration','deck-pine-home-wood-stairs','Wood deck at a pine-country home','Wood deck with steps, black railings, timber posts and seating outside a home in a pine landscape.','Wood-finish deck with stairs and mountain-home detailing.',{scene:'pine'})
  ],
  note:'Settings and features are inspiration rather than approved structural plans. Actual decks require site-specific assessment of footings, guards, stairs, connections, fire exposure, permitted scope, and HOA review.'
 }
};
const escaped=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const catalogPath=(id)=>visualExplorers[id]||null;
export function visualExplorersForService(path){
 return path==='/custom-cabinetry'?[visualExplorers['cabinet-finishes'],visualExplorers['sewing-storage']]:
 path==='/deck-building-outdoor-carpentry'?[visualExplorers['deck-inspiration']]:[];
}
export function visualExplorerSection(config,link){
 if(!config)return '';
 const first=config.variants[0];
 const data=JSON.stringify({id:config.id,axes:config.axes,variants:config.variants}).replace(/</g,'\\u003c');
 return '<section class="site-section visual-explorer" data-visual-explorer="'+escaped(config.id)+'" aria-labelledby="'+escaped(config.id)+'-title">'+
 '<div class="section-heading"><span class="kicker">'+escaped(config.kicker)+'</span><h2 id="'+escaped(config.id)+'-title">'+escaped(config.heading)+'</h2><p>'+escaped(config.description)+'</p></div>'+
 '<div class="visual-workspace"><figure class="visual-main-figure"><img data-visual-main src="'+first.file+'" srcset="'+first.thumb+' 480w, '+first.file+' 1280w" sizes="(max-width:700px) 100vw, 800px" width="1280" height="960" loading="lazy" decoding="async" alt="'+escaped(first.alt)+'">'+
 '<figcaption data-visual-caption>'+escaped(first.caption)+'</figcaption></figure>'+
 '<div class="visual-control-panel">'+config.axes.map(axis=>
  '<fieldset class="visual-axis"><legend>'+escaped(axis.title)+'</legend><div class="visual-option-row">'+axis.options.map((option,i)=>
   '<button type="button" data-visual-axis="'+escaped(axis.id)+'" data-visual-value="'+escaped(option.value)+'" aria-pressed="'+(i===0?'true':'false')+'">'+escaped(option.label)+'</button>').join('')+'</div></fieldset>').join('')+
 '<p class="visual-selection-text" aria-live="polite" data-visual-selection>'+escaped(first.name)+'</p>'+
 '<div class="visual-actions"><button type="button" data-visual-save>Save this look</button><button type="button" data-visual-copy>Copy design details</button><a class="site-button outline" data-visual-request href="'+link('/schedule')+'?preview=1">Ask about this design</a></div>'+
 '<p class="visual-feedback" data-visual-feedback role="status" aria-live="polite"></p>'+
 '<p class="visual-disclosure">'+escaped(config.note)+'</p></div></div>'+
 '<script type="application/json" data-visual-catalog>'+data+'</script>'+
 '<noscript><div class="visual-nojs"><strong>More looks:</strong><ul>'+config.variants.map(v=>'<li><a href="'+v.file+'">'+escaped(v.name)+'</a></li>').join('')+'</ul></div></noscript></section>';
}
export function visualImageObjectsForPage(path,origin){
 return visualExplorersForService(path).flatMap(config=>config.variants.map(v=>({
  '@type':'ImageObject',name:v.name,contentUrl:origin+v.file,url:origin+v.file,
  description:v.alt,caption:v.caption,width:1280,height:960
 })));
}
export function allVisualImages(){
 return Object.values(visualExplorers).flatMap(g=>g.variants);
}
export function visualGroups(){return Object.values(visualExplorers);}
