import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,transition,draft,scenarios,nextRole} from '../demo/model.mjs';
const send=(s,type,payload={})=>transition(s,{type,...payload});
const start=id=>{let s=fresh(id),c=scenarios[id];s=send(s,'choose',{choice:c.choices.find(x=>x.good).id});s=send(s,'continue');return send(s,'record',{reference:'fictional-method-7'});};
test('a safe reference changes the generated record but not access',()=>{
 const s=start('stellar-survey'),text=draft(s);
 assert.match(text.record,/sky-raw-v1.*sky-calibrated-v2/s);
 assert.match(text.record,/fictional-method-7/);
 assert.match(text.handoff,/capacity/i);
 assert.equal(s.accessGranted,false);
 assert.equal(s.publicMetadata,false);
});
test('reference field does not accept subject text or markup',()=>{
 let s=fresh();s=send(s,'choose',{choice:'ask'});s=send(s,'continue');
 for(const reference of ['', 'x', '<img src=x onerror=alert(1)>', 'participant@example.com', 'name: someone'])assert.throws(()=>send(s,'record',{reference}));
});
test('a curator cannot skip independent reviews and can return a package',()=>{
 let s=start('stellar-survey');assert.throws(()=>send(s,'receipt',{role:'curator',decision:'ready'}));
 s=send(s,'review',{role:'steward',decision:'checked'});
 s=send(s,'receipt',{role:'curator',decision:'return'});assert.equal(s.phase,'repair');
 assert.throws(()=>send(s,'receipt',{role:'curator',decision:'ready'}));
 s=send(s,'repair');s=send(s,'receipt',{role:'curator',decision:'ready'});
 assert.equal(s.phase,'done');assert.equal(s.receipt,'ready');
});
test('six routes keep distinct reviewers and no hold can issue a receipt',()=>{
 const reviewers=new Set(Object.values(scenarios).map(c=>c.reviewers.join(',')));
 assert.ok(reviewers.size>=3);
 for(const id of Object.keys(scenarios)){
  let s=start(id);
  for(const role of scenarios[id].reviewers){assert.equal(nextRole(s),role);s=send(s,'review',{role,decision:'checked',...(role==='community'?{metadata:'private',access:'none'}:{})});}
  if(scenarios[id].hold){assert.equal(s.phase,'hold');assert.throws(()=>send(s,'receipt',{role:'curator',decision:'ready'}));}
  else assert.equal(s.phase,'curator');
 }
});
