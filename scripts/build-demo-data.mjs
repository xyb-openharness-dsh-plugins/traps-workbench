#!/usr/bin/env node
/* 合成演示数据唯一源：data/demo-data.json -> prototypes/v0.2/demo-data.js。
   两套档案：A 刚确诊记录少、B 长期随访记录多；全部虚构，姓名/日期/数值不对应真实患者。
   生成器是确定性的：同一版本重复运行字节一致，便于审计。 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const TODAY = '2026-11-15'

const metric = (id, key, label, category, value, unit, low, high, date, extra = {}) => ({
  id, key, label, category, value, unit, ref_low: low, ref_high: high, date,
  method: extra.method || '静脉血', institution: extra.institution || '市一医院检验科',
  source: extra.source || '血常规报告', is_private: extra.is_private ? 1 : 0,
})

const entry = (id, kind, date, title, body, data = {}, extra = {}) => ({
  id, kind, date, title, body, data, source: extra.source || '患者自记', is_private: extra.is_private ? 1 : 0,
})

const profiles = [
  {
    id: 'demo-a', profile_key: 'demo-a', name: '林岚 · 合成示例', tag: 'PV · 刚确诊', subtype: 'PV',
    diagnosed_on: '2026-08-19', is_demo: 1, age: 46,
    summary: '确诊约 3 个月，记录还少。最近一次血红蛋白偏高，血小板也偏高；正在和医生讨论随访节奏。',
    facts: [
      { field: 'subtype', label: '亚型', value: 'PV（真性红细胞增多症）', source: '2026-08-19 骨髓报告', confirmed: 1 },
      { field: 'driver', label: '驱动突变', value: 'JAK2 V617F 阳性', source: '2026-08-19 分子检测', confirmed: 1 },
      { field: 'age', label: '年龄', value: '46', source: '档案自填', confirmed: 1 },
      { field: 'phase', label: '疾病阶段', value: '慢性期', source: '2026-08-19 门诊记录', confirmed: 1 },
      { field: 'prior_therapy', label: '既往治疗', value: '尚未开始降细胞治疗', source: '2026-10-21 门诊记录', confirmed: 1 },
      { field: 'calr', label: 'CALR', value: '未检测', source: '—', confirmed: 0 },
    ],
    metrics: [
      metric('a-hb-1', 'Hb', '血红蛋白', '血细胞', 161, 'g/L', 115, 150, '2026-08-19'),
      metric('a-hb-2', 'Hb', '血红蛋白', '血细胞', 155, 'g/L', 115, 150, '2026-09-16'),
      metric('a-hb-3', 'Hb', '血红蛋白', '血细胞', 149, 'g/L', 115, 150, '2026-10-21'),
      metric('a-plt-1', 'PLT', '血小板', '血细胞', 645, '×10⁹/L', 125, 350, '2026-08-19'),
      metric('a-plt-2', 'PLT', '血小板', '血细胞', 590, '×10⁹/L', 125, 350, '2026-09-16'),
      metric('a-plt-3', 'PLT', '血小板', '血细胞', 510, '×10⁹/L', 125, 350, '2026-10-21'),
      metric('a-wbc-1', 'WBC', '白细胞', '血细胞', 10.2, '×10⁹/L', 3.5, 9.5, '2026-08-19'),
      metric('a-wbc-2', 'WBC', '白细胞', '血细胞', 9.6, '×10⁹/L', 3.5, 9.5, '2026-09-16'),
      metric('a-wbc-3', 'WBC', '白细胞', '血细胞', 8.9, '×10⁹/L', 3.5, 9.5, '2026-10-21'),
      metric('a-ldh-1', 'LDH', '乳酸脱氢酶', '炎症与代谢', 220, 'U/L', 120, 250, '2026-08-19'),
      metric('a-ldh-2', 'LDH', '乳酸脱氢酶', '炎症与代谢', 205, 'U/L', 120, 250, '2026-09-16'),
      metric('a-ldh-3', 'LDH', '乳酸脱氢酶', '炎症与代谢', 198, 'U/L', 120, 250, '2026-10-21'),
      metric('a-spl-1', 'Spleen', '脾脏长径', '脾脏与体型', 13.2, 'cm', 8, 12, '2026-08-19', { method: '腹部超声', source: '超声报告' }),
      metric('a-spl-2', 'Spleen', '脾脏长径', '脾脏与体型', 12.9, 'cm', 8, 12, '2026-09-16', { method: '腹部超声', source: '超声报告' }),
      metric('a-wt-1', 'Weight', '体重', '脾脏与体型', 62.0, 'kg', null, null, '2026-08-19', { method: '家用体重秤', source: '自记' }),
      metric('a-wt-2', 'Weight', '体重', '脾脏与体型', 62.5, 'kg', null, null, '2026-09-16', { method: '家用体重秤', source: '自记' }),
      metric('a-wt-3', 'Weight', '体重', '脾脏与体型', 63.0, 'kg', null, null, '2026-10-21', { method: '家用体重秤', source: '自记' }),
    ],
    entries: [
      entry('a-e1', 'symptom', '2026-09-02', '头晕、饭后皮肤发痒', '下午头晕约半小时；洗热水澡后小腿发痒，持续一阵。没有胸闷。', { score: 3, locations: ['头晕', '皮肤瘙痒'], duration: '间歇' }),
      entry('a-e2', 'question', '2026-10-22', '复诊要问：阿司匹林和刷牙出血', '每天一片阿司匹林，最近刷牙会出血。想请医生看看要不要调整，以及下次什么时候复查血常规。', { priority: '高' }),
      entry('a-e3', 'hospital', '2026-08-19', '确诊门诊', '做了血常规、JAK2 检测和骨髓穿刺。医生说要先看随访结果，再决定是不是需要降细胞治疗。', { department: '血液科', doctor: '（合成）王医生' }, { source: '门诊记录' }),
    ],
    treatments: [],
    saved_trials: [],
  },
  {
    id: 'demo-b', profile_key: 'demo-b', name: '周远 · 合成示例', tag: 'PMF · 长期随访', subtype: 'PMF',
    diagnosed_on: '2021-03-04', is_demo: 1, age: 63,
    summary: '确诊约 5 年半，记录较多。最近一年血红蛋白在 90–105 g/L 区间波动，脾脏较前增大，疲劳和夜间盗汗更明显。',
    facts: [
      { field: 'subtype', label: '亚型', value: 'PMF（原发性骨髓纤维化）', source: '2021-03-04 骨髓活检', confirmed: 1 },
      { field: 'driver', label: '驱动突变', value: 'JAK2 V617F 阳性', source: '2021-03-04 分子检测', confirmed: 1 },
      { field: 'age', label: '年龄', value: '63', source: '档案自填', confirmed: 1 },
      { field: 'phase', label: '疾病阶段', value: '慢性期', source: '2026-10-08 门诊记录', confirmed: 1 },
      { field: 'prior_therapy', label: '既往治疗', value: '羟基脲（2021–2023）；芦可替尼（2023-05 起）', source: '用药记录', confirmed: 1 },
      { field: 'prior_jak', label: '既往 JAK 抑制剂', value: '有', source: '2023-05 用药记录', confirmed: 1 },
      { field: 'calr', label: 'CALR', value: '阴性', source: '2021-03-04 分子检测', confirmed: 1 },
    ],
    metrics: [
      metric('b-hb-1', 'Hb', '血红蛋白', '血细胞', 108, 'g/L', 115, 150, '2024-03-12'),
      metric('b-hb-2', 'Hb', '血红蛋白', '血细胞', 104, 'g/L', 115, 150, '2024-09-18'),
      metric('b-hb-3', 'Hb', '血红蛋白', '血细胞', 101, 'g/L', 115, 150, '2025-03-20'),
      metric('b-hb-4', 'Hb', '血红蛋白', '血细胞', 99, 'g/L', 115, 150, '2025-09-25'),
      metric('b-hb-5', 'Hb', '血红蛋白', '血细胞', 96, 'g/L', 115, 150, '2026-04-02'),
      metric('b-hb-6', 'Hb', '血红蛋白', '血细胞', 94, 'g/L', 115, 150, '2026-10-08'),
      metric('b-plt-1', 'PLT', '血小板', '血细胞', 390, '×10⁹/L', 125, 350, '2024-03-12'),
      metric('b-plt-2', 'PLT', '血小板', '血细胞', 350, '×10⁹/L', 125, 350, '2024-09-18'),
      metric('b-plt-3', 'PLT', '血小板', '血细胞', 320, '×10⁹/L', 125, 350, '2025-03-20'),
      metric('b-plt-4', 'PLT', '血小板', '血细胞', 280, '×10⁹/L', 125, 350, '2025-09-25'),
      metric('b-plt-5', 'PLT', '血小板', '血细胞', 250, '×10⁹/L', 125, 350, '2026-04-02'),
      metric('b-plt-6', 'PLT', '血小板', '血细胞', 228, '×10⁹/L', 125, 350, '2026-10-08'),
      metric('b-wbc-1', 'WBC', '白细胞', '血细胞', 13.8, '×10⁹/L', 3.5, 9.5, '2024-03-12'),
      metric('b-wbc-2', 'WBC', '白细胞', '血细胞', 14.2, '×10⁹/L', 3.5, 9.5, '2024-09-18'),
      metric('b-wbc-3', 'WBC', '白细胞', '血细胞', 12.9, '×10⁹/L', 3.5, 9.5, '2025-03-20'),
      metric('b-wbc-4', 'WBC', '白细胞', '血细胞', 11.7, '×10⁹/L', 3.5, 9.5, '2025-09-25'),
      metric('b-wbc-5', 'WBC', '白细胞', '血细胞', 10.1, '×10⁹/L', 3.5, 9.5, '2026-04-02'),
      metric('b-wbc-6', 'WBC', '白细胞', '血细胞', 9.4, '×10⁹/L', 3.5, 9.5, '2026-10-08'),
      metric('b-ldh-1', 'LDH', '乳酸脱氢酶', '炎症与代谢', 310, 'U/L', 120, 250, '2024-03-12'),
      metric('b-ldh-2', 'LDH', '乳酸脱氢酶', '炎症与代谢', 340, 'U/L', 120, 250, '2024-09-18'),
      metric('b-ldh-3', 'LDH', '乳酸脱氢酶', '炎症与代谢', 355, 'U/L', 120, 250, '2025-03-20'),
      metric('b-ldh-4', 'LDH', '乳酸脱氢酶', '炎症与代谢', 390, 'U/L', 120, 250, '2025-09-25'),
      metric('b-ldh-5', 'LDH', '乳酸脱氢酶', '炎症与代谢', 410, 'U/L', 120, 250, '2026-04-02'),
      metric('b-ldh-6', 'LDH', '乳酸脱氢酶', '炎症与代谢', 430, 'U/L', 120, 250, '2026-10-08'),
      metric('b-spl-1', 'Spleen', '脾脏长径', '脾脏与体型', 15.8, 'cm', 8, 12, '2024-03-12', { method: '腹部超声', source: '超声报告' }),
      metric('b-spl-2', 'Spleen', '脾脏长径', '脾脏与体型', 16.4, 'cm', 8, 12, '2024-09-18', { method: '腹部超声', source: '超声报告' }),
      metric('b-spl-3', 'Spleen', '脾脏长径', '脾脏与体型', 17.0, 'cm', 8, 12, '2025-03-20', { method: '腹部超声', source: '超声报告' }),
      metric('b-spl-4', 'Spleen', '脾脏长径', '脾脏与体型', 17.5, 'cm', 8, 12, '2025-09-25', { method: '腹部超声', source: '超声报告' }),
      metric('b-spl-5', 'Spleen', '脾脏长径', '脾脏与体型', 18.0, 'cm', 8, 12, '2026-04-02', { method: '腹部超声', source: '超声报告' }),
      metric('b-spl-6', 'Spleen', '脾脏长径', '脾脏与体型', 18.4, 'cm', 8, 12, '2026-10-08', { method: '腹部超声', source: '超声报告' }),
      metric('b-wt-1', 'Weight', '体重', '脾脏与体型', 66.0, 'kg', null, null, '2024-03-12', { method: '家用体重秤', source: '自记' }),
      metric('b-wt-2', 'Weight', '体重', '脾脏与体型', 65.2, 'kg', null, null, '2024-09-18', { method: '家用体重秤', source: '自记' }),
      metric('b-wt-3', 'Weight', '体重', '脾脏与体型', 64.8, 'kg', null, null, '2025-03-20', { method: '家用体重秤', source: '自记' }),
      metric('b-wt-4', 'Weight', '体重', '脾脏与体型', 64.0, 'kg', null, null, '2025-09-25', { method: '家用体重秤', source: '自记' }),
      metric('b-wt-5', 'Weight', '体重', '脾脏与体型', 63.4, 'kg', null, null, '2026-04-02', { method: '家用体重秤', source: '自记' }),
      metric('b-wt-6', 'Weight', '体重', '脾脏与体型', 62.8, 'kg', null, null, '2026-10-08', { method: '家用体重秤', source: '自记' }),
    ],
    entries: [
      entry('b-e1', 'symptom', '2026-04-05', '疲劳明显，下午需要躺一会儿', '这周疲劳评分 7/10，走两层楼要歇。晚上盗汗，睡衣会湿。', { score: 7, locations: ['疲劳', '夜间盗汗'], duration: '近 2 周' }),
      entry('b-e2', 'symptom', '2026-09-28', '左上腹涨、吃一点就饱', '晚饭吃半碗就觉得撑，左上腹有压迫感。体重比春天轻了 0.6 kg。', { score: 5, locations: ['腹胀', '早饱'], duration: '近 1 个月' }),
      entry('b-e3', 'symptom', '2026-10-10', '骨痛，主要是小腿和肋骨', '晚上更明显，走多了小腿酸胀。没有发烧。', { score: 4, locations: ['骨痛'], duration: '间歇 3 周' }, { is_private: 1 }),
      entry('b-e4', 'lab', '2026-10-08', '十月血常规', 'Hb 94，PLT 228，WBC 9.4，LDH 430。检验科换了 LDH 试剂，报告备注了方法变化。', { reportNo: 'SYN-20261008-01' }, { source: '血常规报告' }),
      entry('b-e5', 'treatment', '2023-05-12', '开始芦可替尼', '按医生处方开始，剂量与复查安排以门诊记录为准。主要观察脾脏和症状。', { drug: '芦可替尼', status: '正在用' }, { source: '门诊记录' }),
      entry('b-e6', 'treatment', '2021-06-01', '羟基脲阶段', '2021–2023 年用过羟基脲，后来因血细胞变化调整。具体原因以医生记录为准。', { drug: '羟基脲', status: '已停用' }, { source: '门诊记录' }),
      entry('b-e7', 'question', '2026-10-12', '复诊要问：贫血和脾脏', '1）Hb 一直在 90 多，要不要查铁、叶酸？2）脾脏 18.4 cm，比去年大，接下来怎么随访？3）夜间盗汗和骨痛需要单独处理吗？', { priority: '高' }),
      entry('b-e8', 'mind', '2026-10-13', '担心拖累家里', '最近总觉得自己帮不上忙，晚上会想很多。想找机会和家里人说说。', { mood: '低落' }, { is_private: 1 }),
      entry('b-e9', 'hospital', '2026-10-08', '血液科随访', '复查血常规、腹部超声。医生记录了脾脏大小和体重变化。', { department: '血液科', doctor: '（合成）陈医生' }, { source: '门诊记录' }),
      entry('b-e10', 'report', '2026-10-08', '腹部超声报告', '脾脏长径 18.4 cm，实质回声均匀。报告原文以医院纸质件为准。', { reportType: '超声' }, { source: '超声报告' }),
    ],
    treatments: [
      { id: 'b-t1', name: '芦可替尼', status: '正在用', started_on: '2023-05-12', ended_on: null, note: '剂量与复查以门诊记录为准', source: '门诊记录' },
      { id: 'b-t2', name: '羟基脲', status: '已停用', started_on: '2021-06-01', ended_on: '2023-04-20', note: '调整原因以医生记录为准', source: '门诊记录' },
    ],
    saved_trials: [],
  },
]

const demo = {
  TODAY,
  brand: { name: '小髓宝', en: 'MPN Workbench', version: 'v0.2.0', tagline: '把自己的病程，收在一处' },
  profiles,
  trials: [
    {
      trialKey: 'DEMO-MPN-001', fictional: true, title: '（虚构示例）口服 JAK2 抑制剂用于高危 PV/MF 的 I 期研究',
      shortTitle: '虚构示例 · JAK2 抑制剂 I 期', registry: 'DEMO-MPN-001', phase: 'Phase 1', status: 'Recruiting',
      studyType: 'Interventional', sponsor: '虚构申办方（示例）', countries: ['中国', '澳大利亚'], startDate: '2025-11-01',
      conditions: ['Polycythemia Vera', 'Primary Myelofibrosis'], source: '合成示例', url: '',
      eligibilityText: 'Inclusion: confirmed PV or MF; documented JAK2 V617F; age >= 18; ECOG 0-1. Exclusion: prior JAK inhibitor within 4 weeks; prior splenectomy.',
      snapshotDate: TODAY,
    },
    {
      trialKey: 'DEMO-MPN-002', fictional: true, title: '（虚构示例）CALR 突变肽疫苗在 ET/PMF 中的 I 期研究',
      shortTitle: '虚构示例 · CALR 疫苗 I 期', registry: 'DEMO-MPN-002', phase: 'Phase 1', status: 'Active, not recruiting',
      studyType: 'Interventional', sponsor: '虚构学术中心（示例）', countries: ['中国'], startDate: '2023-04-04',
      conditions: ['Essential Thrombocythemia', 'Primary Myelofibrosis'], source: '合成示例', url: '',
      eligibilityText: 'Inclusion: confirmed chronic phase ET or PMF; verified CALR exon 9 mutation; age >= 18; PS <= 2; stable hydroxyurea for 8 weeks. Exclusion: current JAK inhibitor; current interferon; active autoimmune disease.',
      snapshotDate: TODAY,
    },
  ],
  trialSnapshot: {
    snapshotDate: TODAY, recordCount: 3, relevant: 3, returned: 3,
    candidateScope: '本地快照 3 条；本轮检索返回 3 条；不是全库扫描',
    channels: [
      { id: 'ctv', label: 'ClinicalTrials.gov（CTV 本地索引）', state: 'SUCCESS', count: 3, note: '本地 1,434 条索引；零命中只代表索引未命中' },
      { id: 'chinadrugtrials', label: '中国药物临床试验登记平台', state: 'NO_RESULTS', count: 0, note: '本地受控归档；不代表官网无该试验' },
      { id: 'chictr_online', label: 'ChiCTR 在线', state: 'FAILED', count: null, note: 'UPSTREAM_MCP_FAILED：连接关闭，不算查过' },
      { id: 'ictrp', label: 'WHO ICTRP', state: 'FAILED', count: null, note: '上游返回错误；不算查过' },
    ],
    disclaimer: '登记状态，未核实；登记 ≠ 有效 ≠ 安全 ≠ 可入组。快照会过期。',
  },
  groupOrder: ['血细胞', '炎症与代谢', '脾脏与体型', '其他'],
  recordKinds: [
    { kind: 'symptom', label: '症状', icon: '◌' },
    { kind: 'lab', label: '血常规', icon: '⌁' },
    { kind: 'treatment', label: '治疗', icon: '⊕' },
    { kind: 'question', label: '问题', icon: '?' },
    { kind: 'hospital', label: '就诊', icon: '⌂' },
    { kind: 'report', label: '报告', icon: '▤' },
    { kind: 'doc', label: '文档', icon: '◇' },
    { kind: 'mind', label: '心情', icon: '○' },
  ],
  meta: { generatedBy: 'scripts/build-demo-data.mjs', synthetic: true, warning: '全部为合成示例，不对应任何真实患者。' },
}

mkdirSync(join(ROOT, 'data'), { recursive: true })
const json = JSON.stringify(demo, null, 2) + '\n'
writeFileSync(join(ROOT, 'data/demo-data.json'), json)
writeFileSync(join(ROOT, 'prototypes/v0.2/demo-data.js'),
  '/* 由 scripts/build-demo-data.mjs 生成；唯一源 data/demo-data.json。全部为合成示例。 */\n' +
  'window.DEMO_DATA = ' + JSON.stringify(demo, null, 2) + ';\n')
console.log(`demo-data: ${profiles.length} profiles, ${profiles.reduce((n, p) => n + p.metrics.length, 0)} metrics, ${profiles.reduce((n, p) => n + p.entries.length, 0)} entries`)
