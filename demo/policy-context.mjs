// Citation IDs and applicability remain tied to the canonical fictional catalogue.
import {scenarios} from './scenarios.mjs';
export function applicablePolicies(catalog,project){
 return catalog.policies.filter(p=>Object.entries(p.scope).every(([key,value])=>key==='all'||project[key]===value));
}
export function policySectionHref(policy){
 const section=policy.citation.match(/§(\d+)\s*\(fictional\)$/)?.[1];
 if(!section||policy.citation!==`${policy.id}${policy.id==='HER-COMM'?' agreement':''} §${section} (fictional)`)throw Error(`Unmapped fictional citation: ${policy.citation}`);
 return `policy-documents.html#${policy.id}-s${section}`;
}
const summaries={
 'MI-DOC':'Keep the original and explain each change. A colleague needs to be able to follow how you made the new copy.',
 'MI-PRES':'Ask the archive before sending files. Its curator needs the file list, space required and any limits on use to decide whether it can care for them.',
 'MI-PRIV':'Explain who wants to use the material and why. The privacy reviewer needs that purpose and the actual agreements to check the risks to people.',
 'ASTRO-FITS':'Keep the image-processing instructions with the sky images. Otherwise another scientist cannot explain or repeat the correction.',
 'SOC-DDI':'Keep a guide to the codes with the interview table. A number in a table is useful only if a reader knows what it means.',
 'GEN-USE':'Wait until the person responsible for consent checks the proposed genetic study. Protected storage cannot answer what participants agreed to.',
 'HER-COMM':'Ask the appointed community body about the title and requests for recordings separately. A public title can reveal something even when the audio is private.',
 'BIO-DWC':'Ask an independent ecology specialist to check the map and caption. Larger map areas may still give away a rare site.',
 'NEU-BIDS':'Have people inspect the scans and their companion information. Removing faces by software can miss identifying details.',
 'FUN-OPEN':'Share useful work when the necessary people agree it is safe and permitted. A funder preference for openness does not outweigh promises or risks.'
};
export function policyLink(policy){
 const link=document.createElement('a');link.href=policySectionHref(policy);link.target='_blank';link.rel='noopener';link.textContent=policy.citation;link.setAttribute('aria-label',`${policy.citation}, opens a separate tab; the exercise stays in place`);return link;
}
const text=(tag,value)=>{const el=document.createElement(tag);el.textContent=value;return el;};
export function renderPolicyContext(root,catalog,id){
 const project=catalog.projects.find(p=>p.id===id);
 if(!project)throw Error('Unknown fictional project');
 const c=scenarios[id];root.replaceChildren();
 const back=()=>{const a=text('a','Back to the current answer choices');a.href='#action';root.append(a);};back();
 root.append(text('h3','Why Meridian works this way'),text('p',c.why));
 root.append(text('p','Meridian keeps the original files and asks another person to check the account of a change. The researcher knows the work best, but a colleague can notice a missing explanation. Keeping old notes also helps people understand a later correction.'));
 root.append(text('h3','Who needs your work'));
 const people=text('ul','');root.append(people);
 const researcher=catalog.people.find(p=>p.id===project.pi),steward=catalog.people.find(p=>p.id===project.steward);
 const responsibilities=[
 `${researcher.name}, researcher: proposes the change and explains what the team wants to do next. Give the next person the method note and the question you need answered.`,
 `${steward.name}, data steward: helps organise and check the material. They ask how the new copy was made and send the note back if a colleague could not follow it.`,
 'Sam Neri, privacy reviewer: checks the proposed use against promises to participants and possible harm. For a sensitive location, Sam asks for an ecology specialist rather than deciding alone.',
 'Jo Ellis, archive curator: checks the file list, available space and conditions for looking after the files. An incomplete list may come back to the researcher.'
 ];
 if(project.community_governed)responsibilities.push('The community-appointed review circle decides whether people may find the collection and whether requests for recordings may be considered. The institute prepares the questions, but does not answer for the community.');
 responsibilities.forEach(item=>people.append(text('li',item)));
 root.append(text('p',c.handoffLesson));
 root.append(text('h3','What to prepare, and why'));
 const list=text('ul','');root.append(list);
 for(const policy of applicablePolicies(catalog,project)){
  const item=text('li',summaries[policy.id]+' ');item.append(policyLink(policy));list.append(item);
 }
 const repo=catalog.repositories.find(r=>r.name===c.candidate);
 root.append(text('h3','Asking an archive to look after the work'));
 root.append(text('p',`${repo.name} is a possible place to ask. Its advertised file types and space help you make a shortlist. The curator still needs to check the real files and terms before agreeing to take them. Deciding whether an archive fits, whether it accepts the work and who may use it are separate steps.`));
 const repositoryLink=text('a','Read about the four possible archives');repositoryLink.href='policy-documents.html#repositories-title';repositoryLink.target='_blank';repositoryLink.rel='noopener';repositoryLink.setAttribute('aria-label','Read about the four possible archives, opens a separate tab');root.append(repositoryLink);
 root.append(text('h3','What we have shortened for this lesson'));
 root.append(text('p','We use a short set of fictional rules and one question per reviewer so you can follow the handoffs. You can practise one return for each reviewer. In real work, people may go back and forth several times, talk to participants, inspect files and read the full agreements. Only the sky survey continues to an archive conversation here; the other cases still have that work ahead.'));
 root.append(text('p','These rules are not legal advice. Real decisions depend on current law, consent records, community agreements, ethics decisions and archive terms. Those documents and the responsible people remain outside this exercise. The genetics and rare-site cases stop until the named outside decision is made.'));
 back();
 const details=document.createElement('details');details.append(text('summary','Source catalogue and exercise facts'));
 details.append(text('p',`Project ${project.id}: ${project.size_gib} GiB, a file-size unit. Classification: ${project.classification}. These are supplied example facts, not inspected files.`));
 const link=text('a','Read the fictional institution catalogue');link.href='meridian-institute.json';link.target='_blank';link.rel='noopener';link.setAttribute('aria-label','Read the fictional institution catalogue, opens a separate tab');details.append(link);root.append(details);
}
