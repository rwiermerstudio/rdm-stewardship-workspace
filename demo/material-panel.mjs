import {materialCatalog,loadMaterials,inspectMaterials} from './materials.mjs';
import {buildHandover,tarArchive} from './handover.mjs';
const el=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
const p=(root,text)=>root.append(el('p',text));
export function createMaterialPanel(root,getState,onAnswer){
 const cache=new Map();let checked=false,shownId='';
 const fileRoot=root.querySelector('#material-files'),answerRoot=root.querySelector('#material-question');
 function render(){
  const state=getState(),id=state.id,c=materialCatalog[id];
  if(shownId!==id){shownId=id;root.open=false;checked=false;}
  const entry=cache.get(id);
  if(!entry){
   cache.set(id,{loading:true});fileRoot.replaceChildren(el('p','Loading the small fictional files…'));
   loadMaterials(id).then(files=>cache.set(id,{files})).catch(error=>cache.set(id,{error:error.message})).finally(()=>{if(getState().id===id)render();});
  }
  const openFiles=new Set([...fileRoot.querySelectorAll('details[open]')].map(d=>d.dataset.path));
  fileRoot.replaceChildren();answerRoot.replaceChildren();
  root.querySelector('#material-check-results').replaceChildren();
  const feedback=root.querySelector('#material-feedback');feedback.textContent=state.materialFeedback||'Read a file, then choose what you would tell the next person.';
  if(!entry||entry.loading){p(fileRoot,'Loading the small fictional files…');return;}
  if(entry.error){
   p(fileRoot,`Materials unavailable: ${entry.error}. Your role choices are unchanged. Retry before inspecting or exporting.`);
   const retry=el('button','Retry loading materials');retry.type='button';retry.onclick=()=>{cache.delete(id);render();};fileRoot.append(retry);return;
  }
  for(const file of c.files){
   const details=el('details');details.dataset.path=file.path;details.open=openFiles.has(file.path);
   details.append(el('summary',file.path));p(details,file.description);
   const text=entry.files[file.path];
   if(file.path.endsWith('.csv')){
    const table=el('table'),caption=el('caption',file.description);table.append(caption);
    text.trim().split(/\r?\n/).forEach((line,i)=>{const row=el('tr');for(const value of line.split(',')){const cell=el(i===0?'th':'td',value);if(i===0)cell.scope='col';row.append(cell);}table.append(row);});
    const scroller=el('div');scroller.className='material-table';scroller.tabIndex=0;scroller.setAttribute('role','region');scroller.setAttribute('aria-label',`${file.path} table, scroll horizontally if needed`);scroller.append(table);details.append(scroller);
   }else if(file.path.endsWith('.json')){
    const values=el('dl');values.className='record';for(const [key,value] of Object.entries(JSON.parse(text))){values.append(el('dt',key),el('dd',value===null?'Not recorded':typeof value==='object'?JSON.stringify(value):String(value)));}details.append(values);
   }else p(details,text);
   const raw=el('details');raw.append(el('summary','Exact file text'),el('pre',text));details.append(raw);
   const link=el('a','Open this exercise file in a new tab');link.href=`materials/${id}/${file.path}`;link.target='_blank';link.rel='noopener';details.append(link);fileRoot.append(details);
  }
  const group=el('fieldset');group.id='material-answer';group.className='answer-cards';group.append(el('legend',c.question.prompt));
  // Alternate the location of the sound answer across subjects.
  const options=Object.keys(materialCatalog).indexOf(id)%2?[...c.question.options].reverse():c.question.options;
  for(const option of options){const label=el('label');label.className='answer-card';const input=el('input');input.type='radio';input.name='material-answer';input.value=option.id;input.checked=state.materialAnswer?.answer===option.id;label.append(input,el('span',option.label));group.append(label);}
  const submit=el('button','Record my observation');submit.type='button';submit.disabled=!group.querySelector('input:checked');group.onchange=()=>submit.disabled=false;
  submit.onclick=()=>onAnswer(group.querySelector('input:checked').value);answerRoot.append(group,submit);
  const run=el('button','Run the text checks');run.type='button';run.onclick=()=>{checked=true;showChecks();};answerRoot.append(run);
  function showChecks(){const output=root.querySelector('#material-check-results');output.replaceChildren();for(const check of inspectMaterials(id,entry.files)){p(output,`${check.passed?'Selected check passed':'Defect found'}: ${check.detail} Files: ${check.materials.join(', ')}. Reference: ${check.id}.`);}p(output,'These checks read only the supplied synthetic text. They cannot verify claims about unseen files, agreement interpretation, permissions or archive acceptance.');}
  if(checked)showChecks();
 }
 return {render,reset(){checked=false;shownId='';root.open=false;render();},async download(){
  const state=structuredClone(getState()),entry=cache.get(state.id);
  if(!entry?.files)throw Error('Load the exercise materials before downloading.');
  const entries=await buildHandover(state,entry.files),blob=new Blob([tarArchive(entries)],{type:'application/x-tar'}),url=URL.createObjectURL(blob),link=el('a');
  link.href=url;link.download=`meridian-${state.id}-handover.tar`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }};
}
