import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const role=(page,value)=>page.getByLabel('Acting as').selectOption(value);
const choose=(page,id)=>page.locator(`[data-choice="${id}"]`).click();
async function prepare(page,id,choice){await page.locator(`.project[data-id="${id}"]`).click();await choose(page,choice);await page.getByRole('button',{name:'Continue to the change record'}).click();await page.getByLabel('Invented method or evidence reference').fill('fictional-run-1');await page.getByRole('button',{name:'Make draft and ask reviewers'}).click();}
async function review(page,r){await role(page,r);await page.getByLabel('What can you say from this draft?').selectOption(`${r}-scope`);if(r==='community'){await page.getByLabel('Description visibility').selectOption('private');await page.getByLabel('File requests').selectOption('none');}await page.getByRole('button',{name:'Record this training response'}).click();}
for(const [id,bad,good,reviewers,outcome] of [
 ['oral-heritage','publish','ask',['steward','privacy','community'],'pending'],
 ['stellar-survey','copy','run',['steward'],'curator'],
 ['neighbourhood-voices','post','scope',['steward','privacy'],'pending'],
 ['coastal-species','map','assess',['steward','privacy'],'hold'],
 ['variant-study','vault','refer',['steward','privacy'],'hold'],
 ['brain-maps','done','check',['steward','privacy'],'pending']
])test(`${id}: draft consequence, correction, evidence gate and outcome`,async({page})=>{
 await page.goto('/');await page.locator(`.project[data-id="${id}"]`).click();
 await expect(page.locator(`.project[data-id="${id}"]`)).toContainText('researcher');
 await expect(page.locator('#record')).toBeHidden();
 await choose(page,bad);await expect(page.locator('#record')).toBeVisible();await expect(page.locator('#record')).toContainText('draft');await expect(page.locator('#package-details')).toHaveCount(1);await expect(page.locator('#package-details')).toBeHidden();
 if(id==='neighbourhood-voices')await expect(page.locator('#vocabulary')).toContainText('codebook');
 if(id==='stellar-survey')await expect(page.locator('#vocabulary')).toContainText('FITS');
 if(id==='brain-maps')await expect(page.locator('#vocabulary')).toContainText('JSON');
 await page.getByRole('button',{name:'Try another action'}).click();await choose(page,good);
 await page.getByRole('button',{name:'Continue to the change record'}).click();await page.getByLabel('Invented method or evidence reference').fill('fictional-run-1');await page.getByRole('button',{name:'Make draft and ask reviewers'}).click();
 await role(page,reviewers[0]);await expect(page.getByRole('button',{name:'Record this training response'})).toBeDisabled();
 for(const r of reviewers)await review(page,r);
 if(outcome==='curator'){
  await role(page,'curator');await expect(page.getByRole('button',{name:'Record package observation'})).toBeDisabled();
 }else{
  await expect(page.locator('#result')).toContainText(outcome==='hold'?'hold':'still needs');
  await role(page,'curator');await expect(page.getByRole('button',{name:'Record package observation'})).toHaveCount(0);
 }
});
test('review return and package repair require visible changed plans',async({page})=>{
 await page.goto('/');await prepare(page,'stellar-survey','run');await role(page,'steward');await page.getByLabel('What can you say from this draft?').selectOption('steward-evidence');await page.getByRole('button',{name:'Ask researcher for this missing check'}).click();
 await role(page,'researcher');await expect(page.getByRole('button',{name:'Send proposed correction'})).toBeDisabled();
 await page.getByLabel('New invented reference for the proposed correction').fill('fictional-run-2');await page.getByLabel('What will you propose to change?').selectOption('fix-steward');await page.getByRole('button',{name:'Send proposed correction'}).click();
 await expect(page.locator('#record')).toContainText('calibration inputs');await review(page,'steward');await role(page,'curator');await page.getByRole('button',{name:'Return package for correction'}).click();
 await role(page,'researcher');await expect(page.getByRole('button',{name:'Send revised package'})).toBeDisabled();await page.getByLabel('New invented reference').fill('fictional-run-3');await page.getByLabel('Changed package plan').selectOption('inventory-revised');await page.getByRole('button',{name:'Send revised package'}).click();
 await expect(page.locator('#handoff')).toContainText('Revised inventory');await role(page,'curator');await page.getByLabel('Package observation and reason').selectOption('capacity-pending');await page.getByRole('button',{name:'Record package observation'}).click();await expect(page.locator('#result')).toContainText('still needs');
});
test('desktop and mobile keyboard focus, overflow and axe',async({page})=>{
 await page.goto('/');await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to exercise'})).toBeFocused();
 await page.locator('.project[data-id="brain-maps"]').focus();await page.keyboard.press('Enter');await expect(page.locator('#project-title')).toBeFocused();
 await choose(page,'check');await expect(page.locator('#step')).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
});
test('options offer reasoning cues before a choice, not only after it',async({page})=>{
 await page.goto('/');await page.locator('.project[data-id="oral-heritage"]').click();
 await expect(page.locator('[data-choice="publish"]')).toContainText('A title might seem harmless.');
 await expect(page.locator('[data-choice="ask"]')).toContainText('Description and file requests are separate questions.');
});
test('an inadequate returned-question correction explains the gap and leaves review blocked',async({page})=>{
 await page.goto('/');await prepare(page,'coastal-species','assess');await review(page,'steward');
 await role(page,'privacy');await page.getByLabel('What can you say from this draft?').selectOption('privacy-evidence');
 await page.getByRole('button',{name:'Ask researcher for this missing check'}).click();await role(page,'researcher');
 await page.getByLabel('New invented reference for the proposed correction').fill('fictional-run-2');
 await page.getByLabel('What will you propose to change?').selectOption('shortcut-privacy');
 await page.getByRole('button',{name:'Send proposed correction'}).click();
 await expect(page.locator('#feedback')).toContainText('outside risk assessment');
 await expect(page.locator('#step')).toContainText('A question came back');
 await page.getByLabel('What will you propose to change?').selectOption('fix-privacy');
 await page.getByRole('button',{name:'Send proposed correction'}).click();
 await expect(page.locator('#step')).toContainText('Independent questions');
});
test('a reviewer can return only a missing-check statement',async({page})=>{
 await page.goto('/');await prepare(page,'oral-heritage','ask');await role(page,'steward');
 const response=page.getByLabel('What can you say from this draft?');
 await response.selectOption('steward-scope');
 await expect(page.getByRole('button',{name:'Ask researcher for this missing check'})).toBeDisabled();
 await response.selectOption('steward-evidence');
 await expect(page.getByRole('button',{name:'Ask researcher for this missing check'})).toBeEnabled();
});
