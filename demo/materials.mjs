import {materialCatalog} from './material-catalog.mjs';
export {materialCatalog};

// These tiny authored CSVs use no quoting or embedded delimiters. Not a general CSV validator.
const rows=text=>text.trim().split(/\r?\n/).map(line=>line.split(','));
export function inspectMaterials(id,files){
 return materialCatalog[id].checks.map(check=>{
  let passed=false,detail='';
  try{
   for(const path of check.files)if(typeof files[path]!=='string')throw Error(`Missing material: ${path}`);
   const [a,b]=check.files.map(path=>files[path]);
   if(check.kind==='columns'){
    const missing=rows(a)[0].filter(column=>!rows(b).slice(1).some(row=>row[0]===column));
    passed=!missing.length;detail=passed?'Every header has a guide entry.':`Missing definition: ${missing.join(', ')}.`;
   }else if(check.kind==='coverage'){
    const missing=rows(a).slice(1).map(row=>row[0]).filter(segment=>!rows(b).slice(1).some(row=>row[0]===segment));
    passed=!missing.length;detail=passed?'Every segment has a log row.':`Missing log row: ${missing.join(', ')}.`;
   }else if(check.kind==='equal'){
    const left=JSON.parse(a)[check.field],right=JSON.parse(b)[check.field];
    passed=left!==undefined&&left===right;detail=`${check.field}: ${String(left)} in ${check.files[0]}; ${String(right)} in ${check.files[1]}.`;
   }else if(check.kind==='manifest'){
    passed=JSON.parse(a).files.includes(check.files[1]);detail=`${check.files[1]} is ${passed?'listed':'missing from the transfer list'}.`;
   }else if(check.kind==='absent-key'){
    passed=!Object.hasOwn(JSON.parse(a),check.field);detail=`${check.field} is ${passed?'absent':'present'}. Absence alone would not establish safety.`;
   }else if(check.kind==='absent-column'){
    passed=!rows(a)[0].includes(check.field);detail=`${check.field} column is ${passed?'absent':'present'}. This does not assess location inference.`;
   }else if(check.kind==='nonempty'){
    const value=JSON.parse(a)[check.field];passed=typeof value==='string'&&value.trim().length>0;detail=`${check.field} is ${passed?'recorded, not verified':'missing'}. This does not interpret permission.`;
   }else throw Error('Unknown check');
  }catch(error){detail=error.message;}
  return {id:`CHECK-${id}-${check.id}`,label:check.label,passed,detail,materials:check.files,scope:'Exact synthetic text files only; no real subject, consent or repository inspection'};
 });
}
export async function loadMaterials(id,fetcher=fetch){
 const entries=await Promise.all(materialCatalog[id].files.map(async file=>{
  const response=await fetcher(`materials/${id}/${file.path}`);
  if(!response.ok)throw Error(`Cannot load ${file.path}: HTTP ${response.status}`);
  return [file.path,await response.text()];
 }));
 return Object.fromEntries(entries);
}
