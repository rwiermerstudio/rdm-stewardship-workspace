import {fresh,transition,draft,nextRole,actionOwner,processView,scenarios,roles} from './model.mjs';
import {renderPolicyContext,applicablePolicies,policyLink} from './policy-context.mjs';
import {createMaterialPanel} from './material-panel.mjs';
let state=fresh(),role='researcher',manualSwitch=false,catalog=null;
fetch('meridian-institute.json').then(response=>{if(!response.ok)throw Error(`HTTP ${response.status}`);return response.json();}).then(data=>{catalog=data;render();}).catch(()=>set('policy-context','The fictional catalogue could not be loaded. Do not use the exercise without its source documents.'));
const $=id=>document.getElementById(id);
const set=(id,value)=>{$(id).textContent=value;};
const button=(parent,label,handler,css='')=>{const el=document.createElement('button');el.type='button';el.textContent=label;el.className=css;el.addEventListener('click',handler);parent.append(el);return el;};
const paragraph=(parent,text)=>{const el=document.createElement('p');el.textContent=text;parent.append(el);};
const action=a=>{try{state=transition(state,a);role=actionOwner(state)||role;manualSwitch=false;$('role').value=role;render();$(a.type==='inspect'?'material-feedback':'step').focus();}catch(error){set('feedback',error.message);}};
const materialPanel=createMaterialPanel($('material-panel'),()=>state,answer=>action({type:'inspect',answer}));
$('inspect-link').addEventListener('click',()=>{$('material-panel').open=true;});
$('download-handover').addEventListener('click',async()=>{try{await materialPanel.download();set('download-feedback','Local package prepared. It includes the original exercise files, real text-check results and unresolved human questions. No upload or approval occurred.');}catch(error){set('download-feedback',error.message);}});
const list=(id,items)=>{const root=$(id);root.replaceChildren();for(const text of items){const li=document.createElement('li');li.textContent=text;root.append(li);}};
const renderRecord=sections=>{const root=$('record');root.replaceChildren();for(const item of sections){const term=document.createElement('dt'),description=document.createElement('dd');term.textContent=item.label;description.textContent=item.text;root.append(term,description);}};
const renderRoles=items=>{const root=$('role-lanes');root.replaceChildren();for(const item of items){const li=document.createElement('li'),name=document.createElement('strong'),short=document.createElement('span'),status=document.createElement('span'),details=document.createElement('details'),summary=document.createElement('summary'),question=document.createElement('p');li.dataset.role=item.role;if(item.role===role){li.classList.add('current-role');li.setAttribute('aria-current','step');}name.className='role-long';name.textContent=item.name;short.className='role-short';short.textContent={researcher:'Researcher',steward:'Steward',privacy:'Privacy',community:'Community',curator:'Curator'}[item.role];short.setAttribute('aria-hidden','true');status.textContent=item.role===role?`Current role · ${item.status}`:item.status==='not in this practice route'?'outside route':item.status;status.className='role-status';summary.textContent='Question';question.textContent=item.question;details.append(summary,question);li.append(name,short,status,details);root.append(li);}};
const cards=(parent,id,title,options)=>{const group=document.createElement('fieldset');group.className='answer-cards';group.id=id;group.append(document.createElement('legend'));group.firstChild.textContent=title;for(const option of options){const label=document.createElement('label');label.className='answer-card';const input=document.createElement('input');input.type='radio';input.name=id;input.value=option.id;const caption=document.createElement('span');caption.textContent=option.label;label.append(input,caption);group.append(label);}parent.append(group);return {get value(){return group.querySelector('input:checked')?.value||'';},addEventListener:(type,handler)=>group.addEventListener(type,handler)};};
const gated=(parent,label,controls,handler)=>{const b=button(parent,label,handler,'primary');b.disabled=true;const update=()=>b.disabled=controls.some(x=>!x.value);controls.forEach(x=>x.addEventListener('change',update));return b;};
for(const [id,c] of Object.entries(scenarios)){const b=button($('projects'),`${c.title}\n${c.card}`,()=>{state=fresh(id);role='researcher';manualSwitch=false;$('role').value=role;render();$('project-title').focus();},'project');b.dataset.id=id;}
for(const [id,name] of Object.entries(roles))$('role').append(new Option(name,id));
$('role').addEventListener('change',event=>{role=event.target.value;manualSwitch=true;render();$('step').focus();});
$('reset').addEventListener('click',()=>{state=fresh(state.id);role='researcher';manualSwitch=false;$('role').value=role;materialPanel.reset();render();$('project-title').focus();});
function render(){
 const c=scenarios[state.id],d=draft(state),a=$('action');a.replaceChildren();
 materialPanel.render();set('download-feedback','');
 const ended=['hold','pending','done'].includes(state.phase);
 const completed=[Boolean(state.materialAnswer?.correct),Boolean(state.progress),Boolean(state.reference),ended].filter(Boolean).length;
 set('learning-progress',`${completed} of 4 learning tasks complete. ${ended&&state.materialAnswer?.correct?'Learning complete. The external hold or unanswered decision remains; read the debrief and take your handover draft.':`Current goal: ${!state.materialAnswer?.correct?'inspect the small files and record what the next person needs.':!state.progress?'choose a safe response to the project question.':!state.reference?'explain the proposed change for the steward.':'record each colleague’s reply and the next outside task.'}`}`);
 if(catalog){
  renderPolicyContext($('policy-context'),catalog,state.id);
  const references=$('decision-policy');references.replaceChildren();
  references.append(document.createTextNode('Source passages for this question: '));
  const project=catalog.projects.find(p=>p.id===state.id);
  applicablePolicies(catalog,project).forEach((policy,index)=>{
   if(index)references.append(document.createTextNode(' · '));
   references.append(policyLink(policy));
  });
 }
 $('reflection').hidden=!['hold','pending','done'].includes(state.phase);
 $('role').value=role;document.querySelector('.task').dataset.currentRole=role;document.querySelector('#process-view').dataset.currentRole=role;
 for(const b of document.querySelectorAll('.project'))b.setAttribute('aria-pressed',String(b.dataset.id===state.id));
 set('discipline',`${c.discipline} · ${c.group} · ${c.person}`);set('project-title',c.title);set('arrival',c.arrival);
 set('files',c.files);set('sample',c.sample);$('sample').hidden=state.phase==='choice';
 $('versions').hidden=['choice','feedback'].includes(state.phase);set('versions',`Earlier copy: ${c.from}. Proposed copy: ${c.to}. These describe the fictional project, not supplied research payloads. Inspect the small teaching files separately below.`);
 set('project-question',c.question);set('feedback',state.phase==='feedback'?state.feedback:state.lastOutcome||'');set('result','');
 $('support').hidden=state.phase==='choice';$('package-details').hidden=['choice','feedback','record'].includes(state.phase);$('handover').hidden=['choice','feedback','record'].includes(state.phase);$('history-section').hidden=!state.events.length;
 set('supplied',state.choice?`Researcher selected: ${c.choices.find(x=>x.id===state.choice).label}. `:'Choose what you would do first.');renderRecord(d.sections);set('handoff',d.handoff);
 const view=processView(state);
 list('process-steps',view.steps.map(x=>`${x.name} · ${x.status}`));
 renderRoles(view.roles);
 list('open-items',view.open);list('fixed-items',view.fixed.length?view.fixed:['No draft corrections yet.']);
 list('evidence',state.evidence.length?state.evidence.map(x=>`${x.id} · ${x.kind}. ${x.description}. Example reference, unverified.`):['No reference to a proposed check yet.']);
 const terms={
  'oral-heritage':'A transcript is a written account of a recording. A catalogue title can reveal information without opening the recording.',
  'stellar-survey':'FITS is an astronomy image format; Zarr stores large arrays in smaller chunks. The processing run explains how one image copy became another.',
  'neighbourhood-voices':'The guide to the codes is called a codebook. It explains what each table category means; it does not grant permission to share a row.',
  'coastal-species':'A map area is sometimes called a grid cell. Making areas larger does not prove that sites cannot be inferred.',
  'variant-study':'A VCF is a file of reported genetic differences, often called variant calls. It is not automatically safe to share.',
  'brain-maps':'JSON is a structured text format for companion fields beside an image. A human still needs to inspect those fields and the image.'
 };
 set('human',c.external);set('vocabulary',`${terms[state.id]}${state.reference?' A changed copy is sometimes called a derivative. The account of how it was made is called provenance. Descriptions of files are often called metadata. You do not need those terms to complete the steps.':''}`);
 const researcher=role==='researcher',reviewer=nextRole(state);
 set('next-person',state.phase==='review'?`Next: ${roles[reviewer]}. Read what they need to answer the question.`:state.phase==='returned'?'Back to the researcher: explain the missing information in the private plan.':state.phase==='repair'?'Back to the researcher: complete the file list for the curator.':state.phase==='curator'?'Next: the archive curator considers what is still needed before taking the files.':!actionOwner(state)?`No next action in this exercise. ${state.phase==='hold'?`The ${state.id==='variant-study'?'consent decision':'independent check of location risk'} must happen outside this page; no choice here can clear the hold.`:'The handover note is ready for the people who must do the real checks.'} ${c.external}`:`Next: ${roles[actionOwner(state)]} acts in this simulation.`);
 if(state.phase==='choice'){
  set('step','1 · Choose an action');set('role-context',researcher?'You are the researcher. What would you do with today’s change?':`Switch to researcher to make the first choice.`);
  if(researcher){const box=document.createElement('div');box.className='choices';a.append(box);for(const option of c.choices){const b=button(box,`${option.label}\n${option.example}\nWhy you might choose it: ${option.gain}\nWhat you give up: ${option.cost}\nWhat still needs checking: ${option.unknown}`,()=>action({type:'choose',choice:option.id}));b.dataset.choice=option.id;}}
 }else if(state.phase==='feedback'){
  set('step','2 · See the consequence');set('role-context',`Your handover note now reflects your action. ${c.choices.find(x=>x.id===state.choice).example} ${state.progress?'':c.choices.find(x=>x.id===state.choice).blockedReason}`);
  if(researcher){button(a,'Try another action',()=>action({type:'retry'}));if(state.progress)button(a,'Write down the change',()=>action({type:'continue'}),'primary');}
 }else if(state.phase==='record'){
  set('step','3 · Explain how you made the new copy');set('role-context','Prepare a note that connects the original files, the changed copy and the method. The steward needs this to follow your work. The page adds an example reference to the proposed check for you; it remains unverified.');
  if(researcher)button(a,'Send the note to the steward',()=>action({type:'record'}),'primary');
 }else if(state.phase==='review'){
  set('step','4 · A colleague checks the work');set('role-context',`Next reviewer: ${roles[reviewer]}. ${c.reviewQuestions[reviewer]}`);
  if(role===reviewer){
   const response=cards(a,'review-reason','What can you say from this draft?',c.reviewOptions[role]);
   let metadata,access;
   if(role==='community'){
    metadata=cards(a,'metadata','Description visibility',[{id:'private',label:'Keep the collection title private for now. Example: only the study team sees the draft title.'},{id:'review-needed',label:'Ask whether the title may be seen. Example: send the draft title to the appointed community body before publishing it.'}]);
    access=cards(a,'access','File requests',[{id:'none',label:'Keep recording requests closed for now. Example: do not offer a request button beside the title.'},{id:'request-review',label:'Ask separately who may request recordings. Example: ask the community body which requests it would consider.'}]);
   }
   if(state.revisedRoles[role]){
    paragraph(a,'You have practised one return for this reviewer. Record what they still need to check. We stop the back-and-forth here to keep the lesson short; colleagues may need several rounds in real work.');
   }else{
    const returnButton=gated(a,'Ask researcher for this missing check',[response],()=>action({type:'review',role,decision:'return',reason:response.value}));
    const updateReturn=()=>returnButton.disabled=response.value!==`${role}-evidence`;
    response.addEventListener('change',updateReturn);updateReturn();
   }
   gated(a,'Record this reply',[response,...(metadata?[metadata,access]:[])],()=>{const option=c.reviewOptions[role].find(o=>o.id===response.value);action({type:'review',role,decision:option.decision,reason:option.id,metadata:metadata?.value,access:access?.value});});
  }
 }else if(state.phase==='returned'){
  set('step','4 · A question came back');set('role-context','The reviewer needs more information before answering. Change the private plan and send it back. Explain the correction to the person who asked. Keep the earlier note so they can see what changed. The page adds an unverified reference for this proposal.');
  if(researcher){const returned=Object.keys(state.reviews).find(r=>state.reviews[r].decision==='return');const plan=cards(a,'changed-plan','What will you propose to change?',c.revisionChoices[returned]);gated(a,'Send proposed correction',[plan],()=>action({type:'revise',plan:plan.value}));}
 }else if(state.phase==='curator'){
  set('step','5 · The archive asks about the files');set('role-context',`You are considering ${c.candidate}. The curator needs the file list, expected size and a plan to check that copies arrive unchanged. They can ask the researcher to complete the list before agreeing to a transfer.`);
  if(role==='curator'){const reason=cards(a,'curator-reason','What does the archive still need?',c.curatorReasons);if(!state.packageRepaired)button(a,'Ask for a complete file list',()=>action({type:'receipt',role,decision:'return'}));else paragraph(a,'You have practised one archive return. Record what still needs checking. The real curator would inspect the files and agree terms before accepting them.');gated(a,'Record the archive reply',[reason],()=>action({type:'receipt',role,decision:'noted',reason:reason.value}));}
 }else if(state.phase==='repair'){
  set('step','5 · Complete the file list');set('role-context','The curator needs a complete file list with the method note beside the images. Revise the list and send it back. The curator will still need to check space and the actual copies.');
  if(researcher){const plan=cards(a,'package-plan','What will you send back to the archive?',c.packagePlans.filter(p=>p.id!==state.packagePlan));gated(a,'Send the revised file list',[plan],()=>action({type:'repair',plan:plan.value}));}
 }else{
  set('step','5 · The work outside this exercise');set('role-context',`You have prepared the questions and recorded the replies for this lesson. ${c.external}`);
  set('result',state.phase==='hold'?`Pause here. No next action in this exercise. ${c.hold} ${c.external}`:`No next action in this exercise. This draft still needs external checks. ${c.external}`);
 }
 $('role-context').prepend(`Current role: ${roles[role]}. ${manualSwitch?'Manual role switching is a simulation, not authentication. ':''}`);
 const history=$('history');history.replaceChildren();for(const event of state.events){const li=document.createElement('li');li.textContent=event;history.append(li);}
}
render();
