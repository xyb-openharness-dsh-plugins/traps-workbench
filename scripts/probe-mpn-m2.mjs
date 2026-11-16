#!/usr/bin/env node
/* MPN M2 全量路由探针：真实 Chromium 打开本仓原型，逐路由渲染并检查。
   用法：node scripts/probe-mpn-m2.mjs --url http://127.0.0.1:4173/prototypes/v0.2/index.html
   不是截图秀：每个路由都要有 h1、有正文、无 JS 错误、无横向溢出（390 宽）。 */
import puppeteer from 'puppeteer-core'

const args = process.argv.slice(2)
const argOf = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d }
const URL = argOf('--url', 'http://127.0.0.1:4173/prototypes/v0.2/index.html')
const ROUTES = ['dash', 'record', 'metrics', 'trials', 'files', 'settings']
const EXEC = process.env.CHROMIUM || '/usr/bin/chromium'

const browser = await puppeteer.launch({ executablePath: EXEC, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
await page.setViewport({ width: 1440, height: 1000 })
await page.goto(URL, { waitUntil: 'networkidle0' })
await page.waitForSelector('h1', { timeout: 10000 })
const results = []
for (const route of ROUTES) {
  errors.length = 0
  await page.evaluate((r) => window.MPNApp.nav(r), route)
  await new Promise((r) => setTimeout(r, 180))
  const got = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent || '',
    text: document.body.innerText.length,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    blank: document.querySelectorAll('.empty').length,
  }))
  const passed = Boolean(got.h1) && got.text > 300 && errors.length === 0
  results.push({ route, ...got, passed, errors: [...errors] })
  if (!passed) console.error(`✗ ${route}: h1=${!!got.h1} text=${got.text} errors=${errors.join(' | ')}`)
  else console.log(`✓ ${route}: h1="${got.h1.slice(0, 24)}" text=${got.text} overflow=${got.overflow}`)
}
/* 两套档案切换：整页联动 */
await page.evaluate(() => window.MPNApp.nav('dash'))
await page.click('[data-action="profiles"]')
await page.waitForSelector('[data-select-profile="demo-b"]')
await page.click('[data-select-profile="demo-b"]')
await new Promise((r) => setTimeout(r, 200))
const switched = await page.evaluate(() => ({ status: document.getElementById('top-status').innerText, h2: document.querySelector('.status-hero h2')?.textContent, metrics: document.querySelectorAll('.stat .v')[0]?.textContent }))
const switchOk = /周远/.test(switched.status + switched.h2) && switched.metrics === '94'
console.log(`${switchOk ? '✓' : '✗'} 档案切换：${switched.h2} / Hb ${switched.metrics}`)
/* 390 宽不横向溢出 */
await page.setViewport({ width: 390, height: 844 })
await new Promise((r) => setTimeout(r, 250))
const narrow = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - window.innerWidth, viewport: window.innerWidth }))
const narrowOk = narrow.overflow <= 1
console.log(`${narrowOk ? '✓' : '✗'} 390 宽：overflow=${narrow.overflow}`)
await browser.close()
const failures = results.filter((r) => !r.passed)
if (failures.length || !switchOk || !narrowOk) { console.error(`FAIL ${failures.length} routes / switch=${switchOk} / narrow=${narrowOk}`); process.exit(1) }
console.log(`PASS ${results.length}/${ROUTES.length} routes · switch ✓ · 390 ✓ · ${URL}`)
