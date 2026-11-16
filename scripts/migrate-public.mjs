#!/usr/bin/env node
/* public/ 定点移植：业务原型逐字节复制，不做“两套维护”。
   原型的 file:// 演示与开发版共用同一份 app.js；开发版通过 /api/traps-workbench 判断数据源。
   用法：node scripts/migrate-public.mjs [--check] */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
export const SRC = join(ROOT, 'prototypes/v0.2')
export const OUT = join(ROOT, 'public')
export const FILES = ['index.html', 'app.js', 'style.css', 'demo-data.js', 'primer-data.js', 'primer.js', 'primer.css']
export function expected(name) { return readFileSync(join(SRC, name)) }

function check() {
  const problems = []
  for (const f of FILES) {
    let current = null
    try { current = readFileSync(join(OUT, f)) } catch { problems.push(`public/${f} 缺失（跑 npm run build:public）`); continue }
    if (!current.equals(expected(f))) problems.push(`public/${f} 与 prototypes/v0.2 不一致（跑 npm run build:public 后人工复核）`)
  }
  if (problems.length) { console.error('✗ public/ 与原型逐字节移植不一致：\n  ' + problems.join('\n  ')); process.exit(1) }
  console.log(`✓ public/ 七件与 prototypes/v0.2 逐字节一致（${FILES.length} 件）`)
}
function build() {
  mkdirSync(OUT, { recursive: true })
  for (const f of FILES) writeFileSync(join(OUT, f), expected(f))
  console.log(`✓ public/ 已从 prototypes/v0.2 移植（${FILES.length} 件逐字节）`)
}
const invoked = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href
if (invoked) { if (process.argv.includes('--check')) check(); else build() }
