import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {applicablePolicies} from '../demo/policy-context.mjs';
import {scenarios} from '../demo/scenarios.mjs';
const catalogue=JSON.parse(readFileSync(new URL('../examples/meridian-institute.json',import.meta.url)));
const published=JSON.parse(readFileSync(new URL('../demo/meridian-institute.json',import.meta.url)));
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
