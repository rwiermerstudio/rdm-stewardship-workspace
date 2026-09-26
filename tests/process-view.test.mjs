import test from 'node:test';
import assert from 'node:assert/strict';
import * as model from '../demo/model.mjs';
const {fresh,transition,scenarios}=model;
const processView=(state)=>model.processView(state);
const send=(s,type,rest={})=>transition(s,{type,...rest});
const prepared=id=>{let s=fresh(id);s=send(s,'choose',{choice:scenarios[id].choices.find(x=>x.good).id});s=send(s,'continue');return send(s,'record');};
test('every decision names its gain, cost and unresolved check before selection',()=>{
 for(const c of Object.values(scenarios))for(const option of c.choices){
  assert.ok(option.gain?.length>12,`${c.id}/${option.id} gain`);
  assert.ok(option.cost?.length>12,`${c.id}/${option.id} cost`);
  assert.ok(option.unknown?.length>12,`${c.id}/${option.id} unknown`);
 }
});
test('record creates an automatic invented evidence identifier without subject input',()=>{
 const s=prepared('stellar-survey');
 assert.match(s.reference,/^EV-STELLAR-SURVEY-001$/);
 assert.equal(s.evidence.length,1);
 assert.equal(s.evidence[0].id,s.reference);
 assert.equal(s.evidence[0].kind,'proposed method link');
 assert.throws(()=>send(s,'review',{role:'curator',decision:'noted'}));
});
test('return and repair preserve an auditable open-versus-fixed record',()=>{
 let s=prepared('stellar-survey');s=send(s,'review',{role:'steward',decision:'return',reason:'steward-evidence'});
 const issue=s.issues[0];assert.equal(issue.status,'open');assert.match(issue.question,/run log/i);
 s=send(s,'revise',{plan:'fix-steward'});
 assert.equal(s.reference,'EV-STELLAR-SURVEY-002');assert.equal(s.issues[0].id,issue.id);
 assert.equal(s.issues[0].status,'fixed in draft');assert.equal(s.issues[0].evidence,s.reference);
 assert.match(s.issues[0].resolution,/calibration inputs/i);
 assert.match(processView(s).open.join(' '),/capacity|integrity/i);
 assert.match(processView(s).fixed.join(' '),/calibration inputs/i);
});
test('all roles remain visible while only next reviewer can act',()=>{
 let s=prepared('oral-heritage');let view=processView(s);
 assert.deepEqual(view.roles.map(x=>x.role),['researcher','steward','privacy','community','curator']);
 assert.equal(view.roles.find(x=>x.role==='steward').status,'next');
 assert.equal(view.roles.find(x=>x.role==='privacy').status,'waiting');
 s=send(s,'review',{role:'steward',decision:'noted',reason:'steward-scope'});
 view=processView(s);assert.equal(view.roles.find(x=>x.role==='steward').status,'recorded');
 assert.equal(view.roles.find(x=>x.role==='privacy').status,'next');
 assert.match(view.open.join(' '),/consent|community/i);
 assert.equal(view.roles.find(x=>x.role==='curator').status,'not in this practice route');
 assert.equal(view.steps.find(x=>x.name==='Repository question').status,'not in this practice route');
});
