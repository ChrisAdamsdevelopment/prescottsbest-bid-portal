// Visual inspiration only. These are deliberately different kitchen settings and finish-detail photos,
// not interchangeable finishes digitally applied to a single, geometry-locked kitchen.
// Six wood reference boards illustrate stain families for each wood species. Real stain samples vary.
const kitchenAsset='/site-assets/visual-explorer/B03-kitchen-style/';
const woodAsset='/site-assets/visual-explorer/wood-stain-boards/';
const kitchen=(slug,name,alt,caption,tone,view)=>({
 file:kitchenAsset+slug+'.webp',thumb:kitchenAsset+slug+'-thumb.webp',
 width:860,height:580,thumbWidth:430,name,alt,caption,choice:{tone,view}
});
const board=(slug,name,alt,caption,species)=>({
 file:woodAsset+slug+'.webp',thumb:woodAsset+slug+'-thumb.webp',
 width:900,height:1125,thumbWidth:320,name,alt,caption,choice:{species}
});
export const kitchenVisualConfigs={
 'kitchen-inspiration':{
  id:'kitchen-inspiration',
  kicker:'KITCHEN STYLE EXPLORER',
  heading:'See how different kitchen finishes change the atmosphere',
  description:'Choose a light, medium, or dark kitchen concept. Switch between the room view and a close-up of cabinets, countertops, and hardware. Each example is a different design idea—not an identical room with only the stain changed.',
  axes:[
   {id:'tone',title:'Choose an overall look',options:[
    {value:'light',label:'Light & bright'},
    {value:'medium',label:'Warm medium wood'},
    {value:'dark',label:'Deep dark wood'}
   ]},
   {id:'view',title:'What would you like to see?',options:[
    {value:'room',label:'Whole kitchen'},
    {value:'detail',label:'Finish close-up'}
   ]}
  ],
  variants:[
   kitchen('kitchen-light-room','Bright kitchen — full view',
    'Bright kitchen with light painted cabinets, pale countertops, black handles, pendant lighting, island, and white tile backsplash.',
    'Light kitchen inspiration • Pale counters, light cabinet fronts, and black accents brighten the space.','light','room'),
   kitchen('kitchen-light-detail','Bright kitchen — material detail',
    'Close-up of light painted kitchen cabinetry, slim black handles, white tile backsplash and pale marble-look countertop.',
    'Light finish detail • Pale stone-look countertop, white cabinetry and contrasting black pulls.','light','detail'),
   kitchen('kitchen-medium-room','Warm wood kitchen — full view',
    'Warm medium-brown wood kitchen with pendant lighting, granite-look counters, stone tile backsplash and island.',
    'Medium wood kitchen inspiration • Richer cabinet grain, patterned stone-look counters and warm ambient light.','medium','room'),
   kitchen('kitchen-medium-detail','Warm wood kitchen — material detail',
    'Close-up of medium-brown wood kitchen drawer fronts with black cup pulls and patterned granite-look countertop.',
    'Medium finish detail • Wood-grain drawers, dark cup pulls and a patterned countertop surface.','medium','detail'),
   kitchen('kitchen-dark-room','Dark wood kitchen — full view',
    'Deep dark-brown kitchen cabinetry with black stone-look countertops, warm gold hardware, overhead lighting and an island.',
    'Dark kitchen inspiration • Espresso-tone cabinetry, darker stone-look surfaces and brass-tone hardware.','dark','room'),
   kitchen('kitchen-dark-detail','Dark wood kitchen — material detail',
    'Close-up of dark espresso-brown kitchen drawers with gold-tone hardware and a black veined stone-look countertop.',
    'Dark finish detail • Deep wood-tone grain, veined dark countertop and warm brass-color pulls.','dark','detail')
  ],
  note:'These are separate inspiration scenes, not six controlled versions of one exact kitchen. Finish colors and species depend on lighting, real samples, sourcing and the existing layout; final decisions are confirmed during planning.'
 },
 'wood-stain-boards':{
  id:'wood-stain-boards',
  kicker:'WOOD SPECIES & STAIN IDEAS',
  heading:'Explore how stain tones can look on different woods',
  description:'Six visual-reference boards, each displaying six stain-tone examples. Select a wood type to view its grain and possible looks, then save your favorite as a starting point for a real sample discussion.',
  axes:[
   {id:'species',title:'Choose a wood reference',options:[
    {value:'white-oak',label:'White oak'},
    {value:'maple',label:'Maple'},
    {value:'walnut',label:'Walnut'},
    {value:'alder',label:'Alder'},
    {value:'hickory',label:'Hickory'},
    {value:'red-oak',label:'Red oak'}
   ]}
  ],
  variants:[
   board('white-oak-stain-reference','White oak stain inspiration','White oak cabinet doors arranged in six labeled stain-tone examples, from light natural through espresso-dark.','White oak • Compare six light-to-dark illustrative stain looks and visible grain.', 'white-oak'),
   board('maple-stain-reference','Maple stain inspiration','Maple-style cabinet door reference with six labeled finish samples showing light, golden, brown and deep dark tones.','Maple • See how stain families change the appearance of a fine-grained wood.', 'maple'),
   board('walnut-stain-reference','Walnut stain inspiration','Walnut-style wood cabinet panels showing six labeled stain-tone treatments from lighter warm colors to deep brown.','Walnut • Explore six concept finish colors and rich wood-grain appearances.', 'walnut'),
   board('alder-stain-reference','Alder stain inspiration','Alder-style cabinet door reference board with six labeled finishes ranging from natural to darker stains.','Alder • Review six warm-to-dark stain looks for cabinetry ideas.', 'alder'),
   board('hickory-stain-reference','Hickory stain inspiration','Hickory-style cabinet door reference board with six labeled finish colors and visible character grain.','Hickory • Compare six stain-tone concepts and distinctive grain movement.', 'hickory'),
   board('red-oak-stain-reference','Red oak stain inspiration','Red oak-style cabinet door reference with six labeled stains showing warm grain from natural to dark espresso.','Red oak • See six contrasting stain ideas and open wood grain.', 'red-oak')
  ],
  note:'Illustrative wood and stain boards are not calibrated physical samples, verified species photographs, stock availability or guarantees of the finished color. Confirm species, stains, sheen, hardware and actual samples with your contractor.'
 }
};
