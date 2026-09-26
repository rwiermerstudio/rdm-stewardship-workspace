// All projects, people, files and services here are invented teaching examples.
const make=(id,title,discipline,group,person,arrival,files,from,to,question,choices,reviewers,candidate,checklist,hold='',sample='')=>({id,title,discipline,group,person,arrival,files,from,to,question,choices,reviewers,candidate,checklist,hold,sample});
export const scenarios={
 'oral-heritage':make('oral-heritage','Oral histories','History','Living Heritage Collective','Dr Tova Mer','Today your group corrected transcripts and wants to describe the collection. The recordings came with limited consent and community rules. Even a catalogue title might reveal something the community wants kept private.','Hundreds of gigabytes of voice recordings, transcript text and scanned images. Invented file names: clip-EXAMPLE.wav, transcript-EXAMPLE.txt, image-EXAMPLE.tiff. The example shows file names only.','recordings-v1','curated-collection-v2','Who should decide whether anyone can find the description?',[
 {id:'publish',label:'Put up a public catalogue title now',cue:'A title might seem harmless.',feedback:'A catalogue title can reveal a person, place or tradition even when recordings stay closed. Take the title back for community review first.',good:false},
 {id:'private',label:'Keep the description private without asking the community',cue:'No one could find it.',feedback:'Keeping it private for now is safe, but the community should decide whether people can find it in future. Ask its appointed reviewer rather than deciding for them.',good:false},
 {id:'ask',label:'Keep it private and ask the appointed reviewers',cue:'Description and file requests are separate questions.',feedback:'Keep the description private until the steward checks the correction, the privacy office reads the consent terms and the community-appointed body decides discovery. A decision about the title leaves the recording request as a separate question.',good:true}],['steward','privacy','community'],'Meridian Community-Governed Collection','List the invented files; request a check that copies stay unchanged; keep the description private; ask separately who may request recordings.','','transcript_id,language,consent_status (invented column names only)'),
 'stellar-survey':make('stellar-survey','Sky survey','Astronomy','Sky Survey Lab','Dr Ada Rell','The lab corrected a sky mosaic today. Another scientist wants the corrected images, but the processing run has not been linked to them. The collection is too large to assume an archive can take it.','A very large sky-image collection in astronomy image and formats that split large images into smaller pieces. Invented files: tile-EXAMPLE.fits, tile-EXAMPLE.zarr and pipeline-run-EXAMPLE.txt. No image pixels appear here.','sky-raw-v1','sky-calibrated-v2','What would let someone understand and store this correction?',[
 {id:'copy',label:'Send the corrected images alone',cue:'The pictures look ready.',feedback:'Without the processing run and calibration inputs, a colleague cannot explain the correction. Record the run and ask about available archive space.',good:false},
 {id:'run',label:'Include the processing note and ask whether the archive has space',cue:'The copy and its origin travel together.',feedback:'That connects old and new images to the method. The steward still checks the link and a curator must check space and whether copies are unchanged.',good:true},
 {id:'wait',label:'Wait until every image has been checked',cue:'Checking files matters.',feedback:'Checks matter, but waiting does not record which run made the new images. Link the run first and arrange the checks.',good:false}],['steward'],'Meridian Large-Object Archive','List astronomy images and large images split into smaller pieces; check processing history, whether copies are unchanged and capacity.','','Astronomy image header sketch: SIMPLE = T; pixels omitted'),
 'neighbourhood-voices':make('neighbourhood-voices','Neighbourhood interviews','Social science','Urban Lives Group','Dr Malik Osei','Your team coded interviews about neighbourhood change today. The coded table sits beside voice recordings and a guide that explains each code. Interviewees agreed only to limited uses, so a coded row is not automatically safe to publish.','Dozens of gigabytes of recordings, text and coded tables. Invented files: audio-EXAMPLE.wav, guide-EXAMPLE.csv and memo-EXAMPLE.txt. No names or quotes appear here.','interviews-v1','coded-interviews-v2','Does coding the interviews make the result public?',[
 {id:'post',label:'Publish the coded table',cue:'It has no direct names.',feedback:'Codes can still point to someone, and limited consent does not become open consent when you code a table. Ask the privacy reviewer about this use.',good:false},
 {id:'delete',label:'Discard the guide to the codes',cue:'Fewer files might feel safer.',feedback:'Without the guide to the codes, others cannot understand what the codes mean. Keep it restricted and ask which use consent covers.',good:false},
 {id:'scope',label:'Keep the table private and check the agreed use',cue:'The agreed purpose matters.',feedback:'That protects both the recordings and the coded table while a privacy reviewer can examine the limited consent. A private description is separate from file access.',good:true}],['steward','privacy'],'Meridian Secure Data Vault','List recordings, coded tables and the guide to their codes; ask about the agreed use; keep descriptions private; check whether copies are unchanged.','','recording_id,codebook_version,consent_scope (invented column names only)'),
 'coastal-species':make('coastal-species','Coastal species','Ecology','Coastal Ecology Unit','Dr Paz Linn','The team replaced exact rare-species sites with larger map areas today. A published map could still reveal sites when combined with other information. No outside location-risk assessment has happened.','Hundreds of gigabytes of restricted tables and map images. Invented files: restricted-EXAMPLE.csv, area-EXAMPLE.csv and preview-EXAMPLE.tiff. No coordinates or sightings appear here.','observations-v1','generalised-coordinates-v2','Is a map with larger areas safe to share?',[
 {id:'map',label:'Publish the map with larger areas now',cue:'The exact points are gone.',feedback:'A map area or caption can still narrow down a rare site. An outside location-risk assessment must happen before release.',good:false},
 {id:'source',label:'Send restricted sites to a research partner for a check',cue:'Others could check the work.',feedback:'Exact sites create more risk. Keep the source restricted and ask an independent specialist to assess the map with larger areas and its description.',good:false},
 {id:'assess',label:'Keep both private and request a location-risk check',cue:'The map and its description both matter.',feedback:'The steward can document the map-area method, but only an outside location-risk assessment can resolve the release question. This exercise cannot clear that hold.',good:true}],['steward','privacy'],'Meridian General Archive','Keep raw sites apart from the grid; document the method; request an outside location-risk assessment before release.','An independent ecology location-risk specialist has not assessed the map and its description.','species_code,map_area,observation_month (invented column names only)'),
 'variant-study':make('variant-study','Variant study','Genomics','Human Variation Group','Dr Elin Roe','The group wants to reprocess a very large sequence collection today. A secure vault might hold the files, but the team does not yet know what participants agreed to. Enough storage space does not mean the team may start a new study.','Tens of thousands of gigabytes of sequence reads and files listing genetic differences. Invented files: reads-EXAMPLE.fastq, variants-EXAMPLE.vcf and run-EXAMPLE.txt. No genotypes or participant IDs appear here.','sequence-v1','variant-calls-v2','Does a suitable vault allow reprocessing or sharing?',[
 {id:'vault',label:'Use the secure vault and proceed',cue:'The files would stay protected.',feedback:'The vault may fit the files, but it cannot supply missing consent or an approved purpose. Pause reuse and refer the question to the responsible authority.',good:false},
 {id:'public',label:'Share only the genetic-difference list with collaborators',cue:'The raw reads would stay closed.',feedback:'Files listing genetic differences can still be sensitive. Unknown consent blocks this reuse question regardless of which files you release.',good:false},
 {id:'refer',label:'Pause and refer the consent question',cue:'The missing answer is about authority, not storage.',feedback:'Record the proposed method safely, but stop reuse and release until the responsible consent authority resolves the purpose. No click here clears that hold.',good:true}],['steward','privacy'],'Meridian Secure Data Vault','List sequence and variant file types; document the run; refer unknown consent and purpose outside this exercise.','We do not yet know whether participants agreed to this study. Ask the project consent owner and a privacy specialist.','Genetic-difference file header only; no participant rows'),
 'brain-maps':make('brain-maps','Brain images','Neuroimaging','Neural Imaging Group','Dr Ria Chen','The imaging group removed facial structure from brain scans today. Small companion files describing the scans remain with each image. A person still needs to check the images and companion fields for identifying details.','Thousands of gigabytes of brain scans and small structured companion files. Invented files: scan-EXAMPLE.nii and scan-EXAMPLE.json. No image pixels or person details appear here.','mri-session-v1','defaced-mri-v2','Does removing facial structure finish the safety check?',[
 {id:'done',label:'Send the images to the vault now',cue:'The face is no longer visible.',feedback:'A processing run can miss a face, and companion fields may still identify someone. Ask people to check both before handoff.',good:false},
 {id:'sidecar',label:'Delete every companion file',cue:'Removing fields might avoid disclosure.',feedback:'Some fields explain how to use the scans. Review and remove unsafe fields instead of deleting all method information.',good:false},
 {id:'check',label:'Check images and companion files with reviewers',cue:'A tool result needs a human quality check.',feedback:'The steward would check the run and companion-file list. The privacy reviewer would check remaining identifying details and intended use. A record that participants gave consent does not finish either check.',good:true}],['steward','privacy'],'Meridian Secure Data Vault','List scans and companion files; request a human quality check and a privacy review; check whether copies are unchanged.','','Structured companion-file sketch: {"DefacingRun":"unverified"}; no person fields')
};
const questions={
 'oral-heritage':{steward:'Does the corrected transcript point back to the recording and the correction method?',privacy:'Does limited consent cover the proposed description and the use of recordings?',community:'Can a title be found at all, and who may ask for recordings? Keep those decisions separate.'},
 'stellar-survey':{steward:'Which processing instructions and calibration inputs used to correct the measurements produced these images, and can a colleague trace them?'},
 'neighbourhood-voices':{steward:'Does the guide to the codes explain how the new table was coded from the interviews?',privacy:'Does limited consent cover this coded table and this intended research use?'},
 'coastal-species':{steward:'Can the map-area method be traced without exposing the exact sites?',privacy:'Has an outside specialist assessed whether the map or its description reveals a rare site?'},
 'variant-study':{steward:'Which version of the analysis software would make the proposed genetic-difference list from these reads?',privacy:'Who outside this exercise can establish consent and an approved purpose before reuse?'},
 'brain-maps':{steward:'Which face-removal software run made these images, and which companion files belong with them?',privacy:'Did a person check the images and companion fields for remaining identifiers and intended use?'}
};
for(const [id,reviewQuestions] of Object.entries(questions))scenarios[id].reviewQuestions=reviewQuestions;
export const roles={researcher:'Researcher',steward:'Data steward',privacy:'Privacy reviewer',community:'Community-appointed reviewer',curator:'Archive curator'};

