#!/usr/bin/env node
/* ui-parity：public/ 与 prototypes/v0.2 逐字节一致（白名单替换点已取消，避免两套代码分叉）。 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FILES, SRC, OUT } from './migrate-public.mjs'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const problems = []
for (const f of FILES) {
  let a, b
  try { a = readFileSync(join(SRC, f)) } catch { problems.push(`prototypes/v0.2/${f} 缺失`); continue }
  try { b = readFileSync(join(OUT, f)) } catch { problems.push(`public/${f} 缺失`); continue }
  if (!a.equals(b)) problems.push(`public/${f} 与原型不一致`)
}
if (problems.length) { console.error('✗ ui-parity 不一致：\n  ' + problems.join('\n  ')); process.exit(1) }
console.log(`✓ ui-parity：public/ 八件与 prototypes/v0.2 逐字节一致`)
