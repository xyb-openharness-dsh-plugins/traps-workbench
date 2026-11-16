import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Workbench } from '../dsh/workbench.js'

const root = mkdtempSync(join(tmpdir(), 'traps-write-'))
test.after(() => rmSync(root, { recursive: true, force: true }))

function fresh() { return new Workbench({ root }) }

test('共存：两套合成档案 + 一个自建 = 3，自建 is_demo=0', () => {
  const w = fresh()
  const before = w.bootstrap().profiles.length
  assert.equal(before, 2)
  const made = w.createProfile({ name: '我的测试档案', subtype: 'TRAPS', diagnosed_on: '2026-01-02' })
  assert.match(made.profileKey, /^user-/)
  const b = w.bootstrap()
  assert.equal(b.profiles.length, 3)
  const user = b.profiles.find((p) => p.profile_key === made.profileKey)
  assert.equal(user.is_demo, 0)
  assert.equal(user.subtype, 'TRAPS')
  assert.equal(b.profiles.filter((p) => Number(p.is_demo) === 1).length, 2)
  w.close()
})

test('8 类记录都能写库并同形回读', () => {
  const w = fresh()
  const { profileKey } = w.createProfile({ name: '八类记录' })
  const kinds = ['symptom', 'lab', 'treatment', 'question', 'hospital', 'report', 'doc', 'mind']
  for (const kind of kinds) {
    const data = { date: '2026-11-15', title: kind + ' 标题', body: kind + ' 备注逐字一致', source: '合成测试' }
    if (kind === 'symptom') data.score = 6
    if (kind === 'lab') data.metric = { key: 'Hb', label: '血红蛋白', category: '血细胞', value: 9, unit: 'mg/L', ref_low: null, ref_high: null, method: '合成测试', institution: '测试检验科' }
    const res = w.addEntry(profileKey, kind, data)
    assert.match(res.id, /^e\d+$/)
  }
  const p = w.readProfile(profileKey)
  assert.equal(p.entries.length, 8)
  assert.equal(p.metrics.length, 1)
  assert.equal(p.metrics[0].value, 9)
  assert.equal(p.entries.find((e) => e.kind === 'hospital').body, 'hospital 备注逐字一致')
  w.close()
})

test('私密切换按 rowid 回写，reload 后仍在', () => {
  let w = fresh()
  const { profileKey } = w.createProfile({ name: '隐私测试' })
  const { id } = w.addEntry(profileKey, 'mind', { date: '2026-11-15', title: '不想让别人看到', body: '合成私密内容' })
  assert.equal(w.setPrivacy(profileKey, 'mind', id, true).is_private, 1)
  w.close()
  w = fresh()
  const p = w.readProfile(profileKey)
  assert.equal(p.entries.length, 0)
  assert.equal(p.privateEntries.length, 1)
  assert.equal(p.privateEntries[0].id, id)
  w.close()
})

test('错误路径可读：空名称 / 非法类型 / 不存在的记录', () => {
  const w = fresh()
  assert.throws(() => w.createProfile({ name: ' ' }), /档案名称不能为空/)
  const { profileKey } = w.createProfile({ name: '错误路径' })
  assert.throws(() => w.addEntry(profileKey, 'unknown', { title: 'x' }), /不支持的记录类型/)
  assert.throws(() => w.setPrivacy(profileKey, 'entry', 'e999999', true), /没有找到这条记录/)
  w.close()
})

test('试点试验快照 total 等于 manifest.recordCount，且带 honestyNote', async () => {
  const w = fresh()
  const r = w.trialMatch('')
  assert.equal(r.total, 3)
  assert.match(r.honestyNote, /未核实/)
  assert.match(r.honestyNote, /不是全库扫描/)
  w.close()
})

test('TRAPS 发作区间与逐条观察同事务写入并回读', () => {
  const w = fresh()
  const { profileKey } = w.createProfile({ name: '发作测试' })
  const result = w.addFlare(profileKey, { started_on: '2026-11-01', ended_on: '2026-11-02', source: '合成测试', observations: [{ observed_on: '2026-11-01T08:00:00Z', feature: 'fever', patient_rated_impact: 3, source: '合成测试' }] })
  const flare = w.readProfile(profileKey).flares.find((item) => item.id === result.id)
  assert.equal(flare.ended_on, '2026-11-02')
  assert.equal(flare.observations[0].feature, 'fever')
  assert.equal(flare.observations[0].patient_rated_impact, 3)
  assert.throws(() => w.addFlare(profileKey, { started_on: '2026-11-03', ended_on: '2026-11-02' }), /结束日期不能早于开始日期/)
  w.close()
})
