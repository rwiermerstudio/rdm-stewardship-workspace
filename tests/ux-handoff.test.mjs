import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,transition,scenarios,draft,actionOwner,processView} from '../demo/model.mjs';
const send=(s,type,rest={})=>transition(s,{type,...rest});
const selected=(s)=>scenarios[s.id].choices.find(x=>x.good);
const prepared=id=>{let s=fresh(id);s=send(s,'choose',{choice:selected(s).id});s=send(s,'continue');return send(s,'record');};
const review=(s,r)=>{const o=scenarios[s.id].reviewOptions[r][0];return send(s,'review',{role:r,decision:o.decision,reason:o.id,...(r==='community'?{metadata:'private',access:'none'}:{})});};
test('all six routes hand off each actionable transition and preserve the terminal actor',()=>{
 for(const id of Object.keys(scenarios)){
  let s=fresh(id);assert.equal(actionOwner(s),'researcher');
  s=send(s,'choose',{choice:selected(s).id});assert.equal(actionOwner(s),'researcher');
  s=send(s,'continue');assert.equal(actionOwner(s),'researcher');
  s=send(s,'record');assert.equal(actionOwner(s),scenarios[id].reviewers[0]);
  for(const r of scenarios[id].reviewers){s=review(s,r);assert.equal(actionOwner(s),s.phase==='review'?scenarios[id].reviewers[scenarios[id].reviewers.indexOf(r)+1]:s.phase==='curator'?'curator':null);}
  assert.equal(processView(s).roles.filter(x=>x.status==='next').length,s.phase==='curator'?1:0);
  assert.equal(['hold','pending','curator'].includes(s.phase),true);
 }
});
test('returns go to researcher and repaired questions go back to owner',()=>{
 let s=prepared('oral-heritage');s=send(s,'review',{role:'steward',decision:'return',reason:'steward-evidence'});assert.equal(actionOwner(s),'researcher');
 s=send(s,'revise',{plan:'fix-steward'});assert.equal(actionOwner(s),'steward');
 let sky=prepared('stellar-survey');sky=review(sky,'steward');sky=send(sky,'receipt',{role:'curator',decision:'return'});assert.equal(actionOwner(sky),'researcher');
 sky=send(sky,'repair',{plan:'inventory-revised'});assert.equal(actionOwner(sky),'curator');sky=send(sky,'receipt',{role:'curator',decision:'noted',reason:'capacity-pending'});assert.equal(actionOwner(sky),null);
});
test('returned reviewer and curator choices show concrete sample text in the draft',()=>{
 for(const [id,c] of Object.entries(scenarios))for(const r of c.reviewers){
  const example=c.revisionPlans[r].label;
  assert.match(example,/EXAMPLE/,`${id}/${r} needs a fictional sample`);
  assert.ok(example.length>110,`${id}/${r} needs a concrete correction`);
  let s=prepared(id);for(const earlier of c.reviewers.slice(0,c.reviewers.indexOf(r)))s=review(s,earlier);
  s=send(s,'review',{role:r,decision:'return',reason:`${r}-evidence`});
  s=send(s,'revise',{plan:`fix-${r}`});
  assert.ok(draft(s).record.includes(example),`${id}/${r} sample must survive in record`);
 }
 let sky=prepared('stellar-survey');sky=review(sky,'steward');sky=send(sky,'receipt',{role:'curator',decision:'return'});
 sky=send(sky,'repair',{plan:'inventory-revised'});
 assert.match(scenarios['stellar-survey'].packagePlans[1].label,/EXAMPLE/);
 assert.match(draft(sky).handoff,/EXAMPLE/);
});

test('every one of 18 choices has a safe concrete fictional action visible in its draft',()=>{
 let count=0;
 for(const [id,c] of Object.entries(scenarios))for(const option of c.choices){
  count++;assert.match(option.example,/EXAMPLE|fictional|invented|placeholder/i,`${id}/${option.id}`);
  assert.ok(option.example.length>65,`${id}/${option.id} needs actual proposed text/action`);
  const s=send(fresh(id),'choose',{choice:option.id});assert.ok(draft(s).record.includes(option.example));
  if(!option.good){assert.ok(option.blockedReason?.length>45,`${id}/${option.id} correction/authority`);assert.match(option.blockedReason,/ask|request|check|link|keep|review|record|pause|retain|refer|arrange/i);}
 }
 assert.equal(count,18);
});
