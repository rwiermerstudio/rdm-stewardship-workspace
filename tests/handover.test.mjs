import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fresh,scenarios} from '../demo/model.mjs';
import {materialCatalog} from '../demo/materials.mjs';
import jsonld from 'jsonld';
test('every handover contains its actual files, resolvable crate links, honest decisions and valid tar bytes',async()=>{
 await assert.doesNotReject(access(new URL('../demo/handover.mjs',import.meta.url)),'export builder must exist');
 const {buildHandover,tarArchive}=await import('../demo/handover.mjs');
 const dir=await mkdtemp(join(tmpdir(),'meridian-export-'));
 try{for(const [id,c] of Object.entries(materialCatalog)){
  const files=Object.fromEntries(await Promise.all(c.files.map(async f=>[f.path,await readFile(new URL(`../demo/materials/${id}/${f.path}`,import.meta.url),'utf8')])));
  const entries=await buildHandover(fresh(id),files,'2026-09-26T12:00:00.000Z');
  for(const [p,text] of Object.entries(files))assert.equal(entries[`materials/${p}`],text);
  const crate=JSON.parse(entries['ro-crate-metadata.json']);
  const officialContext=JSON.parse(await readFile(new URL('./fixtures/ro-crate-context-1.2.json',import.meta.url),'utf8'));
  const expanded=await jsonld.expand(crate,{base:'https://example.invalid/exercise/',documentLoader:async url=>{
   assert.equal(url,'https://w3id.org/ro/crate/1.2/context');
   return {contextUrl:null,documentUrl:url,document:officialContext};
  }});
  const expandedRoot=expanded.find(x=>x['@id']==='https://example.invalid/exercise/');
  assert.deepEqual(expandedRoot['@type'],['http://schema.org/Dataset']);
  assert.equal(expandedRoot['http://schema.org/hasPart'].length,Object.keys(entries).length-2);
  assert.equal(crate['@context'],'https://w3id.org/ro/crate/1.2/context');
  const graph=new Map(crate['@graph'].map(e=>[e['@id'],e]));
  assert.equal(graph.get('ro-crate-metadata.json').about['@id'],'./');
  assert.equal(graph.get('ro-crate-metadata.json').conformsTo,undefined,'an unpublished partial draft must not assert full conformance');
  assert.equal(graph.get('ro-crate-metadata.json').isBasedOn['@id'],'https://w3id.org/ro/crate/1.2');
  assert.equal(graph.get('./')['@type'],'Dataset');
  assert.equal(graph.get('./').name,`EXAMPLE handover: ${scenarios[id].title}`);
  for(const ref of graph.get('./').hasPart)assert.ok(Object.hasOwn(entries,ref['@id']));
  for(const entity of graph.values()){
   for(const value of Object.values(entity).flat())if(value&&typeof value==='object'&&value['@id']&&!value['@id'].startsWith('https:'))assert.ok(graph.has(value['@id']),`broken graph link ${value['@id']}`);
   if(entity['@type']==='File')assert.equal(entity.contentSize,new TextEncoder().encode(entries[entity['@id']]).length);
  }
  const inventory=JSON.parse(entries['manifest-sha256.json']);
  for(const [path,hash] of Object.entries(inventory))assert.equal(hash,createHash('sha256').update(entries[path]).digest('hex'));
  assert.equal(Object.keys(inventory).length,Object.keys(entries).length-1,'manifest covers all other entries');
  const decisions=JSON.parse(entries['human-decisions.json']);
  assert.equal(decisions.authorizedDecision,'not obtained');
  assert.equal(decisions.accessGranted,false);
  assert.equal(decisions.publicMetadata,false);
  assert.ok(decisions.openHumanQuestions.length);
  const dc=JSON.parse(entries['datacite-draft.json']);
  assert.equal(dc.types.resourceTypeGeneral,'Dataset');assert.ok(dc.creators[0].name);assert.ok(dc.titles[0].title);assert.equal(dc.publicationYear,2026);
  assert.equal(dc.doi,undefined);assert.equal(dc.identifiers,undefined);
  assert.match(entries['README.txt'],/not registration-ready/i);
  const events=JSON.parse(entries['preservation-events.json']);
  assert.ok(events.every(e=>e.agent==='Meridian exercise software'&&e.dateTime==='2026-09-26T12:00:00.000Z'));
  assert.ok(events.some(e=>e.type==='message digest calculation'));
  assert.ok(events.some(e=>e.type==='validation'&&e.outcome==='defects found'));
  const history=JSON.parse(entries['history.json']);
  assert.equal(history.researchHistory.status,c.history.status);
  if(id==='variant-study'){assert.match(history.researchHistory.status,/not executed/);assert.equal(decisions.duoMapping,'unresolved; no agreement interpretation');}
  const path=join(dir,`${id}.tar`);await writeFile(path,tarArchive(entries));
  const result=execFileSync('python3',['-c',`import tarfile,json,hashlib,sys\nwith tarfile.open(sys.argv[1]) as t:\n m=json.load(t.extractfile('manifest-sha256.json'))\n assert len(t.getnames())==len(m)+1\n for p,h in m.items():\n  assert hashlib.sha256(t.extractfile(p).read()).hexdigest()==h\n print('TAR_AND_SHA256_OK')`,path],{encoding:'utf8'});
  assert.match(result,/TAR_AND_SHA256_OK/);
 }}finally{await rm(dir,{recursive:true,force:true});}
});
