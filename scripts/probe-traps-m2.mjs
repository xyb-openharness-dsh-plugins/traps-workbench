#!/usr/bin/env node
/* TRAPS route probe. Explicit URL is required so it cannot silently probe a sample app. */
import puppeteer from 'puppeteer-core'
const args=process.argv.slice(2), at=args.indexOf('--url')
if(at<0||!args[at+1]) throw new Error('Usage: node scripts/probe-traps-m2.mjs --url http://127.0.0.1:4173/prototypes/v0.2/index.html?prototype')
const url=args[at+1], routes=['dash','record','metrics','trials','files','settings']
const browser=await puppeteer.launch({executablePath:process.env.CHROMIUM||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})
const page=await browser.newPage(), errors=[]
page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
await page.setViewport({width:1440,height:980}); await page.goto(url,{waitUntil:'networkidle0'}); await page.waitForSelector('h1')
let failed=false
for(const route of routes){errors.length=0;await page.evaluate(r=>window.TRAPSApp.nav(r),route);await new Promise(r=>setTimeout(r,120));const got=await page.evaluate(()=>({h1:document.querySelector('h1')?.textContent||'',text:document.body.innerText.length,overflow:document.documentElement.scrollWidth-innerWidth}));const ok=!!got.h1&&got.text>250&&!errors.length;failed ||= !ok;console.log(`${ok?'PASS':'FAIL'} ${route}: h1=${got.h1.slice(0,30)} text=${got.text} overflow=${got.overflow} errors=${errors.join('|')}`)}
await page.setViewport({width:390,height:844});await new Promise(r=>setTimeout(r,120));const mobile=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);console.log(`${mobile<=1?'PASS':'FAIL'} mobile overflow=${mobile}`);failed ||= mobile>1;await browser.close();process.exit(failed?1:0)
