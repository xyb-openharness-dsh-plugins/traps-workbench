#!/usr/bin/env node
/**
 * ui-parity 闸门：public/ 与 prototypes/v0.2 的移植一致性（M5 检查链追加项）。
 *
 * 判据（与 scripts/migrate-public.mjs 同源，避免两套口径漂移）：
 *   - demo-data.js / demo-data-b.js / primer-data.js / metric-model.js /
 *     pathway-model.js / host-bridge.js：逐字节相同；
 *   - index.html：等于「原型 + 白名单替换点」产物（业务文件不改字符）；
 *   - patterns/ 两件与 assets/patterns 同源（判据也在 migrate-public.mjs）。
 *
 * 用法：node scripts/check-ui-parity.mjs
 * 退出码：0 一致 / 1 不一致
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FILES, PATTERN_FILES, expected, OUT, SRC } from './migrate-public.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BYTE_COPY = FILES.filter((f) => f !== 'index.html');
const problems = [];

for (const f of BYTE_COPY) {
  const proto = readFileSync(join(SRC, f));
  let pub = null;
  try { pub = readFileSync(join(OUT, f)); } catch { problems.push(`public/${f} 缺失`); continue; }
  if (!proto.equals(pub)) problems.push(`public/${f} 与原型逐字节不一致`);
}
for (const f of FILES) {
  if (f === 'index.html') continue; // 上面 BYTE_COPY 已排除；index.html 走 expected()
  let pub = '';
  try { pub = readFileSync(join(OUT, f), 'utf8'); } catch { problems.push(`public/${f} 缺失`); continue; }
  if (pub !== expected(f)) problems.push(`public/${f} 与定点移植产物不一致（白名单之外被改动）`);
}

if (problems.length) {
  console.error('✗ ui-parity 不一致：\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log(`✓ ui-parity：public/ 与 prototypes/v0.2 定点移植一致（${BYTE_COPY.length} 件逐字节、index.html 仅白名单替换点、patterns ${PATTERN_FILES.length} 件）`);
