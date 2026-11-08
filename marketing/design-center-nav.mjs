const links=[
 {id:'hub',label:'Design Center',path:'/visual-design-preview'},
 {id:'kitchen',label:'Kitchens',path:'/kitchen-remodeling#kitchen-finish-comparison'},
 {id:'wood',label:'Woods & stains',path:'/kitchen-remodeling#wood-stain-boards'},
 {id:'hardware',label:'Knobs & hinges',path:'/custom-cabinetry#hardware-exterior'},
 {id:'cabinetry',label:'Built-ins',path:'/custom-cabinetry#cabinet-finishes'},
 {id:'decks',label:'Decks',path:'/deck-building-outdoor-carpentry#deck-inspiration'},
 {id:'holiday',label:'Holiday lighting',path:'/holiday-lighting/design'},
 {id:'ideas',label:'My Ideas',path:'/visual-design-preview#my-inspiration-list'}
];
const eligible=new Set(['/visual-design-preview','/kitchen-remodeling','/custom-cabinetry','/deck-building-outdoor-carpentry','/holiday-lighting','/holiday-lighting/design']);
export function designCenterNav(link,path){
 if(!eligible.has(path))return '';
 const current=path==='/holiday-lighting'||path==='/holiday-lighting/design'?'holiday':
  path==='/visual-design-preview'?'hub':
  path==='/kitchen-remodeling'?'kitchen':
  path==='/custom-cabinetry'?'cabinetry':
  path==='/deck-building-outdoor-carpentry'?'decks':'';
 return '<nav class="design-center-nav" aria-label="Design Center — switch design categories"><span class="design-center-nav-title">DESIGN CENTER</span>'+
  '<div class="design-center-nav-scroll">'+links.map(x=>
   '<a href="'+link(x.path.split('#')[0])+(x.path.includes('#')?'#'+x.path.split('#')[1]:'')+'"'+(x.id===current?' aria-current="page"':'')+
   ' class="design-center-nav-item'+(x.id===current?' is-current':'')+'">'+x.label+
   (x.id==='ideas'?' <span data-inspiration-count>0</span>':'')+'</a>').join('')+'</div></nav>';
}
