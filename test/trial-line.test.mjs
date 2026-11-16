import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const src = readFileSync(join(process.cwd(), 'prototypes/v0.2/trial-match.js'), 'utf8')
const calcTrialMatch = new Function('globalThis', src + '\nreturn globalThis.calcTrialMatch')(globalThis)
const profile = {
  id: 'p1', subtype: 'PV', facts: [
    { field: 'subtype', value: 'PV', confirmed: 1, source: '骨髓报告' },
    { field: 'driver', value: 'JAK2 V617F 阳性', confirmed: 1, source: '分子检测' },
    { field: 'age', value: '46', confirmed: 1, source: '自填' },
    { field: 'phase', value: '慢性期', confirmed: 1, source: '门诊' },
    { field: 'prior_therapy', value: '尚未开始降细胞治疗', confirmed: 1, source: '门诊' },
  ]
}
const trial = {
  trialKey: 'T1', title: 'A Phase 1 Study of PRT12396 in PV and MF',
  conditions: ['Polycythemia Vera', 'Primary Myelofibrosis'],
  eligibilityText: 'Inclusion: confirmed PV or MF; documented JAK2 V617 mutation; age >= 18. Exclusion: prior systemic therapy for PV or MF.',
}
const sparse = { id: 'p2', facts: [] }

test('相关档案得到 pct = 符合 ÷ 已对照（待确认计入分母）', () => {
  const r = calcTrialMatch(profile, trial, {})
  assert.equal(r.matched, 3)
  assert.equal(r.compared, 3)
  assert.equal(r.pending, 0)
  assert.equal(r.pct, 100)
  assert.equal(r.tier, '字段都对得上')
  assert.match(r.note, /不是入组资格/)
})

test('可对照项 < 2 不给百分数', () => {
  const r = calcTrialMatch(sparse, { title: 'x', conditions: ['Myeloproliferative'], eligibilityText: 'adult' }, {})
  assert.equal(r.pct, null)
  assert.equal(r.tier, '需补充信息')
})

test('硬性条件不满足单独分层，不靠 pct 排首位', () => {
  const r = calcTrialMatch({ ...profile, facts: [{ field: 'phase', value: '慢性期', confirmed: 1, source: '门诊' }] },
    { title: 'accelerated phase MPN', conditions: ['Myeloproliferative'], eligibilityText: 'accelerated-phase or blast-phase; age >= 18; JAK2' }, {})
  assert.equal(r.tier, '硬性条件不满足')
  assert.equal(r.hardNo, true)
})

test('只使用真实字段：缺 CALR 标待确认，不补阴性', () => {
  const r = calcTrialMatch(profile, { title: 'CALR vaccine', conditions: ['Primary Myelofibrosis'], eligibilityText: 'CALR exon 9 mutation; age >= 18' }, {})
  const calr = r.criteria.find((c) => c.key === 'calr')
  assert.equal(calr.state, 'unknown')
  assert.match(calr.requirement, /方案原文/)
})
