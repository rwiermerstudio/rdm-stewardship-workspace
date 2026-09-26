import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,transition,draft,scenarios,nextRole} from '../demo/model.mjs';
const act=(s,type,extra={})=>transition(s,{type,...extra});
test('a risky first choice teaches a consequence and can be retried',()=>{
 let s=fresh('oral-heritage');
 s=act(s,'choose',{choice:'publish'});
 assert.equal(s.phase,'feedback');
 assert.match(s.feedback,/catalogue title|description/i);
 assert.equal(s.progress,false);
 s=act(s,'retry');
 assert.equal(s.phase,'choice');
 s=act(s,'choose',{choice:'ask'});
 assert.equal(s.phase,'feedback');
 assert.equal(s.progress,true);
 s=act(s,'continue');
 assert.equal(s.phase,'record');
 assert.match(draft(s).record,/recordings-v1.*curated-collection-v2/s);
});
test('each route has a distinct question, a risky option and a safe recovery',()=>{
 const ids=Object.keys(scenarios);
 assert.equal(ids.length,6);
 assert.equal(new Set(ids.map(id=>scenarios[id].question)).size,6);
 assert.equal(new Set(ids.map(id=>scenarios[id].reviewQuestions.steward)).size,6);
 for(const id of ids)for(const role of scenarios[id].reviewers){assert.ok(scenarios[id].reviewQuestions[role].length>35);assert.ok(scenarios[id].reviewOutcome[role].length>35);}
 for(const id of ids){
  let s=fresh(id), c=scenarios[id];
  assert.ok(c.files.includes('EXAMPLE'));
  assert.equal(c.choices.length,3);
  for(const bad of c.choices.filter(o=>!o.good)){
   const attempt=act(s,'choose',{choice:bad.id});
   assert.equal(attempt.progress,false);
   assert.ok(attempt.feedback.length>55);
   assert.equal(act(attempt,'retry').phase,'choice');
  }
  s=act(s,'choose',{choice:c.choices.find(o=>o.good).id});s=act(s,'continue');
  s=act(s,'record',{reference:'invented-run-1'});
  assert.equal(nextRole(s),c.reviewers[0]);
  assert.throws(()=>act(s,'review',{role:'researcher',decision:'checked'}));
  for(const r of c.reviewers){
   assert.equal(nextRole(s),r);
   s=act(s,'review',{role:r,decision:'checked',...(r==='community'?{metadata:'private',access:'request-review'}:{})});
  }
  if(id==='oral-heritage')assert.deepEqual(s.communityScope,{metadata:'private',access:'request-review'});
  assert.equal(s.phase,c.hold?'hold':'curator');
  if(c.hold)assert.throws(()=>act(s,'receipt',{role:'curator',decision:'ready'}));
  else {s=act(s,'receipt',{role:'curator',decision:'ready'});assert.equal(s.phase,'done');}
  assert.equal(s.accessGranted,false);assert.equal(s.publicMetadata,false);
 }
});
test('a returned review requires researcher correction and a new reviewer response',()=>{
 let s=fresh();s=act(s,'choose',{choice:'ask'});s=act(s,'continue');s=act(s,'record',{reference:'invented-run-1'});
 s=act(s,'review',{role:'steward',decision:'return'});assert.equal(s.phase,'returned');
 assert.throws(()=>act(s,'review',{role:'steward',decision:'checked'}));
 s=act(s,'revise');assert.equal(nextRole(s),'steward');
 s=act(s,'review',{role:'steward',decision:'checked'});assert.equal(nextRole(s),'privacy');
});
test('community description and file request remain distinct and never public',()=>{
 let s=fresh();s=act(s,'choose',{choice:'ask'});s=act(s,'continue');s=act(s,'record',{reference:'invented-run-1'});
 s=act(s,'review',{role:'steward',decision:'checked'});s=act(s,'review',{role:'privacy',decision:'checked'});
 assert.throws(()=>act(s,'review',{role:'community',decision:'checked',metadata:'public',access:'open'}));
 assert.throws(()=>act(s,'review',{role:'community',decision:'checked'}));
 s=act(s,'review',{role:'community',decision:'checked',metadata:'private',access:'none'});
 assert.match(draft(s).record,/description private.*file requests none/i);
});
