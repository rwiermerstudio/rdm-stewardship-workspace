import {fresh,transition,draft,nextRole,scenarios,roles} from './model.mjs';
let state=fresh(),role='researcher';
const $=id=>document.getElementById(id);
const set=(id,value)=>{$(id).textContent=value;};
const button=(parent,label,handler,css='')=>{const el=document.createElement('button');el.type='button';el.textContent=label;el.className=css;el.addEventListener('click',handler);parent.append(el);return el;};
const action=a=>{try{state=transition(state,a);render();$('step').focus();}catch(error){set('feedback',error.message);}};
const field=(parent,id,label,placeholder='fictional-run-2')=>{const lab=document.createElement('label');lab.htmlFor=id;lab.textContent=label;parent.append(lab);const input=document.createElement('input');input.id=id;input.maxLength=80;input.placeholder=placeholder;parent.append(input);return input;};
const select=(parent,id,label,options,placeholder)=>{const lab=document.createElement('label');lab.htmlFor=id;lab.textContent=label;parent.append(lab);const control=document.createElement('select');control.id=id;control.append(new Option(placeholder,''));for(const o of options)control.append(new Option(o.label,o.id));parent.append(control);return control;};
const gated=(parent,label,controls,handler)=>{const b=button(parent,label,handler,'primary');b.disabled=true;const update=()=>b.disabled=controls.some(x=>!x.value);controls.forEach(x=>x.addEventListener('input',update));return b;};
for(const [id,c] of Object.entries(scenarios)){const b=button($('projects'),`${c.title}\n${c.card}`,()=>{state=fresh(id);role='researcher';$('role').value=role;render();$('project-title').focus();},'project');b.dataset.id=id;}
for(const [id,name] of Object.entries(roles))$('role').append(new Option(name,id));
$('role').addEventListener('change',event=>{role=event.target.value;render();$('step').focus();});
$('reset').addEventListener('click',()=>{state=fresh(state.id);role='researcher';$('role').value=role;render();$('project-title').focus();});
function render(){
 const c=scenarios[state.id],d=draft(state),a=$('action');a.replaceChildren();
 for(const b of document.querySelectorAll('.project'))b.setAttribute('aria-pressed',String(b.dataset.id===state.id));
 set('discipline',`${c.discipline} · ${c.group} · ${c.person}`);set('project-title',c.title);set('arrival',c.arrival);
 set('files',c.files);set('sample',c.sample);$('sample').hidden=state.phase==='choice';
 $('versions').hidden=['choice','feedback'].includes(state.phase);set('versions',`Earlier copy: ${c.from}. Proposed copy: ${c.to}. Invented labels, not files in this page.`);
 set('project-question',c.question);set('feedback',state.phase==='feedback'?state.feedback:state.lastOutcome||'');set('result','');
 $('support').hidden=state.phase==='choice';$('package-details').hidden=['choice','feedback','record'].includes(state.phase);$('handover').hidden=['choice','feedback','record'].includes(state.phase);$('history-section').hidden=!state.events.length;
 set('supplied',state.reference||'No invented method reference yet. Do not enter subject content.');set('record',d.record);set('handoff',d.handoff);
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
 set('next-person',state.phase==='review'?`Next: ${roles[reviewer]}. Their response is a training determination about this question, not inspection or permission.`:state.phase==='returned'?'The researcher must change the private plan and invented reference before this question can return.':state.phase==='repair'?'The researcher must change the package plan and invented reference.':`Unresolved outside this exercise: ${c.external}`);
 if(state.phase==='choice'){
  set('step','1 · Choose an action');set('role-context',researcher?'You are the researcher. What would you do with today’s change?':`Switch to researcher to make the first choice.`);
  if(researcher){const box=document.createElement('div');box.className='choices';a.append(box);for(const option of c.choices){const b=button(box,option.label,()=>action({type:'choose',choice:option.id}));b.dataset.choice=option.id;}}
 }else if(state.phase==='feedback'){
  set('step','2 · See the consequence');set('role-context','The workbench draft now reflects your action. Compare it with the question still open. No real files or permissions changed.');
  if(researcher){button(a,'Try another action',()=>action({type:'retry'}));if(state.progress)button(a,'Continue to the change record',()=>action({type:'continue'}),'primary');}
 }else if(state.phase==='record'){
  set('step','3 · Connect the copies');set('role-context',`The workbench has invented labels for the earlier and proposed copy. Give the method an invented reference; do not enter subject content.`);
  if(researcher){const input=field(a,'reference','Invented method or evidence reference');button(a,'Make draft and ask reviewers',()=>action({type:'record',reference:input.value}),'primary');}
 }else if(state.phase==='review'){
  set('step','4 · Independent questions');set('role-context',`Next reviewer: ${roles[reviewer]}. ${c.reviewQuestions[reviewer]}`);
  if(role===reviewer){
   const response=select(a,'review-reason','What can you say from this draft?',c.reviewOptions[role],'Choose what is still missing');
   let metadata,access;
   if(role==='community'){
    metadata=select(a,'metadata','Description visibility',[{id:'private',label:'Keep private'},{id:'review-needed',label:'Request separate visibility decision'}],'Choose description status');
    access=select(a,'access','File requests',[{id:'none',label:'No request route yet'},{id:'request-review',label:'Requests need separate decision'}],'Choose file request status');
   }
   gated(a,'Ask researcher for this missing check',[response],()=>action({type:'review',role,decision:'return',reason:response.value}));
   gated(a,'Record this training response',[response,...(metadata?[metadata,access]:[])],()=>{const option=c.reviewOptions[role].find(o=>o.id===response.value);action({type:'review',role,decision:option.decision,reason:option.id,metadata:metadata?.value,access:access?.value});});
  }
 }else if(state.phase==='returned'){
  set('step','4 · A question came back');set('role-context','Change the private plan and invented reference before the reviewer answers again. A returned question is not resolved by a click.');
  if(researcher){const returned=Object.keys(state.reviews).find(r=>state.reviews[r].decision==='return');const input=field(a,'new-reference','New invented reference for the proposed correction');const plan=select(a,'changed-plan','What will you propose to change?',[c.revisionPlans[returned]],'Choose a response to this reviewer’s question');gated(a,'Send proposed correction',[input,plan],()=>action({type:'revise',reference:input.value,plan:plan.value}));}
 }else if(state.phase==='curator'){
  set('step','5 · Package question');set('role-context',`${c.candidate} is a candidate only. The curator has not inspected actual files, capacity or integrity.`);
  if(role==='curator'){const reason=select(a,'curator-reason','Package observation and reason',c.curatorReasons,'Choose what remains to be checked');button(a,'Return package for correction',()=>action({type:'receipt',role,decision:'return'}));gated(a,'Record package observation',[reason],()=>action({type:'receipt',role,decision:'noted',reason:reason.value}));}
 }else if(state.phase==='repair'){
  set('step','5 · Package returned');set('role-context','Change the proposed inventory plan and reference before asking the curator again.');
  if(researcher){const input=field(a,'new-reference','New invented reference');const plan=select(a,'package-plan','Changed package plan',c.packagePlans.filter(p=>p.id!==state.packagePlan),'Choose a changed package plan');gated(a,'Send revised package',[input,plan],()=>action({type:'repair',reference:input.value,plan:plan.value}));}
 }else{
  set('step','5 · What remains');set('role-context',`Training responses recorded. No actual inspection, consent decision, rights review or transfer happened. ${c.external}`);
  set('result',state.phase==='hold'?`Hard hold. ${c.hold} ${c.external}`:`This draft still needs external checks. ${c.external}`);
 }
 const history=$('history');history.replaceChildren();for(const event of state.events){const li=document.createElement('li');li.textContent=event;history.append(li);}
}
render();
