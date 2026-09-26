import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,transition,scenarios} from '../demo/model.mjs';
import {materialCatalog} from '../demo/materials.mjs';
test('material answers give correction, record exact sources, and never clear human holds',()=>{
 for(const [id,c] of Object.entries(materialCatalog)){
  let s=fresh(id);const bad=c.question.options.find(x=>!x.correct),good=c.question.options.find(x=>x.correct);
  assert.doesNotThrow(()=>{s=transition(s,{type:'inspect',answer:bad.id});},'inspection is a supported learner action');
  assert.equal(s.materialAnswer.correct,false);assert.equal(s.phase,'choice');assert.equal(s.accessGranted,false);
  assert.match(s.materialFeedback,/Try again/);
  s=transition(s,{type:'inspect',answer:good.id});
  assert.equal(s.materialAnswer.correct,true);assert.ok(s.materialAnswer.materials.length);
  assert.match(s.materialFeedback,/Next/);assert.equal(s.publicMetadata,false);
  assert.ok(s.events.some(x=>x.includes(good.label)));
  assert.equal(fresh(id).materialAnswer,null);
  assert.throws(()=>transition(s,{type:'inspect',answer:'invented'}),/Unknown/);
 }
});
