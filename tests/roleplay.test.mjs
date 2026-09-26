import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,transition,draft,scenarios,nextRole} from '../demo/model.mjs';
const send=(s,type,payload={})=>transition(s,{type,...payload});
const start=id=>{let s=fresh(id),c=scenarios[id];s=send(s,'choose',{choice:c.choices.find(x=>x.good).id});s=send(s,'continue');return send(s,'record',{reference:'fictional-method-7'});};
const review=(s,r)=>{const option=scenarios[s.id].reviewOptions[r][0];return send(s,'review',{role:r,decision:option.decision,reason:option.id,...(r==='community'?{metadata:'private',access:'none'}:{})});};
test('invented reference changes the record but never grants access',()=>{
 const s=start('stellar-survey'),text=draft(s);assert.match(text.record,/sky-raw-v1.*sky-calibrated-v2/s);assert.match(text.record,/fictional-method-7/);assert.match(text.handoff,/capacity/i);assert.equal(s.accessGranted,false);assert.equal(s.publicMetadata,false);
});
test('curator cannot skip review; repair cannot be ceremonial',()=>{
 let s=start('stellar-survey');assert.throws(()=>send(s,'receipt',{role:'curator',decision:'noted',reason:'capacity-pending'}));
 s=review(s,'steward');s=send(s,'receipt',{role:'curator',decision:'return'});assert.equal(s.phase,'repair');
 assert.throws(()=>send(s,'repair',{plan:'inventory-revised',reference:'fictional-method-7'}));
 s=send(s,'repair',{plan:'inventory-revised',reference:'fictional-method-8'});
 s=send(s,'receipt',{role:'curator',decision:'noted',reason:'capacity-pending'});assert.equal(s.phase,'done');
});
test('all six routes retain distinct questions and the two hard holds',()=>{
 const reviewers=new Set(Object.values(scenarios).map(c=>c.reviewers.join(',')));assert.ok(reviewers.size>=3);
 for(const id of Object.keys(scenarios)){
  let s=start(id);for(const r of scenarios[id].reviewers){assert.equal(nextRole(s),r);s=review(s,r);}
  if(scenarios[id].hold){assert.equal(s.phase,'hold');assert.throws(()=>send(s,'receipt',{role:'curator',decision:'noted',reason:'capacity-pending'}));}
  else assert.equal(s.phase,id==='stellar-survey'?'curator':'pending');
 }
});
