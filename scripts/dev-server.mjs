#!/usr/bin/env node
/* 本机开发/探针服务：同一 Workbench 数据层 + public 静态文件。
   不是装机验证；Desktop 装机仍需 pack/profile 检查。 */
import http from 'node:http'
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs'
import { join, dirname, extname, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Workbench, forbiddenRoot } from '../dsh/workbench.js'
import { handleProfileWrite } from '../dsh/profile-route.js'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const PORT = Number(process.env.PORT || 4173)
const DATA_ROOT = process.env.TRAPS_DATA_ROOT || join(ROOT, '.dev-data')
mkdirSync(DATA_ROOT, { recursive: true })
const w = new Workbench({ root: DATA_ROOT })
const manifest = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' }
const publicDir = join(ROOT, 'public')
const protoDir = join(ROOT, 'prototypes/v0.2')

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' })
  res.end(body)
}
function json(res, status, body) { send(res, status, JSON.stringify(body), 'application/json; charset=utf-8') }
function file(res, base, rel) {
  const safe = normalize(rel).replace(/^([.][.][\\/])+/, '')
  const path = join(base, safe)
  if (!path.startsWith(base) || !existsSync(path) || !statSync(path).isFile()) return send(res, 404, 'Not found')
  send(res, 200, readFileSync(path), types[extname(path)] || 'application/octet-stream')
}
function body(req) {
  return new Promise((resolve, reject) => {
    let n = 0; const parts = []
    req.on('data', (c) => { n += c.length; if (n > 64 * 1024) { reject(Object.assign(new Error('请求体超过 64KB'), { status: 413 })); req.destroy(); return } parts.push(c) })
    req.on('end', () => { try { resolve(parts.length ? JSON.parse(Buffer.concat(parts)) : {}) } catch { reject(Object.assign(new Error('JSON 解析失败'), { status: 400 })) } })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://localhost')
    if (u.pathname === '/api/traps-workbench/health') return json(res, 200, { ok: true, version: manifest.version, capabilities: ['health', 'bootstrap', 'write', 'trials', 'root', 'ui'], dataRoot: w.currentRootInfo().dir })
    if (u.pathname === '/api/traps-workbench/bootstrap' && req.method === 'GET') return json(res, 200, w.bootstrap())
    if (u.pathname === '/api/traps-workbench/root' && req.method === 'GET') return json(res, 200, { ok: true, ...w.currentRootInfo() })
    if (u.pathname === '/api/traps-workbench/root' && req.method === 'POST') { const b = await body(req); const reason = forbiddenRoot(b.dir); if (reason) return json(res, 400, { error: reason }); return json(res, 200, { ok: true, ...w.setRoot(b.dir) }) }
    if (u.pathname === '/api/traps-workbench/subjects' && req.method === 'POST') { const b = await body(req); return json(res, 200, { ...handleProfileWrite('POST', '/subjects', b, w), bootstrap: w.bootstrap() }) }
    if (u.pathname === '/api/traps-workbench/entries' && req.method === 'POST') { const b = await body(req); return json(res, 200, { ...w.addEntry(b.profileKey, b.kind, b.data), bootstrap: w.bootstrap() }) }
    if (u.pathname === '/api/traps-workbench/flares' && req.method === 'POST') { const b = await body(req); return json(res, 200, { ...w.addFlare(b.profileKey, b.data), bootstrap: w.bootstrap() }) }
    if (u.pathname === '/api/traps-workbench/privacy' && req.method === 'POST') { const b = await body(req); return json(res, 200, { ...w.setPrivacy(b.profileKey, b.kind, b.id, !!b.private), bootstrap: w.bootstrap() }) }
    if (u.pathname === '/api/traps-workbench/saved-trials' && req.method === 'POST') { const b = await body(req); return json(res, 200, { ...w.saveTrial(b.profileKey, b.trialKey, b.state), bootstrap: w.bootstrap() }) }
    if (u.pathname === '/api/traps-workbench/trials' && req.method === 'GET') return json(res, 200, w.trialMatch(u.searchParams.get('keyword') || ''))
    if (u.pathname === '/api/traps-workbench/ui' || u.pathname === '/api/traps-workbench/ui/' || u.pathname === '/api/traps-workbench/ui/index.html') return file(res, publicDir, 'index.html')
    if (u.pathname.startsWith('/api/traps-workbench/ui/')) return file(res, publicDir, u.pathname.slice('/api/traps-workbench/ui/'.length))
    if (u.pathname.startsWith('/prototypes/v0.2/')) return file(res, protoDir, u.pathname.slice('/prototypes/v0.2/'.length))
    if (u.pathname === '/prototypes/v0.2' || u.pathname === '/prototypes/v0.2/') return file(res, protoDir, 'index.html')
    send(res, 404, 'Not found')
  } catch (error) { json(res, error.status || 500, { error: error.message || String(error) }) }
})
server.listen(PORT, '127.0.0.1', () => console.log(`TRAPS dev server http://127.0.0.1:${PORT}/api/traps-workbench/ui/ (data ${DATA_ROOT})`))
process.on('SIGTERM', () => { w.close(); server.close(() => process.exit(0)) })
process.on('SIGINT', () => { w.close(); server.close(() => process.exit(0)) })