// These are bounded training responses, not evidence of an actual inspection.
const humanProcess={
 "oral-heritage": {
  "why": "Meridian lets the appointed community body decide whether people may find this collection. The institute may hold the recordings, but it should not speak for the community. It keeps the title private while asking because even a title can reveal a tradition. The privacy office separately checks promises to the people recorded.",
  "handoffLesson": "The researcher sends the corrected transcript and the correction note to the steward. The privacy reviewer needs the intended use and consent terms; the community body needs separate questions about the title and recording requests. An unclear correction or missing agreement brings the work back. Real decisions happen with those people outside this page."
 },
 "stellar-survey": {
  "why": "Meridian keeps the image-processing instructions with the corrected sky images so another scientist can explain or repeat the work. It asks the archive about space before sending a very large collection. This case goes on to an archive conversation so you can practise a returned file list as well as a returned method note.",
  "handoffLesson": "The researcher gives the steward the original and corrected image names, processing record and calibration inputs used to correct the measurements. The curator then needs the file list and expected size. Either person may return missing information. Outside this page, they inspect the files, check that copies are unchanged and agree the transfer."
 },
 "neighbourhood-voices": {
  "why": "Meridian keeps the guide to the interview codes with the table because a colleague needs to know what each category means. It does not treat removed names as permission to publish: combinations of details can still identify people, and participants agreed only to limited uses.",
  "handoffLesson": "The researcher sends the table and its guide to the steward, then asks the consent owner and privacy reviewer about a specific proposed use. A missing guide or a vague purpose may bring the request back. The responsible people must read the signed agreements before the table leaves the team."
 },
 "coastal-species": {
  "why": "Meridian asks an independent ecology specialist to assess the map and its caption. Larger map areas can still point to a rare site when combined with local knowledge. The exercise stops at this outside review rather than letting the team that made the map decide its own release question.",
  "handoffLesson": "The researcher explains the larger map areas to the steward without exposing exact sites. The privacy reviewer asks for the independent ecology assessment. A missing method note can come back for correction, but a better note cannot replace the specialist checking the actual map and caption outside this page."
 },
 "variant-study": {
  "why": "Meridian waits for a consent decision before anyone starts this new genetic analysis. The secure vault may protect the files, but it cannot tell the team what participants agreed to. This case deliberately ends with a pause so you can practise preparing a clear question rather than assuming every process ends in a transfer.",
  "handoffLesson": "The researcher gives the steward a proposed analysis method while the work stays paused. The consent owner and privacy specialist need the purpose of the new study and the actual consent records. They may ask for a clearer purpose. Only their decision outside this exercise can settle whether the analysis may begin."
 },
 "brain-maps": {
  "why": "Meridian asks people to inspect both the scans and the small files describing them. Software that removes faces may miss details, while deleting all companion information would make the scans harder to use. The policy keeps useful context and asks a trained person to check what could identify someone.",
  "handoffLesson": "The researcher gives the steward the processing record and the list of scans and companion files. A trained image reviewer checks the scans, and the privacy office checks the companion information and intended use. Missing records can come back to the researcher. Those people must inspect the real material before any transfer."
 }
};
const lessons={
 'oral-heritage':{card:'History · Dr Tova Mer, researcher. Corrected oral-history transcripts; decide whether the collection can be found.',risk:['A public title is now in the draft catalogue; it may expose a person or tradition.','The draft keeps the title private permanently without asking the community.'],steward:['The note connects the corrected transcript to its recording. I still need to compare it with the recording and correction log.','I need the correction log before I can check how this copy was made.'],privacy:['Limited consent is not evidence for this proposed use; the consent owner still needs to read the agreement.','I need the signed agreement and a description of the planned study.'],community:['Keep the title private; the appointed community body must decide separately whether people may see the title and whether they may request recordings.','I need the appointed community body to decide both questions.'],external:'The appointed community body must decide whether the title may be seen and who may request recordings. The privacy office must read the actual consent terms.'},
 'stellar-survey':{card:'Astronomy · Dr Ada Rell, researcher. Corrected sky images; decide what a colleague needs to reproduce them.',risk:['The draft package now omits the processing run, so the correction cannot be traced.','The draft postpones the run link, so the images remain unexplained.'],steward:['The note explains which instructions go with the images. I still need to compare it with the calibration inputs and actual processing record.','I need the calibration inputs and actual processing record.'],external:'The archive curator must confirm there is enough space, check the real file list and check that copies are unchanged.'},
 'neighbourhood-voices':{card:'Social science · Dr Malik Osei, researcher. Coded interviews; decide if a coded table can leave the team.',risk:['The draft marks the coded table public despite limited consent; coded rows may identify people.','The draft removes the guide to the codes, so readers cannot interpret the coded table.'],steward:['The guide explains the table categories. I still need to compare the coding with the original interviews.','I need the right version of the guide and the original interview reference.'],privacy:['Keep the coded table and voices private; the consent owner must confirm this use against actual agreements.','I need the signed consent terms and proposed use before any decision.'],external:'The project consent owner and privacy office must compare the actual agreements with the intended coded-table use.'},
 'coastal-species':{card:'Ecology · Dr Paz Linn, researcher. Replaced rare-species sites with larger map areas; decide whether the map can be released.',risk:['The draft marks the map with larger areas public; other clues may reveal a rare site.','The draft proposes giving a partner exact rare-species sites before the risk review.'],steward:['The note explains how the larger areas were made. I still need to compare it with the original observations and map-making steps.','I need the note explaining how the team made the map, without exposing exact sites.'],privacy:['A location-risk specialist has not assessed the map and caption; release remains blocked.','I need the outside location-risk assessment of map and description.'],external:'An independent ecology location-risk specialist must assess the actual map and description before release.'},
 'variant-study':{card:'Genomics · Dr Elin Roe, researcher. Plans to reprocess sequences; decide whether the participants agreed to a new analysis.',risk:['The draft begins reuse on the strength of vault capacity alone; consent and purpose are unknown.','The draft proposes sharing results about genetic differences with collaborators while consent is unknown.'],steward:['I can record the proposed analysis method while the study stays paused. The consent owner still needs to decide whether it may begin.','I need the proposed analysis instructions while work remains paused.'],privacy:['We do not yet know whether participants agreed to this study. The project consent owner needs to decide that before analysis begins.','I need the consent owner to compare this study with the participant agreements.'],external:'The project consent owner, who decides what the participant agreements cover, and a privacy specialist must check this study before analysis or sharing begins.'},
 'brain-maps':{card:'Neuroimaging · Dr Ria Chen, researcher. Removed facial structure from scans; decide whether the copies can move.',risk:['The draft treats automated face removal as complete inspection; remaining image details or companion information may identify someone.','The draft deletes companion information needed to interpret scans.'],steward:['The note lists the processing instructions and companion files. I still need the real records and files to check that account.','I need the processing log and actual companion-file list.'],privacy:['A trained image reviewer and privacy office must inspect scans and companion fields.','I need the trained image reviewer and privacy office to inspect the actual scans and companion information.'],external:'A trained image reviewer must inspect actual scans; the privacy office must inspect companion fields and intended use before transfer.'}
};
// Each option states its appeal, price and remaining check before the learner commits.
const tradeoffs={
 'oral-heritage':{
  publish:['People could find the collection now.','The title may reveal a person or tradition.','The community body has not answered, and the consent terms still need checking.'],
  private:['No title becomes public today.','The institute would decide alone whether people may find the collection later.','The appointed community body has not answered.'],
  ask:['The title stays private while the right people answer.','People have to wait to find the collection and recording requests stay closed.','Consent and community decisions remain outside this exercise.']},
 'stellar-survey':{
  copy:['A colleague receives images sooner.','The processing method is lost from the package.','The processing instructions, calibration inputs and available space need checking.'],
  run:['A colleague can trace the proposed correction.','Linking the run and arranging storage takes work.','The processing notes, available space and unchanged copies still need checking.'],
  wait:['No unchecked image moves yet.','Waiting leaves the correction unexplained.','The processing run still needs linking.']},
 'neighbourhood-voices':{
  post:['Colleagues can use the coded table sooner.','Coded rows may identify people or exceed consent.','The agreed use is not established.'],
  delete:['Fewer files appear in the package.','Readers lose the meaning of the codes.','Consent and risk of recognising someone remain open.'],
  scope:['The table and guide remain usable under review.','The proposed research use cannot proceed yet.','The consent owner must read actual agreements.']},
 'coastal-species':{
  map:['A map with larger areas becomes available sooner.','Other clues may still reveal a rare site.','Independent assessment of map and caption is missing.'],
  source:['A partner could check exact locations.','Sharing exact sites could make it easier to disturb rare species.','Nobody has checked whether sending sites to this partner is safe or permitted.'],
  assess:['Restricted sites and the map with larger areas stay private.','Publication waits for outside assessment.','The specialist has not inspected the map or caption.']},
 'variant-study':{
  vault:['Protected storage could hold large files.','Storage does not authorize a new use.','Consent and approved purpose are unknown.'],
  public:['Collaborators receive a smaller changed copy.','Genetic differences can still be sensitive.','Consent and purpose remain unknown.'],
  refer:['The team waits rather than starting a study without permission.','The new analysis waits for the consent decision.','The consent owner has not checked whether the agreement covers this study.']},
 'brain-maps':{
  done:['The processed scans can move sooner.','Remaining facial details or companion fields may identify people.','A person has not yet checked the images and companion information.'],
  sidecar:['Removing identifying details can protect participants.','Deleting every field loses necessary context.','Actual scans and remaining fields need inspection.'],
  check:['Both image and companion-file risks get reviewed.','The handoff waits for human inspection.','Actual images, fields and intended use remain unchecked.']}
};
// Invented snippets show what a researcher might actually write or do, never real authorization.
const examples={
 'oral-heritage':{
  publish:'Example title note: title "EXAMPLE community recording collection"; "Make this title public today, before community review."',
  private:'Example title note: "Keep the EXAMPLE title private permanently; the institute will decide alone whether people can find it."',
  ask:'Example request: "Keep EXAMPLE collection title private. Ask the appointed community body whether people may see the title and whether they may request recordings; ask the privacy office to check consent terms."'},
 'stellar-survey':{
  copy:'Example transfer list: "sky-calibrated-EXAMPLE.fits" only; omit the pipeline-run-EXAMPLE.txt method record.',
  run:'Example method note: "Link sky-raw-v1 to sky-calibrated-v2 using pipeline-run-EXAMPLE.txt; request available archive space and file checks before transfer."',
  wait:'Example lab note: "Hold sky-calibrated-EXAMPLE.fits until every tile is checked; leave pipeline-run-EXAMPLE.txt unlinked for now."'},
 'neighbourhood-voices':{
  post:'Example release note: "Publish coded-table-EXAMPLE.csv for general use" despite the limited interview agreement.',
  delete:'Example file-list instruction: "Delete guide-EXAMPLE.csv and retain coded-table-EXAMPLE.csv without the guide explaining its codes."',
  scope:'Example purpose note: "Keep coded-table-EXAMPLE.csv and guide-EXAMPLE.csv private; ask the consent owner whether secondary analysis of neighbourhood change fits the limited agreement. Wait for that decision before starting the new study."'},
 'coastal-species':{
  map:'Example map draft: "Publish area-EXAMPLE.csv and preview-EXAMPLE.tiff with a public caption" before outside location-risk review.',
  source:'Example partner email draft: "Send restricted-EXAMPLE.csv with exact sites for checking" before approving a safe route.',
  assess:'Example review request: "Keep area-EXAMPLE.csv and its caption private; ask an independent ecology location-risk specialist to assess whether someone could work out the sites without putting exact sites in this exercise."'},
 'variant-study':{
  vault:'Example analysis draft: "Start the analysis of genetic differences using reads-EXAMPLE.fastq in the secure vault" while consent and approved purpose are unknown.',
  public:'Example sharing draft: "Send variants-EXAMPLE.vcf to collaborators" despite unknown consent; no actual genetic data is shown.',
  refer:'Example pause note: "Do not run reads-EXAMPLE.fastq. Refer the purpose of the proposed study of genetic differences to the project consent owner and privacy specialist; wait for their decision."'},
 'brain-maps':{
  done:'Example transfer draft: "Move scan-EXAMPLE.nii and scan-EXAMPLE.json to the vault now" without human inspection.',
  sidecar:'Example file-list draft: "Delete every scan-EXAMPLE.json companion file" rather than inspect fields and retain safe method context.',
  check:'Example check request: "Keep scan-EXAMPLE.nii and scan-EXAMPLE.json restricted; ask a trained image reviewer and privacy office to inspect remaining identifying details and intended use before transfer."'}
};
const blockedCorrections={
 'oral-heritage':{publish:'Before you continue, even the public title may identify a tradition. Keep it private and ask the appointed community body about whether people may find the collection and the privacy office about consent.',private:'Before you continue, the institute cannot decide for the community whether the title should always stay private. Keep it private temporarily and request the appointed body’s decision.'},
 'stellar-survey':{copy:'Before you continue, the images have no traceable correction method. Link the processing run and calibration inputs and ask the curator whether the archive has space.',wait:'Before you continue, waiting for image checks does not identify the run. Record the proposed run link now and arrange the checks.'},
 'neighbourhood-voices':{post:'Before you continue, coding does not establish permission for public use. Keep the table private and ask the consent owner and privacy office to check the stated purpose.',delete:'Before you continue, deleting the guide makes the coded table uninterpretable. Retain the guide privately and ask the consent owner about intended use.'},
 'coastal-species':{map:'Before you continue, map areas and captions may expose rare sites. Keep both private and request an independent location-risk assessment.',source:'Before you continue, sharing exact sites adds risk. Keep restricted source files private and request independent assessment of the proposed map with larger areas.'},
 'variant-study':{vault:'Before you continue, protected storage cannot tell us what participants agreed to. Pause the job and refer consent and purpose to the project consent owner and privacy specialist.',public:'Before you continue, files of genetic differences may still be sensitive and consent is unknown. Pause sharing and refer the intended use to the consent owner.'},
 'brain-maps':{done:'Before you continue, removing faces by software is not a human check of images or companion fields. Request trained image and privacy inspection before transfer.',sidecar:'Before you continue, deleting all companion files loses method context without assessing remaining risk. Retain them restricted and request human inspection.'}
};
const revisionExamples={
 'oral-heritage':{
  steward:'Example method note: "Link transcript-EXAMPLE.txt to clip-EXAMPLE.wav and correction-log-EXAMPLE.txt; inspect the log outside this exercise."',
  privacy:'Example purpose note: "Limit EXAMPLE recordings to the named study team examining this collection. Keep title and audio private; ask the consent owner whether that exact study fits the signed terms."',
  community:'Example request: "Keep EXAMPLE title private. Ask the appointed community body separately whether the title may be found and who may request audio."'},
 'stellar-survey':{steward:'Example method note: "Identify pipeline-run-EXAMPLE.txt and calibration-EXAMPLE.txt as proposed inputs for sky-calibrated-v2; inspect both logs before treating the link as verified."'},
 'neighbourhood-voices':{
  steward:'Example method note: "Keep guide-EXAMPLE.csv with coded-table-EXAMPLE.csv and link both to restricted interviews-v1; verify the real guide version later."',
  privacy:'Example purpose note: "Only the named study team may propose secondary analysis of neighbourhood change using coded-table-EXAMPLE.csv. Keep it private until the consent owner checks that purpose against signed agreements."'},
 'coastal-species':{
  steward:'Example method note: "Describe how restricted-EXAMPLE.csv would become area-EXAMPLE.csv without including any real coordinates or sites."',
  privacy:'Example review request: "Send the private preview-EXAMPLE.tiff and draft caption to an independent location-risk specialist through an approved route; publish neither here."'},
 'variant-study':{
  steward:'Example analysis instructions: "Propose run-EXAMPLE.txt as the method for sequence-v1 to variant-calls-v2, but do not process reads-EXAMPLE.fastq while consent is unknown."',
  privacy:'Example purpose request: "Ask the consent owner if the proposed variant analysis of EXAMPLE sequence collection is within the signed purpose; do not run or share files before that determination."'},
 'brain-maps':{
  steward:'Example file list: "List scan-EXAMPLE.nii with scan-EXAMPLE.json and the proposed defacing-run-EXAMPLE.txt; inspect the actual run and files later."',
  privacy:'Example check request: "Have a trained reviewer inspect scan-EXAMPLE.nii and the privacy office inspect scan-EXAMPLE.json fields and intended use before any transfer."'}
};
for(const [id,options] of Object.entries(tradeoffs))for(const option of scenarios[id].choices){
 const [gain,cost,unknown]=options[option.id];Object.assign(option,{gain,cost,unknown});
 option.example=examples[id][option.id];option.blockedReason=blockedCorrections[id][option.id]||'';
}
const soundConsequences={
 'oral-heritage':'The draft keeps the title private and asks the appointed community body whether people may see the title, separately from requests for recordings. Actual consent terms still need privacy review.',
 'stellar-survey':'Your note connects the corrected images with the processing instructions and asks whether the archive has space. The steward needs the real processing record and calibration inputs. The curator will check that the copies arrive unchanged.',
 'neighbourhood-voices':'The draft keeps voices and coded rows private while the consent owner checks this proposed use. The coding guide still needs to travel with the restricted table.',
 'coastal-species':'The draft keeps both the map and description private and requests an outside location-risk assessment. Larger map areas cannot clear the release hold on their own.',
 'variant-study':'The draft pauses reprocessing despite the candidate vault. The consent owner must establish whether this purpose is allowed before any reuse.',
 'brain-maps':'The draft requests a human check of images and companion fields. Remaining identifying details and the processing run still need inspection before transfer.'
};
const inadequateCorrections={
 'oral-heritage':{steward:['Rename the transcript without finding its correction log','A new name cannot explain which recording and correction made this copy.'],privacy:['Hide the transcript but assume the catalogue title is covered','Closing files does not establish consent for the title or intended use.'],community:['Let the institute choose a generic public title','The institute cannot replace the appointed community body’s decision on discovery.']},
 'stellar-survey':{steward:['Rename the corrected images without linking the run','A new label cannot identify the processing run or calibration inputs.']},
 'neighbourhood-voices':{steward:['Rename the coded table without finding its coding guide','A new table name does not explain its codes or source interviews.'],privacy:['Remove names from the table and assume reuse is allowed','Removing direct names does not establish that this use is covered by consent.']},
 'coastal-species':{steward:['Rename the map without documenting the area method','A new name does not explain how the restricted sites became map areas.'],privacy:['Make the map areas larger and skip outside assessment','Using larger areas alone cannot replace an outside risk assessment of map and description.']},
 'variant-study':{steward:['Move the files into the vault without a proposed run record','Secure storage does not document the proposed processing method.'],privacy:['Assume the vault permits this reuse','A vault does not establish consent or an approved purpose.']},
 'brain-maps':{steward:['Rename the scans without linking the processing run','A new name cannot show which run and companion files produced the scans.'],privacy:['Delete every companion field instead of arranging inspection','Removing fields blindly does not inspect images or establish intended use.']}
};
for(const [id,lesson] of Object.entries(lessons)){
 const c=scenarios[id];Object.assign(c,humanProcess[id]);c.card=lesson.card;c.external=lesson.external;
 c.choices.filter(o=>!o.good).forEach((o,i)=>o.consequence=lesson.risk[i]);
 c.choices.find(o=>o.good).consequence=soundConsequences[id];
 const corrections={
  'oral-heritage':{steward:'Ask for the correction log and link this transcript version to its recording',privacy:'Narrow the proposed use and ask for the actual consent terms',community:'Keep the title private and ask the appointed community body whether people may see the title and request recordings'},
  'stellar-survey':{steward:'Link the actual processing run and calibration inputs to these image versions'},
  'neighbourhood-voices':{steward:'Find the coding guide version and its link to the original interviews',privacy:'Specify the intended coded-table use and request the consent agreements'},
  'coastal-species':{steward:'Record how the restricted sites became map areas without including coordinates',privacy:'Request an outside assessment of both the map and its description'},
  'variant-study':{steward:'Specify the proposed processing run while the data stays on hold',privacy:'Send the proposed purpose to the consent owner before any reuse'},
  'brain-maps':{steward:'Link the image-processing run and its companion-file list',privacy:'Request inspection of the actual images and companion fields'}
 };
 c.revisionPlans=Object.fromEntries(Object.entries(corrections[id]).map(([r,label])=>[r,{id:`fix-${r}`,label:`Proposed correction: ${label}. ${revisionExamples[id][r]}`}]));
 c.revisionChoices=Object.fromEntries(Object.entries(c.revisionPlans).map(([r,plan])=>[r,[
  {id:plan.id,label:plan.label,sufficient:true},
  {id:`shortcut-${r}`,label:inadequateCorrections[id][r][0],sufficient:false,feedback:inadequateCorrections[id][r][1]}
 ]]));
 c.safePlans=[{id:'private-review',label:'Keep the proposed copy private and request the named checks'},...Object.values(c.revisionPlans)];
 c.packagePlans=[{id:'inventory-pending',label:'Draft file list; the curator still needs to check it'}, {id:'inventory-revised',label:'Revised file list draft: list tile-EXAMPLE.fits, tile-EXAMPLE.zarr and pipeline-run-EXAMPLE.txt together. Ask the curator to check available space, the file list and whether copies are unchanged before any transfer; the curator needs the actual files to do this.'}];
 c.reviewOptions={};for(const r of c.reviewers){
  const statements=lesson[r];c.reviewOptions[r]=[{id:`${r}-scope`,decision:r==='steward'?'noted':'needs-more',label:statements[0]}, {id:`${r}-evidence`,decision:'needs-more',label:statements[1]}];
 }
 c.curatorReasons=[{id:'capacity-pending',label:'The proposed file list is recorded; available space, the file list and whether copies are unchanged still need checking.'}];
 const soundPosition={'oral-heritage':0,'stellar-survey':1,'neighbourhood-voices':2,'coastal-species':1,'variant-study':0,'brain-maps':2}[id];
 const sound=c.choices.splice(c.choices.findIndex(o=>o.good),1)[0];c.choices.splice(soundPosition,0,sound);
}
