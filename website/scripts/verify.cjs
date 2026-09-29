'use strict';
// Run with NODE_PATH pointing to an installed Playwright package.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const qa = path.join(root, '.qa');
fs.mkdirSync(qa, { recursive: true });
const base = process.env.KUPAS_PREVIEW_URL || 'http://127.0.0.1:4173/';
let activeBrowser;
async function run(){
  const browser = await chromium.launch({ headless:true, executablePath: process.env.KUPAS_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  activeBrowser=browser;
  const page = await browser.newPage({viewport:{width:1440,height:1000}, deviceScaleFactor:1, reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`)});
  const checks=[];
  const settle=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  await page.goto(base+'?lang=zh', {waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
  assert.match(await page.locator('h1').innerText(),/让隐性经验/);
  assert.equal(await page.locator('h1').count(),1);
  const links=await page.locator('a[href^="#"]').evaluateAll(items=>items.map(a=>a.hash));
  for(const hash of new Set(links))assert.equal(await page.locator(hash).count(),1,`Missing anchor ${hash}`);
  checks.push('All in-page navigation targets resolve');
  for(let i=0;i<9;i++){
    await page.locator(`[data-layer="${i}"]`).click();
    assert.equal(await page.locator('#layer-number').innerText(),'L'+(i+1));
    assert.ok((await page.locator('#layer-description').innerText()).length>20);
  }
  await page.locator('[data-layer="2"]').click();
  await page.locator('[data-layer="2"]').press('ArrowRight');
  assert.equal(await page.locator('#layer-number').innerText(),'L4');
  await page.locator('[data-layer="3"]').press('Home');
  assert.equal(await page.locator('#layer-number').innerText(),'L1');
  await page.locator('[data-layer="2"]').click();
  checks.push('All nine dimensions and keyboard tab navigation work');
  assert.equal(await page.locator('.sample-band').count(),0);
  assert.equal(await page.locator('#framework .hero-diagram').count(),1);
  assert.equal(await page.locator('.partner-logos img').count(),3);
  assert.equal(await page.locator('.product-cta').getAttribute('href'),'https://lsf.kupasai.com/');
  assert.doesNotMatch(await page.locator('body').innerText(),/2026 年|技术报告 ·|1,576|23,024|13,113/);
  checks.push('Product entry, three logos, independent framework, and requested removals verified');
  assert.equal(await page.locator('img[src*="login-bg"]').count(),0);
  assert.match(await page.locator('.hero-artwork img').getAttribute('src'),/master-transparent\.png$/);
  await page.locator('.hero-artwork img').evaluate(el=>el.decode());
  assert.match(await page.locator('#product-art-title').innerText(),/AI 时代/);
  assert.equal(await page.locator('.hero-art-dialog,.hero-art-button,.art-expand').count(),0);
  assert.equal(await page.locator('.hero-artwork').evaluate(el=>!!el.closest('a,button')),false);
  assert.equal(await page.locator('.site-header .partner-logos img').count(),3);
  assert.equal(await page.locator('.hero-report-card .hero-report-download[download]').count(),2);
  assert.equal(await page.locator('.hero-downloads').count(),0);
  for(const [i,edition] of ['zh','en'].entries()){
    const card=page.locator('.hero-report-card').nth(i);
    const lowerCard=page.locator('#report .report-card').nth(i);
    const cover=card.locator('.hero-report-cover');
    await cover.evaluate(el=>el.decode());
    assert.equal(await cover.getAttribute('src'),await lowerCard.locator('img').getAttribute('src'));
    assert.equal(await card.locator('h2').innerText(),await lowerCard.locator('h3').innerText());
    assert.equal(await card.locator('a[download]').getAttribute('href'),await lowerCard.locator('a[download]').getAttribute('href'));
    assert.match(await cover.getAttribute('src'),new RegExp(`report-preview-${edition}\\.png$`));
    assert.match(await card.locator('.hero-report-meta').innerText(),/PDF · 38 页 · (7\.6|11\.0) MB/);
  }
  checks.push('Hero report cards use the current covers, full report titles, file metadata, and original download URLs');
  assert.equal(await page.locator('.header-inner .partner-logos img').count(),3);
  assert.equal(await page.locator('.partner-strip').count(),0);
  assert.equal(await page.locator('.footer-logos img').count(),2);
  assert.match(await page.locator('.footer-iae').getAttribute('src'),/iae_logo\.png$/);
  assert.doesNotMatch(await page.locator('.hero-actions,.hero-reports,.header-product').allTextContents().then(parts=>parts.join(' ')),/[↗↓]/);
  assert.ok(await page.locator('.desktop-nav a').evaluateAll(links=>links.every(link=>Number(getComputedStyle(link).fontWeight)>=600)));
  assert.equal(await page.locator('.result-arrows svg[fill="none"]').count(),2);
  assert.equal(await page.locator('.diagram-connector svg[fill="none"]').count(),2);
  checks.push('Single-row header logos, bold navigation, footer institute logo, outline arrows, and arrow-free product/download buttons verified');
  for(let i=0;i<3;i++){
    await page.locator(`[data-slide="${i}"]`).click();
    assert.equal(await page.locator(`[data-result="${i}"]`).getAttribute('aria-hidden'),'false');
    assert.equal(await page.locator('.result-slide:not([inert])').count(),1);
    assert.equal(await page.locator('.result-prev').isDisabled(),i===0);
    assert.equal(await page.locator('.result-next').isDisabled(),i===2);
    const img=page.locator(`[data-result="${i}"] img`);
    await img.evaluate(el=>el.decode());
    await page.locator(`[data-zoom="${i}"]`).click();
    assert.equal(await page.locator('.figure-dialog').evaluate(el=>el.open),true);
    assert.equal(await page.locator('#expanded-figure').getAttribute('src'),await img.evaluate(el=>el.src));
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.figure-dialog').evaluate(el=>el.open),false);
  }
  assert.equal(await page.locator('.results-stage img').count(),3);
  assert.equal(await page.locator('.result-peek').count(),0);
  await page.locator('.results-carousel').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[data-slide="2"]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-slide="0"]').click();
  await page.locator('.results-carousel').focus();
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator('[data-slide="0"]').getAttribute('aria-pressed'),'true');
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[data-slide="1"]').getAttribute('aria-pressed'),'true');
  checks.push('Three real cards, bounded arrows and keyboard navigation, pagination, zoom, and Escape work');
  assert.equal(await page.locator('.evaluation-details,.runtime-table').count(),0);
  assert.doesNotMatch(await page.locator('#evaluation').innerText(),/评测范围、评分方式与运行开销/);
  assert.match(await page.locator('.overview-lead').innerText(),/^老师傅平台将分散/);
  assert.deepEqual(await page.locator('.representation h3 strong').allTextContents(),['06','09','06']);
  checks.push('Overview wording and inline numbers updated; evaluation disclosure removed');
  await page.locator('[data-lang="en"]').click();
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  assert.match(await page.locator('.overview-lead').innerText(),/^The KUPAS MASTER platform/);
  assert.match(await page.locator('#layer-question').innerText(),/evidence supports/);
  assert.match(await page.locator('.current-report').first().getAttribute('href'),/Report-EN.pdf/);
  assert.match(await page.locator('[data-page="6"]').getAttribute('href'),/Report-EN.pdf#page=6/);
  const untranslated=await page.locator('[data-en]').evaluateAll(items=>items.filter(el=>el.textContent!==el.dataset.en).map(el=>el.outerHTML.slice(0,120)));
  assert.deepEqual(untranslated,[]);
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  checks.push('English translation, report-link switching, and saved language verified');
  const viewports=[1440,1024,768,700,390,320];
  for(const lang of ['zh','en']){
    await page.locator(`[data-lang="${lang}"]`).click();
    for(const width of viewports){
      await page.setViewportSize({width,height:950});
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      await page.evaluate(()=>window.scrollTo(0,0));
      const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      if(overflow.scroll>overflow.width)console.log(await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.right>innerWidth&&!el.closest('.results-viewport,dialog')}).map(el=>({tag:el.tagName,class:el.className,right:el.getBoundingClientRect().right,width:el.getBoundingClientRect().width,display:getComputedStyle(el).display,fontSize:getComputedStyle(el).fontSize,text:el.textContent.slice(0,90)})).slice(0,12)));
      assert.ok(overflow.scroll<=overflow.width,`${lang} ${width}px overflow: ${JSON.stringify(overflow)}`);
      const reports=await page.locator('.hero-report-card').evaluateAll(cards=>cards.map(card=>{
        const bounds=card.getBoundingClientRect(), cover=card.querySelector('img').getBoundingClientRect();
        return {top:bounds.top,bottom:bounds.bottom,left:bounds.left,right:bounds.right,coverVisible:cover.width>=52&&cover.height>0,contained:[...card.querySelectorAll('img,h2,p,a')].every(el=>{const r=el.getBoundingClientRect();return r.left>=bounds.left&&r.right<=bounds.right&&r.bottom<=bounds.bottom}),downloadHeight:card.querySelector('a').getBoundingClientRect().height};
      }));
      assert.ok(reports.every(card=>card.coverVisible&&card.contained&&card.downloadHeight>=44),`${lang} ${width}px report content: ${JSON.stringify(reports)}`);
      assert.ok(width>800?reports[0].top===reports[1].top&&reports[0].right<reports[1].left:reports[0].bottom<reports[1].top,`${lang} ${width}px report layout: ${JSON.stringify(reports)}`);
      const masthead=await page.locator('.header-inner').evaluate(header=>{
        const brand=header.querySelector('.brand').getBoundingClientRect(),logos=header.querySelector('.partner-logos').getBoundingClientRect();
        return {rightOfBrand:logos.left>brand.right,aligned:Math.abs((logos.top+logos.bottom-brand.top-brand.bottom)/2)<2,height:header.getBoundingClientRect().height};
      });
      assert.ok(masthead.rightOfBrand&&masthead.aligned&&masthead.height<=90,`${lang} ${width}px header: ${JSON.stringify(masthead)}`);
      for(let selected=0;selected<3;selected++){
        await page.locator(`[data-slide="${selected}"]`).click();
        await settle();
        const cards=await page.locator('.results-stage').evaluate(stage=>{
          const bounds=stage.getBoundingClientRect();
          return [...stage.querySelectorAll('.result-slide')].map(el=>{
            const rect=el.getBoundingClientRect(), glass=getComputedStyle(el,'::after');
            return {exposed:Math.max(0,Math.min(bounds.right,rect.right)-Math.max(bounds.left,rect.left)),width:rect.width,glass:glass.backdropFilter,frost:Number(glass.opacity),src:el.querySelector('img').getAttribute('src')};
          });
        });
        for(const [index,card] of cards.entries()){
          assert.match(card.src,new RegExp(`-${lang}\\.svg$`));
          if(index===selected){assert.ok(Math.abs(card.exposed-card.width)<1);assert.equal(card.frost,0)}
          else if(Math.abs(index-selected)===1){assert.ok(card.exposed>=20&&card.exposed<=120,`${lang} ${width}px selected ${selected}: ${JSON.stringify(cards)}`);assert.match(card.glass,/blur\(0\.65px\)/)}
          else assert.equal(card.exposed,0);
        }
      }
      await page.locator('[data-slide="0"]').click();
      if(width===1440||width===390){
        await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
        await settle();
        await page.screenshot({path:path.join(qa,`${lang}-${width}-full.png`),fullPage:true});
        await page.screenshot({path:path.join(qa,`${lang}-${width}-hero.png`)});
        await page.locator('.hero-reports').screenshot({path:path.join(qa,`${lang}-${width}-hero-reports.png`),style:'.site-header,.skip-link{visibility:hidden}'});
        await page.locator('.site-header').screenshot({path:path.join(qa,`${lang}-${width}-header.png`)});
        await page.locator('#overview').screenshot({path:path.join(qa,`${lang}-${width}-overview.png`),style:'.site-header,.skip-link{visibility:hidden}'});
        await page.locator('#workflow').screenshot({path:path.join(qa,`${lang}-${width}-workflow.png`),style:'.site-header,.skip-link{visibility:hidden}'});
        await page.locator('.site-footer').screenshot({path:path.join(qa,`${lang}-${width}-footer.png`),style:'.site-header,.skip-link{visibility:hidden}'});
        if(width===1440){
          await page.locator('#framework').screenshot({path:path.join(qa,`${lang}-framework.png`),style:'.site-header,.skip-link{visibility:hidden}'});
          await page.locator('#technology').screenshot({path:path.join(qa,`${lang}-technology.png`)});
          await page.locator('#evaluation').screenshot({path:path.join(qa,`${lang}-evaluation.png`),style:'.site-header,.skip-link{visibility:hidden}'});
          await page.locator('#report').screenshot({path:path.join(qa,`${lang}-report.png`)});
        }
        for(let i=0;i<3;i++){
          await page.locator(`[data-slide="${i}"]`).click();
          assert.match(await page.locator(`[data-result="${i}"] img`).getAttribute('src'),new RegExp(`-${lang}\\.svg$`));
          await page.locator('#evaluation').screenshot({path:path.join(qa,`${lang}-${width}-result-${i}.png`),style:'.site-header,.skip-link{visibility:hidden}'});
        }
        await page.locator('[data-slide="0"]').click();
      }
    }
  }
  checks.push('Chinese and English have no horizontal overflow at 320, 390, 700, 768, 1024, and 1440 px');
  checks.push('Real neighboring cards are partly visible with light frost; no wrapped neighbor at either boundary, in both languages and six widths');
  await page.locator('[data-slide="0"]').click();
  await page.locator('.results-stage').scrollIntoViewIfNeeded();
  await settle();
  const peekPoint=await page.locator('[data-result="1"]').evaluate(el=>{
    const rect=el.getBoundingClientRect(), stage=el.closest('.results-stage').getBoundingClientRect();
    return {x:(Math.max(stage.left,rect.left)+Math.min(stage.right,rect.right))/2,y:Math.min(innerHeight-40,Math.max(180,rect.top+rect.height/2))};
  });
  await page.mouse.click(peekPoint.x,peekPoint.y);
  assert.equal(await page.locator('[data-slide="1"]').getAttribute('aria-pressed'),'true');
  checks.push('Clicking the actual visible edge selects its card');
  await page.setViewportSize({width:1440,height:950});
  await page.locator('[data-slide="0"]').click();
  await page.locator('.results-stage').scrollIntoViewIfNeeded();
  await settle();
  const dragBounds=await page.locator('[data-result="0"]').boundingBox();
  const dragX=dragBounds.x+dragBounds.width-140,dragY=Math.min(800,Math.max(200,dragBounds.y+dragBounds.height/2));
  const trackX=()=>page.locator('.results-track').evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
  const before=await page.locator('[data-result="1"]').boundingBox();
  await page.mouse.move(dragX,dragY);
  await page.mouse.down();
  await page.mouse.move(dragX-150,dragY,{steps:10});
  assert.ok(Math.abs(await trackX()+150)<1,'Track must follow the mouse before release');
  const during=await page.locator('[data-result="1"]').boundingBox();
  assert.ok(Math.abs(during.x-before.x+150)<1,'The same adjacent card must move with the track');
  assert.equal(await page.locator('[data-slide="0"]').getAttribute('aria-pressed'),'true');
  await page.screenshot({path:path.join(qa,'mouse-drag-in-progress.png')});
  await page.mouse.up();
  assert.equal(await page.locator('[data-slide="1"]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('.figure-dialog').evaluate(el=>el.open),false);
  for(const selected of [0,2]){
    await page.locator(`[data-slide="${selected}"]`).click();
    await settle();
    const boundary=await trackX();
    await page.mouse.move(720,dragY);
    await page.mouse.down();
    await page.mouse.move(720+(selected===0?180:-180),dragY,{steps:10});
    assert.ok(Math.abs(await trackX()-boundary)<1,'Dragging cannot pass either end');
    await page.mouse.up();
    assert.equal(await page.locator(`[data-slide="${selected}"]`).getAttribute('aria-pressed'),'true');
  }
  checks.push('Mouse drag moves the original track continuously before release, snaps without accidental zoom, and stops at both ends');
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.locator('.menu-toggle').click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
  await page.locator('#mobile-nav a[href="#technology"]').click();
  assert.equal(await page.locator('#mobile-nav').isVisible(),false);
  assert.match(page.url(),/#technology$/);
  checks.push('Mobile navigation opens, navigates, and closes');
  await page.locator('[data-slide="0"]').click();
  await page.locator('[data-zoom="0"]').scrollIntoViewIfNeeded();
  await settle();
  const bounds=await page.locator('[data-zoom="0"]').boundingBox();
  const swipeY=Math.min(700,Math.max(160,bounds.y+80));
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:320,y:swipeY}]});
  for(const x of [280,220,160,90])await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:swipeY}]});
  await settle();
  assert.ok(Math.abs(await trackX()+230)<1,'Track must follow a touch drag before release');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await settle();
  assert.equal(await page.locator('[data-slide="1"]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('.figure-dialog').evaluate(el=>el.open),false);
  await cdp.detach();
  checks.push('Real touch swipe advances the carousel without accidentally opening the zoom view');
  for(const lang of ['ZH','EN']){
    const name=`KUPAS-MASTER-Technical-Report-${lang}.pdf`;
    const response=await page.request.get(base+'assets/reports/'+name);
    assert.equal(response.status(),200);
    assert.match(response.headers()['content-type'],/pdf/);
    const body=await response.body();
    const local=fs.readFileSync(path.join(root,'dist/assets/reports',name));
    assert.equal(createHash('sha256').update(body).digest('hex'),createHash('sha256').update(local).digest('hex'));
    const downloadPromise=page.waitForEvent('download');
    await page.locator(`a[download][href$="${name}"]`).first().click();
    const download=await downloadPromise;
    assert.equal(download.suggestedFilename(),name);
    await download.cancel();
  }
  checks.push('Both PDFs respond, preserve exact bytes, and trigger correctly named downloads');
  await page.setViewportSize({width:640,height:950});
  await page.addStyleTag({content:'html {font-size: 200%;}'});
  const enlarged=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
  assert.ok(enlarged,'Text enlargement causes horizontal overflow');
  checks.push('Text enlargement smoke check passed');
  assert.deepEqual(errors,[]);
  const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await nojs.goto(base);
  assert.ok(await nojs.locator('h1').isVisible());
  assert.equal(await nojs.locator('a[download]').count(),4);
  checks.push('Chinese content and both PDF downloads available without JavaScript');
  await browser.close();
  const result={passed:true,checks,browserErrors:errors};
  fs.writeFileSync(path.join(qa,'verification.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
}
run().catch(async error=>{console.error(error);await activeBrowser?.close();process.exitCode=1});
