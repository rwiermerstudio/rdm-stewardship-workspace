import {scenarios,roles} from './scenarios.mjs';
export {scenarios,roles};
export function fresh(id='oral-heritage') {
 if(!scenarios[id]) throw Error('Unknown project');
 return {id,phase:'choice',choice:null,feedback:'',progress:false,reference:'',reviews:{},receipt:null,events:[],publicMetadata:false,accessGranted:false};
}
export function nextRole(s){return scenarios[s.id].reviewers.find(r=>!s.reviews[r])||null;}
export function transition(current,a){
 const s=structuredClone(current),c=scenarios[s.id];
 const note=(who,what)=>s.events.push(`${who}: ${what}`);
 if(a.type==='choose'){
  if(s.phase!=='choice')throw Error('Choose only at the question');
  const option=c.choices.find(o=>o.id===a.choice);if(!option)throw Error('Unknown choice');
  s.choice=option.id;s.feedback=option.feedback;s.progress=option.good;s.phase='feedback';note('Researcher',option.label);
 }else if(a.type==='retry'){
  if(s.phase!=='feedback')throw Error('No choice to retry');
  s.phase='choice';s.feedback='';s.choice=null;s.progress=false;
 }else if(a.type==='continue'){
  if(s.phase!=='feedback'||!s.progress)throw Error('Try a safer action first');
  s.phase='record';
 }else if(a.type==='record'){
  if(s.phase!=='record')throw Error('Record after the first decision');
  if(typeof a.reference!=='string'||!/^[-a-zA-Z0-9_/ .]{4,80}$/.test(a.reference.trim()))throw Error('Use a short invented reference, not names, sites, quotes or data');
  s.reference=a.reference.trim();s.phase='review';note('Researcher',`Entered an unverified reference: ${s.reference}`);
 }else if(a.type==='review'){
  if(s.phase!=='review'||a.role!==nextRole(s))throw Error('This is not the next independent review');
  if(!['checked','return'].includes(a.decision))throw Error('Choose a review response');
  if(a.role==='community'&&a.decision==='checked'){
   if(!['private','review-needed'].includes(a.metadata)||!['none','request-review'].includes(a.access))throw Error('Keep description and file requests separate; no public choice here');
   s.communityScope={metadata:a.metadata,access:a.access};
  }
  s.reviews[a.role]=a.decision;note(roles[a.role],a.decision==='return'?'Returned the question for correction':a.role==='community'?`Description ${a.metadata}; file requests ${a.access}. ${c.reviewOutcome[a.role]}`:c.reviewOutcome[a.role]);
  s.lastOutcome=a.decision==='return'?'This question went back to the researcher.':c.reviewOutcome[a.role];
  if(a.decision==='return')s.phase='returned';
  else if(!nextRole(s))s.phase=c.hold?'hold':'curator';
 }else if(a.type==='revise'){
  if(s.phase!=='returned')throw Error('Only returned questions can be revised');
  const returned=Object.keys(s.reviews).find(r=>s.reviews[r]==='return');delete s.reviews[returned];
  s.phase='review';note('Researcher','Reopened the returned question; the reviewer must answer again');
 }else if(a.type==='receipt'){
  if(s.phase!=='curator'||a.role!=='curator'||c.hold||nextRole(s))throw Error('No curator receipt is possible yet');
  if(!['ready','return'].includes(a.decision))throw Error('Choose a handoff response');
  s.receipt=a.decision;s.phase=a.decision==='ready'?'done':'repair';note('Curator',a.decision==='ready'?'Simulated package handoff, not a real deposit':'Returned the package checklist');
 }else if(a.type==='repair'){
  if(s.phase!=='repair')throw Error('No package returned');
  s.phase='curator';s.receipt=null;note('Researcher','Revised the fictional package checklist for another check');
 }else throw Error('Unknown action');
 return s;
}
export function draft(s){
 const c=scenarios[s.id];
 return {record:`Invented catalogue: ${c.from} → ${c.to}.\nYour choice: ${s.choice?c.choices.find(o=>o.id===s.choice).label:'Not chosen yet'}.\nYour reference: ${s.reference||'Not entered yet'}.\nWorkbench draft: ${s.reference?`Connect the copies using ${s.reference}; method not checked.`:'Waiting for your safe reference.'}\nHuman responses: ${Object.entries(s.reviews).map(([r,d])=>`${roles[r]} ${d==='checked'?'answered for this exercise':'returned the question'}`).join('; ')||'Pending'}.${s.communityScope?` Description ${s.communityScope.metadata}; file requests ${s.communityScope.access}.`:''}`,
 handoff:`Candidate only: ${c.candidate}.\nWorkbench drafts this checklist: ${c.checklist}\nPerson decides this: whether the proposed use, description and files are appropriate; a curator checks the actual file list and integrity before any real transfer.${c.hold?`\nHard hold: ${c.hold}`:''}`};
}
