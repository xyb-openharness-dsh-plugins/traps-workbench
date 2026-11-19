// 合成示例组 B：长期随访、发作与指标都多（切换后整页联动）。仅用于原型演示，不含任何真实患者资料。
// 默认组仍是 demo-data.js 的组 A；刷新或切换后回到 A。
window.HEATPAL_SET_B = {
  id: 'courseB',
  label: '示例组 B · 长期随访（发作与指标多）',
  synthetic: true,
  records: [
    { id: 201, kind: '发作记录', date: '2026-08-20', endDate: '2026-08-25', site: '发热 · 肌痛', text: '发热最高 38.6℃，大腿两侧酸痛，持续约 5 天（既往多为一到两周）（示例）', source: '本人记录 · 合成数据 B', private: false, history: [] },
    { id: 202, kind: '发作记录', date: '2026-03-14', endDate: '2026-03-21', site: '发热 · 眶周水肿', text: '发热伴左眼周围肿，一周后退热（示例）', source: '本人记录 · 合成数据 B', private: false, history: [] },
    { id: 203, kind: '发作记录', date: '2025-10-02', endDate: '2025-10-11', site: '发热 · 腹痛', text: '考试周开始发烧，腹痛两天，持续约 9 天（示例）', source: '本人记录 · 合成数据 B', private: false, history: [] },
    { id: 204, kind: '发作记录', date: '2025-06', datePrecision: 'month', endDate: '2025-06-30', site: '发热 · 游走性皮疹', text: '六月中旬起发烧约两周，腿上有会移动的红斑（示例，具体开始日期待核）', source: '本人补记 · 合成数据 B', private: false, history: [] },
    { id: 205, kind: '发作记录', date: '', datePrecision: 'unknown', endDate: '', site: '发热 · 关节痛', text: '记不清日期的一次发作，膝盖和手腕酸痛（示例）', source: '本人补记 · 合成数据 B', private: false, history: [] },
    { id: 206, kind: '症状记录', date: '2026-08-22', text: '左眼周围肿，热退后自己消了（示例）', source: '本人记录 · 合成数据 B', private: false, history: [] },
    { id: 207, kind: '症状记录', date: '2026-03-16', text: '大腿皮肤发红发热，红斑位置两天一挪，碰到就疼（示例）', source: '本人记录 · 合成数据 B', private: false, history: [] },
    { id: 208, kind: '诱因与先兆', date: '2025-10-01', text: '连着两周复习到半夜，发作前两天觉得特别累（示例）', source: '本人记录 · 合成数据 B', private: false, history: [] },
    { id: 209, kind: '当前用药', date: '2024-11-06', datePrecision: 'day', endDate: '', ongoing: true, drug: '卡那单抗（示例药名）', dose: '150 mg', text: '每 8 周皮下注射一次，按处方抄录（示例）', source: '本人抄录 · 合成数据 B', private: false, history: [],
      pathwayDetail: {
        imaging: { summary: '阶段内 1 条影像结论原文（合成示例 B）；只抄原文，不判读。', items: [['检查日期', '2025-02-14'], ['结论原文（逐字抄录）', '示例超声报告原文：双肾形态大小未见明显异常（合成示例 B）'], ['检查机构/来源', '合成示例医院超声科 · 无原件']] },
        ae: { summary: '阶段内 1 条副作用记录（合成示例 B）；保留等级与处理原文，不归因。', items: [['记录日期', '2025-01-12'], ['现象原文', '示例记录：注射当天针眼周围发红（合成示例 B）'], ['等级原文', '未记录'], ['处理原文', '示例记录：已向随访医生说明（合成示例 B）']] },
        support: { summary: '阶段内 1 条支持措施；效果仅保留本人原话，不评疗效。', items: [['记录日期', '2025-03-05'], ['措施（原文）', '示例记录：注射日前一天早睡、当天多喝水（合成示例 B）'], ['效果（本人原话）', '“第二天上课没那么困。”'], ['来源', '本人记录 · 合成数据 B'], ['性质', '合成示例，不是真实记录']] }
      } },
    { id: 210, kind: '当前用药', date: '2022-05-10', datePrecision: 'day', endDate: '', ongoing: true, drug: '泼尼松（示例药名）', dose: '', text: '发作期短期使用，具体剂量与减量安排未抄录（示例）', source: '本人抄录 · 合成数据 B', private: false, history: [] },
    { id: 211, kind: '当前用药', date: '2023-03-08', datePrecision: 'day', endDate: '2024-08-30', ongoing: false, drug: '依那西普（示例药名）', dose: '', text: '曾用，治疗细节只抄到起止日期（示例）', source: '本人抄录 · 合成数据 B', private: true, history: [] },
    { id: 212, kind: '医嘱记录', date: '2026-08-25', text: '随访医生原话：每次发作把体温和持续天数记全，复诊带着基因报告和尿常规（示例）', source: '本人抄录 · 合成数据 B', private: false, history: [] },
    { id: 213, kind: '问题清单', date: '2026-10-20', text: '下次复诊想问的问题（示例 B，私密）', source: '本人记录 · 合成数据 B', private: true, history: [] },
    { id: 214, kind: '资料库', date: '2021-06-18', department: '儿科风湿免疫', text: '基因检测报告：TNFRSF1A 杂合变异（示例）', source: '儿科合成记录 B', original: { title: '基因检测报告（合成原件 B）', text: '合成原件：TNFRSF1A 基因检出杂合变异，父亲同样检出；报告原文以原件为准（合成示例）。' }, private: false, history: [] },
    { id: 215, kind: '资料库', date: '2025-02-14', department: '肾内科', text: '肾内科会诊：AA 淀粉样变筛查与随访安排（示例）', source: '肾内科合成记录 B', original: { title: '肾内科会诊记录（合成原件 B）', text: '合成原件：建议定期尿常规、尿蛋白与肾功能随访（合成示例）。' }, private: false, history: [] },
    { id: 216, kind: '资料库', date: '2025-02-14', department: '超声科', text: '肾脏超声报告原文抄录（示例）', source: '超声科合成记录 B', original: { title: '肾脏超声报告（合成原件 B）', text: '合成原件：双肾形态大小未见明显异常（合成示例）。' }, private: false, history: [] },
    { id: 217, kind: '资料库', date: '2026-08-25', department: '儿科风湿免疫', text: '随访小结：发作间隔较前缩短、持续时间较前缩短（示例）', source: '儿科合成记录 B', original: { title: '随访小结（合成原件 B）', text: '合成原件：近一年发作记录较前规律，继续随访（合成示例）。' }, private: false, history: [] }
  ],
  metrics: [
    { id: 'crp', name: 'C反应蛋白 CRP', group: '炎症指标', unit: 'mg/L', method: '免疫比浊法', laboratory: '合成示例医院检验科', source: '合成示例 B · 无原件', color: '#216f60',
      points: [{date:'2024-10-15',value:68},{date:'2024-12-20',value:54},{date:'2025-02-10',value:21},{date:'2025-04-18',value:16},{date:'2025-06-18',value:49},{date:'2025-08-22',value:12},{date:'2025-09-30',value:39,method:'免疫透射比浊',laboratory:'合成示例分院检验科'},{date:'2025-10-05',value:41},{date:'2025-12-15',value:10},{date:'2026-03-16',value:36},{date:'2026-06-20',value:9},{date:'2026-08-21',value:28},{date:'2026-10-12',value:11}] },
    { id: 'saa', name: '血清淀粉样A蛋白 SAA', group: '炎症指标', unit: 'mg/L', method: '免疫比浊法', laboratory: '合成示例医院检验科', source: '合成示例 B · 无原件', color: '#345d8a',
      points: [{date:'2025-02-10',value:96},{date:'2025-06-18',value:74},{date:'2025-10-05',value:58},{date:'2026-03-16',value:47},{date:'2026-08-21',value:31},{date:'2026-10-12',value:18}] },
    { id: 'esr', name: '血沉 ESR', group: '炎症指标', unit: 'mm/h', method: '魏氏法', laboratory: '合成示例医院检验科', source: '合成示例 B · 无原件', color: '#76609c',
      points: [{date:'2025-02-10',value:46},{date:'2025-10-05',value:38},{date:'2026-03-16',value:29},{date:'2026-08-21',value:22},{date:'2026-10-12',value:14}] },
    { id: 'wbc', name: '白细胞 WBC', group: '炎症指标', unit: '×10⁹/L', method: '流式细胞计数', laboratory: '合成示例医院检验科', source: '合成示例 B · 无原件', color: '#9a5d35',
      points: [{date:'2025-02-10',value:12.6},{date:'2025-10-05',value:11.2},{date:'2026-03-16',value:9.8},{date:'2026-10-12',value:7.4}] },
    { id: 'creat', name: '血肌酐', group: '长期监测', unit: 'μmol/L', method: '酶法', laboratory: '合成示例医院检验科', source: '合成示例 B · 无原件', color: '#2a6e4f',
      points: [{date:'2025-02-14',value:58},{date:'2026-02-10',value:61},{date:'2026-08-21',value:63}] },
    { id: 'protp', name: '尿蛋白定性', group: '长期监测', unit: '', method: '干化学试带', laboratory: '合成示例医院检验科', source: '合成示例 B · 无原件', color: '#8a6d1f',
      points: [{date:'2025-02-14',value:'±'},{date:'2026-08-21',value:'-'}] },
    { id: 'temp', name: '发作期最高体温', group: '体温测量', unit: '℃', method: '耳温枪', laboratory: '家中自测', source: '本人记录 · 合成数据 B', color: '#9a480d',
      points: [{date:'2025-06-18',value:38.9},{date:'2025-10-04',value:38.4},{date:'2026-03-15',value:38.2},{date:'2026-08-21',value:38.6}] }
  ],
  events: [
    { date: '2021-06-18', type: '事件', label: '基因检测确诊（合成示例 B）' },
    { date: '2024-11-06', type: '事件', label: '起用卡那单抗（合成示例 B）' },
    { date: '2025-02-14', type: '事件', label: '肾内科 AA 淀粉样变评估（合成示例 B）' },
    { date: '2026-02-10', type: '事件', label: '年度随访（合成示例 B）' },
    { date: '2026-08-25', type: '事件', label: '复诊·随访小结（合成示例 B）' }
  ]
};
