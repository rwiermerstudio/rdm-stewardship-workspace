import {fresh,transition,draft,nextRole,actionOwner,processView,scenarios,roles} from './model.mjs';
import {renderPolicyContext,applicablePolicies,policyLink} from './policy-context.mjs';
let state=fresh(),role='researcher',manualSwitch=false,catalog=null;
fetch('meridian-institute.json').then(response=>{if(!response.ok)throw Error(`HTTP ${response.status}`);return response.json();}).then(data=>{catalog=data;render();}).catch(()=>set('policy-context','The fictional catalogue could not be loaded. Do not use the exercise without its source documents.'));
const $=id=>document.getElementById(id);
const set=(id,value)=>{$(id).textContent=value;};
const button=(parent,label,handler,css='')=>{const el=document.createElement('button');el.type='button';el.textContent=label;el.className=css;el.addEventListener('click',handler);parent.append(el);return el;};
const paragraph=(parent,text)=>{const el=document.createElement('p');el.textContent=text;parent.append(el);};
const action=a=>{try{state=transition(state,a);role=actionOwner(state)||role;manualSwitch=false;$('role').value=role;render();$('step').focus();}catch(error){set('feedback',error.message);}};
const list=(id,items)=>{const root=$(id);root.replaceChildren();for(const text of items){const li=document.createElement('li');li.textContent=text;root.append(li);}};
const renderRecord=sections=>{const root=$('record');root.replaceChildren();for(const item of sections){const term=document.createElement('dt'),description=document.createElement('dd');term.textContent=item.label;description.textContent=item.text;root.append(term,description);}};
const renderRoles=items=>{const root=$('role-lanes');root.replaceChildren();for(const item of items){const li=document.createElement('li'),name=document.createElement('strong'),short=document.createElement('span'),status=document.createElement('span'),details=document.createElement('details'),summary=document.createElement('summary'),question=document.createElement('p');li.dataset.role=item.role;if(item.role===role){li.classList.add('current-role');li.setAttribute('aria-current','step');}name.className='role-long';name.textContent=item.name;short.className='role-short';short.textContent={researcher:'Researcher',steward:'Steward',privacy:'Privacy',community:'Community',curator:'Curator'}[item.role];short.setAttribute('aria-hidden','true');status.textContent=item.role===role?`Current role · ${item.status}`:item.status==='not in this practice route'?'outside route':item.status;status.className='role-status';summary.textContent='Question';question.textContent=item.question;details.append(summary,question);li.append(name,short,status,details);root.append(li);}};
const cards=(parent,id,title,options)=>{const group=document.createElement('fieldset');group.className='answer-cards';group.id=id;group.append(document.createElement('legend'));group.firstChild.textContent=title;for(const option of options){const label=document.createElement('label');label.className='answer-card';const input=document.createElement('input');input.type='radio';input.name=id;input.value=option.id;const caption=document.createElement('span');caption.textContent=option.label;label.append(input,caption);group.append(label);}parent.append(group);return {get value(){return group.querySelector('input:checked')?.value||'';},addEventListener:(type,handler)=>group.addEventListener(type,handler)};};
const gated=(parent,label,controls,handler)=>{const b=button(parent,label,handler,'primary');b.disabled=true;const update=()=>b.disabled=controls.some(x=>!x.value);controls.forEach(x=>x.addEventListener('change',update));return b;};
for(const [id,c] of Object.entries(scenarios)){const b=button($('projects'),`${c.title}\n${c.card}`,()=>{state=fresh(id);role='researcher';manualSwitch=false;$('role').value=role;render();$('project-title').focus();},'project');b.dataset.id=id;}
for(const [id,name] of Object.entries(roles))$('role').append(new Option(name,id));
$('role').addEventListener('change',event=>{role=event.target.value;manualSwitch=true;render();$('step').focus();});
$('reset').addEventListener('click',()=>{state=fresh(state.id);role='researcher';manualSwitch=false;$('role').value=role;render();$('project-title').focus();});
function render(){
 const c=scenarios[state.id],d=draft(state),a=$('action');a.replaceChildren();
 if(catalog){
  renderPolicyContext($('policy-context'),catalog,state.id);
  const references=$('decision-policy');references.replaceChildren();
  references.append(document.createTextNode('Read the applicable fictional sections: '));
  const project=catalog.projects.find(p=>p.id===state.id);
  applicablePolicies(catalog,project).forEach((policy,index)=>{
   if(index)references.append(document.createTextNode(' · '));
   references.append(policyLink(policy));
  });
 }
 $('role').value=role;document.querySelector('.task').dataset.currentRole=role;document.querySelector('#process-view').dataset.currentRole=role;
 for(const b of document.querySelectorAll('.project'))b.setAttribute('aria-pressed',String(b.dataset.id===state.id));
 set('discipline',`${c.discipline} · ${c.group} · ${c.person}`);set('project-title',c.title);set('arrival',c.arrival);
 set('files',c.files);set('sample',c.sample);$('sample').hidden=state.phase==='choice';
 $('versions').hidden=['choice','feedback'].includes(state.phase);set('versions',`Earlier copy: ${c.from}. Proposed copy: ${c.to}. Invented labels, not files in this page.`);
 set('project-question',c.question);set('feedback',state.phase==='feedback'?state.feedback:state.lastOutcome||'');set('result','');
 $('support').hidden=state.phase==='choice';$('package-details').hidden=['choice','feedback','record'].includes(state.phase);$('handover').hidden=['choice','feedback','record'].includes(state.phase);$('history-section').hidden=!state.events.length;
 set('supplied',state.choice?`Researcher selected: ${c.choices.find(x=>x.id===state.choice).label}. No subject content was entered.`:'No decision yet. No subject content is requested.');renderRecord(d.sections);set('handoff',d.handoff);
 const view=processView(state);
 list('process-steps',view.steps.map(x=>`${x.name} · ${x.status}`));
 renderRoles(view.roles);
 list('open-items',view.open);list('fixed-items',view.fixed.length?view.fixed:['No draft corrections yet.']);
 list('evidence',state.evidence.length?state.evidence.map(x=>`${x.id} · ${x.kind}. ${x.description}. Generated here; unverified, not a link to an inspected file.`):['No evidence pointer generated yet.']);
 const terms={
  'oral-heritage':'A transcript is a written account of a recording. A catalogue title can reveal information without opening the recording.',
  'stellar-survey':'FITS is an astronomy image format; Zarr stores large arrays in smaller chunks. The processing run explains how one image copy became another.',
  'neighbourhood-voices':'The guide to the codes is called a codebook. It explains what each table category means; it does not grant permission to share a row.',
  'coastal-species':'A map area is sometimes called a grid cell. Making areas larger does not prove that sites cannot be inferred.',
  'variant-study':'A VCF is a file of reported genetic differences, often called variant calls. It is not automatically safe to share.',
  'brain-maps':'JSON is a structured text format for companion fields beside an image. A human still needs to inspect those fields and the image.'
 };
 set('human',c.external);set('vocabulary',`${terms[state.id]}${state.reference?' The link between copies and method is called provenance. The proposed file list is an inventory, not an inspected list. An integrity check tests whether actual files changed; none was run here.':''}`);
 const researcher=role==='researcher',reviewer=nextRole(state);
 set('next-person',state.phase==='review'?`Next: ${roles[reviewer]}. Their response is a training determination, not inspection or permission.`:state.phase==='returned'?'Next: researcher must change the private plan; a new pointer will be generated.':state.phase==='repair'?'Next: researcher must change the package plan; a new pointer will be generated.':state.phase==='curator'?'Next: repository curator records a package observation. No actual acceptance occurs here.':!actionOwner(state)?`No next action in this exercise. ${state.phase==='hold'?`The ${state.id==='variant-study'?'consent and approved-purpose':'independent location-risk'} hold needs external authority; no choice here can clear it.`:'The training responses are recorded; actual review or transfer requires authorized people outside this exercise.'} ${c.external}`:`Next: ${roles[actionOwner(state)]} acts in this simulation.`);
 if(state.phase==='choice'){
  set('step','1 · Choose an action');set('role-context',researcher?'You are the researcher. What would you do with today’s change?':`Switch to researcher to make the first choice.`);
  if(researcher){const box=document.createElement('div');box.className='choices';a.append(box);for(const option of c.choices){const b=button(box,`${option.label}\nExample: ${option.example}\nGain: ${option.gain}\nCost: ${option.cost}\nStill unknown: ${option.unknown}`,()=>action({type:'choose',choice:option.id}));b.dataset.choice=option.id;}}
 }else if(state.phase==='feedback'){
  set('step','2 · See the consequence');set('role-context',`The workbench draft now reflects your action. ${c.choices.find(x=>x.id===state.choice).example} ${state.progress?'':c.choices.find(x=>x.id===state.choice).blockedReason} No real files or permissions changed.`);
  if(researcher){button(a,'Try another action',()=>action({type:'retry'}));if(state.progress)button(a,'Continue to the change record',()=>action({type:'continue'}),'primary');}
 }else if(state.phase==='record'){
  set('step','3 · Connect the copies');set('role-context','The workbench has invented labels for the earlier and proposed copy. It will generate an evidence pointer for the proposed method; no file or method is inspected.');
  if(researcher)button(a,'Make draft and ask reviewers',()=>action({type:'record'}),'primary');
 }else if(state.phase==='review'){
  set('step','4 · Independent questions');set('role-context',`Next reviewer: ${roles[reviewer]}. ${c.reviewQuestions[reviewer]}`);
  if(role===reviewer){
   const response=cards(a,'review-reason','What can you say from this draft?',c.reviewOptions[role]);
   let metadata,access;
   if(role==='community'){
    metadata=cards(a,'metadata','Description visibility',[{id:'private',label:'Keep private'},{id:'review-needed',label:'Request separate visibility decision'}]);
    access=cards(a,'access','File requests',[{id:'none',label:'No request route yet'},{id:'request-review',label:'Requests need separate decision'}]);
   }
   if(state.revisedRoles[role]){
    paragraph(a,'You have practiced returning this question once. Record what remains unverified; a real reviewer would continue outside this exercise.');
   }else{
    const returnButton=gated(a,'Ask researcher for this missing check',[response],()=>action({type:'review',role,decision:'return',reason:response.value}));
    const updateReturn=()=>returnButton.disabled=response.value!==`${role}-evidence`;
    response.addEventListener('change',updateReturn);updateReturn();
   }
   gated(a,'Record this training response',[response,...(metadata?[metadata,access]:[])],()=>{const option=c.reviewOptions[role].find(o=>o.id===response.value);action({type:'review',role,decision:option.decision,reason:option.id,metadata:metadata?.value,access:access?.value});});
  }
 }else if(state.phase==='returned'){
  set('step','4 · A question came back');set('role-context','Change the private plan before the reviewer answers again. The workbench generates a new evidence pointer for the proposed correction. This does not verify the missing check.');
  if(researcher){const returned=Object.keys(state.reviews).find(r=>state.reviews[r].decision==='return');const plan=cards(a,'changed-plan','What will you propose to change?',c.revisionChoices[returned]);gated(a,'Send proposed correction',[plan],()=>action({type:'revise',plan:plan.value}));}
 }else if(state.phase==='curator'){
  set('step','5 · Package question');set('role-context',`${c.candidate} is a candidate only. The curator has not inspected actual files, capacity or integrity.`);
  if(role==='curator'){const reason=cards(a,'curator-reason','Package observation and reason',c.curatorReasons);if(!state.packageRepaired)button(a,'Return package for correction',()=>action({type:'receipt',role,decision:'return'}));else paragraph(a,'You have practiced one package return. Record remaining checks; real acceptance needs an actual curator.');gated(a,'Record package observation',[reason],()=>action({type:'receipt',role,decision:'noted',reason:reason.value}));}
 }else if(state.phase==='repair'){
  set('step','5 · Package returned');set('role-context','Change the proposed inventory plan. A new pointer is generated, but actual capacity and file integrity remain open.');
  if(researcher){const plan=cards(a,'package-plan','Changed package plan',c.packagePlans.filter(p=>p.id!==state.packagePlan));gated(a,'Send revised package',[plan],()=>action({type:'repair',plan:plan.value}));}
 }else{
  set('step','5 · What remains');set('role-context',`Training responses recorded. No actual inspection, consent decision, rights review or transfer happened. ${c.external}`);
  set('result',state.phase==='hold'?`Hard hold. No next action in this exercise. ${c.hold} ${c.external}`:`No next action in this exercise. This draft still needs external checks. ${c.external}`);
 }
 $('role-context').prepend(`Current role: ${roles[role]}. ${manualSwitch?'Manual role switching is a simulation, not authentication. ':''}`);
 const history=$('history');history.replaceChildren();for(const event of state.events){const li=document.createElement('li');li.textContent=event;history.append(li);}
}
render();
