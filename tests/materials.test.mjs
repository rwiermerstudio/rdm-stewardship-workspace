import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {repairs} from './material-repairs.mjs';
const base=new URL('../demo/',import.meta.url);
test('six inspectable bundles have real files and checks respond to changed bytes',async()=>{
 await assert.doesNotReject(access(new URL('materials.mjs',base)),'the material loader and real checks must exist');
 const {materialCatalog,inspectMaterials}=await import('../demo/materials.mjs');
 assert.equal(Object.keys(materialCatalog).length,6);
 for(const [id,c] of Object.entries(materialCatalog)){
  const files=Object.fromEntries(await Promise.all(c.files.map(async f=>[f.path,await readFile(new URL(`materials/${id}/${f.path}`,base),'utf8')])));
  assert.ok(c.files.length>=3,id);
  const result=inspectMaterials(id,files);
  assert.equal(result.length,c.checks.length);
  assert.ok(result.some(r=>!r.passed),`${id} contains a discoverable defect`);
  assert.ok(result.every(r=>r.materials.every(p=>Object.hasOwn(files,p))));
  assert.ok(c.question.options.some(x=>x.correct));
  assert.ok(c.question.options.some(x=>!x.correct));
  const repaired=structuredClone(files);
  for(const fix of repairs[id])repaired[fix.path]=repaired[fix.path].replace(fix.before,fix.after);
  assert.ok(inspectMaterials(id,repaired).every(r=>r.passed),`${id} checks inspect bytes, not canned labels`);
  const absent={...files};delete absent[c.checks[0].files[0]];
  assert.equal(inspectMaterials(id,absent)[0].passed,false,'missing files never pass');
 }
});
