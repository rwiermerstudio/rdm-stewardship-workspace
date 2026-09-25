import {fresh,transition,view,scenarios,roles} from './model.mjs';
let state=fresh(), role='researcher';
const $=id=>document.getElementById(id);
const text=(id,value)=>$(id).textContent=value;
const add=(parent,tag,content,cls)=>{const el=document.createElement(tag);el.textContent=content;if(cls)el.className=cls;parent.append(el);return el;};
const storyKeys=Object.keys(scenarios);
for(const [i,key] of storyKeys.entries()) {const b=add($('stories'),'button',`${String(i+1).padStart(2,'0')}   ${scenarios[key].title}`,'story');b.type='button';b.dataset.story=key;b.addEventListener('click',()=>{state=fresh(key);role='researcher';$('role').value=role;render();});}
for(const [key,name] of Object.entries(roles)){const o=document.createElement('option');o.value=key;o.textContent=name;$('role').append(o);}
$('role').addEventListener('change',e=>{role=e.target.value;render();});
$('reset').addEventListener('click',()=>{state=fresh(state.scenario);role='researcher';$('role').value=role;render();$('status').focus();});
$('status').tabIndex=-1;
function field(label,name,placeholder,value='',kind='input') {const id=`field-${name}`;const control=kind==='textarea'?`<textarea id="${id}" name="${name}" maxlength="180" required placeholder="${placeholder}"></textarea>`:`<input id="${id}" name="${name}" maxlength="180" required placeholder="${placeholder}" value="${value}">`;return `<label for="${id}">${label}</label>${control}`;}
function form(markup,button,handler){$('form-area').innerHTML=`<form id="desk-form">${markup}<button class="primary" type="submit">${button} <span aria-hidden="true">↗</span></button><p id="error" class="error" role="alert"></p></form>`;$('desk-form').addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));try{state=transition(state,{role,...handler(data)});render();$('status').focus();}catch(err){text('error',err.message);}});}
function render(){const cfg=scenarios[state.scenario],v=view(state,role),pending=state.required.filter(r=>state.decisions[r]?.decision!=='accept');
 for(const b of document.querySelectorAll('.story')){b.classList.toggle('selected',b.dataset.story===state.scenario);b.setAttribute('aria-current',b.dataset.story===state.scenario?'true':'false');}
 text('scenario-number',String(storyKeys.indexOf(state.scenario)+1).padStart(2,'0'));text('story-title',cfg.title);text('story-subtitle',cfg.subtitle);text('role-badge',roles[role]);text('question',cfg.question);
 text('status',!state.description?'NOT STARTED':state.receipt?.decision==='accept'?'SIMULATED HANDOFF':state.receipt?.decision==='reject'?'HANDOFF RETURNED':pending.length?'REVIEW IN PROGRESS':'AWAITING CURATOR');
 for(const [i,active] of [!!state.description,pending.length===0,!!state.receipt].entries()) $('stage-'+(i+1)).classList.toggle('complete',active);
 for(const [id,items] of Object.entries(v)){const list=$(id);list.replaceChildren();for(const item of items)add(list,'li',item);if(!items.length)add(list,'li','Nothing assigned at this step.','muted');}
 const area=$('form-area');area.replaceChildren();$('context').replaceChildren();
 if(!state.description && role==='researcher') {text('summary','Start with a small description of versions and evidence—not the contents of a recording.');form(`<p class="hint">Use invented references only. Keep any actual participant or sensitive location out of this browser.</p>${field('What changed?','change','e.g. Corrected an invented transcript version','','textarea')}${field('Starting version ID','input','e.g. oral-source-v1',cfg.defaultInput)}${field('Resulting version ID','output','e.g. oral-redacted-v2',cfg.defaultOutput)}${field('Safe evidence reference','evidence','e.g. restricted-log-ref-1')}`,'Record fictional change',d=>({type:'describe',...d}));}
 else if(!state.description) text('summary',`${roles[role]} has nothing to review yet. Switch to Researcher to begin.`);
 else {
  text('summary',role==='researcher'?'Your change record is in place. Decisions below are fictional and never authorise sharing.':role==='curator'?'A candidate repository is not a deposit. Check a simulated manifest, fixity reference and rights/access statement.':'Your determination is scoped to this story; record a reason, not private subject material.');
  if(role==='researcher'){
   const desc=add($('context'),'div','CHANGE RECORD · FOR THIS EXERCISE','context-label');
   add($('context'),'p',`${state.description.change} · ${state.description.input} → ${state.description.output}`);
   add($('context'),'p',`Evidence pointer: ${state.description.evidence}`);
   if(state.plan)add($('context'),'p',`Revised plan: ${state.plan}`);
   for(const r of state.required){const d=state.decisions[r];if(d)add($('context'),'p',`${roles[r]} — ${d.decision}: ${d.reason}${r==='community'?` · Metadata: ${d.metadata}; data access: ${d.access}`:''}`);}
   if(state.receipt)add($('context'),'p',`Curator ${state.receipt.decision} (${state.receipt.id}): ${state.receipt.reason}. This receipt is simulated.`);
   if(state.required.some(r=>state.decisions[r] && state.decisions[r].decision!=='accept'))form(`${field('Your revised plan (invented, no subject content)','plan','e.g. Narrow use; leave metadata private','','textarea')}`,'Return revised plan',d=>({type:'revise',...d}));
  }else if(state.required.includes(role)&&pending.includes(role)&&!state.decisions[role]){
   add($('context'),'p',`Question: ${role==='community'?'Should metadata stay private, separately from whether the data may be requested?':role==='privacy'?'Is the proposed use limited to an appropriate review route?':'Can the input, output and evidence reference explain this change?'}`);
   add($('context'),'p',`Safe reference: ${state.description.evidence} · Fictional rule: ${role==='community'?'HER-COMM §1':role==='privacy'?'MI-PRIV §3':'MI-DOC §2'}.`);
   form(`<label for="field-decision">Your fictional determination</label><select id="field-decision" name="decision"><option value="needs-info">Needs more information</option><option value="reject">Reject this plan</option><option value="accept">Accept this scoped plan (simulation)</option></select>${role==='community'?'<div class="two-fields"><div><label for="field-metadata">Metadata visibility</label><select id="field-metadata" name="metadata"><option value="private">Keep private</option><option value="reviewed">Request separate visibility review</option></select></div><div><label for="field-access">Data access route</label><select id="field-access" name="access"><option value="none">No access route yet</option><option value="mediated">Mediated requests only</option></select></div></div><p class="hint">A metadata choice is not a data access grant. Public metadata cannot be enabled here.</p>':''}${field('Reason (no private notes)','reason','e.g. Intended use is still too broad','','textarea')}`,'Record determination',d=>({type:'determine',...d}));
  }else if(role==='curator'&&!pending.length){add($('context'),'p',`Candidate: ${cfg.repository}. The exercise has no files, checksum or real reservation; assess invented references only.`);form(`<label for="field-decision">Simulated receipt</label><select id="field-decision" name="decision"><option value="reject">Reject handoff</option><option value="accept">Accept simulated handoff</option></select>${field('Reason: manifest, fixity and rights check','reason','e.g. Invented checksum reference missing','','textarea')}`,'Record simulated receipt',d=>({type:'receipt',...d}));}
  else add($('context'),'p','This role cannot take over another role’s question. Switch roles to continue.');
 }
 const list=$('events');list.replaceChildren();if(!state.events.length)add(list,'li','No events yet. Describe a fictional change to begin.','empty');
 for(const e of state.events){const li=document.createElement('li');add(li,'span',String(e.step).padStart(2,'0'),'event-no');const body=add(li,'div','');add(body,'strong',`${roles[e.role]} · ${e.action}`);add(body,'p',e.detail);list.append(li);}text('event-count',`${state.events.length} ${state.events.length===1?'EVENT':'EVENTS'}`);
}
render();
