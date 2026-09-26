import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {applicablePolicies,policySectionHref} from '../demo/policy-context.mjs';
import {scenarios} from '../demo/scenarios.mjs';
const catalogue=JSON.parse(readFileSync(new URL('../examples/meridian-institute.json',import.meta.url)));
const published=JSON.parse(readFileSync(new URL('../demo/meridian-institute.json',import.meta.url)));
const documents=readFileSync(new URL('../demo/policy-documents.html',import.meta.url),'utf8');
test('every canonical citation resolves to a complete numbered document',()=>{
 assert.equal(catalogue.policies.length,10);
 for(const policy of catalogue.policies){
  const href=policySectionHref(policy);
  const section=Number(href.match(/-s(\d+)$/)?.[1]);
  assert.ok(Number.isInteger(section),policy.id);
  assert.match(documents,new RegExp(`<h2 id="${policy.id}-title">`),policy.id);
  assert.match(documents,new RegExp(`Version ${policy.version.replace('.','\\.')} ·`),policy.id);
  const headings=[...documents.matchAll(new RegExp(`<h3 id="${policy.id}-s(\\d+)">§(\\d+) [^<]+</h3><p>[^<]{50,}</p>`,'g'))];
  assert.deepEqual(headings.map(m=>Number(m[1])),Array.from({length:section},(_,i)=>i+1),policy.id);
  assert.ok(headings.every(m=>m[1]===m[2]),policy.id);
  assert.ok(documents.includes(`href="#${policy.id}-s${section}"`),policy.id);
 }
 assert.throws(()=>policySectionHref({...catalogue.policies[0],citation:'MI-DOC §9 (fictional) extra'}),/Unmapped/);
 assert.match(documents,/independent ecology/);
 assert.match(documents,/consent owner/);
 assert.match(documents,/community-appointed circle/);
 assert.match(documents,/candidate-only/);
});
test('published context matches fictional source and scopes all six routes',()=>{
 assert.deepEqual(published,catalogue);
 const perCase={
  'stellar-survey':['MI-DOC','MI-PRES','ASTRO-FITS','FUN-OPEN'],
  'neighbourhood-voices':['MI-DOC','MI-PRES','MI-PRIV','SOC-DDI'],
  'variant-study':['MI-DOC','MI-PRES','MI-PRIV','GEN-USE'],
  'oral-heritage':['MI-DOC','MI-PRES','MI-PRIV','HER-COMM'],
  'coastal-species':['MI-DOC','MI-PRES','MI-PRIV','BIO-DWC','FUN-OPEN'],
  'brain-maps':['MI-DOC','MI-PRES','MI-PRIV','NEU-BIDS']
 };
 for(const [id,expected] of Object.entries(perCase)){
  const project=catalogue.projects.find(p=>p.id===id);
  const policies=applicablePolicies(catalogue,project);
  assert.deepEqual(policies.map(p=>p.id),expected,id);
  assert.ok(policies.every(p=>p.citation.includes('(fictional)')&&p.version&&p.authority),id);
  assert.ok(catalogue.repositories.some(r=>r.name===scenarios[id].candidate&&r.status==='candidate-only'),id);
 }
});
