import {fresh,transition,draft,nextRole,scenarios,roles} from './model.mjs';
let state=fresh(),role='researcher';
const $=id=>document.getElementById(id);
const set=(id,value)=>{$(id).textContent=value;};
const button=(parent,label,handler,css='')=>{const el=document.createElement('button');el.type='button';el.textContent=label;el.className=css;el.addEventListener('click',handler);parent.append(el);return el;};
const action=a=>{try{state=transition(state,a);render();$('step').focus();}catch(error){set('feedback',error.message);}};
$('step').tabIndex=-1;
for(const [id,c] of Object.entries(scenarios)){const b=button($('projects'),c.title,()=>{state=fresh(id);role='researcher';$('role').value=role;render();$('project-title').focus();},'project');b.dataset.id=id;}
for(const [id,name] of Object.entries(roles)){const opt=document.createElement('option');opt.value=id;opt.textContent=name;$('role').append(opt);}
$('role').addEventListener('change',event=>{role=event.target.value;render();$('step').focus();});
$('reset').addEventListener('click',()=>{state=fresh(state.id);role='researcher';$('role').value=role;render();$('project-title').focus();});
function render(){
 const c=scenarios[state.id],d=draft(state),a=$('action');a.replaceChildren();
 for(const b of document.querySelectorAll('.project')){const selected=b.dataset.id===state.id;b.setAttribute('aria-pressed',String(selected));}
 set('discipline',`${c.discipline} · ${c.group} · ${c.person}`);set('project-title',c.title);set('arrival',c.arrival);set('files',c.files);set('sample',c.sample);
 set('versions',`Earlier copy: ${c.from}. Proposed copy: ${c.to}. These are invented labels, not files in this page.`);
 set('project-question',c.question);set('feedback',state.phase==='feedback'?state.feedback:state.lastOutcome||'');set('result','');
 set('supplied',state.reference||'An invented method or evidence reference after your first choice. Never enter subject content.');set('record',d.record);set('handoff',d.handoff);
 set('human',c.hold?`${c.hold} A click here cannot clear this hold.`:c.question);
 set('vocabulary',state.reference?'The link between the earlier copy, new copy and method is called provenance. A file list is a manifest. A checksum is a number used later to test whether a file changed. None is calculated here.':'After you connect the copies, this panel explains the terms used for that record.');
 set('next-person',state.phase==='review'?`Next: ${roles[nextRole(state)]}. Their response concerns only their question.`:state.phase==='returned'?'The researcher needs to revise the plan before that reviewer can answer again.':state.phase==='hold'?'An outside authority must resolve the hold. The curator has no acceptance action here.':state.phase==='curator'?'The curator can inspect the proposed package in this exercise.':state.phase==='done'?'The handoff here is only a teaching result. No files moved.':state.phase==='repair'?'The researcher revises the fictional package checklist.':'Each role has its own question after you prepare the record.');
 const researcher=role==='researcher', reviewer=nextRole(state);
 if(state.phase==='choice'){
  set('step','1 · Choose an action');set('role-context',researcher?'You are the researcher. Decide how to handle today’s change.':`You are acting as ${roles[role]}. The researcher makes the first choice; switch back to begin.`);
  if(researcher){const box=document.createElement('div');box.className='choices';a.append(box);for(const option of c.choices){const b=button(box,option.label,()=>action({type:'choose',choice:option.id}));b.dataset.choice=option.id;const cue=document.createElement('small');cue.textContent=option.cue;b.append(cue);}}
 }else if(state.phase==='feedback'){
  set('step','2 · See what happened');set('role-context',state.progress?'This action keeps the open question with the right people.':'That choice has a consequence. You can change course without losing the project.');
  if(researcher){button(a,'Try another action',()=>action({type:'retry'}));if(state.progress)button(a,'Continue to the change record',()=>action({type:'continue'}),'primary');}
 }else if(state.phase==='record'){
  set('step','3 · Connect the copies');set('role-context',`The workbench knows ${c.from} and ${c.to}. What invented reference identifies the method or check?`);
  if(researcher){const label=document.createElement('label');label.htmlFor='reference';label.textContent='Invented method or evidence reference';a.append(label);const input=document.createElement('input');input.id='reference';input.maxLength=80;input.placeholder='fictional-run-7';a.append(input);button(a,'Make draft and ask reviewers',()=>action({type:'record',reference:input.value}),'primary');}
 }else if(state.phase==='review'){
  set('step','4 · Independent questions');set('role-context',`Next reviewer: ${roles[reviewer]}. ${c.reviewQuestions[reviewer]} ${state.id==='variant-study'?'Unknown consent still needs an outside authority.':state.id==='coastal-species'?'Location risk still needs an outside assessment.':''}`);
  if(role===reviewer){
   let metadata,access;
   if(role==='community'){
    const select=(id,label,options)=>{const lab=document.createElement('label');lab.htmlFor=id;lab.textContent=label;a.append(lab);const control=document.createElement('select');control.id=id;for(const [value,name] of options){const opt=document.createElement('option');opt.value=value;opt.textContent=name;control.append(opt);}a.append(control);return control;};
    metadata=select('metadata','Description visibility',[['private','Keep private'],['review-needed','Ask for a separate visibility review']]);
    access=select('access','File requests',[['none','No request route yet'],['request-review','Consider requests separately, with a person deciding']]);
    const info=document.createElement('p');info.textContent='Neither choice publishes a title or opens recordings.';a.append(info);
   }
   button(a,'Return this question',()=>action({type:'review',role,decision:'return'}));
   button(a,'Record scoped response',()=>action({type:'review',role,decision:'checked',metadata:metadata?.value,access:access?.value}),'primary');
  }
 }else if(state.phase==='returned'){
  set('step','4 · A question came back');set('role-context','The reviewer needs a narrower or clearer plan. The researcher can send the question back; that reviewer must answer again.');if(researcher)button(a,'Revise and send back',()=>action({type:'revise'}),'primary');
 }else if(state.phase==='hold'){
  set('step','5 · Stop here');set('role-context',`You are acting as ${roles[role]}. ${c.hold} Ask the responsible authority outside this exercise. No simulated acceptance is available.`);set('result','This exercise cannot clear the hold or release any files.');
 }else if(state.phase==='curator'){
  set('step','5 · Proposed handoff');set('role-context',`You are acting as ${roles[role]}. ${c.candidate} is a candidate, not a booked destination. The curator would need a real file list, file integrity checks and rights review.`);
  if(role==='curator'){button(a,'Return package for correction',()=>action({type:'receipt',role,decision:'return'}));button(a,'Record simulated handoff',()=>action({type:'receipt',role,decision:'ready'}),'primary');}
 }else if(state.phase==='repair'){
  set('step','5 · Package returned');set('role-context','The candidate package needs correction. This exercise has not checked actual files.');if(researcher)button(a,'Revise checklist and return',()=>action({type:'repair'}),'primary');
 }else {set('step','5 · Exercise complete');set('role-context','The curator recorded a simulated handoff after the scoped questions. Actual custody and access require a real process.');set('result','Simulated handoff only, not a real deposit or permission to share.');}
 const history=$('history');history.replaceChildren();for(const event of state.events){const li=document.createElement('li');li.textContent=event;history.append(li);}if(!state.events.length){const li=document.createElement('li');li.textContent='Choose an action to begin.';history.append(li);}
}
render();
