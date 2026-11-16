/* MPN 数据层：本地 sqlite、两套合成档案、用户档案、8 类记录、试验快照与收藏。
   约束：不生成个体判断/风险分级/入组资格；pct 只在展示层计算；所有个人记录带 is_private。 */
import { DatabaseSync } from 'node:sqlite'
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { homedir } from 'node:os'
import { randomBytes } from 'node:crypto'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = JSON.parse(readFileSync(join(HERE, '..', 'package.json'), 'utf8'))
const SCHEMA = readFileSync(join(HERE, '..', 'schema', '0001_initial.sql'), 'utf8')
const DEMO = JSON.parse(readFileSync(join(HERE, '..', 'data', 'demo-data.json'), 'utf8'))
const KINDS = new Set(['symptom', 'lab', 'treatment', 'question', 'hospital', 'report', 'doc', 'mind'])
const FACT_FIELDS = new Set(['subtype', 'driver', 'age', 'phase', 'prior_therapy', 'prior_jak', 'calr', 'mpl', 'diagnosed_on'])
const LOCAL_DATE = () => {
  const d = new Date()
  const off = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - off).toISOString().slice(0, 10)
}

function forbiddenRoot(dir) {
  const p = resolve(String(dir || '')).replace(/[\\/]+$/, '') || '/'
  const home = resolve(homedir())
  const tmpRoots = ['/tmp', '/private/tmp', '/var/tmp']
  const badExact = new Set([home, '/', ...tmpRoots, join(home, 'Desktop'), join(home, 'Downloads')])
  if (badExact.has(p)) return '主目录本身、桌面、下载根目录或 tmp 不能作为资料目录'
  if (/[\\/](Desktop|桌面|Downloads?|下载)[\\/]?$/i.test(p)) return '桌面、下载根目录不能作为资料目录'
  if (/^[\\/](private[\\/])?tmp([\\/]|$)/i.test(p)) return 'tmp 不能作为资料目录'
  if (/^[A-Za-z]:[\\/](Users[\\/][^\\/]+)?[\\/]?$/.test(p)) return '主目录本身不能作为资料目录'
  return null
}

