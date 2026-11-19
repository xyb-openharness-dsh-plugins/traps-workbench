#!/usr/bin/node
/**
 * public/ 定点移植（小热宝 HeatPal · TRAPS 版）：复制原型 → 定点替换，不手抄。
 *
 * 替换点（只有这些，其余与 prototypes/v0.2 逐字符相同——ui-parity 口径）：
 *   1. index.html：加 noindex；标题去「交互原型」字样并接开发版措辞；状态条改开发版口径；
 *      「原型 v0.2」版本 chip 走 __VERSION_DISPLAY__ 占位（dsh/static.js 注入，两种形态同一份文件）；
 *      primer 共享件路径改写 ../../assets/patterns/ → ./patterns/；
 *   2. 其余六件（demo-data / demo-data-b / primer-data / metric-model / pathway-model / host-bridge）
 *      逐字节复制；patterns/ 从 assets/patterns 复制 disease-primer 两件。
 *
 * API 就绪口径：host-bridge.js 只在 window.__heatpalApiReady 为真时请求 bootstrap；
 * 该标志由 dsh/static.js 在服务 index.html 时注入，静态/file:// 形态天然不发请求（零 404）。
 *
 * 用法：node scripts/migrate-public.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC = join(ROOT, 'prototypes/v0.2');
const OUT = join(ROOT, 'public');
const CHECK = process.argv.includes('--check');
const FILES = ['index.html', 'demo-data.js', 'demo-data-b.js', 'primer-data.js', 'metric-model.js', 'pathway-model.js', 'host-bridge.js'];
const PATTERN_FILES = [['disease-primer.js', 'disease-primer.js'], ['disease-primer.css', 'disease-primer.css']];

const TITLE_OLD = '<title>小热宝 · 交互原型 v0.2</title>';
const TITLE_NEW = '<title>小热宝 · TRAPS 工作台</title>\n<meta name="robots" content="noindex,nofollow">';
const BAR_OLD = '<span class="status" title="合成示例 · 仅本页临时演示 · 未连接宿主">合成示例 · 仅本页临时演示 · 未连接宿主</span>';
const BAR_NEW = '<span class="status" title="开发版 · 本机数据 · 不上传 · AI 面板由宿主提供">开发版 · 本机数据 · 不上传 · AI 面板由宿主提供</span>';
const VER_OLD = '<span class="version">原型 v0.2</span>';
const VER_NEW = '<span class="version">__VERSION_DISPLAY__</span>';

function migrateIndex(s) {
  return s
    .replace(TITLE_OLD, TITLE_NEW)
    .replace(BAR_OLD, BAR_NEW)
    .replace(VER_OLD, VER_NEW)
    .replace(/\.\.\/\.\.\/assets\/patterns\//g, './patterns/');
}

function expected(name) {
  const src = readFileSync(join(SRC, name), 'utf8');
  if (name === 'index.html') return migrateIndex(src);
  return src;
}

export { FILES, PATTERN_FILES, migrateIndex, expected, SRC, OUT };

function check() {
  const problems = [];
  for (const f of FILES) {
    let current = '';
    try { current = readFileSync(join(OUT, f), 'utf8'); } catch { problems.push(`public/${f} 缺失（跑 npm run build:public）`); continue; }
    const want = expected(f);
    if (current !== want) problems.push(`public/${f} 与原型定点移植产物不一致（跑 npm run build:public 后人工复核 diff）`);
  }
  for (const [srcName, outName] of PATTERN_FILES) {
    let a = '', b = '';
    try { a = readFileSync(join(OUT, 'patterns', outName), 'utf8'); } catch { problems.push(`public/patterns/${outName} 缺失`); continue; }
    try { b = readFileSync(join(ROOT, 'assets/patterns', srcName), 'utf8'); } catch { problems.push(`assets/patterns/${srcName} 缺失`); continue; }
    if (a !== b) problems.push(`public/patterns/${outName} 与 assets/patterns/${srcName} 不一致`);
  }
  if (problems.length) { console.error('✗ public/ 与 prototypes/v0.2 定点移植不一致：\n  ' + problems.join('\n  ')); process.exit(1); }
  console.log(`✓ public/ 七件与 prototypes/v0.2 定点移植一致（index.html 白名单替换点，其余六件逐字节相同；patterns 两件与 assets 一致）`);
}

function build() {
  mkdirSync(OUT, { recursive: true });
  mkdirSync(join(OUT, 'patterns'), { recursive: true });
  for (const f of FILES) writeFileSync(join(OUT, f), expected(f));
  for (const [srcName, outName] of PATTERN_FILES) writeFileSync(join(OUT, 'patterns', outName), readFileSync(join(ROOT, 'assets/patterns', srcName), 'utf8'));
  console.log(`✓ public/ 已从 prototypes/v0.2 定点移植（${FILES.length} 件 + patterns 2 件）`);
}

/* 仅直接执行时跑主流程（被测试/检查器 import 时只取上面的纯函数） */
const INVOKED_DIRECTLY = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
/* Windows/软链兜底：路径比较失败时退回 argv 特征判断 */
const _invoked = INVOKED_DIRECTLY || (process.argv[1] && process.argv[1].endsWith('migrate-public.mjs'));
if (_invoked) {
  if (CHECK) check();
  else build();
}
