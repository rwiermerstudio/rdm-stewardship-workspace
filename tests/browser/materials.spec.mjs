import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {materialCatalog} from '../../demo/materials.mjs';
import {scenarios} from '../../demo/model.mjs';
import {execFileSync} from 'node:child_process';
for(const [id,c] of Object.entries(materialCatalog))test(`${id}: inspect real materials, correct an answer, preserve state, export`,async({page},testInfo)=>{
 await page.goto('/');await page.locator(`.project[data-id="${id}"]`).click();
 await expect(page.locator('#learning-progress')).toContainText('Current goal');
 await page.getByText('Inspect the small fictional files',{exact:true}).click();
 await expect(page.locator('#material-files > details')).toHaveCount(c.files.length);
 await page.locator('#material-files details summary').first().click();
 await expect(page.locator('#material-files')).toContainText(c.files[0].path);
 await page.locator('#material-answer input[value="assume"]').check();
 await page.getByRole('button',{name:'Record my observation'}).click();
 await expect(page.locator('#material-feedback')).toContainText('Try again');
 await page.locator('#material-answer input[value="inspect"]').check();
 await page.getByRole('button',{name:'Record my observation'}).click();
 await expect(page.locator('#material-feedback')).toContainText('Next');
 await page.getByRole('button',{name:'Run the text checks'}).click();
 await expect(page.locator('#material-check-results')).toContainText('Defect found');
 await expect(page.locator('#material-check-results')).toContainText(c.checks[0].files[0]);
 await page.locator(`[data-choice="${scenarios[id].choices.find(x=>x.good).id}"]`).click();
 await page.getByRole('button',{name:'Write down the change'}).click();await page.getByRole('button',{name:'Send the note to the steward'}).click();
 await expect(page.locator('#record')).toContainText(c.question.options.find(x=>x.correct).label);
 for(const r of scenarios[id].reviewers){
  await page.locator(`#review-reason input[value="${r}-scope"]`).check();
  if(r==='community'){await page.locator('#metadata input[value="private"]').check();await page.locator('#access input[value="none"]').check();}
  await page.getByRole('button',{name:'Record this reply',exact:true}).click();
 }
 if(id==='stellar-survey'){await page.locator('#curator-reason input').first().check();await page.getByRole('button',{name:'Record the archive reply'}).click();}
 await expect(page.locator('#learning-progress')).toContainText('Learning complete');
 if(scenarios[id].hold)await expect(page.locator('#result')).toContainText('Pause here');
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Download handover package'}).click();const download=await downloadPromise;
 const path=testInfo.outputPath(`${id}.tar`);await download.saveAs(path);
 const result=execFileSync('python3',['-c',`import tarfile,json,sys,hashlib\nwith tarfile.open(sys.argv[1]) as t:\n d=json.load(t.extractfile('human-decisions.json')); assert d['learnerInspection']['correct']; assert not d['accessGranted']; assert d['authorizedDecision']=='not obtained'\n for p,h in json.load(t.extractfile('manifest-sha256.json')).items(): assert hashlib.sha256(t.extractfile(p).read()).hexdigest()==h\n print('BROWSER_PACKAGE_OK')`,path],{encoding:'utf8'});
 expect(result).toContain('BROWSER_PACKAGE_OK');
 await page.getByRole('button',{name:'Reset this project'}).click();await expect(page.locator('#learning-progress')).toContainText('0 of 4');
});
test('short mobile material question supports keyboard, return and readable files',async({page})=>{
 await page.setViewportSize({width:320,height:568});await page.goto('/');
 await page.getByText('Inspect the small fictional files',{exact:true}).click();
 await page.locator('#material-answer input[value="inspect"]').focus();await page.keyboard.press('Space');
 await page.getByRole('button',{name:'Record my observation'}).click();
 await expect(page.locator('#material-feedback')).toBeFocused();
 const boxes=await page.evaluate(()=>({map:document.querySelector('#process-view').getBoundingClientRect().bottom,focus:document.querySelector('#material-feedback').getBoundingClientRect().top,width:document.documentElement.scrollWidth,height:innerHeight}));
 expect(boxes.focus).toBeGreaterThanOrEqual(boxes.map-1);expect(boxes.focus).toBeLessThan(boxes.height);expect(boxes.width).toBeLessThanOrEqual(320);
 await page.locator('#material-files details summary').first().click();
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
});
for(const width of [320,1280])test(`material consultation preserves the pending reviewer answer at ${width}px`,async({page,context})=>{
 await page.setViewportSize({width,height:568});await page.goto('/');
 await page.locator('[data-choice="ask"]').click();await page.getByRole('button',{name:'Write down the change'}).click();await page.getByRole('button',{name:'Send the note to the steward'}).click();
 await page.locator('#review-reason input').first().check();
 await page.locator('#inspect-link').click();
 const file=page.locator('#material-files > details[data-path="agreement-EXAMPLE.json"]');await file.locator('summary').first().click();
 const [tab]=await Promise.all([context.waitForEvent('page'),file.getByRole('link').click()]);await tab.waitForLoadState();await tab.close();
 await page.locator('#material-panel').getByRole('link',{name:'Back to the current answer choices'}).click();
 await expect(page.locator('#role')).toHaveValue('steward');await expect(page.locator('#review-reason input').first()).toBeChecked();
 const g=await page.evaluate(()=>({card:document.querySelector('#action .answer-card').getBoundingClientRect().top,map:document.querySelector('#process-view').getBoundingClientRect().bottom,height:innerHeight}));
 expect(g.card).toBeGreaterThanOrEqual(g.map);expect(g.card).toBeLessThan(g.height);
});
test('failed material loading has a recoverable retry without inventing checks',async({page})=>{
 await page.route('**/materials/oral-heritage/agreement-EXAMPLE.json',route=>route.fulfill({status:503,body:'Unavailable'}));await page.goto('/');
 await page.getByText('Inspect the small fictional files',{exact:true}).click();await expect(page.locator('#material-files')).toContainText('Materials unavailable');
 await expect(page.getByRole('button',{name:'Run the text checks'})).toHaveCount(0);
 await page.unroute('**/materials/oral-heritage/agreement-EXAMPLE.json');await page.getByRole('button',{name:'Retry loading materials'}).click();
 await expect(page.locator('#material-files > details')).toHaveCount(4);
});
