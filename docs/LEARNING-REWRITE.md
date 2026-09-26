# Learning-first role-play rewrite

## Why the current page fails

The page gives readers a long list of facts, labels and standards before they have made a decision. It treats the six research projects as different content inside essentially the same form. It calls an unverified list of suggested paperwork an automated result. The learner has to know what a version, evidence pointer, manifest, fixity and repository route mean before acting. A checklist is not a learning experience.

## Learner contract

Audience: a researcher who knows their own work but is **not** trained in research data management. At each step, the page should answer: *Where am I? What happened? What do I know? What can I choose? What happens if I choose it? What can the workbench do for me? Who decides what it cannot?* Introduce one technical word only after the learner has done or seen the corresponding ordinary-language action. Use friendly, plain English without sounding like a sales pitch or a game for children.

The setting should be introduced once: Meridian is an invented Dutch research institute with laboratories and humanities/social-science groups, a data steward service, privacy specialists, community-appointed reviewers and candidate storage/repositories. Those services are fictional. Each project card identifies a discipline, a research question, the person/role the learner is playing, a concrete event today, the material at hand and the decision at stake. Name quantities and formats in human terms first; put abbreviations in optional context.

## Play loop

1. **Choose a project.** A short card contrasts science at large scale, interviews, community-held recordings, genomic data, wildlife locations and brain images. The user can pick any; oral histories is the worked introduction.
2. **Arrive at the task.** Show 3–5 sentences addressed to the learner: whose project, what changed, what two or three invented files look like, why a decision is needed *today*. Do not present the entire institute catalogue.
3. **Choose, then learn.** Present two or three plausible actions as large buttons, each with a brief 'you might be thinking...' cue but do not reveal the answer first. After selection, show the realistic consequence, why the option is sound or risky, a way to try another option, and the next action. No irreversible punishment; a risky choice must be recoverable.
4. **Offer help at the right time.** A separate, visible 'What the workbench can do' panel pre-fills known facts from the invented catalogue, derives a change record (old version → new version, method/evidence reference), and drafts a case-specific handoff checklist. It asks for **only missing, safe references**. Show a readable example, not a wall of technical text. Distinguish seeded facts, the user's entry, system suggestion and human decision.
5. **Hand over for judgement.** The researcher can ask an appropriate reviewer (steward, privacy specialist, community-appointed reviewer, repository curator). Reviewers should see the situation and a specific question, not a researcher's 'you are...' paragraph. Unknown consent, community authority or location-disclosure risk cannot be clicked into permission. Metadata visibility is separate from access to files. The end state says clearly what can happen next and what remains blocked.
6. **Teach vocabulary in context.** After showing old and new versions, explain 'provenance' as the record of where a result came from. After showing file inventory and checksums, explain what those terms do. A glossary is optional backup, never a prerequisite.

## Six contrasting learning questions

- Astronomy: a sky-image correction produces a very large set of FITS/Zarr images. Should the lab publish the corrected copy without linking the pipeline run, or record the run and check whether the candidate archive can actually take it? Teach reproducible change records and scale/capacity. No privacy gate.
- Neighbourhood interviews: a coded table exists alongside voice recordings and a codebook. Does coding mean the team can make the interviews public? Teach purpose-specific limited consent and a private description. Privacy review needed.
- Community oral histories: the group wants to describe a corrected transcript collection. Is even a public catalogue title acceptable? Teach that a community-appointed reviewer can determine discoverability separately from access; a funder/institute preference does not overrule the community.
- Coastal ecology: rare-species exact sites were replaced by a coarser grid. Does coarsening alone prove safety? Teach inference from maps/metadata and an outside location-risk assessment before release.
- Genomics: a very large sequence collection is to be reprocessed; the project's consent status is unknown. A secure vault is technically suitable, but does it authorize reuse? Teach technical fit versus authority; hard hold and named referral.
- Brain imaging: the team removed facial structure from MRI images and kept JSON sidecars. Is the job finished? Teach residual disclosure/sidecars, method versions and human quality review; consent status alone is insufficient.

Each scenario needs *different consequences and reviewer route*, not merely different nouns on the same two-button quiz. Avoid a score that rewards 'open' or 'closed'. If using a game mechanic, award progress for asking the right question, recording an explanation and escalating appropriately.

## Acceptance and evidence

- A first-time learner can begin without reading glossary, standards list or a long catalogue paragraph.
- At least one plausible wrong choice per scenario shows a specific consequence and a recoverable correction; positive choices also explain what remains unknown.
- The user sees the old/new asset names or safe synthetic structure; the app never asks for actual subject content.
- In oral histories, a complete researcher → independent reviewers → simulated curator journey is possible; in unknown-consent and location-risk cases the UI cannot show an acceptance route. Role switching is a teaching device, not authentication.
- Every scenario displays what the workbench did automatically and what remains a human determination. The generated record reflects actual choices and safe user input rather than static prose alone.
- Tests cover choices, feedback, branch-dependent state, reset, six scenario contrasts, accessibility and desktop/mobile. Test a complete path and a recoverable mistake on the *published* site. No real policy or standards conformance claim.
- Run a human editorial pass on all runtime text: no unexplained jargon before action, no repeated disclaimer in every card, no sprawling 'known/unknown/options/outcome' list, and no congratulatory pseudo-approval.
