import {scenarios,roles} from './scenarios.mjs';
import {materialCatalog} from './material-catalog.mjs';
export {scenarios,roles};
export function fresh(id='oral-heritage'){
 if(!scenarios[id])throw Error('Unknown project');
 return {id,phase:'choice',choice:null,feedback:'',progress:false,reference:'',evidence:[],issues:[],plan:scenarios[id].safePlans[0].id,packagePlan:scenarios[id].packagePlans[0].id,reviews:{},revisedRoles:{},packageRepaired:false,receipt:null,events:[],publicMetadata:false,accessGranted:false,materialAnswer:null,materialFeedback:''};
}
export function nextRole(s){return scenarios[s.id].reviewers.find(r=>!s.reviews[r])||null;}
// The owner of the next in-exercise action, not an authenticated identity.
export function actionOwner(s){
 if(['choice','feedback','record','returned','repair'].includes(s.phase))return 'researcher';
 if(s.phase==='review')return nextRole(s);
 if(s.phase==='curator')return 'curator';
 return null;
}
function addEvidence(s,kind,description){
 const id=`EV-${s.id.toUpperCase()}-${String(s.evidence.length+1).padStart(3,'0')}`;
 s.evidence.push({id,kind,description,verified:false});s.reference=id;
 return id;
}
function noSubjectInput(a){if(Object.hasOwn(a,'reference'))throw Error('Evidence IDs are generated here; do not enter subject content');}
export function processView(s){
 const c=scenarios[s.id],active=actionOwner(s);
 const status=r=>r==='curator'&&s.id!=='stellar-survey'?'not in this practice route':r===active?'next':r==='curator'&&s.phase==='repair'||s.reviews[r]?.decision==='return'?'returned':s.reviews[r]&&s.issues.some(x=>x.role===r&&x.status==='open')?'open question':s.reviews[r]?'recorded':r==='researcher'&&s.reference?'drafted':r==='curator'&&s.receipt?.decision==='noted'?'recorded':'waiting';
 const roleIds=['researcher',...c.reviewers,'curator'];
 const rolesView=roleIds.map(r=>({role:r,name:roles[r],status:status(r),question:r==='researcher'?c.question:r==='curator'?'Does the archive have the file list, space and copy checks it needs?':c.reviewQuestions[r]}));
 return {roles:rolesView,steps:[{name:'Choose a response',status:s.choice?'drafted':'next'},{name:'Explain the change',status:s.reference?'drafted':'waiting'},{name:'Colleagues check',status:s.phase==='returned'?'returned':c.reviewers.every(r=>s.reviews[r]&&s.reviews[r].decision!=='return')?(s.issues.some(x=>x.status==='open'&&c.reviewers.includes(x.role))?'open questions':'recorded'):s.phase==='review'?'next':'waiting'},{name:'Ask the archive',status:s.id!=='stellar-survey'?'not in this practice route':s.phase==='repair'?'returned':s.receipt?.decision==='noted'?'recorded':s.phase==='curator'?'next':'waiting'}],open:[...s.issues.filter(x=>x.status==='open').map(x=>`${x.id}: ${x.question}`),c.external,...(c.hold?[c.hold]:[])],fixed:s.issues.filter(x=>x.status==='fixed in draft').map(x=>`${x.id}: ${x.resolution} (${x.evidence}; proposed only)`)};
}
export function transition(current,a){
 const s=structuredClone(current),c=scenarios[s.id];
 const note=(who,what)=>s.events.push(`${who}: ${what}`);
 if(a.type==='inspect'){
  const material=materialCatalog[s.id],answer=material.question.options.find(x=>x.id===a.answer);
  if(!answer)throw Error('Unknown material answer');
  s.materialAnswer={answer:answer.id,label:answer.label,correct:answer.correct,materials:material.checks.flatMap(x=>x.files)};
  s.materialFeedback=answer.correct?'You identified what the next person needs. Your observation is now in the handover. Next: continue the role choices, or download your draft if the route has ended.':'Try again. '+material.question.correction+' No permission or release status has changed.';
  note('Learner material observation',answer.label);
 }else if(a.type==='choose'){
  if(s.phase!=='choice')throw Error('Choose only at the question');
  const option=c.choices.find(o=>o.id===a.choice);if(!option)throw Error('Unknown choice');
  s.choice=option.id;s.feedback=option.feedback;s.progress=option.good;s.phase='feedback';note('Researcher',option.label);note('Handover note',option.consequence);
 }else if(a.type==='retry'){
  if(s.phase!=='feedback')throw Error('No choice to retry');
  s.phase='choice';s.feedback='';s.choice=null;s.progress=false;note('Researcher','Chose to reconsider the draft');
 }else if(a.type==='continue'){
  if(s.phase!=='feedback'||!s.progress)throw Error('Try a safer action first');s.phase='record';
 }else if(a.type==='record'){
  if(s.phase!=='record')throw Error('Record after the first decision');
  noSubjectInput(a);addEvidence(s,'proposed method link',`${c.from} to ${c.to}; method and files not inspected`);s.phase='review';note('Handover note',`Generated ${s.reference} for a proposed method link; not verified`);
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
   if(a.decision==='needs-more'&&!s.issues.some(x=>x.role===a.role&&x.question===option.label&&x.status==='open')){
    s.issues.push({id:`Q-${s.id.toUpperCase()}-${String(s.issues.length+1).padStart(3,'0')}`,role:a.role,question:option.label,status:'open',resolution:'',evidence:null});
   }
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
  s.phase='review';note('Researcher',`${plan.label}; page added the example reference ${reference}. Actual evidence still needs checking.`);
 }else if(a.type==='receipt'){
  if(s.phase!=='curator'||a.role!=='curator'||nextRole(s))throw Error('No curator action possible');
  if(a.decision==='return'){if(s.packageRepaired)throw Error('This package correction was already practiced; record outstanding checks instead');s.receipt='return';s.phase='repair';s.issues.push({id:`Q-${s.id.toUpperCase()}-${String(s.issues.length+1).padStart(3,'0')}`,role:'curator',question:'The archive needs a complete file list with the image-processing note.',status:'open',resolution:'',evidence:null});note('Curator','Asked the researcher to complete the file list and include the processing note');}
  else if(a.decision==='noted'&&c.curatorReasons.some(r=>r.id===a.reason)){
   s.receipt={decision:'noted',reason:a.reason};s.phase='done';note('Curator',c.curatorReasons.find(r=>r.id===a.reason).label);
  }else throw Error('Select a case-specific package observation');
 }else if(a.type==='repair'){
  if(s.phase!=='repair')throw Error('No package returned');
  const plan=c.packagePlans.find(p=>p.id===a.plan&&p.id!==s.packagePlan);if(!plan)throw Error('Choose a changed package plan');
  noSubjectInput(a);s.packagePlan=plan.id;s.packageRepaired=true;const reference=addEvidence(s,'revised package',plan.label);s.phase='curator';s.receipt=null;
  const issue=s.issues.find(x=>x.role==='curator'&&x.status==='open');issue.status='fixed in draft';issue.resolution=plan.label;issue.evidence=reference;
  note('Researcher',`Revised package: ${plan.label}; page added the example reference ${reference}`);
 }else throw Error('Unknown action');
 return s;
}
export function draft(s){
 const c=scenarios[s.id],choice=c.choices.find(o=>o.id===s.choice);
 const plan=c.safePlans.find(p=>p.id===s.plan).label,packagePlan=c.packagePlans.find(p=>p.id===s.packagePlan).label;
 const reviews=Object.entries(s.reviews).map(([r,v])=>`${roles[r]}: ${v.decision==='return'?`asked for ${c.reviewOptions[r].find(o=>o.id===v.reason)?.label}`:c.reviewOptions[r].find(o=>o.id===v.reason)?.label}`).join('\n')||'No reviewer response yet.';
 const corrections=s.issues.filter(x=>x.status==='fixed in draft').map(x=>`${x.evidence}: ${x.resolution} (proposed only)`).join('\n');
 const open=processView(s).open.join('\n');
 const method=s.evidence.find(x=>x.kind==='proposed method link');
 const pointers=s.evidence.map(x=>`${x.id}: ${x.kind} — ${x.description} (generated here, unverified)`).join('\n')||'Not generated yet.';
 const sections=[
  {label:'Material observation · learner answer',text:s.materialAnswer?`${s.materialAnswer.label} ${s.materialAnswer.correct?'Sound observation recorded.':'Needs correction; do not treat as a finding.'} Sources: ${s.materialAnswer.materials.join(', ')}.`:'Inspect the small fictional files and answer the material question. No observation recorded yet.'},
  {label:'Who receives this work',text:c.handoffLesson},
  {label:'Given in this exercise · not checked outside it',text:`Project: ${c.from}. Selected path: ${choice?.label||'none yet'}. These are example facts, not checked files.`},
  {label:'Still open · people need to check',text:open},
  {label:'Original and proposed copy',text:`${c.from} → ${c.to} (invented catalogue labels)`},
  {label:'Proposed action · fictional example',text:`${choice?.label||'Choose an action first'}. ${choice?.example||'No example yet.'} ${choice?.consequence||'No draft action yet.'} ${choice&&!choice.good?choice.blockedReason:''}`},
  {label:'Benefit and compromise',text:choice?`Why choose it: ${choice.gain} What you give up: ${choice.cost}`:'No choice yet.'},
  {label:'Private plan · proposed',text:choice?.good?plan:'No agreed private plan in this draft.'},
  {label:'Reference to the proposed method check · unverified',text:method?`${method.id}: ${method.description}`:'Not generated yet.'},
  {label:'Corrections proposed in draft',text:corrections||'No draft corrections yet.'},
  {label:'All example references · unverified',text:pointers},
  {label:'Colleagues’ replies · not approval',text:reviews},
  ...(s.communityScope?[{label:'Description versus file requests',text:`Description: ${s.communityScope.metadata==='private'?'keep the title private':'ask whether the title may be seen'}; file requests: ${s.communityScope.access==='none'?'keep requests closed':'ask separately who may request files'}. Both need separate real decisions.`}]:[])
 ];
 return {sections,record:sections.map(x=>`${x.label}: ${x.text}`).join('\n')+`\nAll example references:\n${pointers}`,
 handoff:`Possible archive to ask: ${c.candidate}.\n${packagePlan}.\n${c.checklist}\nReference to the method check: ${method?.id||'Not generated'}.\nOther example references:\n${pointers}\nPeople still need to check: ${open}`};
}
