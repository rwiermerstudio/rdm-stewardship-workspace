import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh, transition, view, scenarios, draft} from '../demo/model.mjs';
const send = (s, role, type, payload={}) => transition(s,{role,type,...payload});
const described = () => send(fresh('oral'),'researcher','describe',{change:'A transcript correction was made',input:'oral-source-v1',output:'oral-redacted-v2',evidence:'restricted-log-ref-1'});
test('complete fictional oral-history handoff needs distinct decisions and receipt',()=>{
 let s=described();
 assert.match(view(s,'researcher').waiting.join(' '),/steward/i);
 s=send(s,'steward','determine',{decision:'accept',reason:'Lineage reference is usable'});
 s=send(s,'privacy','determine',{decision:'needs-info',reason:'Narrow the intended use'});
 assert.match(view(s,'researcher').now.join(' '),/revise/i);
 s=send(s,'researcher','revise',{plan:'Restricted research use only; no public catalogue entry'});
 s=send(s,'privacy','determine',{decision:'accept',reason:'Limited to reviewed use'});
 s=send(s,'community','determine',{decision:'accept',reason:'No public discovery',metadata:'private',access:'mediated'});
 assert.match(view(s,'researcher').waiting.join(' '),/curator/i);
 s=send(s,'curator','receipt',{decision:'accept',reason:'Simulated manifest and fixity references checked'});
 assert.equal(s.receipt.decision,'accept');
 assert.equal(s.events.at(-1).role,'curator');
 assert.equal(s.publicMetadata,false);
 assert.equal(s.accessGranted,false);
});
test('researcher cannot self-review, skip review or forge receipt',()=>{
 let s=described();
 for(const type of ['determine','receipt']) assert.throws(()=>send(s,'researcher',type,{decision:'accept',reason:'yes'}));
 assert.throws(()=>send(s,'curator','receipt',{decision:'accept',reason:'yes'}));
 assert.throws(()=>send(s,'community','determine',{decision:'accept',reason:'yes',metadata:'public',access:'open'}));
});
test('rejection blocks curator; reset clears history',()=>{
 let s=described();
 s=send(s,'steward','determine',{decision:'reject',reason:'Input version cannot be traced'});
 assert.match(view(s,'researcher').now.join(' '),/revise/i);
 assert.throws(()=>send(s,'curator','receipt',{decision:'accept',reason:'yes'}));
 assert.deepEqual(fresh('oral').events,[]);
});
test('returned question cannot be overruled without researcher revision',()=>{
 let s=described();
 s=send(s,'privacy','determine',{decision:'needs-info',reason:'Narrow the use'});
 assert.throws(()=>send(s,'privacy','determine',{decision:'accept',reason:'I changed my mind'}));
});
test('open sky route still requires curator and does not grant access',()=>{
 let s=send(fresh('sky'),'researcher','describe',{change:'Calibration correction',input:'sky-v1',output:'sky-v2',evidence:'pipeline-run-ref'});
 assert.deepEqual(s.required,['steward']);
 s=send(s,'steward','determine',{decision:'accept',reason:'Traceable versions'});
 s=send(s,'curator','receipt',{decision:'reject',reason:'Missing checksum evidence'});
 assert.equal(s.receipt.decision,'reject');
 assert.equal(s.accessGranted,false);
});
test('six catalogue projects offer distinct assets, constraints and review routes',()=>{
 const ids=['oral-heritage','stellar-survey','coastal-species','neighbourhood-voices','variant-study','brain-maps'];
 assert.deepEqual(ids.map(id=>scenarios[id].catalogueId),ids);
 for(const id of ids){const c=scenarios[id];for(const key of ['purpose','moment','assets','sample','known','unknown','options','outcome','question','task','checklist']) assert.ok(c[key]?.length,`${id}: ${key}`);assert.match(c.sample,/synthetic/i);}
 assert.match(scenarios['stellar-survey'].sample,/FITS/i);
 assert.match(scenarios['brain-maps'].sample,/BIDS/i);
 assert.match(scenarios['coastal-species'].unknown,/re.identif/i);
 assert.deepEqual(fresh('stellar-survey').required,['steward']);
 assert.deepEqual(fresh('oral-heritage').required,['steward','privacy','community']);
 assert.deepEqual(fresh('variant-study').required,['steward','privacy']);
});
test('generated draft separates catalogue, researcher and reviewer evidence',()=>{
 let s=send(fresh('stellar-survey'),'researcher','describe',{change:'Recalibrated synthetic tiles',input:'sky-raw-v1',output:'sky-calibrated-v2',evidence:'pipeline-run-42'});
 let d=draft(s);assert.match(d.record,/Catalogue.*sky-raw-v1/s);assert.match(d.record,/Researcher.*pipeline-run-42/s);assert.match(d.handoff,/checksum.*not verified/i);
 s=send(s,'steward','determine',{decision:'accept',reason:'Pipeline reference traceable'});
 d=draft(s);assert.match(d.record,/Data steward.*Pipeline reference traceable/s);assert.match(d.handoff,/candidate only/i);
});
test('unknown consent and location risk remain holds even after simulated reviews',()=>{
 for(const id of ['variant-study','coastal-species']){
  let s=send(fresh(id),'researcher','describe',{change:'Synthetic derivative proposed',input:scenarios[id].defaultInput,output:scenarios[id].defaultOutput,evidence:'safe-manifest-ref'});
  for(const r of s.required)s=send(s,r,'determine',{decision:'accept',reason:'Review route considered in simulation'});
  assert.throws(()=>send(s,'curator','receipt',{decision:'accept',reason:'Package checked'}),/hold/i);
  assert.match(draft(s).handoff,/hold/i);
 }
});
