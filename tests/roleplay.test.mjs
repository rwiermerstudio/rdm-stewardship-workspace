import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh, transition, view} from '../demo/model.mjs';
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