function idOf(kind, rowid) {
  const prefix = kind === 'metric' ? 'm' : kind === 'saved_trial' ? 's' : 'e'
  return `${prefix}${rowid}`
}
function rowidOf(value) {
  const m = String(value || '').match(/(\d+)\s*$/)
  return m ? Number(m[1]) : null
}
function parse(value, fallback) {
  try { return JSON.parse(value) } catch { return fallback }
}
function text(value, max = 2000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export class Workbench {
  constructor({ root } = {}) {
    this.defaultRoot = resolve(root || process.env.MPN_DATA_ROOT || join(homedir(), '.mpn-workbench'))
    this.pointer = join(this.defaultRoot, '.data-root.json')
    this.db = null
    this.root = this.resolveStartRoot()
    this.open()
  }

  resolveStartRoot() {
    try {
      const saved = JSON.parse(readFileSync(this.pointer, 'utf8'))
      if (saved?.dataRoot && !forbiddenRoot(saved.dataRoot)) return resolve(saved.dataRoot)
    } catch { /* 首次启动或指针损坏 */ }
    return this.defaultRoot
  }

  open() {
    mkdirSync(this.root, { recursive: true })
    this.dbPath = join(this.root, 'mpn.sqlite')
    this.db = new DatabaseSync(this.dbPath)
    this.db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;')
    if (Number(this.db.prepare('PRAGMA user_version').get()?.user_version || 0) < 1) this.db.exec(SCHEMA)
    this.db.prepare('CREATE TABLE IF NOT EXISTS app_setting (key TEXT PRIMARY KEY, value TEXT, updated_at TEXT NOT NULL)').run()
    this.setSetting('data_root', this.root)
    this.seedIfNeeded()
    this.syncTrialSnapshot()
    writeFileSync(this.pointer, JSON.stringify({ dataRoot: this.root, updatedAt: new Date().toISOString() }, null, 2) + '\n')
  }

  close() { try { this.db?.close() } catch { /* 已关 */ } this.db = null }

  setSetting(key, value) {
    this.db.prepare('INSERT INTO app_setting(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at')
      .run(key, String(value), new Date().toISOString())
  }

  getSetting(key) {
    return this.db.prepare('SELECT value FROM app_setting WHERE key=?').get(key)?.value ?? null
  }

  seedIfNeeded() {
    const seeded = this.getSetting('seed_version')
    if (seeded === 'mpn-demo-v1') return
    const count = Number(this.db.prepare('SELECT COUNT(*) AS n FROM profiles').get()?.n || 0)
    if (count === 0) this.seedDemo()
    this.setSetting('seed_version', 'mpn-demo-v1')
  }

  seedDemo() {
    const now = new Date().toISOString()
    const ip = this.db.prepare('INSERT INTO profiles(profile_key,name,tag,subtype,diagnosed_on,summary,is_demo,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)')
    const iff = this.db.prepare('INSERT INTO profile_facts(profile_key,field,label,value,source,confirmed,created_at) VALUES(?,?,?,?,?,?,?)')
    const im = this.db.prepare('INSERT INTO metrics(profile_key,metric_key,label,category,value_num,value_text,unit,ref_low,ref_high,method,institution,measured_on,source,is_private,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
    const ie = this.db.prepare('INSERT INTO entries(profile_key,kind,title,body,data_json,event_date,source,is_private,created_at) VALUES(?,?,?,?,?,?,?,?,?)')
    const it = this.db.prepare('INSERT INTO treatments(profile_key,name,status,started_on,ended_on,note,source,created_at) VALUES(?,?,?,?,?,?,?,?)')
    this.db.exec('BEGIN')
    try {
      for (const p of DEMO.profiles) {
        ip.run(p.profile_key, p.name, p.tag, p.subtype, p.diagnosed_on, p.summary || '', p.is_demo ? 1 : 0, now, now)
        for (const f of p.facts || []) iff.run(p.profile_key, f.field, f.label || f.field, f.value == null ? null : String(f.value), f.source || null, f.confirmed ? 1 : 0, now)
        for (const m of p.metrics || []) im.run(p.profile_key, m.key, m.label, m.category, m.value == null ? null : Number(m.value), m.value == null ? null : String(m.value), m.unit || null, m.ref_low ?? null, m.ref_high ?? null, m.method || null, m.institution || null, m.date, m.source || null, m.is_private ? 1 : 0, now)
        for (const e of p.entries || []) ie.run(p.profile_key, e.kind, e.title || '', e.body || '', JSON.stringify(e.data || {}), e.date, e.source || null, e.is_private ? 1 : 0, now)
        for (const t of p.treatments || []) it.run(p.profile_key, t.name, t.status || null, t.started_on || null, t.ended_on || null, t.note || null, t.source || null, now)
      }
      this.db.exec('COMMIT')
    } catch (error) { this.db.exec('ROLLBACK'); throw error }
  }

  syncTrialSnapshot() {
    const dir = join(HERE, '..', 'research', 'mpn-2026')
    const manifestPath = join(dir, 'manifest.json')
    if (!existsSync(manifestPath)) return
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    const jsonlPath = join(dir, 'trials-2026.jsonl')
    if (!existsSync(jsonlPath)) return
    const rows = readFileSync(jsonlPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line))
    const ins = this.db.prepare(`INSERT INTO trials(record_id,merged_sources,source_id,title,study_type,sponsors,registry_numbers,dates,source_url,retrieved_at,status_note,snapshot_date,conditions_json,phase_json,countries_json,eligibility_text,summary,raw_json,relevant)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(record_id) DO UPDATE SET
      title=excluded.title, study_type=excluded.study_type, sponsors=excluded.sponsors,
      registry_numbers=excluded.registry_numbers, dates=excluded.dates, source_url=excluded.source_url,
      retrieved_at=excluded.retrieved_at, status_note=excluded.status_note, snapshot_date=excluded.snapshot_date,
      conditions_json=excluded.conditions_json, phase_json=excluded.phase_json, countries_json=excluded.countries_json,
      eligibility_text=excluded.eligibility_text, summary=excluded.summary, relevant=excluded.relevant`)
    const status = this.db.prepare('INSERT OR REPLACE INTO source_statuses(query,source_id,state,reason_code,explanation,result_count,coverage_json,completeness_json,freshness_json,snapshot_date) VALUES(?,?,?,?,?,?,?,?,?,?)')
    this.db.exec('BEGIN')
    try {
      for (const r of rows) {
        ins.run(r.recordId, JSON.stringify(r.mergedSources || [r.sourceId]), r.sourceId, r.title, r.studyType || null,
          JSON.stringify(r.sponsor || []), JSON.stringify(r.registryNumbers || []), JSON.stringify(r.dates || {}), r.sourceUrl || '',
          r.retrievedAt || null, r.statusNote || '登记状态，未核实', r.snapshotDate || manifest.snapshotDate,
          JSON.stringify(r.conditions || []), JSON.stringify(r.phase || []), JSON.stringify(r.countries || []),
          r.eligibilityText || '', r.summary || '', '{}', 1)
      }
      this.setSetting('trial_manifest', JSON.stringify({ snapshotDate: manifest.snapshotDate, recordCount: manifest.recordCount, relevant: manifest.relevant, channels: manifest.channels, failed: manifest.failed }))
      this.db.exec('COMMIT')
    } catch (error) { this.db.exec('ROLLBACK'); throw error }
  }

  currentRootInfo() {
    return { dir: this.root, db: this.dbPath, defaultRoot: this.defaultRoot, source: this.getSetting('data_root') === this.root ? 'app_setting' : 'pointer' }
  }

  setRoot(next) {
    const reason = forbiddenRoot(next)
    if (reason) throw Object.assign(new Error(reason), { status: 400 })
    const dir = resolve(String(next))
    mkdirSync(dir, { recursive: true })
    this.close()
    this.root = dir
    this.open()
    return this.currentRootInfo()
  }

  listProfiles() {
    return this.db.prepare('SELECT * FROM profiles ORDER BY is_demo DESC, created_at, profile_key').all()
      .map((p) => ({ ...p, id: p.profile_key, is_demo: Number(p.is_demo) }))
  }

  getProfile(profileKey) {
    return this.db.prepare('SELECT * FROM profiles WHERE profile_key=?').get(profileKey) || null
  }

  readProfile(profileKey) {
    const p = this.getProfile(profileKey)
    if (!p) return null
    const facts = this.db.prepare('SELECT field,label,value,source,confirmed FROM profile_facts WHERE profile_key=? ORDER BY id').all(profileKey)
      .map((f) => ({ ...f, confirmed: Number(f.confirmed), is_confirmed: Number(f.confirmed) === 1 }))
    const metrics = this.db.prepare('SELECT * FROM metrics WHERE profile_key=? AND in_use=1 AND is_private=0 ORDER BY measured_on, id').all(profileKey)
      .map((m) => ({ id: idOf('metric', m.id), key: m.metric_key, label: m.label, category: m.category, value: m.value_num, value_text: m.value_text, unit: m.unit, ref_low: m.ref_low, ref_high: m.ref_high, method: m.method, institution: m.institution, date: m.measured_on, source: m.source, is_private: Number(m.is_private) }))
    const entries = this.db.prepare("SELECT * FROM entries WHERE profile_key=? AND in_use=1 AND is_private=0 ORDER BY event_date DESC, id DESC").all(profileKey)
      .map((e) => ({ id: idOf('entry', e.id), kind: e.kind, title: e.title, body: e.body, data: parse(e.data_json, {}), date: e.event_date, source: e.source, is_private: Number(e.is_private) }))
    const treatments = this.db.prepare('SELECT * FROM treatments WHERE profile_key=? AND in_use=1 AND is_private=0 ORDER BY started_on DESC, id DESC').all(profileKey)
      .map((t) => ({ id: idOf('treatment', t.id), name: t.name, status: t.status, started_on: t.started_on, ended_on: t.ended_on, note: t.note, source: t.source }))
    const privateEntries = this.db.prepare('SELECT id, kind, title, event_date AS date FROM entries WHERE profile_key=? AND in_use=1 AND is_private=1 ORDER BY event_date DESC, id DESC').all(profileKey)
      .map((e) => ({ ...e, id: idOf('entry', e.id) }))
    const saved = this.db.prepare('SELECT * FROM saved_trial WHERE profile_key=? ORDER BY saved_on DESC, id DESC').all(profileKey)
      .map((s) => ({ id: idOf('saved_trial', s.id), trialKey: s.trial_key, state: s.state, savedOn: s.saved_on }))
    return {
      id: p.profile_key, profile_key: p.profile_key, name: p.name, tag: p.tag, subtype: p.subtype,
      diagnosed_on: p.diagnosed_on, summary: p.summary, is_demo: Number(p.is_demo),
      age: Number(facts.find((f) => f.field === 'age')?.value || 0) || null,
      facts, metrics, entries, treatments, saved_trials: saved, privateEntries,
    }
  }

  bootstrap() {
    const profiles = this.listProfiles().map((p) => this.readProfile(p.profile_key))
    const trials = this.db.prepare('SELECT * FROM trials WHERE relevant=1 ORDER BY snapshot_date DESC, record_id').all().map((r) => ({
      trialKey: r.record_id, title: r.title, shortTitle: r.title, registry: (parse(r.registry_numbers, []) || []).find((x) => x.registry === 'NCT')?.value || r.record_id,
      phase: (parse(r.phase_json, []) || []).join(' / ') || '未标注', status: r.status_note || '登记状态，未核实', studyType: r.study_type,
      sponsor: (parse(r.sponsors, []) || [])[0] || '未标注', countries: parse(r.countries_json, []) || [],
      startDate: parse(r.dates, {})?.startDate || '', conditions: parse(r.conditions_json, []) || [],
      source: r.source_id, sourceUrl: r.source_url, eligibilityText: r.eligibility_text || '', summary: r.summary || '',
      snapshotDate: r.snapshot_date, fictional: false,
    }))
    const manifest = parse(this.getSetting('trial_manifest'), null)
    return {
      TODAY: LOCAL_DATE(), profiles,
      trials,
      trialSnapshot: {
        snapshotDate: manifest?.snapshotDate || '未标注', recordCount: manifest?.recordCount ?? trials.length,
        relevant: manifest?.relevant ?? trials.length, returned: trials.length,
        candidateScope: `本地快照 ${manifest?.recordCount ?? trials.length} 条；相关 ${manifest?.relevant ?? trials.length} 条；不是全库扫描`,
        channels: (manifest?.channels || []).map((c) => ({ id: c.id, label: c.id, state: c.state, count: c.records, note: '' })),
        failed: manifest?.failed || [],
        fictionalInThisView: 0,
        disclaimer: '登记状态，未核实；登记 ≠ 有效 ≠ 安全 ≠ 可入组。快照会过期。',
      },
      groupOrder: DEMO.groupOrder, recordKinds: DEMO.recordKinds, brand: { ...DEMO.brand, version: `v${PKG.version}` },
      dataRoot: this.currentRootInfo(), meta: DEMO.meta,
    }
  }

  createProfile({ name, tag, facts, subtype, diagnosed_on }) {
    const cleanName = text(name, 80)
    if (!cleanName) throw Object.assign(new Error('档案名称不能为空'), { status: 400 })
    const key = `user-${Date.now().toString(36)}-${randomBytes(3).toString('hex')}`
    const now = new Date().toISOString()
    const sub = text(subtype || facts?.subtype, 40) || null
    const diag = text(diagnosed_on || facts?.diagnosed_on, 20) || null
    this.db.exec('BEGIN')
    try {
      this.db.prepare('INSERT INTO profiles(profile_key,name,tag,subtype,diagnosed_on,summary,is_demo,created_at,updated_at) VALUES(?,?,?,?,?,?,0,?,?)')
        .run(key, cleanName, text(tag, 80) || null, sub, diag, '还没有记录。可以从「记录」开始，或先补一条血常规。', now, now)
      const allowed = { ...(facts && typeof facts === 'object' ? facts : {}) }
      if (sub) allowed.subtype = sub
      if (diag) allowed.diagnosed_on = diag
      const stmt = this.db.prepare('INSERT INTO profile_facts(profile_key,field,label,value,source,confirmed,created_at) VALUES(?,?,?,?,?,?,?)')
      for (const [field, value] of Object.entries(allowed)) {
        if (!FACT_FIELDS.has(field) || value == null || String(value).trim() === '') continue
        stmt.run(key, field, field, String(value).slice(0, 300), '用户自填', 1, now)
      }
      this.db.exec('COMMIT')
    } catch (error) { this.db.exec('ROLLBACK'); throw error }
    return { ok: true, profileKey: key, is_demo: 0 }
  }

  addEntry(profileKey, kind, data) {
    if (!KINDS.has(kind)) throw Object.assign(new Error('不支持的记录类型'), { status: 400 })
    if (!this.getProfile(profileKey)) throw Object.assign(new Error('档案不存在'), { status: 404 })
    const d = data && typeof data === 'object' ? data : {}
    const eventDate = text(d.date, 20) || LOCAL_DATE()
    const title = text(d.title, 160)
    const body = text(d.body, 4000)
    if (!title && !body && !(Array.isArray(d.metrics) && d.metrics.length) && !d.metric) throw Object.assign(new Error('至少填写标题或内容'), { status: 400 })
    const now = new Date().toISOString()
    let entryId
    this.db.exec('BEGIN')
    try {
      const result = this.db.prepare('INSERT INTO entries(profile_key,kind,title,body,data_json,event_date,source,is_private,created_at) VALUES(?,?,?,?,?,?,?,?,?)')
        .run(profileKey, kind, title, body, JSON.stringify(d), eventDate, text(d.source, 120) || '患者自记', d.private ? 1 : 0, now)
      entryId = Number(result.lastInsertRowid)
      const metrics = Array.isArray(d.metrics) ? d.metrics : d.metric ? [d.metric] : []
      for (const m of metrics) {
        if (!m || !m.key || m.value == null || !isFinite(Number(m.value))) continue
        this.db.prepare('INSERT INTO metrics(profile_key,metric_key,label,category,value_num,value_text,unit,ref_low,ref_high,method,institution,measured_on,source,is_private,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
          .run(profileKey, text(m.key, 40), text(m.label, 80) || text(m.key, 40), text(m.category, 40) || '其他', Number(m.value), String(m.value), text(m.unit, 20), m.ref_low ?? null, m.ref_high ?? null, text(m.method, 60) || null, text(m.institution, 120) || null, eventDate, text(d.source, 120) || '患者自记', d.private ? 1 : 0, now)
      }
      this.db.exec('COMMIT')
    } catch (error) { this.db.exec('ROLLBACK'); throw error }
    return { ok: true, id: idOf('entry', entryId), entryId }
  }

  setPrivacy(profileKey, kind, id, isPrivate) {
    if (!this.getProfile(profileKey)) throw Object.assign(new Error('档案不存在'), { status: 404 })
    const rowid = rowidOf(id)
    if (!rowid) throw Object.assign(new Error('记录 id 无法对回 rowid'), { status: 400 })
    const flag = isPrivate ? 1 : 0
    let changes = 0
    if (kind === 'metric' || kind === 'lab') changes = Number(this.db.prepare('UPDATE metrics SET is_private=? WHERE id=? AND profile_key=?').run(flag, rowid, profileKey).changes)
    else if (kind === 'saved_trial') changes = Number(this.db.prepare('UPDATE saved_trial SET is_private=? WHERE id=? AND profile_key=?').run(flag, rowid, profileKey).changes)
    else changes = Number(this.db.prepare('UPDATE entries SET is_private=? WHERE id=? AND profile_key=?').run(flag, rowid, profileKey).changes)
    if (!changes) throw Object.assign(new Error('没有找到这条记录'), { status: 404 })
    return { ok: true, id, is_private: flag }
  }

  saveTrial(profileKey, trialKey, state = 'in_followup') {
    if (!this.getProfile(profileKey)) throw Object.assign(new Error('档案不存在'), { status: 404 })
    if (!['in_followup', 'preparing', 'archived'].includes(state)) throw Object.assign(new Error('收藏状态不合法'), { status: 400 })
    const now = LOCAL_DATE()
    this.db.prepare(`INSERT INTO saved_trial(profile_key,trial_key,state,saved_on,is_private) VALUES(?,?,?,?,0)
      ON CONFLICT(profile_key,trial_key) DO UPDATE SET state=excluded.state, saved_on=excluded.saved_on`).run(profileKey, text(trialKey, 160), state, now)
    const row = this.db.prepare('SELECT * FROM saved_trial WHERE profile_key=? AND trial_key=?').get(profileKey, trialKey)
    return { ok: true, id: idOf('saved_trial', row.id), trialKey, state, savedOn: row.saved_on }
  }

  trialMatch(keyword) {
    const total = Number(this.db.prepare('SELECT COUNT(*) AS n FROM trials').get()?.n || 0)
    const q = text(keyword, 120)
    const rows = q
      ? this.db.prepare(`SELECT * FROM trials WHERE title LIKE ? OR conditions_json LIKE ? OR eligibility_text LIKE ? ORDER BY record_id LIMIT 100`).all(`%${q}%`, `%${q}%`, `%${q}%`)
      : this.db.prepare('SELECT * FROM trials ORDER BY record_id LIMIT 100').all()
    return {
      ok: true, total, returned: rows.length,
      honestyNote: '登记状态未核实；快照会过期；不是全库扫描；登记 ≠ 有效 ≠ 安全 ≠ 可入组。',
      records: rows,
    }
  }
}

export { forbiddenRoot, KINDS, idOf }
