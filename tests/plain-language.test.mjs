import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scenarios,fresh,transition,draft,nextRole} from '../demo/model.mjs';
const read=p=>readFileSync(new URL(`../demo/${p}`,import.meta.url),'utf8');
test('the lesson starts with human work and leaves improvement ideas until the end',()=>{
 const html=read('index.html');
 assert.match(html,/Keep the original files and write down what you changed/);
 assert.match(html,/colleague who helps/);
 assert.ok(html.indexOf('id="reflection"')>html.indexOf('id="history-section"'));
 assert.match(html,/id="reflection"[^>]*hidden/);
 assert.match(html,/ideas to investigate, not capabilities/);
 assert.match(html,/not been measured/);
});
test('every route explains the organizational choice and the next human handoff',()=>{
 for(const [id,c] of Object.entries(scenarios)){
  assert.ok(c.why?.length>100,id);
  assert.ok(c.handoffLesson?.length>100,id);
  let s=transition(fresh(id),{type:'choose',choice:c.choices.find(x=>x.good).id});
  s=transition(s,{type:'continue'});s=transition(s,{type:'record'});
  assert.match(draft(s).record,/Who receives this work/);
  assert.ok(draft(s).record.includes(c.handoffLesson),id);
  while(nextRole(s)){
   const role=nextRole(s),o=c.reviewOptions[role][0];
   s=transition(s,{type:'review',role,decision:o.decision,reason:o.id,metadata:'private',access:'none'});
  }
  assert.equal(s.publicMetadata,false);assert.equal(s.accessGranted,false);
  if(c.hold)assert.equal(s.phase,'hold');
 }
});
test('numbered rules explain reasons in ordinary language while preserving holds',()=>{
 const doc=read('policy-documents.html');
 assert.match(doc,/Keep the original files/);
 assert.match(doc,/because a colleague/);
 assert.match(doc,/Only the authorized consent owner/);
 assert.match(doc,/independent ecology/);
 assert.doesNotMatch(doc,/DDI-compatible variable metadata|BIDS-compatible sidecars|generalized coordinates|residual re-identification/);
});
