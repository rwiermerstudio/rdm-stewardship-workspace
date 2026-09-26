# Meridian plain-language lesson

## What changed

The lesson now starts with a researcher preparing work for a colleague: keep the original files, explain the change and ask the person who can answer the next question. It introduces the steward, privacy reviewer and archive curator through their jobs rather than through software functions.

Each of the six projects has its own explanation of Meridian's choices and a handoff account: what to prepare, who receives it, why it may return and what happens outside the page. The policy overview explains why the institute keeps originals, separates description visibility from file access, asks the community to decide its own questions, waits for consent and requests an independent check of rare-site risk. It also explains the deliberate teaching shortcuts, including one return per reviewer and an archive conversation only for the sky survey.

All numbered source passages were rewritten in plain language. Their canonical citation IDs, anchors, document versions and applicability stay intact. The two catalogue copies are unchanged and still match. Exact catalogue facts and the glossary are optional reading rather than required vocabulary.

Scenario choices, consequences, reviewer replies, correction cards, role/process labels and the handover note use ordinary descriptions of the work. Community answer cards now give concrete examples for the separate title and recording-request decisions. The note keeps all proposed corrections and unverified references, including the original method reference.

Reflection about possible improvements appears only after the route ends, including the two outside-decision holds. It distinguishes existing page behaviour from ideas such as shared checklists, reminders and file-list comparisons. It states that time savings have not been measured. Reset hides the reflection again.

## Verification

Test-first: added the three Node lesson assertions and ran them against the unchanged demo. All three failed for the intended missing lesson content, handoff explanation and plain-language source passages. Then implemented the rewrite and added browser coverage for the end reflection and reading policies midway through review.

Final local runs:

| Command | Result |
| --- | --- |
| `npm test` | 38 passed, 0 failed |
| `npm run test:browser` | 84 passed, 0 failed, desktop and mobile Chromium |
| `python3 -m unittest discover -s tests -v` | 32 passed |
| `git diff --check` | Clean |

The tests retain all six routes, all twelve blocked first choices, reviewer returns and inadequate corrections, archive return/repair, the two terminal holds, automatic role ownership, manual role exploration, reset, separate community decisions and unverified reference history. Existing safety assertions were retained. Wording selectors were updated to the new labels; the archive-check assertion now requires both enough space and unchanged copies instead of either technical term.

Browser checks cover keyboard radio selection, role borders and labels, axe accessibility checks, narrow-screen click targets and sticky-map clearance. New checks read and return from policies in the privacy-review stage at 320 by 568 and 1280 by 568, preserving the selected project, role and checked answer. Both overview return links put the first answer below the sticky map and within the viewport. Every project keeps reflection hidden until its terminal lesson state.

## Boundaries and review notes

The state-machine guards, canonical catalogue, file examples, action IDs and permissions remain unchanged. The new runtime behaviour only controls when the final reflection appears. There is no new file inspection, consent decision, archive acceptance or measured process improvement.

The editorial review found and fixed several awkward phrases from the initial wording pass, including the sky-survey consequence and the map-making request. Tests initially failed where visible labels had changed; selectors were corrected without removing their behavioural assertions. No dependency or network blocker prevented verification.

This work is for the feature branch only. It has not been merged or deployed to Pages. The checks are local automated verification and an author editorial review, not a learner study or an independent editorial sign-off.
