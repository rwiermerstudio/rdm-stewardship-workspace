import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function start(page,id,good){await page.goto('/');await page.locator(`.project[data-id="${id}"]`).click();await page.locator(`[data-choice="${good}"]`).click();await page.getByRole('button',{name:'Continue to the change record'}).click();await page.getByRole('button',{name:'Make draft and ask reviewers'}).click();}
test('numbered source documents navigate by contents, remain readable on phone, and pass axe',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.goto('/policy-documents.html');
 await page.getByRole('navigation',{name:'Document contents'}).getByRole('link',{name:/GEN-USE §5/}).click();
 await expect(page).toHaveURL(/#GEN-USE-s5$/);
 await expect(page.locator('#GEN-USE-s5')).toBeVisible();
 await expect(page.locator('#GEN-USE-s5 + p')).toContainText('Only the authorized consent owner');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
});
test('policy context follows all six cases with source citations and limitations',async({page,context})=>{
 for(const [id,citation] of [['stellar-survey','ASTRO-FITS §1'],['neighbourhood-voices','SOC-DDI §2'],['variant-study','GEN-USE §5'],['oral-heritage','HER-COMM agreement §2'],['coastal-species','BIO-DWC §2'],['brain-maps','NEU-BIDS §4']]){
  await page.goto('/');await page.locator(`.project[data-id="${id}"]`).click();
  await expect(page.locator('#policy-context')).toContainText(citation);
  await expect(page.locator('#policy-context')).toContainText('MI-DOC §2');
  await expect(page.locator('#policy-context')).toContainText('MI-PRES §4');
  await expect(page.locator('#policy-context')).toContainText('fictional');
  await expect(page.locator('#policy-context')).toContainText('not legal');
  await expect(page.locator('#policy-context')).toContainText('researcher: proposes');
  await expect(page.locator('#policy-context')).toContainText('Practice record: change');
  await expect(page.locator('#policy-context a[href="meridian-institute.json"]')).toHaveCount(1);
  const links=page.locator('#decision-policy a');
  await expect(links.first()).toHaveAttribute('href','policy-documents.html#MI-DOC-s2');
  const cited=page.locator('#policy-context a').filter({hasText:citation});
  await expect(cited).toHaveCount(1);
  const href=await cited.getAttribute('href');
  await expect(page.locator(`#decision-policy a[href="${href}"]`)).toBeVisible();
  const [documentTab]=await Promise.all([context.waitForEvent('page'),cited.click()]);
  await expect(documentTab).toHaveURL(new RegExp(`${href.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}$`));
  await expect(documentTab.locator(href.slice(href.indexOf('#')))).toBeVisible();
  await expect(documentTab.locator('main')).toContainText('No passage grants permission');
  await expect(page.locator('#project-title')).not.toBeEmpty();
  await documentTab.close();
 }
});
test('radio cards preserve return, repair, curator and keyboard handoffs on narrow screen',async({page})=>{
 await page.setViewportSize({width:320,height:568});await start(page,'stellar-survey','run');
 await expect(page.getByRole('combobox',{name:'What can you say from this draft?'})).toHaveCount(0);
 const response=page.getByRole('group',{name:'What can you say from this draft?'});
 await response.getByRole('radio').first().focus();await page.keyboard.press('ArrowRight');
 await expect(response.getByRole('radio',{name:/Need/})).toBeChecked();
 await page.getByRole('button',{name:'Ask researcher for this missing check'}).click();
 await expect(page.locator('#role')).toHaveValue('researcher');
 await page.getByRole('group',{name:'What will you propose to change?'}).getByRole('radio',{name:/EXAMPLE/}).check();
 await page.getByRole('button',{name:'Send proposed correction'}).click();
 await expect(page.locator('#role')).toHaveValue('steward');
 await page.getByRole('link',{name:/Read Meridian's fictional rules/}).click();
 await expect(page).toHaveURL(/#policy-title$/);
 await expect(page.locator('#policy-context')).toContainText('ASTRO-FITS §1');
 await response.getByRole('radio').first().check();await page.getByRole('button',{name:'Record this training response'}).click();
 await expect(page.locator('#role')).toHaveValue('curator');
 await page.getByRole('button',{name:'Return package for correction'}).click();
 await expect(page.locator('#role')).toHaveValue('researcher');
 await page.getByRole('group',{name:'Changed package plan'}).getByRole('radio',{name:/Revised inventory/}).check();
 await page.getByRole('button',{name:'Send revised package'}).click();
 await page.getByRole('group',{name:'Package observation and reason'}).getByRole('radio').first().check();
 await page.getByRole('button',{name:'Record package observation'}).click();
 await expect(page.locator('#result')).toContainText('still needs');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
});
test('consulting cited rules preserves the selected project and current decision',async({page,context})=>{
 await start(page,'variant-study','refer');
 await expect(page.locator('#role')).toHaveValue('steward');
 const citation=page.locator('#decision-policy a').first();
 const [documentTab]=await Promise.all([context.waitForEvent('page'),citation.click()]);
 await documentTab.waitForLoadState();
 await expect(documentTab).toHaveURL(/policy-documents\.html#/);
 await expect(page.locator('#role')).toHaveValue('steward');
 await expect(page.locator('#project-title')).toContainText('Variant study');
 await expect(page.locator('#step')).toContainText('Independent questions');
 await Promise.all([documentTab.waitForEvent('close'),documentTab.getByRole('link',{name:/Close this document tab to return to the exercise/}).first().click().catch(error=>{if(!documentTab.isClosed())throw error;})]);
 expect(documentTab.isClosed()).toBe(true);
 await expect(page.locator('#role')).toHaveValue('steward');
});
test('overview offers a direct return to the active task',async({page})=>{
 await start(page,'variant-study','refer');
 await page.getByRole('link',{name:/Read Meridian's fictional rules/}).click();
 const back=page.locator('#policy-context').getByRole('link',{name:/Back to the current decision/}).first();
 await back.click();
 await expect(page).toHaveURL(/#step$/);
 await expect(page.locator('#role')).toHaveValue('steward');
});
test('community description and file-request choices remain separate',async({page})=>{
 await start(page,'oral-heritage','ask');
 for(const r of ['steward','privacy']){await page.getByRole('group',{name:'What can you say from this draft?'}).getByRole('radio').first().check();await page.getByRole('button',{name:'Record this training response'}).click();}
 await page.getByRole('group',{name:'What can you say from this draft?'}).getByRole('radio').first().check();
 await page.getByRole('group',{name:'Description visibility'}).getByRole('radio').first().check();
 await expect(page.getByRole('button',{name:'Record this training response'})).toBeDisabled();
 await page.getByRole('group',{name:'File requests'}).getByRole('radio').first().check();
 await page.getByRole('button',{name:'Record this training response'}).click();
 await expect(page.locator('#record')).toContainText('Description versus file requests');
});
