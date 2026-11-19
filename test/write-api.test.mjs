import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Workbench } from '../dsh/workbench.js'

/* 写库闭环四组断言（ONESHOT §2.3 形状；本仓 API = createSubject/saveRecords 整包）。
   demo 与自建共存 / 八类写读同形 / 私密与档案隔离 / 错误路径可读。 */

const KINDS = ['发作记录', '症状记录', '诱因与先兆', '当前用药', '医嘱记录', '问题清单', '资料库', '体温与热型']

function freshWorkbench() {
  const root = mkdtempSync(join(tmpdir(), 'traps-wb-test-'))
  const wb = new Workbench({ root, seedDemo: true })
  wb.open()
  return { wb, root }
}

test('写库闭环 · demo 与自建共存（新建 is_demo=0，demo 不被覆盖）', () => {
  const { wb, root } = freshWorkbench()
  try {
    const demo = wb.listProfiles()
    assert.ok(demo.filter((p) => Number(p.isDemo ?? p.is_demo) === 1).length >= 2, 'demo 档案已播种')
    const created = wb.createSubject({ name: '测试档案', meta: 'write-api 测试' })
    const after = wb.listProfiles()
    const mine = after.find((p) => p.profileKey === created.profileKey)
    assert.ok(mine, '新建档案在列表里')
    assert.equal(Number(mine.isDemo ?? mine.is_demo), 0, '新建档案 is_demo=0')
    assert.equal(after.filter((p) => Number(p.isDemo ?? p.is_demo) === 1).length,
      demo.filter((p) => Number(p.isDemo ?? p.is_demo) === 1).length, 'demo 档案数量不变')
    assert.throws(() => wb.deleteSubject(demo[0].profileKey), /演示档案不删除/, 'demo 不可删')
    wb.deleteSubject(created.profileKey)
    assert.ok(!wb.listProfiles().some((p) => p.profileKey === created.profileKey), '自建档案可删')
  } finally { wb.close(); rmSync(root, { recursive: true, force: true }) }
})

test('写库闭环 · 八类记录写库与同形回读', () => {
  const { wb, root } = freshWorkbench()
  try {
    const created = wb.createSubject({ name: '八类测试' })
    const key = created.profileKey
    const records = KINDS.map((kind, i) => ({
      id: 1000 + i, kind,
      date: i % 2 === 0 ? '2026-11-01' : '', datePrecision: i % 2 === 0 ? 'day' : 'unknown',
      site: kind === '发作记录' ? '发热 · 肌痛' : '', text: `${kind} 的 write-api 测试记录`,
      source: 'write-api · 合成数据', private: i === 5, history: [],
    }))
    wb.saveRecords(key, records)
    const back = wb.getRecords(key)
    assert.equal(back.records.length, KINDS.length, '八类全部落库')
    for (let i = 0; i < KINDS.length; i++) {
      assert.equal(back.records[i].kind, KINDS[i], `第 ${i + 1} 条 kind 同形回读`)
      assert.equal(back.records[i].text, records[i].text, '原文逐字一致')
    }
  } finally { wb.close(); rmSync(root, { recursive: true, force: true }) }
})

test('写库闭环 · 私密标记与档案隔离（reload 同形）', () => {
  const { wb, root } = freshWorkbench()
  try {
    const a = wb.createSubject({ name: '隔离A' }).profileKey
    const b = wb.createSubject({ name: '隔离B' }).profileKey
    wb.saveRecords(a, [{ id: 1, kind: '问题清单', date: '2026-11-02', text: '私密问题', private: true, history: [] }])
    wb.saveRecords(b, [{ id: 2, kind: '发作记录', date: '2026-11-03', text: 'B 的发作', private: false, history: [] }])
    const ra = wb.getRecords(a).records
    const rb = wb.getRecords(b).records
    assert.equal(ra.length, 1, 'A 只有自己的一条')
    assert.equal(rb.length, 1, 'B 只有自己的一条')
    assert.equal(ra[0].private, true, '私密标记保留（读模型/导出层负责过滤）')
    assert.ok(!JSON.stringify(rb).includes('私密问题'), 'B 档案读不到 A 的内容（隔离）')
  } finally { wb.close(); rmSync(root, { recursive: true, force: true }) }
})

test('写库闭环 · 错误路径可读（不裸崩）', () => {
  const { wb, root } = freshWorkbench()
  try {
    assert.throws(() => wb.createSubject({ name: '' }), /请填写档案名/, '空名可读报错')
    assert.throws(() => wb.createSubject({ name: 'x'.repeat(41) }), /档案名太长/, '超长可读报错')
    assert.throws(() => wb.saveRecords('local-not-exist', [{ id: 1, kind: '发作记录', text: 'x' }]), /档案不存在|不存在/, '未知档案保存可读报错')
    assert.throws(() => wb.saveRecords(wb.createSubject({ name: '形状' }).profileKey, 'not-an-array'), /数组|records/i, '非数组整体拒绝')
  } finally { wb.close(); rmSync(root, { recursive: true, force: true }) }
})
