// The overview reads the same fictional catalogue used by the Python evaluator.
import {scenarios} from './scenarios.mjs';
export function applicablePolicies(catalog,project){
 return catalog.policies.filter(p=>Object.entries(p.scope).every(([key,value])=>key==='all'||project[key]===value));
}
export function policySectionHref(policy){
 const section=policy.citation.match(/§(\d+)\s*\(fictional\)$/)?.[1];
 if(!section||policy.citation!==`${policy.id}${policy.id==='HER-COMM'?' agreement':''} §${section} (fictional)`)throw Error(`Unmapped fictional citation: ${policy.citation}`);
 return `policy-documents.html#${policy.id}-s${section}`;
}
export function policyLink(policy){
 const link=document.createElement('a');link.href=policySectionHref(policy);link.textContent=policy.citation;return link;
}
const text=(tag,value)=>{const el=document.createElement(tag);el.textContent=value;return el;};
export function renderPolicyContext(root,catalog,id){
 const project=catalog.projects.find(p=>p.id===id);
 if(!project)throw Error('Unknown fictional project');
 root.replaceChildren();
 root.append(text('p',`For ${project.title}: ${project.discipline}; ${project.classification} material, ${project.size_gib} GiB in the fictional project record. These are stated exercise facts, not checked files.`));
 root.append(text('p','The assignments below come from the fictional project and people entries. The action descriptions explain this practice route; they do not appoint anyone in a real institution.'));
 const roles=text('h3','Who is responsible');root.append(roles);
 const people=text('ul','');root.append(people);
 const researcher=catalog.people.find(p=>p.id===project.pi),steward=catalog.people.find(p=>p.id===project.steward);
 const responsibilities=[
  `${researcher.name}, researcher: proposes the change and records the method and intended use. Project record: ${project.id} (fictional).`,
  `${steward.name}, data steward: questions the source-to-derivative link and missing documentation. Project record: ${project.id}; MI-DOC §2 (fictional).`,
  'Sam Neri, privacy reviewer: asks about confidential or human data and intended use; classification is not a lawful basis. MI-PRIV §3 (fictional), where restricted.',
  'Jo Ellis, repository curator: checks a proposed format inventory, capacity, rights and file integrity before any real acceptance. MI-PRES §4 (fictional).'
 ];
 if(project.community_governed)responsibilities.push('Community-appointed review circle: decides use and even discoverability; a private title and recording requests are separate questions. HER-COMM agreement §2 (fictional).');
 for(const item of responsibilities)people.append(text('li',item));
 root.append(text('h3','Everyday expectations in the catalogue'));
 const practices=text('ul','');root.append(practices);
 for(const practice of catalog.practices)practices.append(text('li',`${practice.description} Practice record: ${practice.id} (fictional).`));
 root.append(text('h3','What the documents ask for in this case'));
 const list=text('ul','');root.append(list);
 for(const policy of applicablePolicies(catalog,project)){
  const item=document.createElement('li');
  const effect=policy.effect==='document'?`Document ${policy.artifact}.`:policy.effect==='review'?`Ask ${policy.owner} for review: ${policy.reason}.`:`Preference: ${policy.artifact}; this is not an access grant.`;
  item.append(document.createTextNode(`${effect} `),policyLink(policy),document.createTextNode(` · version ${policy.version} (${policy.authority}, fictional).`));
  list.append(item);
 }
 const repo=catalog.repositories.find(r=>r.name===scenarios[id].candidate);
 root.append(text('p',`Proposed storage: ${repo.name}, ${repo.status}. Listed format, residency and size limits are screening criteria, not custody, suitability, or acceptance. Repository entry: ${repo.id} in the fictional catalogue.`));
 const repositoryLink=document.createElement('a');repositoryLink.href='policy-documents.html#repositories-title';repositoryLink.textContent='Read candidate repository capabilities and their limits';root.append(repositoryLink);
 root.append(text('h3','Where these rules stop'));
 root.append(text('p','These fictional documents are complete only for this short exercise, not legal advice or evidence of consent, permission, rights, data inspection or repository acceptance. They omit real law, agreements, ethics decisions and repository terms. Real institutions need current governing documents and authorized people to decide access. A proposed metadata title can disclose information even when files stay closed. Consent owners decide reuse, the community-appointed circle decides community discoverability and use, and an independent ecology authority decides location risk outside this exercise. A reviewer response here cannot clear an external hold.'));
 const link=document.createElement('a');link.href='meridian-institute.json';link.textContent='Read the fictional institution catalogue (policies, people, projects and repositories)';root.append(link);
}
