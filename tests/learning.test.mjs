import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,transition,draft,scenarios,nextRole} from '../demo/model.mjs';
const act=(s,type,extra={})=>transition(s,{type,...extra});
const prepared=id=>{let s=fresh(id),c=scenarios[id];s=act(s,'choose',{choice:c.choices.find(o=>o.good).id});s=act(s,'continue');return act(s,'record');};
const answer=(s,role)=>act(s,'review',{role,decision:scenarios[s.id].reviewOptions[role][0].decision,reason:scenarios[s.id].reviewOptions[role][0].id,...(role==='community'?{metadata:'private',access:'none'}:{})});
for(const [id,c] of Object.entries(scenarios))test(`${id}: risky decision changes draft, correction changes plan, reviews keep external checks`,()=>{
 let s=fresh(id);assert.ok(c.card.includes(c.discipline));assert.ok(c.card.includes(c.person));
 const bad=c.choices.find(o=>!o.good);s=act(s,'choose',{choice:bad.id});assert.match(draft(s).record,new RegExp(bad.consequence.slice(0,24).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));assert.equal(s.progress,false);
 assert.doesNotMatch(draft(s).record,/Private plan: Keep the proposed copy private/);
 s=act(s,'retry');s=act(s,'choose',{choice:c.choices.find(o=>o.good).id});assert.notEqual(draft(s).record.includes(bad.consequence),true);
 s=act(s,'continue');s=act(s,'record');
 for(const r of c.reviewers){assert.equal(nextRole(s),r);assert.throws(()=>act(s,'review',{role:r,decision:'checked'}));assert.throws(()=>act(s,'review',{role:r,decision:'ack',reason:'generic'}));s=answer(s,r);assert.ok(s.reviews[r].reason);}
 assert.equal(s.publicMetadata,false);assert.equal(s.accessGranted,false);
 if(c.hold){assert.equal(s.phase,'hold');assert.throws(()=>act(s,'receipt',{role:'curator',decision:'ready'}));}
 else if(id==='stellar-survey'){assert.equal(s.phase,'curator');assert.throws(()=>act(s,'receipt',{role:'curator',decision:'ready'}));}
 else {assert.equal(s.phase,'pending');assert.match(draft(s).handoff,/still needs|unresolved/i);assert.throws(()=>act(s,'receipt',{role:'curator',decision:'ready'}));}
});
test('returned question cannot be reopened without changed safe plan',()=>{
 let s=prepared('oral-heritage');s=act(s,'review',{role:'steward',decision:'return',reason:'steward-evidence'});
 assert.throws(()=>act(s,'revise'));
 assert.throws(()=>act(s,'revise',{plan:'private-review'}));
 assert.throws(()=>act(s,'revise',{plan:'publish'}));
 s=act(s,'revise',{plan:scenarios[s.id].safePlans[1].id});
 assert.equal(s.phase,'review');assert.match(draft(s).record,/EV-ORAL-HERITAGE-002/);assert.match(draft(s).record,/correction log/i);assert.equal(nextRole(s),'steward');
});
test('a second return cannot strand reviewer or curator after the only practice correction',()=>{
 let s=prepared('oral-heritage');s=act(s,'review',{role:'steward',decision:'return',reason:'steward-evidence'});
 s=act(s,'revise',{plan:'fix-steward'});
 assert.throws(()=>act(s,'review',{role:'steward',decision:'return',reason:'steward-evidence'}),/already practiced/i);
 s=answer(s,'steward');assert.equal(nextRole(s),'privacy');
 let sky=prepared('stellar-survey');sky=answer(sky,'steward');sky=act(sky,'receipt',{role:'curator',decision:'return'});
 sky=act(sky,'repair',{plan:'inventory-revised'});
 assert.throws(()=>act(sky,'receipt',{role:'curator',decision:'return'}),/already practiced/i);
 sky=act(sky,'receipt',{role:'curator',decision:'noted',reason:'capacity-pending'});assert.equal(sky.phase,'done');
});
test('curator return requires changed package plan before new receipt',()=>{
 let s=prepared('stellar-survey');s=answer(s,'steward');s=act(s,'receipt',{role:'curator',decision:'return'});
 assert.throws(()=>act(s,'repair'));assert.throws(()=>act(s,'repair',{plan:scenarios[s.id].packagePlans[0].id}));
 s=act(s,'repair',{plan:scenarios[s.id].packagePlans[1].id});
 assert.equal(s.phase,'curator');assert.match(draft(s).handoff,/EV-STELLAR-SURVEY-002/);assert.match(draft(s).handoff,/revised/i);
 s=act(s,'receipt',{role:'curator',decision:'noted',reason:scenarios[s.id].curatorReasons[0].id});
 assert.equal(s.phase,'done');assert.match(draft(s).handoff,/capacity|integrity/i);
});
test('choice positions vary and every project includes a recoverable risky option',()=>{
 const positions=Object.values(scenarios).map(c=>c.choices.findIndex(o=>o.good));
 assert.ok(new Set(positions).size>=3,`sound choices always in same slot: ${positions}`);
 for(const c of Object.values(scenarios))assert.ok(c.choices.some(o=>!o.good));
});
test('return specifies the missing check and requires a case-specific correction',()=>{
 let s=prepared('oral-heritage');
 assert.throws(()=>act(s,'review',{role:'steward',decision:'return'}));
 s=act(s,'review',{role:'steward',decision:'return',reason:'steward-evidence'});
 assert.match(draft(s).record,/correction log/i);
 assert.throws(()=>act(s,'revise',{plan:'narrowed-review'}));
 const correction=scenarios[s.id].revisionPlans.steward;
 s=act(s,'revise',{plan:correction.id});
 assert.match(draft(s).record,/correction log/i);
});
test('different reviewer reasons change the visible explanation without clearing authority',()=>{
 const c=scenarios['oral-heritage'];let s=prepared(c.id);
 s=act(s,'review',{role:'steward',decision:'noted',reason:'steward-scope'});
 const first=act(s,'review',{role:'privacy',decision:'needs-more',reason:'privacy-scope'});
 const second=act(s,'review',{role:'privacy',decision:'needs-more',reason:'privacy-evidence'});
 assert.notEqual(draft(first).record,draft(second).record);
 assert.match(draft(first).record,/consent/i);
 assert.equal(first.accessGranted,false);
});
test('first-sight material describes formats and quantities in ordinary language',()=>{
 for(const c of Object.values(scenarios)){
  assert.doesNotMatch(c.arrival+' '+c.files,/\b(?:GiB|FITS|Zarr|VCF|JSON|codebook|grid cell|variant calls)\b/);
  assert.match(c.files,/invented/i);
 }
});
test('subject content cannot be supplied as an evidence identifier',()=>{
 let s=fresh();s=act(s,'choose',{choice:'ask'});s=act(s,'continue');
 for(const reference of ['', 'x','<img src=x onerror=alert(1)>','participant@example.com'])assert.throws(()=>act(s,'record',{reference}));
});
test('sound choices explain a distinct case consequence rather than a reusable generic message',()=>{
 const consequences=Object.values(scenarios).map(c=>c.choices.find(o=>o.good).consequence);
 assert.equal(new Set(consequences).size,consequences.length);
 for(const text of consequences)assert.match(text,/still|must|cannot|remains|needs/i);
});
test('a reviewer cannot return a scope observation as though it named missing evidence',()=>{
 const s=prepared('oral-heritage');
 assert.throws(()=>act(s,'review',{role:'steward',decision:'return',reason:'steward-scope'}));
});
test('a returned question offers a tempting but inadequate response without reopening review',()=>{
 let s=prepared('coastal-species');s=act(s,'review',{role:'steward',decision:'noted',reason:'steward-scope'});
 s=act(s,'review',{role:'privacy',decision:'return',reason:'privacy-evidence'});
 const options=scenarios[s.id].revisionChoices.privacy;
 assert.equal(options.length,2);
 const insufficient=options.find(o=>!o.sufficient);
 assert.match(insufficient.label,/map|area|coars/i);
 assert.throws(()=>act(s,'revise',{plan:insufficient.id}),/outside|assessment|risk/i);
 assert.equal(s.phase,'returned');
});
