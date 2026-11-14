// Review-only, homeowner-facing copy. Avoid claiming unverified experience or
// permitting eligibility. Keep one contextual estimate caveat in budget results.
const sharedBudget=['Can I get a ballpark idea of cost before a visit?','Yes. Our Budget Explorer can help you choose a starting range. After we measure your space and talk about finishes, we can put together a written proposal for the work you want done.'];
const sharedContract=['What is the difference between fixed price and cost plus?','With fixed price, we agree on a price for the work described in your contract. With cost plus, you see the documented project costs and the agreed contractor fee. We will walk through either option before you decide.'];
const entries={
 '/bathroom-remodeling':{
  approach:'A shower that is difficult to step into, a vanity without enough storage or a floor that has seen too much water can make everyday life harder. Tell us what bothers you most. We can look at shower access, waterproofing, ventilation and storage, then talk about a plan that fits your home.',
  faqs:[sharedBudget,['Can I replace my tub with a walk-in shower?','Often, yes. We will look at the floor height, drain position, plumbing and the space available so you understand which shower-entry options may work.'],sharedContract]
 },
 '/kitchen-remodeling':{
  approach:'A better kitchen is not always a bigger kitchen. Sticking drawers, dark worktops and awkward corners can make cooking a chore. We can look at cabinet storage, countertop space, lighting and how people move through the room before talking about what to replace.',
  faqs:[sharedBudget,['Can we keep our kitchen layout?','Keeping the sink and appliances where they are can sometimes leave more of your budget for cabinets, counters and lighting. We will measure the room and look at the tradeoffs with you.'],sharedContract]
 },
 '/shower-conversions':{
  approach:'Getting in and out of the shower should feel comfortable. We can compare lower entries, handheld showers, bench seating and practical tile choices, while looking at the floor, drain and waterproofing work each option would need.',
  faqs:[sharedBudget,['Is a zero-threshold shower possible in my bathroom?','It depends on the floor height, drain and structure. We can look at what is underneath the existing bath and explain the options before you choose a design.'],sharedContract]
 },
 '/room-conversions':{
  approach:'That spare room or garage may have more potential than you think. Tell us whether you need a workspace, guest room or hobby area. We will look at the openings, insulation, comfort and local requirements that affect the plan.',
  faqs:[sharedBudget,['Can my garage become living space?','That depends on the property, the existing structure and how the space is allowed to be used. We can start by looking at the room and identifying the questions that need answers.'],sharedContract]
 },
 '/finish-carpentry':{
  approach:'Doors that hang straight, trim that meets cleanly at the corners and baseboards that follow the room make a noticeable difference. Whether you want to match an older profile or finish a new space, we can talk about the details that will pull it together.',
  faqs:[['Can you match trim in an older Prescott home?','Bring a photo or sample of what you have. We can check the profile, door jambs, paint or stain, and the transitions where new work meets old.'],['Do you take smaller carpentry jobs?','Tell us what needs attention and where the home is. We will let you know whether it fits the kind of work we can schedule.'],sharedContract]
 },
 '/custom-cabinetry':{
  approach:'The best built-ins fit what you actually use. A sewing table needs room for the machine and your knees; an office needs doors that open without striking the desk. We work from real measurements and the equipment you want to keep.',
  faqs:[['Can you design around my existing desk or sewing machine?','Yes, that is the place to start. Bring equipment measurements and photos so we can look at working height, storage, outlets and door clearances.'],['Can the new cabinets match the room?','We can compare wood, paint and hardware choices and see how the built-ins meet existing trim and walls.'],sharedContract]
 },
 '/deck-building-outdoor-carpentry':{
  approach:'An outdoor space should fit the way you use the yard. We can discuss the layout, stairs, railings, materials and how a proposed deck meets the house, while checking which structural or permitting questions need attention.',
  faqs:[['What should I know before choosing decking?','Think about sun exposure, maintenance, how the surface feels underfoot and how the deck will connect to your home. We can compare material options with those details in mind.'],['Can you work on existing outdoor trim or steps?','Tell us what you want repaired or changed. We will review the condition and whether the work falls within our available services and license scope.'],sharedContract]
 }
};
export function serviceEditorial(path){return entries[path]??null;}
export const editorialPaths=Object.freeze(Object.keys(entries));
