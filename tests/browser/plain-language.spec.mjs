import {test,expect} from '@playwright/test';
import {scenarios} from '../../demo/scenarios.mjs';
for(const width of [320,1280])test(`reading rules mid-review preserves the answer at ${width}px`,async({page,context})=>{
 await page.setViewportSize({width,height:568});await page.goto('/');
 await page.locator('[data-choice="ask"]').click();
 await page.getByRole('button',{name:'Write down the change'}).click();
 await page.getByRole('button',{name:'Send the note to the steward'}).click();
 await page.locator('#review-reason input').first().check();
 await page.getByRole('button',{name:'Record this reply'}).click();
 await expect(page.locator('#role')).toHaveValue('privacy');
 await page.locator('#review-reason input').first().check();
 const [source]=await Promise.all([context.waitForEvent('page'),page.locator('#decision-policy a').first().click()]);
 await source.waitForLoadState();await source.close();
 await expect(page.locator('#role')).toHaveValue('privacy');
 await expect(page.locator('#review-reason input').first()).toBeChecked();
 for(const end of ['first','last']){
  await page.getByRole('link',{name:/Read Meridian's fictional rules/}).click();
  const links=page.locator('#policy-context').getByRole('link',{name:'Back to the current answer choices'});
  await links[end]().click();
  await expect(page.locator('#project-title')).toHaveText('Oral histories');
  await expect(page.locator('#role')).toHaveValue('privacy');
  await expect(page.locator('#review-reason input').first()).toBeChecked();
  const g=await page.evaluate(()=>({card:document.querySelector('#action .answer-card').getBoundingClientRect().top,map:document.querySelector('#process-view').getBoundingClientRect().bottom,height:innerHeight}));
  expect(g.card).toBeGreaterThanOrEqual(g.map);expect(g.card).toBeLessThan(g.height);
 }
});
for(const [id,c] of Object.entries(scenarios))test(`${id}: human handoff before improvement reflection`,async({page})=>{
 await page.goto('/');await page.locator(`.project[data-id="${id}"]`).click();
 await expect(page.locator('#policy-context')).toContainText(c.why);
 await expect(page.locator('#policy-context')).toContainText(c.handoffLesson);
 await expect(page.locator('#reflection')).toBeHidden();
 await page.locator(`[data-choice="${c.choices.find(x=>x.good).id}"]`).click();
 await page.getByRole('button',{name:'Write down the change'}).click();
 await page.getByRole('button',{name:'Send the note to the steward'}).click();
 await expect(page.locator('#record')).toContainText(c.handoffLesson);
 for(const role of c.reviewers){
  await expect(page.locator('#role')).toHaveValue(role);
  await expect(page.locator('#reflection')).toBeHidden();
  await page.locator('#review-reason input').first().check();
  if(role==='community'){
   await page.locator('#metadata input').first().check();
   await page.locator('#access input').first().check();
  }
  await page.getByRole('button',{name:'Record this reply'}).click();
 }
 if(id==='stellar-survey'){
  await expect(page.locator('#reflection')).toBeHidden();
  await page.locator('#curator-reason input').first().check();
  await page.getByRole('button',{name:'Record the archive reply'}).click();
 }
 await expect(page.locator('#reflection')).toBeVisible();
 await expect(page.locator('#reflection')).toContainText('ideas to investigate, not capabilities');
 await expect(page.locator('#reflection')).toContainText('Time savings have not been measured');
 if(c.hold){
  await expect(page.locator('#result')).toContainText('Pause here');
  await expect(page.locator('#action button')).toHaveCount(0);
 }
 await page.getByRole('button',{name:'Reset this project'}).click();
 await expect(page.locator('#reflection')).toBeHidden();
 await expect(page.locator('#support')).toBeHidden();
});
