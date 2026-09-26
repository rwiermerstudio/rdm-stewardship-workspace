import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,transition,draft,scenarios,nextRole} from '../demo/model.mjs';
const act=(s,type,extra={})=>transition(s,{type,...extra});
const prepared=id=>{let s=fresh(id),c=scenarios[id];s=act(s,'choose',{choice:c.choices.find(o=>o.good).id});s=act(s,'continue');return act(s,'record',{reference:'fictional-run-1'});};
const answer=(s,role)=>act(s,'review',{role,decision:scenarios[s.id].reviewOptions[role][0].decision,reason:scenarios[s.id].reviewOptions[role][0].id,...(role==='community'?{metadata:'private',access:'none'}:{})});
for(const [id,c] of Object.entries(scenarios))test(`${id}: risky decision changes draft, correction changes plan, reviews keep external checks`,()=>{
 let s=fresh(id);assert.ok(c.card.includes(c.discipline));assert.ok(c.card.includes(c.person));
 const bad=c.choices.find(o=>!o.good);s=act(s,'choose',{choice:bad.id});assert.match(draft(s).record,new RegExp(bad.consequence.slice(0,24).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));assert.equal(s.progress,false);
 assert.doesNotMatch(draft(s).record,/Private plan: Keep the proposed copy private/);
 s=act(s,'retry');s=act(s,'choose',{choice:c.choices.find(o=>o.good).id});assert.notEqual(draft(s).record.includes(bad.consequence),true);
 s=act(s,'continue');s=act(s,'record',{reference:'fictional-run-1'});
 for(const r of c.reviewers){assert.equal(nextRole(s),r);assert.throws(()=>act(s,'review',{role:r,decision:'checked'}));assert.throws(()=>act(s,'review',{role:r,decision:'ack',reason:'generic'}));s=answer(s,r);assert.ok(s.reviews[r].reason);}
 assert.equal(s.publicMetadata,false);assert.equal(s.accessGranted,false);
 if(c.hold){assert.equal(s.phase,'hold');assert.throws(()=>act(s,'receipt',{role:'curator',decision:'ready'}));}
 else if(id==='stellar-survey'){assert.equal(s.phase,'curator');assert.throws(()=>act(s,'receipt',{role:'curator',decision:'ready'}));}
 else {assert.equal(s.phase,'pending');assert.match(draft(s).handoff,/still needs|unresolved/i);assert.throws(()=>act(s,'receipt',{role:'curator',decision:'ready'}));}
});
test('returned question cannot be reopened without changed safe plan and reference',()=>{
 let s=prepared('oral-heritage');s=act(s,'review',{role:'steward',decision:'return'});
 assert.throws(()=>act(s,'revise'));
 assert.throws(()=>act(s,'revise',{reference:'fictional-run-1',plan:scenarios[s.id].safePlans[1].id}));
 assert.throws(()=>act(s,'revise',{reference:'fictional-run-2',plan:'publish'}));
 s=act(s,'revise',{reference:'fictional-run-2',plan:scenarios[s.id].safePlans[1].id});
 assert.equal(s.phase,'review');assert.match(draft(s).record,/fictional-run-2/);assert.match(draft(s).record,/revised/i);assert.equal(nextRole(s),'steward');
});
test('curator return requires changed package plan and reference before new receipt',()=>{
 let s=prepared('stellar-survey');s=answer(s,'steward');s=act(s,'receipt',{role:'curator',decision:'return'});
 assert.throws(()=>act(s,'repair'));assert.throws(()=>act(s,'repair',{reference:'fictional-run-1',plan:scenarios[s.id].packagePlans[1].id}));
 s=act(s,'repair',{reference:'fictional-run-2',plan:scenarios[s.id].packagePlans[1].id});
 assert.equal(s.phase,'curator');assert.match(draft(s).handoff,/fictional-run-2/);assert.match(draft(s).handoff,/revised/i);
 s=act(s,'receipt',{role:'curator',decision:'noted',reason:scenarios[s.id].curatorReasons[0].id});
 assert.equal(s.phase,'done');assert.match(draft(s).handoff,/capacity|integrity/i);
});
test('first-sight material describes formats and quantities in ordinary language',()=>{
 for(const c of Object.values(scenarios)){
  assert.doesNotMatch(c.arrival+' '+c.files,/\b(?:GiB|FITS|Zarr|VCF|JSON|codebook|grid cell|variant calls)\b/);
  assert.match(c.files,/invented/i);
 }
});
test('reference input is only a prompt for invented identifiers, never a safety guarantee',()=>{
 let s=fresh();s=act(s,'choose',{choice:'ask'});s=act(s,'continue');
 for(const reference of ['', 'x','<img src=x onerror=alert(1)>','participant@example.com'])assert.throws(()=>act(s,'record',{reference}));
});
