// Entirely fictional in-memory state; never a permission or repository connector.
import {scenarios} from './scenarios.mjs';
export {scenarios};
export const roles={researcher:'Researcher',steward:'Data steward',privacy:'Privacy reviewer',community:'Community-appointed reviewer',curator:'Repository curator'};
export function fresh(scenario='oral') {
 if (!scenarios[scenario]) throw Error('Unknown story');
 return {scenario,description:null,plan:null,required:[...scenarios[scenario].required],decisions:{},receipt:null,events:[],publicMetadata:false,accessGranted:false};
}
const meaningful = text => typeof text==='string' && text.trim().length>=4 && text.length<=180;
const event = (s,role,action,detail) => s.events.push({step:s.events.length+1,role,action,detail});
export function transition(current,a) {
 const s=structuredClone(current), {role,type}=a;
 if (!roles[role]) throw Error('Unknown role');
 if (type==='describe') {
  if(role!=='researcher'||s.description) throw Error('Only the researcher can start a story');
  if(![a.change,a.input,a.output,a.evidence].every(meaningful)||a.input.trim()===a.output.trim()) throw Error('Use four distinct, safe fictional references; input and output must differ.');
  s.description={change:a.change.trim(),input:a.input.trim(),output:a.output.trim(),evidence:a.evidence.trim()};
  event(s,role,'Described a fictional change','Version references recorded; no source data entered.');
 } else if(type==='determine') {
  if(!s.description||!s.required.includes(role)) throw Error('This role cannot determine this question');
  if(s.decisions[role]?.decision!=='accept' && s.decisions[role]) throw Error('Wait for the researcher to revise the returned plan');
  if(!['accept','reject','needs-info'].includes(a.decision)||!meaningful(a.reason)) throw Error('Choose a determination and explain why');
  if(role==='community' && ( !['private','reviewed'].includes(a.metadata) || !['mediated','none'].includes(a.access))) throw Error('Decide metadata visibility and data access separately');
  if(role==='community' && a.metadata==='reviewed' && a.decision==='accept') throw Error('Public metadata is never enabled by this simulation');
  s.decisions[role]={decision:a.decision,reason:a.reason.trim(),revision:s.plan?1:0,...(role==='community'?{metadata:a.metadata,access:a.access}:{})};
  s.receipt=null;
  event(s,role,`${a.decision} • fictional determination`,role==='community'?`Metadata: ${a.metadata}; data access: ${a.access}. ${a.reason.trim()}`:a.reason.trim());
 } else if(type==='revise') {
  if(role!=='researcher'||!s.description||!Object.values(s.decisions).some(d=>d.decision!=='accept')||!meaningful(a.plan)) throw Error('Revision requires a returned determination and a safe revised plan');
  s.plan=a.plan.trim();
  for(const [r,d] of Object.entries(s.decisions)) if(d.decision!=='accept') delete s.decisions[r];
  s.receipt=null;
  event(s,role,'Revised the fictional plan','Returned question reopened for its original reviewer.');
 } else if(type==='receipt') {
  if(role!=='curator'||!s.description||s.required.some(r=>s.decisions[r]?.decision!=='accept')) throw Error('Curator handoff requires all distinct reviews');
  if(!['accept','reject'].includes(a.decision)||!meaningful(a.reason)) throw Error('Choose receipt status and explain the manifest/fixity check');
  if(a.decision==='accept' && scenarios[s.scenario].hardHold) throw Error('External safety/consent hold cannot be cleared in this simulation');
  s.receipt={decision:a.decision,reason:a.reason.trim(),id:`SIM-${s.events.length+1}`};
  event(s,role,`${a.decision} • simulated receipt`,a.reason.trim());
 } else throw Error('Unknown action');
 return s;
}
export function draft(s) {
 const c=scenarios[s.scenario],d=s.description;
 const record=[`Catalogue (fictional): ${c.catalogueId}; ${c.assets}; proposed method: ${c.known}`,
  d?`Researcher (entered, not verified): ${d.change}; ${d.input} → ${d.output}; evidence pointer ${d.evidence}.`:'Researcher: no version change recorded yet.',
  s.plan?`Researcher revision (entered, not verified): ${s.plan}.`:'Researcher revision: none.',
  ...s.required.map(r=>s.decisions[r]?`${roles[r]} (simulated reviewer): ${s.decisions[r].decision}; ${s.decisions[r].reason}${r==='community'?`; metadata ${s.decisions[r].metadata}, data access ${s.decisions[r].access}`:''}.`:`${roles[r]}: decision pending.`),
  s.receipt?`Curator (simulated): ${s.receipt.decision}, ${s.receipt.id}; ${s.receipt.reason}.`:'Curator: no simulated receipt.'].join('\n');
 const handoff=`Automated draft, not a permission or deposit. ${c.repository} is a candidate only.\n${c.checklist}\nManifest, checksum and rights/access evidence: not verified; ask the curator and relevant authorities.\n${c.hold?`External hold: ${c.hold}`:'Review still requires independent human checks before any actual transfer.'}`;
 return {record,handoff};
}
export function view(s,role) {
 const now=[],waiting=[],later=[];
 if(!s.description) now.push('Describe the change with invented version IDs and an evidence reference. Do not enter subject content.');
 else {
  const returned=s.required.filter(r=>s.decisions[r] && s.decisions[r].decision!=='accept');
  const pending=s.required.filter(r=>s.decisions[r]?.decision!=='accept');
  if(role==='researcher') {
   if(returned.length) now.push(`Revise the plan for ${returned.map(r=>roles[r]).join(', ')}; their reason appears below.`);
   if(pending.length) waiting.push(`Wait for ${pending.map(r=>roles[r]).join(', ')} to answer the scoped question.`);
   else if(scenarios[s.scenario].hardHold) now.push(`External hold: ${scenarios[s.scenario].hold} Seek the authorised review outside this simulation.`);
   else if(!s.receipt) waiting.push('Wait for repository curator to check the handoff.');
   if(s.receipt?.decision==='reject') now.push('Repair the preservation package and ask the curator to check again.');
  } else if(s.decisions[role]?.decision!=='accept' && s.decisions[role]) waiting.push('Wait for the researcher to revise the returned plan.');
 else if(s.required.includes(role) && pending.includes(role)) now.push(`Record a fictional ${roles[role].toLowerCase()} determination with a reason.`);
  else if(role==='curator' && !pending.length) now.push(scenarios[s.scenario].hardHold?`External hold: ${scenarios[s.scenario].hold} No receipt can be issued here.`:'Check the proposed package and record a simulated acceptance or rejection receipt.');
  else waiting.push('Another role owns the next action.');
  later.push(scenarios[s.scenario].hardHold?'Only an authorised external review can resolve the hold; this simulation has no clearance action.':s.receipt?.decision==='accept'?'External rights, access and actual custody still require real checks.':'Only after review: a curator may consider a simulated receipt.');
 }
 return {now,waiting,later};
}
