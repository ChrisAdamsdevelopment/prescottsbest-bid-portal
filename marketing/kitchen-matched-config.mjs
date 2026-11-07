const matched='/site-assets/visual-explorer/B03-matched-kitchen/';
const boardPath='/site-assets/visual-explorer/kitchen-design-boards/';
const kitchen=(slug,name,alt,caption,tone,counter)=>({
 file:matched+slug+'.webp',thumb:matched+slug+'-thumb.webp',
 width:1440,height:810,thumbWidth:640,name,alt,caption,choice:{tone,counter}
});
const board=(slug,name,alt,caption,reference)=>({
 file:boardPath+slug+'.webp',thumb:boardPath+slug+'-thumb.webp',
 width:1200,height:800,thumbWidth:480,name,alt,caption,choice:{reference}
});
export const matchedKitchenVisuals={
 'kitchen-finish-comparison':{
  id:'kitchen-finish-comparison',
  heading:'See six cabinet and countertop combinations in the same kitchen',
  kicker:'COMPARE THE FINISHED KITCHEN',
  description:'Use the same kitchen viewpoint to see how light, medium and deep wood-tone cabinets work with pale and gray stone-look counters. The layout, windows, appliances and island remain broadly consistent to make the choices easier to compare.',
  axes:[
   {id:'tone',title:'Cabinet finish appearance',options:[
    {value:'light',label:'Light natural wood'},
    {value:'medium',label:'Medium warm wood'},
    {value:'dark',label:'Deep walnut tone'}
   ]},
   {id:'counter',title:'Countertop look',options:[
    {value:'pale',label:'Pale stone'},
    {value:'gray',label:'Gray stone'}
   ]}
  ],
  variants:[
   kitchen('matched-kitchen-light-pale','Light cabinets with pale counters','Wide full-room view of a Northern Arizona inspired kitchen with light natural wood cabinet fronts, a pale warm stone-look island countertop, metal appliances, wood ceiling beams and two windows.','Light wood and pale stone • A softly lit kitchen with warm pale surfaces.','light','pale'),
   kitchen('matched-kitchen-light-gray','Light cabinets with gray counters','Wide full-room view of the same kitchen arrangement with light painted off-white cabinets, gray stone-look island countertop, stainless steel appliances, three bar stools and pendant lights.','Light cabinetry and gray stone • An airy, high-contrast kitchen look.','light','gray'),
   kitchen('matched-kitchen-medium-pale','Medium cabinets with pale counters','Wide kitchen view with warm medium wood cabinets, a pale stone-look island surface, stainless steel appliances, bar stools, wood ceiling beams and windows in a similar layout.','Medium warm wood and pale stone • Wood grain with a bright countertop.','medium','pale'),
   kitchen('matched-kitchen-medium-gray','Medium cabinets with gray counters','Wide kitchen view with medium brown wood cabinets, a gray stone-look island countertop, stainless appliances and pendant lighting in the same general room layout.','Medium wood and gray stone • A warmer cabinet tone with a cooler counter surface.','medium','gray'),
   kitchen('matched-kitchen-dark-pale','Dark cabinets with pale counters','Wide kitchen view with deep dark-brown walnut-tone cabinetry, pale stone-look island counter, stainless steel appliances, pendant lights and warm beams above.','Deep wood and pale stone • Dark cabinetry balanced by a lighter worktop.','dark','pale'),
   kitchen('matched-kitchen-dark-gray','Dark cabinets with gray counters','Wide kitchen view with dark walnut-tone cabinets, a charcoal-gray stone-look island surface, stainless steel appliances, warm wood ceiling beams and pendant lights.','Deep wood and gray stone • Rich dark wood and a contrasting gray countertop.','dark','gray')
  ],
  note:'These are visual finish comparisons, not measured construction drawings. Small differences between concepts, actual lighting, product availability, stone patterns and real stain samples can change the finished appearance.'
 },
 'kitchen-material-boards':{
  id:'kitchen-material-boards',
  heading:'Browse more kitchen materials and layout inspiration',
  kicker:'KITCHEN INSPIRATION BOARDS',
  description:'These six coordinated idea boards bring cabinet-door styles, countertops, flooring, backsplashes, hinges and exterior hardware together. Open a board to see the combinations and add ideas to your inspiration list.',
  axes:[{id:'reference',title:'Choose a design reference board',options:[
   {value:'bright',label:'Bright classics'},
   {value:'warm',label:'Warm wood'},
   {value:'dark',label:'Deep wood'},
   {value:'finishes',label:'Finish choices'},
   {value:'doors',label:'Cabinet doors'},
   {value:'mixed',label:'Material palette'}
  ]}],
  variants:[
   board('kitchen-board-light-and-materials','Light kitchen design board','Kitchen remodeling reference board combining a bright cabinet and island kitchen concept with examples of cabinet door styles, countertops, backsplash tiles, flooring and cabinet hardware.','Light kitchen idea board • Room design and finishes shown together.','bright'),
   board('kitchen-board-warm-wood','Warm wood kitchen design board','Kitchen reference board with warm wood cabinets, a stone-look island and a row of example woods, countertops, backsplash materials, floors and exterior cabinet hardware.','Warm wood idea board • See a coordinating countertop and tile palette.','warm'),
   board('kitchen-board-dark-wood','Deep wood kitchen design board','Kitchen reference board featuring a warm dark-wood kitchen with cabinet options and separate countertop, backsplash, flooring and hardware sample images.','Deep wood idea board • Mix darker cabinet finishes with light surfaces.','dark'),
   board('kitchen-board-finishes-hardware','Kitchen finish and hardware options','Kitchen remodeling board comparing wooden cabinet-door finish families, pale and gray stone-look countertops, backsplash patterns, exposed and concealed hinge shapes and hardware looks.','Material options board • Cabinet finishes, countertops and hardware inspiration.','finishes'),
   board('kitchen-board-cabinet-doors','Cabinet doors and finishes reference','Kitchen inspiration board featuring multiple wood cabinet-door styles beside stone-look countertops, tile backsplash choices, cabinet knobs, pulls, hinges and flooring examples.','Cabinet door board • Explore grain, panel profiles, hardware and backsplash ideas.','doors'),
   board('kitchen-board-mixed-wood','Kitchen material palette reference','Kitchen reference collage of medium and deep wood cabinets with wood-color examples, countertop patterns, backsplash tiles, flooring materials and hardware choices.','Material palette board • Pair cabinet tones with floors, tile and hardware.','mixed')
  ],
  note:'Idea boards combine illustrative products and finishes. They are reference imagery, not verified manufacturer catalogs, stock availability, construction specifications or physical color samples.'
 }
};
