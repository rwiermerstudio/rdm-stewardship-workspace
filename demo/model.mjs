import {scenarios,roles} from './scenarios.mjs';
export {scenarios,roles};
export function fresh(id='oral-heritage'){
 if(!scenarios[id])throw Error('Unknown project');
 return {id,phase:'choice',choice:null,feedback:'',progress:false,reference:'',evidence:[],issues:[],plan:scenarios[id].safePlans[0].id,packagePlan:scenarios[id].packagePlans[0].id,reviews:{},revisedRoles:{},packageRepaired:false,receipt:null,events:[],publicMetadata:false,accessGranted:false};
}
export function nextRole(s){return scenarios[s.id].reviewers.find(r=>!s.reviews[r])||null;}
function addEvidence(s,kind,description){
 const id=`EV-${s.id.toUpperCase()}-${String(s.evidence.length+1).padStart(3,'0')}`;
 s.evidence.push({id,kind,description,verified:false});s.reference=id;
 return id;
}
function noSubjectInput(a){if(Object.hasOwn(a,'reference'))throw Error('Evidence IDs are generated here; do not enter subject content');}
export function processView(s){
 const c=scenarios[s.id],next=nextRole(s),active=['choice','feedback','record','returned','repair'].includes(s.phase)?'researcher':s.phase==='curator'?'curator':next;
 const status=r=>r==='curator'&&s.id!=='stellar-survey'?'not in this practice route':r===active?'next':r==='curator'&&s.phase==='repair'||s.reviews[r]?.decision==='return'?'returned':s.reviews[r]?'recorded':r==='researcher'&&s.reference?'drafted':r==='curator'&&s.receipt?.decision==='noted'?'recorded':'waiting';
 const roleIds=['researcher',...c.reviewers,'curator'];
 const rolesView=roleIds.map(r=>({role:r,name:roles[r],status:status(r),question:r==='researcher'?c.question:r==='curator'?'Check proposed package, capacity and integrity.':c.reviewQuestions[r]}));
 return {roles:rolesView,steps:[{name:'Choose a response',status:s.choice?'drafted':'next'},{name:'Record proposed method',status:s.reference?'drafted':'waiting'},{name:'Independent questions',status:s.phase==='returned'?'returned':c.reviewers.every(r=>s.reviews[r]&&s.reviews[r].decision!=='return')?'recorded':s.phase==='review'?'next':'waiting'},{name:'Repository question',status:s.id!=='stellar-survey'?'not in this practice route':s.phase==='repair'?'returned':s.receipt?.decision==='noted'?'recorded':s.phase==='curator'?'next':'waiting'}],open:[...s.issues.filter(x=>x.status==='open').map(x=>`${x.id}: ${x.question}`),c.external,...(c.hold?[c.hold]:[])],fixed:s.issues.filter(x=>x.status==='fixed in draft').map(x=>`${x.id}: ${x.resolution} (${x.evidence}; proposed only)`)};
}
export function transition(current,a){
 const s=structuredClone(current),c=scenarios[s.id];
 const note=(who,what)=>s.events.push(`${who}: ${what}`);
 if(a.type==='choose'){
  if(s.phase!=='choice')throw Error('Choose only at the question');
  const option=c.choices.find(o=>o.id===a.choice);if(!option)throw Error('Unknown choice');
  s.choice=option.id;s.feedback=option.feedback;s.progress=option.good;s.phase='feedback';note('Researcher',option.label);note('Workbench draft',option.consequence);
 }else if(a.type==='retry'){
  if(s.phase!=='feedback')throw Error('No choice to retry');
  s.phase='choice';s.feedback='';s.choice=null;s.progress=false;note('Researcher','Withdrew the risky draft; no real file or permission changed');
 }else if(a.type==='continue'){
  if(s.phase!=='feedback'||!s.progress)throw Error('Try a safer action first');s.phase='record';
 }else if(a.type==='record'){
  if(s.phase!=='record')throw Error('Record after the first decision');
  noSubjectInput(a);addEvidence(s,'proposed method link',`${c.from} to ${c.to}; method and files not inspected`);s.phase='review';note('Workbench draft',`Generated ${s.reference} for a proposed method link; not verified`);
 }else if(a.type==='review'){
  if(s.phase!=='review'||a.role!==nextRole(s))throw Error('This is not the next independent review');
  if(a.decision==='return'){
   if(s.revisedRoles[a.role])throw Error('This practice correction was already practiced; record the remaining check without claiming it was verified');
   const missing=c.reviewOptions[a.role].find(o=>o.id===a.reason);
   if(!missing||missing.id!==`${a.role}-evidence`)throw Error('Choose the missing check before returning the question');
   s.reviews[a.role]={decision:'return',reason:missing.id};s.phase='returned';
   s.issues.push({id:`Q-${s.id.toUpperCase()}-${String(s.issues.length+1).padStart(3,'0')}`,role:a.role,question:missing.label,status:'open',resolution:'',evidence:null});
   note(roles[a.role],`Returned the question: ${missing.label}`);
  }
  else{
   const option=c.reviewOptions[a.role].find(o=>o.id===a.reason&&o.decision===a.decision);
   if(!option)throw Error('Select a case-specific determination and reason');
   if(a.role==='community'){
    if(!['private','review-needed'].includes(a.metadata)||!['none','request-review'].includes(a.access))throw Error('Keep description and file requests separate');
    s.communityScope={metadata:a.metadata,access:a.access};
   }
   s.reviews[a.role]={decision:a.decision,reason:a.reason};note(roles[a.role],option.label);
   s.lastOutcome=option.label;
   if(!nextRole(s))s.phase=c.hold?'hold':s.id==='stellar-survey'?'curator':'pending';
  }
 }else if(a.type==='revise'){
  if(s.phase!=='returned')throw Error('Only returned questions can be revised');
  const returned=Object.keys(s.reviews).find(r=>s.reviews[r].decision==='return');
  const chosen=c.revisionChoices[returned].find(o=>o.id===a.plan);
  if(chosen&&!chosen.sufficient)throw Error(chosen.feedback);
  const plan=c.revisionPlans[returned];if(!plan||a.plan!==plan.id||s.plan===plan.id)throw Error('Choose the correction for this reviewer’s missing check');
  noSubjectInput(a);
  delete s.reviews[returned];
  s.revisedRoles[returned]=true;
  s.plan=plan.id;const reference=addEvidence(s,'proposed correction',plan.label);
  const issue=s.issues.find(x=>x.role===returned&&x.status==='open');issue.status='fixed in draft';issue.resolution=plan.label;issue.evidence=reference;
  s.phase='review';note('Researcher',`${plan.label}; workbench generated ${reference}. Actual evidence still needs checking.`);
 }else if(a.type==='receipt'){
  if(s.phase!=='curator'||a.role!=='curator'||nextRole(s))throw Error('No curator action possible');
  if(a.decision==='return'){if(s.packageRepaired)throw Error('This package correction was already practiced; record outstanding checks instead');s.receipt='return';s.phase='repair';s.issues.push({id:`Q-${s.id.toUpperCase()}-${String(s.issues.length+1).padStart(3,'0')}`,role:'curator',question:'Draft package needs a changed inventory and method link.',status:'open',resolution:'',evidence:null});note('Curator','Returned the draft package for a changed inventory and method link');}
  else if(a.decision==='noted'&&c.curatorReasons.some(r=>r.id===a.reason)){
   s.receipt={decision:'noted',reason:a.reason};s.phase='done';note('Curator',c.curatorReasons.find(r=>r.id===a.reason).label);
  }else throw Error('Select a case-specific package observation');
 }else if(a.type==='repair'){
  if(s.phase!=='repair')throw Error('No package returned');
  const plan=c.packagePlans.find(p=>p.id===a.plan&&p.id!==s.packagePlan);if(!plan)throw Error('Choose a changed package plan');
  noSubjectInput(a);s.packagePlan=plan.id;s.packageRepaired=true;const reference=addEvidence(s,'revised package',plan.label);s.phase='curator';s.receipt=null;
  const issue=s.issues.find(x=>x.role==='curator'&&x.status==='open');issue.status='fixed in draft';issue.resolution=plan.label;issue.evidence=reference;
  note('Researcher',`Revised package: ${plan.label}; workbench generated ${reference}`);
 }else throw Error('Unknown action');
 return s;
}
export function draft(s){
 const c=scenarios[s.id],choice=c.choices.find(o=>o.id===s.choice);
 const plan=c.safePlans.find(p=>p.id===s.plan).label,packagePlan=c.packagePlans.find(p=>p.id===s.packagePlan).label;
 const reviews=Object.entries(s.reviews).map(([r,v])=>`${roles[r]}: ${v.decision==='return'?`asked for ${c.reviewOptions[r].find(o=>o.id===v.reason)?.label}`:c.reviewOptions[r].find(o=>o.id===v.reason)?.label}`).join('\n')||'No reviewer response yet.';
 const corrections=s.issues.filter(x=>x.status==='fixed in draft'&&x.role!=='curator').map(x=>`${x.evidence}: ${x.resolution} (proposed only)`).join('\n');
 return {record:`Invented catalogue: ${c.from} → ${c.to}.\nProposed action: ${choice?.label||'Choose an action first'}.\n${choice?.consequence||'No draft action yet.'}\n${choice?.good?`Private plan: ${plan}.`:choice?'Draft action not approved; choose another action to replace this proposal.':'No plan yet.'}\nGenerated evidence pointer (unverified draft, not a file link): ${s.reference||'Not generated'}.\n${corrections?`Proposed corrections (actual evidence not inspected):\n${corrections}\n`:''}Training responses (not actual inspection or consent):\n${reviews}${s.communityScope?`\nDescription: ${s.communityScope.metadata}; file requests: ${s.communityScope.access}.`:''}`,
 handoff:`Candidate storage only: ${c.candidate}.\n${packagePlan}.\n${c.checklist}\nGenerated evidence pointer (unverified): ${s.reference||'Not generated'}.\nStill needs external checks: ${c.external}${c.hold?`\nHard hold: ${c.hold}`:''}`};
}
