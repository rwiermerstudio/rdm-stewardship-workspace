import {materialCatalog,inspectMaterials} from './materials.mjs';
import {scenarios,draft,processView} from './model.mjs';
const json=value=>JSON.stringify(value,null,2)+'\n';
const bytes=text=>new TextEncoder().encode(text);
const ref=id=>({'@id':id});
async function sha256(text){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');}

export async function buildHandover(state,files,dateTime=new Date().toISOString()){
 const c=materialCatalog[state.id],project=scenarios[state.id],checks=inspectMaterials(state.id,files),entries={};
 for(const file of c.files){
  if(typeof files[file.path]!=='string')throw Error(`Missing material: ${file.path}`);
  entries[`materials/${file.path}`]=files[file.path];
 }
 const decisions={
  recordType:'local learning decision record, not an authorization format',project:state.id,phase:state.phase,
  authorizedDecision:'not obtained',publicMetadata:false,accessGranted:false,
  learnerInspection:state.materialAnswer||null,
  researcherProposal:project.choices.find(x=>x.id===state.choice)||null,
  simulatedReplies:state.reviews,proposedCorrections:state.issues,
  openHumanQuestions:processView(state).open,
  unverifiedHumanPointers:state.evidence,
  exerciseCheckPointers:checks.map(check=>({id:check.id,target:`checks.json#${check.id}`,materials:check.materials.map(p=>`materials/${p}`),scope:check.scope})),
  descriptionDecision:state.communityScope?.metadata||'not obtained',fileRequestDecision:state.communityScope?.access||'not obtained',
  ...(state.id==='variant-study'?{duoMapping:'unresolved; no agreement interpretation'}:{})
 };
 entries['human-decisions.json']=json(decisions);
 entries['handover-note.txt']=draft(state).record+'\n\n'+draft(state).handoff+'\n\nActual exercise text checks:\n'+checks.map(x=>`${x.id}: ${x.passed?'passed':'defect found'}; ${x.detail}`).join('\n')+'\n';
 // A dictionary makes each fragment identifier in the local decision record an exact check key.
 entries['checks.json']=json(Object.fromEntries(checks.map(x=>[x.id,x])));
 entries['history.json']=json({researchHistory:c.history,lessonActions:state.events,limits:'Research history is claimed or proposed, never an observed run. Only the checks in checks.json were performed by this software. No workflow was executed.'});
 entries['datacite-draft.json']=json({
  creators:[{name:`${project.person} (fictional exercise researcher)`,nameType:'Personal'}],
  titles:[{title:`EXAMPLE: ${project.title}`}],publisher:'Meridian, fictional teaching institute',publicationYear:new Date(dateTime).getUTCFullYear(),
  types:{resourceTypeGeneral:'Dataset',resourceType:'Synthetic teaching material'},
  subjects:[{subject:project.discipline}],language:'en',version:'exercise-1',
  descriptions:[{descriptionType:'Abstract',description:`Fictional material for practising ${project.question} Not a real research dataset. No approval or repository acceptance.`},{descriptionType:'Methods',description:`Read history.json and materials/${c.history.method}. ${c.history.status}.`}],
  rightsList:[{rights:'Synthetic teaching files only. No permission for any represented research data is granted.'}]
 });
 const materialHashes=Object.fromEntries(await Promise.all(Object.entries(entries).filter(([p])=>p.startsWith('materials/')).map(async([p,text])=>[p,await sha256(text)])));
 const event=(id,type,outcome,detail)=>({id,type,dateTime,agent:'Meridian exercise software',outcome,detail,objects:Object.keys(materialHashes)});
 entries['preservation-events.json']=json([
  event('EVENT-1','message digest calculation','completed',{algorithm:'SHA-256',digests:materialHashes,limits:'Baseline digests calculated here; no transfer or earlier checksum comparison has occurred.'}),
  event('EVENT-2','validation',checks.every(x=>x.passed)?'selected checks passed':'defects found',{checks:checks.map(x=>`checks.json#${x.id}`),limits:'Selected text checks only; not format, domain, consent or full standards validation.'}),
  event('EVENT-3','packaging','assembled in memory',{limits:'Local handover assembled. Download, archival custody, preservation success and acceptance are not attested.'})
 ]);
 entries['README.txt']=`MERIDIAN FICTIONAL HANDOVER\nProject: ${project.title}\nGenerated locally: ${dateTime}\n\nStart with handover-note.txt. Inspect materials/, then compare checks.json with human-decisions.json. A check describes exact synthetic bytes. A researcher claim and a simulated reviewer reply are not an authorized decision.\n\nAll source materials are retained unchanged, including intentional defects. Proposed corrections do not silently repair them. No real recordings, images, sequences, sites or signed agreements are included.\n\nContents\n- datacite-draft.json: selected DataCite 4.6 fields for a shared description. NOT registration-ready: no DOI or identifier is invented, the publisher and publication year are draft teaching values, and no record is registered. No full DataCite schema conformance is claimed.\n- ro-crate-metadata.json: RO-Crate 1.2 JSON-LD packaging structure and file descriptions. This unpublished teaching draft uses dateCreated, not a claimed publication date. Structural checks are not full RO-Crate conformance certification.\n- human-decisions.json: local record, not a new universal standard. Human authority remains outside this package.\n- history.json: claimed or proposed research history and the learner's actions. Inspired by PROV and Workflow Run RO-Crate, but not a conformant workflow-run profile or evidence of execution.\n- preservation-events.json: selected PREMIS-inspired event concepts with time, agent, objects and outcomes. Not PREMIS XML or a complete preservation record. A digest calculation is not a custody or successful transfer event.\n- manifest-sha256.json: actual SHA-256 values for every other file, including the crate metadata. It excludes itself. A recipient can recompute these after extraction.\n\nSubject example: ${c.standard.name}; a small subset, not domain-standard conformance.\n${c.standard.url}\n\nReferences\nhttps://schema.datacite.org/meta/kernel-4.6/\nhttps://www.researchobject.org/ro-crate/specification/1.2/\nhttps://www.researchobject.org/workflow-run-crate/\nhttps://www.w3.org/TR/prov-o/\nhttps://www.loc.gov/standards/premis/\n\nNo publishing, upload, DOI registration, consent determination or archive acceptance occurs. Keep the unresolved human questions with this draft.\n`;
 const descriptions={
  'human-decisions.json':'Learner proposals, simulated replies, exact exercise check links and unresolved human decisions.',
  'handover-note.txt':'Readable next-person note with proposed method and correction history.',
  'checks.json':'Actual selected checks of the included synthetic text files.',
  'history.json':'Claimed or proposed research history, separated from lesson actions.',
  'datacite-draft.json':'Partial DataCite 4.6 description without a DOI; not registration-ready.',
  'preservation-events.json':'Selected local event concepts; not a complete PREMIS record.',
  'README.txt':'Reading order, validation boundaries and standards references.'
 };
 const fileEntities=Object.entries(entries).map(([path,text])=>({
  '@id':path,'@type':'File',name:path,description:descriptions[path]||c.files.find(f=>`materials/${f.path}`===path)?.description,
  encodingFormat:path.endsWith('.json')?'application/json':path.endsWith('.csv')?'text/csv':'text/plain',contentSize:bytes(text).length,
  ...(path.startsWith('materials/')?{isBasedOn:ref('#research-history')}:{} )
 }));
 const graph=[
  {'@id':'ro-crate-metadata.json','@type':'CreativeWork',about:ref('./'),isBasedOn:ref('https://w3id.org/ro/crate/1.2')},
  {'@id':'./','@type':'Dataset',name:`EXAMPLE handover: ${project.title}`,description:'Unpublished fictional lesson handover; human approval is not obtained. Selected fields, not certified full conformance.',dateCreated:dateTime,creator:ref('#exercise-team'),hasPart:fileEntities.map(x=>ref(x['@id']))},
  {'@id':'#exercise-team','@type':'Organization',name:'Meridian fictional exercise team'},
  {'@id':'#research-history','@type':'CreativeWork',name:'Researcher-supplied history, not observed execution',description:`${c.history.status}; input: ${c.history.input}; output: ${c.history.output}`,subjectOf:ref('history.json'),isBasedOn:ref(`materials/${c.history.method}`)},
  ...fileEntities
 ];
 entries['ro-crate-metadata.json']=json({'@context':'https://w3id.org/ro/crate/1.2/context','@graph':graph});
 entries['manifest-sha256.json']=json(Object.fromEntries(await Promise.all(Object.entries(entries).map(async([p,text])=>[p,await sha256(text)]))));
 return entries;
}

// POSIX ustar for these bounded UTF-8 text files; no compression or external library.
export function tarArchive(entries){
 const blocks=[];
 for(const [path,text] of Object.entries(entries)){
  if(!/^[a-zA-Z0-9_./-]+$/.test(path)||path.includes('..')||path.startsWith('/')||bytes(path).length>99)throw Error('Unsafe archive path');
  const data=bytes(text),header=new Uint8Array(512);
  const put=(offset,value)=>header.set(bytes(value),offset);
  const octal=(value,width)=>value.toString(8).padStart(width-1,'0')+'\0';
  put(0,path);put(100,'0000644\0');put(108,'0000000\0');put(116,'0000000\0');put(124,octal(data.length,12));put(136,'00000000000\0');put(148,'        ');put(156,'0');put(257,'ustar\0');put(263,'00');
  put(148,header.reduce((sum,n)=>sum+n,0).toString(8).padStart(6,'0')+'\0 ');
  blocks.push(header,data,new Uint8Array((512-data.length%512)%512));
 }
 blocks.push(new Uint8Array(1024));
 const archive=new Uint8Array(blocks.reduce((size,part)=>size+part.length,0));let offset=0;
 for(const block of blocks){archive.set(block,offset);offset+=block.length;}
 return archive;
}
