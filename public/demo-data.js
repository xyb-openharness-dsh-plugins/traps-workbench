// 合成示例组 A（默认）：刚确诊、记录少。仅用于原型演示，不含任何真实患者资料。
// 本文件是示例记录的唯一初始来源；组 B 在 demo-data-b.js。刷新后回到本组。
window.HEATPAL_DEMO_RECORDS = [
  { id: 1, kind: '发作记录', date: '2026-10-05', endDate: '2026-10-11', site: '发热 · 游走性皮疹 · 肌痛', text: '发热约 38.9℃；右大腿疼痛，皮肤上有会移动的红色斑块，三天后移到小腿；发烧那几天没法上学（示例）', source: '本人家长记录 · 合成数据', private: false, history: [] },
  { id: 2, kind: '发作记录', date: '2026-09-02', endDate: '2026-09-08', site: '发热 · 腹痛', text: '发热约 38.5℃，腹痛两天，第五天退热（示例）', source: '本人家长记录 · 合成数据', private: false, history: [] },
  { id: 3, kind: '当前用药', date: '2026-10-06', datePrecision: 'day', endDate: '', ongoing: true, drug: '布洛芬混悬液', dose: '', text: '发作期按需使用，剂量与频次未抄录（示例）', source: '本人家长抄录 · 合成数据', private: false, history: [],
    pathwayDetail: {
      support: { summary: '阶段内 1 条支持措施；效果仅保留本人原话，不评疗效。', items: [['记录日期', '2026-10-16'], ['措施（原文）', '示例记录：发作期间每天记一次体温和疼痛部位（合成示例）'], ['效果（本人原话）', '“记下来之后，跟医生说病情就不慌了。”'], ['来源', '本人家长记录 · 合成数据'], ['性质', '合成示例，不是真实记录']] }
    } },
  { id: 4, kind: '问题清单', date: '2026-10-20', text: '下次复诊想问的问题：这个药发烧时怎么用；要不要做别的检查（示例）', source: '本人家长记录 · 合成数据', private: true, history: [] },
  { id: 5, kind: '资料库', date: '2026-10-13', department: '儿科风湿免疫', text: '基因检测报告解读门诊：TNFRSF1A 相关周期性综合征（示例）', source: '儿科合成记录', original: { title: '基因检测报告（合成原件）', text: '合成原件：TNFRSF1A 基因检出杂合变异，医生判读为相关；报告原文以原件为准（合成示例）。' }, private: false, history: [] },
  { id: 6, kind: '资料库', date: '2026-09-15', department: '儿科门诊', text: '儿科门诊病历：反复发热两个月，怀疑周期性发热综合征（示例）', source: '儿科合成记录', original: { title: '门诊病历（合成原件）', text: '合成原件：门诊记录反复发热、游走性皮疹与肌痛；建议基因检测（合成示例）。' }, private: false, history: [] }
];
// 合成指标目录：只定类别、项目名与预期单位；无参考范围、无分级、无临床建议。
window.HEATPAL_METRIC_CATALOG = {
  version: 1,
  source: '合成示例目录 · 未经临床审核',
  categoryOrder: ['inflam', 'monitor', 'measure'],
  categories: [
    { id: 'inflam', name: '炎症指标' },
    { id: 'monitor', name: '长期监测' },
    { id: 'measure', name: '体温测量' }
  ],
  items: [
    { metricId: 'crp', displayName: 'C反应蛋白 CRP', aliases: ['CRP', 'C反应蛋白'], categoryId: 'inflam', displayOrder: 10, expectedUnits: ['mg/L'], note: '仅按报告原单位记录；不同单位、方法、机构不合并、不换算。' },
    { metricId: 'saa', displayName: '血清淀粉样A蛋白 SAA', aliases: ['SAA'], categoryId: 'inflam', displayOrder: 20, expectedUnits: ['mg/L'], note: '同一天多条记录不合并、不取平均。' },
    { metricId: 'esr', displayName: '血沉 ESR', aliases: ['ESR', '血沉'], categoryId: 'inflam', displayOrder: 30, expectedUnits: ['mm/h'], note: '仅按报告原单位记录。' },
    { metricId: 'wbc', displayName: '白细胞 WBC', aliases: ['WBC', '白细胞'], categoryId: 'inflam', displayOrder: 40, expectedUnits: ['×10⁹/L'], note: '仅按报告原单位记录。' },
    { metricId: 'creat', displayName: '血肌酐', aliases: ['肌酐'], categoryId: 'monitor', displayOrder: 50, expectedUnits: ['μmol/L'], note: '长期监测项目；不同机构分开看。' },
    { metricId: 'protp', displayName: '尿蛋白定性', aliases: ['尿蛋白'], categoryId: 'monitor', displayOrder: 60, expectedUnits: [''], note: '按报告原文记录定性符号；不换算成数值。' },
    { metricId: 'temp', displayName: '发作期最高体温', aliases: ['体温'], categoryId: 'measure', displayOrder: 70, expectedUnits: ['℃'], note: '按自己测到的值记录；单点只画点，不连线。' }
  ]
};
// 可比组显式声明：单位与方法属于每条序列。
window.HEATPAL_METRICS = [
  {id:'crp', name:'C反应蛋白 CRP', group:'炎症指标', unit:'mg/L', method:'免疫比浊法', laboratory:'合成示例医院检验科', source:'合成示例 · 无原件', color:'#216f60', points:[{date:'2026-09-04',value:52},{date:'2026-10-07',value:64}]},
  {id:'saa', name:'血清淀粉样A蛋白 SAA', group:'炎症指标', unit:'mg/L', method:'免疫比浊法', laboratory:'合成示例医院检验科', source:'合成示例 · 无原件', color:'#345d8a', points:[{date:'2026-10-07',value:118}]},
  {id:'temp', name:'发作期最高体温', group:'体温测量', unit:'℃', method:'耳温枪', laboratory:'家中自测', source:'本人家长记录 · 合成数据', color:'#9a480d', points:[{date:'2026-09-03',value:38.5},{date:'2026-10-06',value:38.9}]}
];
window.HEATPAL_EVENTS = [
  {date:'2026-09-15',type:'事件',label:'儿科风湿免疫初诊（合成示例）'},
  {date:'2026-10-13',type:'事件',label:'基因检测报告解读门诊（合成示例）'}
];
