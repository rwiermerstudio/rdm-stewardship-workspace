# Meridian learning role-play

This browser exercise is a fictional teaching model, not an institutional workflow. Meridian's projects, people, services, file names and candidate archives are invented. The [learning specification](LEARNING-REWRITE.md) sets its editorial goals.

## Learner route

Pick one of six projects. Each starts with a concrete event and a different question. The first screen offers three plausible actions and a brief cue for each, without marking the answer. A risky choice explains its likely consequence and allows a retry. After a safer choice, the learner supplies one **invented reference** for the proposed method or evidence. The workbench connects old and new copy labels and drafts a short record and a case-specific checklist. Only then does it explain provenance, manifest and checksum. No checksum is calculated.

The oral-history route asks a data steward to trace the correction, a privacy reviewer to consider limited consent, and a community-appointed reviewer to consider description visibility separately from requests for recordings. The researcher can receive a question back and send it for another review. A curator can return the proposed package or record a simulated handoff after all three scoped responses. Neither action creates a deposit, a public title or access to files. The page exposes role changes for learning; it does not authenticate anyone.

Sky images require a processing-run link and an archive capacity check. Interview coding requires a codebook and a consent-scope question. Brain images require human checks of image quality and companion fields. Unknown genomic consent and unassessed coastal location risk remain hard holds even if the exercise's reviewers record responses; the curator has no acceptance action in those cases. All projects show safe invented file names and a small structural example, not subject data.

## Model and safety boundary

`demo/scenarios.mjs` holds all case prose, choices, feedback, reviewer questions and outcome text. `demo/model.mjs` owns a pure in-memory transition model. `demo/app.mjs` builds controls with DOM nodes and writes authored and entered strings using `textContent`. State records the chosen action, one short reference, scoped exercise responses and an event list. It keeps `publicMetadata` and `accessGranted` false. There is no storage, export, upload, network API or simulated login. Refresh and Reset erase the local state. A visitor could still type real material despite the input pattern, so the page warns against it and should never be treated as safe storage. A host may log ordinary page requests.

The model enforces the next reviewer role, blocks researcher self-review, requires a returned question to go back through its reviewer, and blocks curator handoff on a hard hold. Community controls allow only private description or separate visibility review, and no route or separately considered requests; they never publish a title or grant file access. Candidate archives are not reservations. Reviewer clicks do not verify consent, rights, methods or actual files.

## Checks and limits

Run `python3 -m unittest discover -s tests -q`, `npm test` and `npm run test:browser`. Node tests cover all six routes, every risky first option, retry, role separation, returned questions, separate community choices, hard holds and curator package return. Playwright exercises the full oral path with a mistake and correction, both hard holds, keyboard skip, no horizontal overflow and axe-core at desktop and mobile widths. Screenshots in `test-results/` are local QA output. These checks do not establish comprehension, cultural appropriateness or real institutional authority. A pilot needs appointed reviewers and community-led evaluation before any operational use.
