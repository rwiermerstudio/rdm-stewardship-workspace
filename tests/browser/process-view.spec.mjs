import {test,expect} from '@playwright/test';
test('role and process remain visible, choice trade-offs precede action and generated evidence tracks a return',async({page})=>{
 await page.goto('/');await page.locator('.project[data-id="stellar-survey"]').click();
 await expect(page.locator('#process-view')).toContainText('Data steward');
 await expect(page.locator('#process-view')).toContainText('Archive curator');
 await expect(page.locator('[data-choice="run"]')).toContainText('Why you might choose it:');
 await expect(page.locator('[data-choice="run"]')).toContainText('What you give up:');
 await expect(page.locator('[data-choice="run"]')).toContainText('What still needs checking:');
 await page.locator('[data-choice="run"]').click();await page.getByRole('button',{name:'Write down the change'}).click();
 await expect(page.getByLabel('Invented method or evidence reference')).toHaveCount(0);
 await page.getByRole('button',{name:'Send the note to the steward'}).click();
 await expect(page.locator('#evidence')).toContainText('EV-STELLAR-SURVEY-001');
 await page.getByLabel('Acting as').selectOption('steward');
 await page.getByRole('group',{name:'What can you say from this draft?'}).locator('input[value="steward-evidence"]').check();
 await page.getByRole('button',{name:'Ask researcher for this missing check'}).click();
 await expect(page.locator('#open-items')).toContainText('Q-STELLAR-SURVEY-001');
 await page.getByLabel('Acting as').selectOption('researcher');
 await page.getByRole('group',{name:'What will you propose to change?'}).locator('input[value="fix-steward"]').check();
 await page.getByRole('button',{name:'Send proposed correction'}).click();
 await expect(page.locator('#fixed-items')).toContainText('EV-STELLAR-SURVEY-002');
 await expect(page.locator('#open-items')).toContainText('space');
});
test('role map precedes the action and the readable record contains open and proposed fixes',async({page})=>{
 await page.goto('/');
 await expect(page.locator('#process-view')).toBeVisible();
 expect(await page.evaluate(()=>document.querySelector('#process-view').compareDocumentPosition(document.querySelector('.task')) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
 await page.locator('.project[data-id="oral-heritage"]').click();
 await page.locator('[data-choice="ask"]').click();await page.getByRole('button',{name:'Write down the change'}).click();await page.getByRole('button',{name:'Send the note to the steward'}).click();
 expect(await page.locator('#record').evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
 await expect(page.locator('#record')).toContainText('EV-ORAL-HERITAGE-001');
 await expect(page.locator('#support #open-items')).toContainText('community');
 await expect(page.locator('#support #fixed-items')).toContainText('No draft corrections');
});
test('focused stage clears the pinned map without hiding roles or flow',async({page})=>{
 await page.goto('/');
 const check=async()=>{
 const positions=await page.evaluate(()=>{
  const box=s=>document.querySelector(s).getBoundingClientRect();
  return {map:box('#process-view'),step:box('#step'),firstStage:box('#process-steps li'),lastStage:box('#process-steps li:last-child'),firstRole:box('#role-lanes li'),lastRole:box('#role-lanes li:last-child')};
 });
 expect(positions.step.top).toBeGreaterThanOrEqual(positions.map.bottom);
 expect(positions.firstStage.top).toBeGreaterThanOrEqual(0);
 expect(positions.lastStage.bottom).toBeLessThanOrEqual(page.viewportSize().height);
 expect(positions.firstRole.top).toBeGreaterThanOrEqual(0);
 expect(positions.lastRole.bottom).toBeLessThanOrEqual(page.viewportSize().height);
 };
 await page.locator('[data-choice="ask"]').click();await check();
 await page.getByRole('button',{name:'Write down the change'}).click();await check();
 await page.getByRole('button',{name:'Send the note to the steward'}).click();await check();
});

test('reset remains available before recording and after a risky draft',async({page})=>{
 await page.goto('/');
 await expect(page.getByRole('button',{name:'Reset this project'})).toBeVisible();
 await page.locator('.project[data-id="variant-study"]').click();
 await page.locator('[data-choice="vault"]').click();
 await expect(page.getByRole('button',{name:'Reset this project'})).toBeVisible();
 await page.getByRole('button',{name:'Reset this project'}).click();
 await expect(page.locator('#step')).toContainText('Choose an action');
 await expect(page.locator('#history-section')).toBeHidden();
});
