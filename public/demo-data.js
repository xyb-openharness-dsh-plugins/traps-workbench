/* Generated from data/demo-data.json. All patient records are synthetic. */
window.DEMO_DATA = {
  "TODAY": "2026-11-16",
  "brand": {
    "name": "TRAPS 工作台（占位名）",
    "en": "TRAPS Workbench",
    "version": "v0.2.0",
    "tagline": "把发作与资料，按时间和来源留在一处"
  },
  "profiles": [
    {
      "id": "demo-a",
      "profile_key": "demo-a",
      "name": "程岚 · 合成示例",
      "tag": "刚完成评估 · 记录较少",
      "subtype": "TRAPS（合成标签）",
      "diagnosed_on": "2026-09-03",
      "is_demo": 1,
      "age": 34,
      "summary": "合成资料：近几个月记下两次发热发作，正在整理每次持续时间、疼痛位置与检验报告来源。所有数据均为虚构。",
      "facts": [
        {
          "field": "genetics",
          "label": "遗传报告状态",
          "value": "合成示例：报告待复核",
          "source": "合成遗传报告记录",
          "confirmed": 0
        }
      ],
      "metrics": [
        {
          "id": "a1",
          "key": "CRP",
          "label": "C反应蛋白",
          "category": "炎症指标",
          "value": 28,
          "unit": "mg/L",
          "ref_low": 0,
          "ref_high": 8,
          "date": "2026-09-03",
          "method": "静脉血",
          "institution": "社区综合门诊检验科",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "a2",
          "key": "CRP",
          "label": "C反应蛋白",
          "category": "炎症指标",
          "value": 7,
          "unit": "mg/L",
          "ref_low": 0,
          "ref_high": 8,
          "date": "2026-10-14",
          "method": "静脉血",
          "institution": "社区综合门诊检验科",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "a3",
          "key": "ESR",
          "label": "红细胞沉降率",
          "category": "炎症指标",
          "value": 36,
          "unit": "mm/h",
          "ref_low": 0,
          "ref_high": 20,
          "date": "2026-09-03",
          "method": "静脉血",
          "institution": "社区综合门诊检验科",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "a4",
          "key": "SAA",
          "label": "血清淀粉样蛋白A",
          "category": "炎症指标",
          "value": null,
          "unit": "mg/L",
          "ref_low": null,
          "ref_high": null,
          "date": "2026-09-03",
          "method": "静脉血",
          "institution": "社区综合门诊检验科",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "a5",
          "key": "TEMP",
          "label": "体温",
          "category": "发作观察",
          "value": 39.1,
          "unit": "°C",
          "ref_low": null,
          "ref_high": null,
          "date": "2026-09-02",
          "method": "家庭体温计",
          "institution": "合成自记",
          "source": "合成检验单",
          "is_private": 0
        }
      ],
      "entries": [
        {
          "id": "a-e1",
          "kind": "symptom",
          "date": "发热与小腿疼痛",
          "title": "合成示例：记录发热起始时间、局部肌肉疼痛与日常活动影响；仅为本人观察。",
          "body": "2026-09-02",
          "data": {
            "score": 6,
            "locations": [
              "发热",
              "肌肉疼痛"
            ],
            "duration": "约 8 天"
          },
          "source": "合成自记",
          "is_private": 0
        },
        {
          "id": "a-e2",
          "kind": "hospital",
          "date": "门诊复诊",
          "title": "合成示例：就诊来源待补；医生原话需以原始记录核对。",
          "body": "2026-09-10",
          "data": {},
          "source": "合成门诊记录",
          "is_private": 0
        },
        {
          "id": "a-e3",
          "kind": "question",
          "date": "下次想确认的问题",
          "title": "合成示例：哪些资料适合带来复诊？",
          "body": "2026-10-14",
          "data": {},
          "source": "合成自记",
          "is_private": 0
        }
      ],
      "treatments": [],
      "saved_trials": [],
      "privateEntries": []
    },
    {
      "id": "demo-b",
      "profile_key": "demo-b",
      "name": "周澄 · 合成示例",
      "tag": "长期随访 · 记录较多",
      "subtype": "TRAPS（合成标签）",
      "diagnosed_on": "2018-04-22",
      "is_demo": 1,
      "age": 42,
      "summary": "合成资料：多个年份的发作记录和检验结果，用于演示时间线、单位/方法差异和资料回顾；并非真实患者。",
      "facts": [
        {
          "field": "genetics",
          "label": "遗传报告状态",
          "value": "合成示例：报告解释状态未核实",
          "source": "合成报告摘要",
          "confirmed": 0
        },
        {
          "field": "family",
          "label": "家族史",
          "value": "未提供（合成示例）",
          "source": "未提供",
          "confirmed": 0
        }
      ],
      "metrics": [
        {
          "id": "b1",
          "key": "CRP",
          "label": "C反应蛋白",
          "category": "炎症指标",
          "value": 41,
          "unit": "mg/L",
          "ref_low": 0,
          "ref_high": 8,
          "date": "2026-01-12",
          "method": "静脉血",
          "institution": "社区综合门诊检验科",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b2",
          "key": "CRP",
          "label": "C反应蛋白",
          "category": "炎症指标",
          "value": 18,
          "unit": "mg/L",
          "ref_low": 0,
          "ref_high": 8,
          "date": "2026-03-18",
          "method": "静脉血",
          "institution": "社区综合门诊检验科",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b3",
          "key": "CRP",
          "label": "C反应蛋白",
          "category": "炎症指标",
          "value": 6,
          "unit": "mg/L",
          "ref_low": 0,
          "ref_high": 8,
          "date": "2026-05-02",
          "method": "静脉血",
          "institution": "社区综合门诊检验科",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b4",
          "key": "CRP",
          "label": "C反应蛋白",
          "category": "炎症指标",
          "value": 32,
          "unit": "mg/L",
          "ref_low": 0,
          "ref_high": 8,
          "date": "2026-08-24",
          "method": "静脉血",
          "institution": "社区综合门诊检验科",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b5",
          "key": "CRP",
          "label": "C反应蛋白",
          "category": "炎症指标",
          "value": 9,
          "unit": "mg/L",
          "ref_low": 0,
          "ref_high": 8,
          "date": "2026-10-18",
          "method": "静脉血",
          "institution": "社区综合门诊检验科",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b6",
          "key": "ESR",
          "label": "红细胞沉降率",
          "category": "炎症指标",
          "value": 52,
          "unit": "mm/h",
          "ref_low": 0,
          "ref_high": 20,
          "date": "2026-01-12",
          "method": "静脉血",
          "institution": "社区综合门诊检验科",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b7",
          "key": "ESR",
          "label": "红细胞沉降率",
          "category": "炎症指标",
          "value": 14,
          "unit": "mm/h",
          "ref_low": 0,
          "ref_high": 20,
          "date": "2026-05-02",
          "method": "静脉血",
          "institution": "社区综合门诊检验科",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b8",
          "key": "SAA",
          "label": "血清淀粉样蛋白A",
          "category": "炎症指标",
          "value": 66,
          "unit": "mg/L",
          "ref_low": null,
          "ref_high": null,
          "date": "2026-01-12",
          "method": "静脉血",
          "institution": "社区综合门诊检验科",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b9",
          "key": "SAA",
          "label": "血清淀粉样蛋白A",
          "category": "炎症指标",
          "value": 12,
          "unit": "mg/L",
          "ref_low": null,
          "ref_high": null,
          "date": "2026-10-18",
          "method": "静脉血",
          "institution": "社区综合门诊检验科",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b10",
          "key": "TEMP",
          "label": "体温",
          "category": "发作观察",
          "value": 39.4,
          "unit": "°C",
          "ref_low": null,
          "ref_high": null,
          "date": "2026-01-10",
          "method": "家庭体温计",
          "institution": "合成自记",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b11",
          "key": "TEMP",
          "label": "体温",
          "category": "发作观察",
          "value": 38.7,
          "unit": "°C",
          "ref_low": null,
          "ref_high": null,
          "date": "2026-03-16",
          "method": "家庭体温计",
          "institution": "合成自记",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b12",
          "key": "TEMP",
          "label": "体温",
          "category": "发作观察",
          "value": 39,
          "unit": "°C",
          "ref_low": null,
          "ref_high": null,
          "date": "2026-08-22",
          "method": "家庭体温计",
          "institution": "合成自记",
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b13",
          "key": "CRP",
          "label": "C反应蛋白",
          "category": "炎症指标",
          "value": 7,
          "unit": "mg/L",
          "ref_low": 0,
          "ref_high": 6,
          "date": "2026-10-18",
          "method": "静脉血",
          "institution": "合成另一机构",
          "source": "合成检验单",
          "is_private": 0
        }
      ],
      "entries": [
        {
          "id": "b-e1",
          "kind": "symptom",
          "date": "发热发作记录",
          "title": "合成示例：体温与整体不适观察；记录发作起止，不判断病因。",
          "body": "2026-01-10",
          "data": {
            "score": 8,
            "locations": [
              "发热",
              "肌肉疼痛",
              "眼部不适"
            ],
            "duration": "约 12 天"
          },
          "source": "合成自记",
          "is_private": 0
        },
        {
          "id": "b-e2",
          "kind": "symptom",
          "date": "发作间期观察",
          "title": "合成示例：记录疲倦和工作影响。",
          "body": "2026-02-04",
          "data": {
            "score": 3,
            "locations": [
              "疲倦"
            ]
          },
          "source": "合成自记",
          "is_private": 0
        },
        {
          "id": "b-e3",
          "kind": "lab",
          "date": "炎症指标记录",
          "title": "合成示例：CRP 与 ESR；原始报告来源待核。",
          "body": "2026-01-12",
          "data": {},
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b-e4",
          "kind": "hospital",
          "date": "门诊记录",
          "title": "合成示例：跨机构复诊日期与待问问题。",
          "body": "2026-03-20",
          "data": {},
          "source": "合成门诊记录",
          "is_private": 0
        },
        {
          "id": "b-e5",
          "kind": "report",
          "date": "遗传报告摘要",
          "title": "合成示例：只记录报告名称和来源，不推断遗传风险。",
          "body": "2026-04-08",
          "data": {},
          "source": "合成报告摘要",
          "is_private": 1
        },
        {
          "id": "b-e6",
          "kind": "question",
          "date": "复诊问题",
          "title": "合成示例：哪些变化适合在时间线上一起回看？",
          "body": "2026-05-02",
          "data": {},
          "source": "合成自记",
          "is_private": 0
        },
        {
          "id": "b-e7",
          "kind": "symptom",
          "date": "发热与腹部不适",
          "title": "合成示例：间歇性腹部不适与发热观察。",
          "body": "2026-08-22",
          "data": {
            "score": 7,
            "locations": [
              "发热",
              "腹部不适"
            ],
            "duration": "约 9 天"
          },
          "source": "合成自记",
          "is_private": 0
        },
        {
          "id": "b-e8",
          "kind": "lab",
          "date": "实验室记录",
          "title": "合成示例：单位/参考范围按本次报告展示。",
          "body": "2026-10-18",
          "data": {},
          "source": "合成检验单",
          "is_private": 0
        },
        {
          "id": "b-e9",
          "kind": "doc",
          "date": "复诊资料清单",
          "title": "合成示例：待带报告、发作记录与问题列表。",
          "body": "2026-10-25",
          "data": {},
          "source": "合成自记",
          "is_private": 0
        },
        {
          "id": "b-e10",
          "kind": "mind",
          "date": "感受记录",
          "title": "合成示例：记录发作对生活安排的影响。",
          "body": "2026-11-01",
          "data": {},
          "source": "合成自记",
          "is_private": 0
        }
      ],
      "treatments": [],
      "saved_trials": [],
      "privateEntries": []
    }
  ],
  "trials": [
    {
      "trialKey": "NCT02059291",
      "title": "Study of Efficacy and Safety of Canakinumab in Patients With Hereditary Periodic Fevers",
      "shortTitle": "Study of Efficacy and Safety of Canakinumab in Patients With Hereditary Periodic Fevers",
      "registry": "NCT02059291",
      "phase": "PHASE3",
      "status": "COMPLETED (registry field; verify source record)",
      "studyType": "INTERVENTIONAL",
      "sponsor": "Novartis Pharmaceuticals",
      "countries": [
        "Belgium",
        "Canada",
        "France",
        "Germany",
        "Hungary",
        "Ireland",
        "Israel",
        "Italy",
        "Japan",
        "Netherlands",
        "Russia",
        "Spain",
        "Switzerland",
        "Turkey (Türkiye)",
        "United Kingdom",
        "United States"
      ],
      "startDate": "2014-02-07",
      "conditions": [
        "Hereditary Periodic Fevers"
      ],
      "source": "ClinicalTrials.gov",
      "sourceUrl": "https://clinicaltrials.gov/study/NCT02059291",
      "snapshotDate": "2026-11-16",
      "summary": "",
      "fictional": false
    },
    {
      "trialKey": "NCT01242813",
      "title": "Efficacy and Safety Study of ACZ885 in Patients With Active Recurrent or Chronic TNF-receptor Associated Periodic Syndrome (TRAPS).",
      "shortTitle": "Efficacy and Safety Study of ACZ885 in Patients With Active Recurrent or Chronic TNF-receptor Associated Periodic Syndrome (TRAPS).",
      "registry": "NCT01242813",
      "phase": "PHASE2",
      "status": "COMPLETED (registry field; verify source record)",
      "studyType": "INTERVENTIONAL",
      "sponsor": "Novartis Pharmaceuticals",
      "countries": [
        "Ireland",
        "Italy",
        "United Kingdom"
      ],
      "startDate": "2010-11-16",
      "conditions": [
        "TNF-receptor Associated Periodic Syndromes (TRAPS)"
      ],
      "source": "ClinicalTrials.gov",
      "sourceUrl": "https://clinicaltrials.gov/study/NCT01242813",
      "snapshotDate": "2026-11-16",
      "summary": "",
      "fictional": false
    },
    {
      "trialKey": "NCT02911857",
      "title": "An Extention Study of Safety of Canakinumab in Japanese Patients With Periodic Fever Syndromes",
      "shortTitle": "An Extention Study of Safety of Canakinumab in Japanese Patients With Periodic Fever Syndromes",
      "registry": "NCT02911857",
      "phase": "PHASE3",
      "status": "COMPLETED (registry field; verify source record)",
      "studyType": "INTERVENTIONAL",
      "sponsor": "Novartis Pharmaceuticals",
      "countries": [
        "Japan"
      ],
      "startDate": "2016-09-20",
      "conditions": [
        "Periodic Fevers Syndrome"
      ],
      "source": "ClinicalTrials.gov",
      "sourceUrl": "https://clinicaltrials.gov/study/NCT02911857",
      "snapshotDate": "2026-11-16",
      "summary": "",
      "fictional": false
    }
  ],
  "trialSnapshot": {
    "recordCount": 3,
    "relevant": 3,
    "snapshotDate": "2026-11-16",
    "channels": [
      {
        "id": "ClinicalTrials.gov",
        "label": "ClinicalTrials.gov",
        "state": "SUCCESS",
        "count": 3,
        "note": "API v2 公共登记元数据，非穷尽种子快照"
      }
    ],
    "disclaimer": "登记状态来自来源当时字段且会变化；不是全库扫描或个人入组资格判断。请查官方登记原文。"
  },
  "groupOrder": [
    "炎症指标",
    "发作观察",
    "其他"
  ],
  "recordKinds": [
    {
      "kind": "symptom",
      "label": "症状 / 发作",
      "icon": "◌"
    },
    {
      "kind": "lab",
      "label": "检验",
      "icon": "⌁"
    },
    {
      "kind": "treatment",
      "label": "既定方案记录",
      "icon": "＋"
    },
    {
      "kind": "question",
      "label": "复诊问题",
      "icon": "?"
    },
    {
      "kind": "hospital",
      "label": "就诊",
      "icon": "⌂"
    },
    {
      "kind": "report",
      "label": "报告",
      "icon": "▤"
    },
    {
      "kind": "doc",
      "label": "资料",
      "icon": "◇"
    },
    {
      "kind": "mind",
      "label": "感受",
      "icon": "○"
    }
  ],
  "meta": {
    "interviewCount": 0,
    "clinicalReviewCount": 0
  }
};
