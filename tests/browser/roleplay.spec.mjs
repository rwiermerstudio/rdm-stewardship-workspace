import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const choose=async(page,label)=>page.getByRole('button',{name:label}).click();
const role=async(page,value)=>page.getByLabel('Acting as').selectOption(value);
const start=async page=>{await choose(page,'Keep it private and ask the appointed reviewers');await choose(page,'Continue to the change record');await page.getByLabel('Invented method or evidence reference').fill('fictional-run-7');await choose(page,'Make draft and ask reviewers');};
test('oral mistake recovers and reaches a fictional curator result',async({page},testInfo)=>{
 await page.goto('/');
 await choose(page,'Put up a public catalogue title now');
 await expect(page.locator('#feedback')).toContainText('catalogue title');
 await choose(page,'Try another action');
 await start(page);
 await expect(page.locator('#record')).toContainText('fictional-run-7');
 await role(page,'steward');await choose(page,'Return this question');
 await role(page,'researcher');await choose(page,'Revise and send back');
 await role(page,'steward');await choose(page,'Record scoped response');
 await expect(page.locator('#feedback')).toContainText('correction log');
 await role(page,'privacy');await expect(page.locator('#role-context')).toContainText('limited consent');await choose(page,'Record scoped response');
 await role(page,'community');await expect(page.getByLabel('Description visibility')).toHaveValue('private');await page.getByLabel('File requests').selectOption('request-review');await choose(page,'Record scoped response');
 await expect(page.locator('#record')).toContainText('file requests request-review');
 await role(page,'curator');await choose(page,'Record simulated handoff');
 await expect(page.locator('#result')).toContainText('not a real deposit');
 await page.screenshot({path:`test-results/${testInfo.project.name}-oral-result.png`,fullPage:true});
 await choose(page,'Reset this project');await expect(page.getByRole('button',{name:'Put up a public catalogue title now'})).toBeVisible();
});
test('six projects have choices and hard holds prevent curator action',async({page})=>{
 await page.goto('/');
 for(const title of ['Sky survey','Neighbourhood interviews','Coastal species','Variant study','Brain images','Oral histories']){
  await choose(page,title);
  await expect(page.locator('#project-question')).not.toBeEmpty();
  await expect(page.locator('#files')).toContainText('EXAMPLE');
  await expect(page.locator('.choices button')).toHaveCount(3);
 }
 for(const title of ['Variant study','Coastal species']){
  await choose(page,title);
  const id=title==='Variant study'?'refer':'assess';
  await page.locator(`[data-choice="${id}"]`).click();await choose(page,'Continue to the change record');
  await page.getByLabel('Invented method or evidence reference').fill('fictional-run-7');await choose(page,'Make draft and ask reviewers');
  await role(page,'steward');await choose(page,'Record scoped response');
  await role(page,'privacy');await choose(page,'Record scoped response');
  await role(page,'curator');await expect(page.locator('#result')).toContainText('cannot clear');
  await expect(page.getByRole('button',{name:'Record simulated handoff'})).toHaveCount(0);
 }
});
test('responsive, keyboard and accessibility',async({page},testInfo)=>{
 await page.goto('/');
 await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to exercise'})).toBeFocused();
 await page.getByRole('button',{name:'Sky survey'}).focus();await page.keyboard.press('Enter');
 await expect(page.locator('#project-title')).toHaveText('Sky survey');
 await page.locator('[data-choice="run"]').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#feedback')).toContainText('old and new images');
 await expect(page.locator('main')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.screenshot({path:`test-results/${testInfo.project.name}-learning.png`,fullPage:true});
});
