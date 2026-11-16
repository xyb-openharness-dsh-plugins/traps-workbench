import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const demo = JSON.parse(readFileSync(join(process.cwd(), 'data/demo-data.json'), 'utf8'))
const rows = readFileSync(join(process.cwd(), 'research/traps-2026/trials-2026.jsonl'), 'utf8').trim().split(/\r?\n/).map(JSON.parse)

test('示例档案均明确标记为合成资料', () => {
  assert.ok(demo.profiles.length >= 2)
  assert.ok(demo.profiles.every((profile) => profile.is_demo === 1 && /合成/.test(profile.name)))
})

test('公开研究列表不按个人档案计算入组匹配分数', () => {
  const app = readFileSync(join(process.cwd(), 'prototypes/v0.2/app.js'), 'utf8')
  assert.doesNotMatch(app, /calcTrialMatch|符合度|匹配只在|matchRows\s*\(/)
  assert.match(app, /不判断个人是否适合参加/)
})

test('公开研究快照带稳定登记号、来源链接和访问日期', () => {
  assert.equal(rows.length, 3)
  for (const row of rows) {
    assert.match(row.recordId, /^NCT\d{8}$/)
    assert.equal(row.sourceId, 'ClinicalTrials.gov')
    assert.match(row.sourceUrl, /^https:\/\/clinicaltrials\.gov\/study\//)
    assert.match(row.retrievedAt, /^2026-11-16T/)
  }
})
