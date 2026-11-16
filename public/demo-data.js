/* 由 scripts/build-demo-data.mjs 生成；唯一源 data/demo-data.json。全部为合成示例。 */
window.DEMO_DATA = {
  "TODAY": "2026-11-15",
  "brand": {
    "name": "小髓宝",
    "en": "MPN Workbench",
    "version": "v0.2.0",
    "tagline": "把自己的病程，收在一处"
  },
  "profiles": [
    {
      "id": "demo-a",
      "profile_key": "demo-a",
      "name": "林岚 · 合成示例",
      "tag": "PV · 刚确诊",
      "subtype": "PV",
      "diagnosed_on": "2026-08-19",
      "is_demo": 1,
      "age": 46,
      "summary": "确诊约 3 个月，记录还少。最近一次血红蛋白偏高，血小板也偏高；正在和医生讨论随访节奏。",
      "facts": [
        {
          "field": "subtype",
          "label": "亚型",
          "value": "PV（真性红细胞增多症）",
          "source": "2026-08-19 骨髓报告",
          "confirmed": 1
        },
        {
          "field": "driver",
          "label": "驱动突变",
          "value": "JAK2 V617F 阳性",
          "source": "2026-08-19 分子检测",
          "confirmed": 1
        },
        {
          "field": "age",
          "label": "年龄",
          "value": "46",
          "source": "档案自填",
          "confirmed": 1
        },
        {
          "field": "phase",
          "label": "疾病阶段",
          "value": "慢性期",
          "source": "2026-08-19 门诊记录",
          "confirmed": 1
        },
        {
          "field": "prior_therapy",
          "label": "既往治疗",
          "value": "尚未开始降细胞治疗",
          "source": "2026-10-21 门诊记录",
          "confirmed": 1
        },
        {
          "field": "calr",
          "label": "CALR",
          "value": "未检测",
          "source": "—",
          "confirmed": 0
        }
      ],
      "metrics": [
        {
          "id": "a-hb-1",
          "key": "Hb",
          "label": "血红蛋白",
          "category": "血细胞",
          "value": 161,
          "unit": "g/L",
          "ref_low": 115,
          "ref_high": 150,
          "date": "2026-08-19",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "a-hb-2",
          "key": "Hb",
          "label": "血红蛋白",
          "category": "血细胞",
          "value": 155,
          "unit": "g/L",
          "ref_low": 115,
          "ref_high": 150,
          "date": "2026-09-16",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "a-hb-3",
          "key": "Hb",
          "label": "血红蛋白",
          "category": "血细胞",
          "value": 149,
          "unit": "g/L",
          "ref_low": 115,
          "ref_high": 150,
          "date": "2026-10-21",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "a-plt-1",
          "key": "PLT",
          "label": "血小板",
          "category": "血细胞",
          "value": 645,
          "unit": "×10⁹/L",
          "ref_low": 125,
          "ref_high": 350,
          "date": "2026-08-19",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "a-plt-2",
          "key": "PLT",
          "label": "血小板",
          "category": "血细胞",
          "value": 590,
          "unit": "×10⁹/L",
          "ref_low": 125,
          "ref_high": 350,
          "date": "2026-09-16",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "a-plt-3",
          "key": "PLT",
          "label": "血小板",
          "category": "血细胞",
          "value": 510,
          "unit": "×10⁹/L",
          "ref_low": 125,
          "ref_high": 350,
          "date": "2026-10-21",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "a-wbc-1",
          "key": "WBC",
          "label": "白细胞",
          "category": "血细胞",
          "value": 10.2,
          "unit": "×10⁹/L",
          "ref_low": 3.5,
          "ref_high": 9.5,
          "date": "2026-08-19",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "a-wbc-2",
          "key": "WBC",
          "label": "白细胞",
          "category": "血细胞",
          "value": 9.6,
          "unit": "×10⁹/L",
          "ref_low": 3.5,
          "ref_high": 9.5,
          "date": "2026-09-16",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "a-wbc-3",
          "key": "WBC",
          "label": "白细胞",
          "category": "血细胞",
          "value": 8.9,
          "unit": "×10⁹/L",
          "ref_low": 3.5,
          "ref_high": 9.5,
          "date": "2026-10-21",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "a-ldh-1",
          "key": "LDH",
          "label": "乳酸脱氢酶",
          "category": "炎症与代谢",
          "value": 220,
          "unit": "U/L",
          "ref_low": 120,
          "ref_high": 250,
          "date": "2026-08-19",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "a-ldh-2",
          "key": "LDH",
          "label": "乳酸脱氢酶",
          "category": "炎症与代谢",
          "value": 205,
          "unit": "U/L",
          "ref_low": 120,
          "ref_high": 250,
          "date": "2026-09-16",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "a-ldh-3",
          "key": "LDH",
          "label": "乳酸脱氢酶",
          "category": "炎症与代谢",
          "value": 198,
          "unit": "U/L",
          "ref_low": 120,
          "ref_high": 250,
          "date": "2026-10-21",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "a-spl-1",
          "key": "Spleen",
          "label": "脾脏长径",
          "category": "脾脏与体型",
          "value": 13.2,
          "unit": "cm",
          "ref_low": 8,
          "ref_high": 12,
          "date": "2026-08-19",
          "method": "腹部超声",
          "institution": "市一医院检验科",
          "source": "超声报告",
          "is_private": 0
        },
        {
          "id": "a-spl-2",
          "key": "Spleen",
          "label": "脾脏长径",
          "category": "脾脏与体型",
          "value": 12.9,
          "unit": "cm",
          "ref_low": 8,
          "ref_high": 12,
          "date": "2026-09-16",
          "method": "腹部超声",
          "institution": "市一医院检验科",
          "source": "超声报告",
          "is_private": 0
        },
        {
          "id": "a-wt-1",
          "key": "Weight",
          "label": "体重",
          "category": "脾脏与体型",
          "value": 62,
          "unit": "kg",
          "ref_low": null,
          "ref_high": null,
          "date": "2026-08-19",
          "method": "家用体重秤",
          "institution": "市一医院检验科",
          "source": "自记",
          "is_private": 0
        },
        {
          "id": "a-wt-2",
          "key": "Weight",
          "label": "体重",
          "category": "脾脏与体型",
          "value": 62.5,
          "unit": "kg",
          "ref_low": null,
          "ref_high": null,
          "date": "2026-09-16",
          "method": "家用体重秤",
          "institution": "市一医院检验科",
          "source": "自记",
          "is_private": 0
        },
        {
          "id": "a-wt-3",
          "key": "Weight",
          "label": "体重",
          "category": "脾脏与体型",
          "value": 63,
          "unit": "kg",
          "ref_low": null,
          "ref_high": null,
          "date": "2026-10-21",
          "method": "家用体重秤",
          "institution": "市一医院检验科",
          "source": "自记",
          "is_private": 0
        }
      ],
      "entries": [
        {
          "id": "a-e1",
          "kind": "symptom",
          "date": "2026-09-02",
          "title": "头晕、饭后皮肤发痒",
          "body": "下午头晕约半小时；洗热水澡后小腿发痒，持续一阵。没有胸闷。",
          "data": {
            "score": 3,
            "locations": [
              "头晕",
              "皮肤瘙痒"
            ],
            "duration": "间歇"
          },
          "source": "患者自记",
          "is_private": 0
        },
        {
          "id": "a-e2",
          "kind": "question",
          "date": "2026-10-22",
          "title": "复诊要问：阿司匹林和刷牙出血",
          "body": "每天一片阿司匹林，最近刷牙会出血。想请医生看看要不要调整，以及下次什么时候复查血常规。",
          "data": {
            "priority": "高"
          },
          "source": "患者自记",
          "is_private": 0
        },
        {
          "id": "a-e3",
          "kind": "hospital",
          "date": "2026-08-19",
          "title": "确诊门诊",
          "body": "做了血常规、JAK2 检测和骨髓穿刺。医生说要先看随访结果，再决定是不是需要降细胞治疗。",
          "data": {
            "department": "血液科",
            "doctor": "（合成）王医生"
          },
          "source": "门诊记录",
          "is_private": 0
        }
      ],
      "treatments": [],
      "saved_trials": []
    },
    {
      "id": "demo-b",
      "profile_key": "demo-b",
      "name": "周远 · 合成示例",
      "tag": "PMF · 长期随访",
      "subtype": "PMF",
      "diagnosed_on": "2021-03-04",
      "is_demo": 1,
      "age": 63,
      "summary": "确诊约 5 年半，记录较多。最近一年血红蛋白在 90–105 g/L 区间波动，脾脏较前增大，疲劳和夜间盗汗更明显。",
      "facts": [
        {
          "field": "subtype",
          "label": "亚型",
          "value": "PMF（原发性骨髓纤维化）",
          "source": "2021-03-04 骨髓活检",
          "confirmed": 1
        },
        {
          "field": "driver",
          "label": "驱动突变",
          "value": "JAK2 V617F 阳性",
          "source": "2021-03-04 分子检测",
          "confirmed": 1
        },
        {
          "field": "age",
          "label": "年龄",
          "value": "63",
          "source": "档案自填",
          "confirmed": 1
        },
        {
          "field": "phase",
          "label": "疾病阶段",
          "value": "慢性期",
          "source": "2026-10-08 门诊记录",
          "confirmed": 1
        },
        {
          "field": "prior_therapy",
          "label": "既往治疗",
          "value": "羟基脲（2021–2023）；芦可替尼（2023-05 起）",
          "source": "用药记录",
          "confirmed": 1
        },
        {
          "field": "prior_jak",
          "label": "既往 JAK 抑制剂",
          "value": "有",
          "source": "2023-05 用药记录",
          "confirmed": 1
        },
        {
          "field": "calr",
          "label": "CALR",
          "value": "阴性",
          "source": "2021-03-04 分子检测",
          "confirmed": 1
        }
      ],
      "metrics": [
        {
          "id": "b-hb-1",
          "key": "Hb",
          "label": "血红蛋白",
          "category": "血细胞",
          "value": 108,
          "unit": "g/L",
          "ref_low": 115,
          "ref_high": 150,
          "date": "2024-03-12",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-hb-2",
          "key": "Hb",
          "label": "血红蛋白",
          "category": "血细胞",
          "value": 104,
          "unit": "g/L",
          "ref_low": 115,
          "ref_high": 150,
          "date": "2024-09-18",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-hb-3",
          "key": "Hb",
          "label": "血红蛋白",
          "category": "血细胞",
          "value": 101,
          "unit": "g/L",
          "ref_low": 115,
          "ref_high": 150,
          "date": "2025-03-20",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-hb-4",
          "key": "Hb",
          "label": "血红蛋白",
          "category": "血细胞",
          "value": 99,
          "unit": "g/L",
          "ref_low": 115,
          "ref_high": 150,
          "date": "2025-09-25",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-hb-5",
          "key": "Hb",
          "label": "血红蛋白",
          "category": "血细胞",
          "value": 96,
          "unit": "g/L",
          "ref_low": 115,
          "ref_high": 150,
          "date": "2026-04-02",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-hb-6",
          "key": "Hb",
          "label": "血红蛋白",
          "category": "血细胞",
          "value": 94,
          "unit": "g/L",
          "ref_low": 115,
          "ref_high": 150,
          "date": "2026-10-08",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-plt-1",
          "key": "PLT",
          "label": "血小板",
          "category": "血细胞",
          "value": 390,
          "unit": "×10⁹/L",
          "ref_low": 125,
          "ref_high": 350,
          "date": "2024-03-12",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-plt-2",
          "key": "PLT",
          "label": "血小板",
          "category": "血细胞",
          "value": 350,
          "unit": "×10⁹/L",
          "ref_low": 125,
          "ref_high": 350,
          "date": "2024-09-18",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-plt-3",
          "key": "PLT",
          "label": "血小板",
          "category": "血细胞",
          "value": 320,
          "unit": "×10⁹/L",
          "ref_low": 125,
          "ref_high": 350,
          "date": "2025-03-20",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-plt-4",
          "key": "PLT",
          "label": "血小板",
          "category": "血细胞",
          "value": 280,
          "unit": "×10⁹/L",
          "ref_low": 125,
          "ref_high": 350,
          "date": "2025-09-25",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-plt-5",
          "key": "PLT",
          "label": "血小板",
          "category": "血细胞",
          "value": 250,
          "unit": "×10⁹/L",
          "ref_low": 125,
          "ref_high": 350,
          "date": "2026-04-02",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-plt-6",
          "key": "PLT",
          "label": "血小板",
          "category": "血细胞",
          "value": 228,
          "unit": "×10⁹/L",
          "ref_low": 125,
          "ref_high": 350,
          "date": "2026-10-08",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-wbc-1",
          "key": "WBC",
          "label": "白细胞",
          "category": "血细胞",
          "value": 13.8,
          "unit": "×10⁹/L",
          "ref_low": 3.5,
          "ref_high": 9.5,
          "date": "2024-03-12",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-wbc-2",
          "key": "WBC",
          "label": "白细胞",
          "category": "血细胞",
          "value": 14.2,
          "unit": "×10⁹/L",
          "ref_low": 3.5,
          "ref_high": 9.5,
          "date": "2024-09-18",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-wbc-3",
          "key": "WBC",
          "label": "白细胞",
          "category": "血细胞",
          "value": 12.9,
          "unit": "×10⁹/L",
          "ref_low": 3.5,
          "ref_high": 9.5,
          "date": "2025-03-20",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-wbc-4",
          "key": "WBC",
          "label": "白细胞",
          "category": "血细胞",
          "value": 11.7,
          "unit": "×10⁹/L",
          "ref_low": 3.5,
          "ref_high": 9.5,
          "date": "2025-09-25",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-wbc-5",
          "key": "WBC",
          "label": "白细胞",
          "category": "血细胞",
          "value": 10.1,
          "unit": "×10⁹/L",
          "ref_low": 3.5,
          "ref_high": 9.5,
          "date": "2026-04-02",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-wbc-6",
          "key": "WBC",
          "label": "白细胞",
          "category": "血细胞",
          "value": 9.4,
          "unit": "×10⁹/L",
          "ref_low": 3.5,
          "ref_high": 9.5,
          "date": "2026-10-08",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-ldh-1",
          "key": "LDH",
          "label": "乳酸脱氢酶",
          "category": "炎症与代谢",
          "value": 310,
          "unit": "U/L",
          "ref_low": 120,
          "ref_high": 250,
          "date": "2024-03-12",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-ldh-2",
          "key": "LDH",
          "label": "乳酸脱氢酶",
          "category": "炎症与代谢",
          "value": 340,
          "unit": "U/L",
          "ref_low": 120,
          "ref_high": 250,
          "date": "2024-09-18",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-ldh-3",
          "key": "LDH",
          "label": "乳酸脱氢酶",
          "category": "炎症与代谢",
          "value": 355,
          "unit": "U/L",
          "ref_low": 120,
          "ref_high": 250,
          "date": "2025-03-20",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-ldh-4",
          "key": "LDH",
          "label": "乳酸脱氢酶",
          "category": "炎症与代谢",
          "value": 390,
          "unit": "U/L",
          "ref_low": 120,
          "ref_high": 250,
          "date": "2025-09-25",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-ldh-5",
          "key": "LDH",
          "label": "乳酸脱氢酶",
          "category": "炎症与代谢",
          "value": 410,
          "unit": "U/L",
          "ref_low": 120,
          "ref_high": 250,
          "date": "2026-04-02",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-ldh-6",
          "key": "LDH",
          "label": "乳酸脱氢酶",
          "category": "炎症与代谢",
          "value": 430,
          "unit": "U/L",
          "ref_low": 120,
          "ref_high": 250,
          "date": "2026-10-08",
          "method": "静脉血",
          "institution": "市一医院检验科",
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-spl-1",
          "key": "Spleen",
          "label": "脾脏长径",
          "category": "脾脏与体型",
          "value": 15.8,
          "unit": "cm",
          "ref_low": 8,
          "ref_high": 12,
          "date": "2024-03-12",
          "method": "腹部超声",
          "institution": "市一医院检验科",
          "source": "超声报告",
          "is_private": 0
        },
        {
          "id": "b-spl-2",
          "key": "Spleen",
          "label": "脾脏长径",
          "category": "脾脏与体型",
          "value": 16.4,
          "unit": "cm",
          "ref_low": 8,
          "ref_high": 12,
          "date": "2024-09-18",
          "method": "腹部超声",
          "institution": "市一医院检验科",
          "source": "超声报告",
          "is_private": 0
        },
        {
          "id": "b-spl-3",
          "key": "Spleen",
          "label": "脾脏长径",
          "category": "脾脏与体型",
          "value": 17,
          "unit": "cm",
          "ref_low": 8,
          "ref_high": 12,
          "date": "2025-03-20",
          "method": "腹部超声",
          "institution": "市一医院检验科",
          "source": "超声报告",
          "is_private": 0
        },
        {
          "id": "b-spl-4",
          "key": "Spleen",
          "label": "脾脏长径",
          "category": "脾脏与体型",
          "value": 17.5,
          "unit": "cm",
          "ref_low": 8,
          "ref_high": 12,
          "date": "2025-09-25",
          "method": "腹部超声",
          "institution": "市一医院检验科",
          "source": "超声报告",
          "is_private": 0
        },
        {
          "id": "b-spl-5",
          "key": "Spleen",
          "label": "脾脏长径",
          "category": "脾脏与体型",
          "value": 18,
          "unit": "cm",
          "ref_low": 8,
          "ref_high": 12,
          "date": "2026-04-02",
          "method": "腹部超声",
          "institution": "市一医院检验科",
          "source": "超声报告",
          "is_private": 0
        },
        {
          "id": "b-spl-6",
          "key": "Spleen",
          "label": "脾脏长径",
          "category": "脾脏与体型",
          "value": 18.4,
          "unit": "cm",
          "ref_low": 8,
          "ref_high": 12,
          "date": "2026-10-08",
          "method": "腹部超声",
          "institution": "市一医院检验科",
          "source": "超声报告",
          "is_private": 0
        },
        {
          "id": "b-wt-1",
          "key": "Weight",
          "label": "体重",
          "category": "脾脏与体型",
          "value": 66,
          "unit": "kg",
          "ref_low": null,
          "ref_high": null,
          "date": "2024-03-12",
          "method": "家用体重秤",
          "institution": "市一医院检验科",
          "source": "自记",
          "is_private": 0
        },
        {
          "id": "b-wt-2",
          "key": "Weight",
          "label": "体重",
          "category": "脾脏与体型",
          "value": 65.2,
          "unit": "kg",
          "ref_low": null,
          "ref_high": null,
          "date": "2024-09-18",
          "method": "家用体重秤",
          "institution": "市一医院检验科",
          "source": "自记",
          "is_private": 0
        },
        {
          "id": "b-wt-3",
          "key": "Weight",
          "label": "体重",
          "category": "脾脏与体型",
          "value": 64.8,
          "unit": "kg",
          "ref_low": null,
          "ref_high": null,
          "date": "2025-03-20",
          "method": "家用体重秤",
          "institution": "市一医院检验科",
          "source": "自记",
          "is_private": 0
        },
        {
          "id": "b-wt-4",
          "key": "Weight",
          "label": "体重",
          "category": "脾脏与体型",
          "value": 64,
          "unit": "kg",
          "ref_low": null,
          "ref_high": null,
          "date": "2025-09-25",
          "method": "家用体重秤",
          "institution": "市一医院检验科",
          "source": "自记",
          "is_private": 0
        },
        {
          "id": "b-wt-5",
          "key": "Weight",
          "label": "体重",
          "category": "脾脏与体型",
          "value": 63.4,
          "unit": "kg",
          "ref_low": null,
          "ref_high": null,
          "date": "2026-04-02",
          "method": "家用体重秤",
          "institution": "市一医院检验科",
          "source": "自记",
          "is_private": 0
        },
        {
          "id": "b-wt-6",
          "key": "Weight",
          "label": "体重",
          "category": "脾脏与体型",
          "value": 62.8,
          "unit": "kg",
          "ref_low": null,
          "ref_high": null,
          "date": "2026-10-08",
          "method": "家用体重秤",
          "institution": "市一医院检验科",
          "source": "自记",
          "is_private": 0
        }
      ],
      "entries": [
        {
          "id": "b-e1",
          "kind": "symptom",
          "date": "2026-04-05",
          "title": "疲劳明显，下午需要躺一会儿",
          "body": "这周疲劳评分 7/10，走两层楼要歇。晚上盗汗，睡衣会湿。",
          "data": {
            "score": 7,
            "locations": [
              "疲劳",
              "夜间盗汗"
            ],
            "duration": "近 2 周"
          },
          "source": "患者自记",
          "is_private": 0
        },
        {
          "id": "b-e2",
          "kind": "symptom",
          "date": "2026-09-28",
          "title": "左上腹涨、吃一点就饱",
          "body": "晚饭吃半碗就觉得撑，左上腹有压迫感。体重比春天轻了 0.6 kg。",
          "data": {
            "score": 5,
            "locations": [
              "腹胀",
              "早饱"
            ],
            "duration": "近 1 个月"
          },
          "source": "患者自记",
          "is_private": 0
        },
        {
          "id": "b-e3",
          "kind": "symptom",
          "date": "2026-10-10",
          "title": "骨痛，主要是小腿和肋骨",
          "body": "晚上更明显，走多了小腿酸胀。没有发烧。",
          "data": {
            "score": 4,
            "locations": [
              "骨痛"
            ],
            "duration": "间歇 3 周"
          },
          "source": "患者自记",
          "is_private": 1
        },
        {
          "id": "b-e4",
          "kind": "lab",
          "date": "2026-10-08",
          "title": "十月血常规",
          "body": "Hb 94，PLT 228，WBC 9.4，LDH 430。检验科换了 LDH 试剂，报告备注了方法变化。",
          "data": {
            "reportNo": "SYN-20261008-01"
          },
          "source": "血常规报告",
          "is_private": 0
        },
        {
          "id": "b-e5",
          "kind": "treatment",
          "date": "2023-05-12",
          "title": "开始芦可替尼",
          "body": "按医生处方开始，剂量与复查安排以门诊记录为准。主要观察脾脏和症状。",
          "data": {
            "drug": "芦可替尼",
            "status": "正在用"
          },
          "source": "门诊记录",
          "is_private": 0
        },
        {
          "id": "b-e6",
          "kind": "treatment",
          "date": "2021-06-01",
          "title": "羟基脲阶段",
          "body": "2021–2023 年用过羟基脲，后来因血细胞变化调整。具体原因以医生记录为准。",
          "data": {
            "drug": "羟基脲",
            "status": "已停用"
          },
          "source": "门诊记录",
          "is_private": 0
        },
        {
          "id": "b-e7",
          "kind": "question",
          "date": "2026-10-12",
          "title": "复诊要问：贫血和脾脏",
          "body": "1）Hb 一直在 90 多，要不要查铁、叶酸？2）脾脏 18.4 cm，比去年大，接下来怎么随访？3）夜间盗汗和骨痛需要单独处理吗？",
          "data": {
            "priority": "高"
          },
          "source": "患者自记",
          "is_private": 0
        },
        {
          "id": "b-e8",
          "kind": "mind",
          "date": "2026-10-13",
          "title": "担心拖累家里",
          "body": "最近总觉得自己帮不上忙，晚上会想很多。想找机会和家里人说说。",
          "data": {
            "mood": "低落"
          },
          "source": "患者自记",
          "is_private": 1
        },
        {
          "id": "b-e9",
          "kind": "hospital",
          "date": "2026-10-08",
          "title": "血液科随访",
          "body": "复查血常规、腹部超声。医生记录了脾脏大小和体重变化。",
          "data": {
            "department": "血液科",
            "doctor": "（合成）陈医生"
          },
          "source": "门诊记录",
          "is_private": 0
        },
        {
          "id": "b-e10",
          "kind": "report",
          "date": "2026-10-08",
          "title": "腹部超声报告",
          "body": "脾脏长径 18.4 cm，实质回声均匀。报告原文以医院纸质件为准。",
          "data": {
            "reportType": "超声"
          },
          "source": "超声报告",
          "is_private": 0
        }
      ],
      "treatments": [
        {
          "id": "b-t1",
          "name": "芦可替尼",
          "status": "正在用",
          "started_on": "2023-05-12",
          "ended_on": null,
          "note": "剂量与复查以门诊记录为准",
          "source": "门诊记录"
        },
        {
          "id": "b-t2",
          "name": "羟基脲",
          "status": "已停用",
          "started_on": "2021-06-01",
          "ended_on": "2023-04-20",
          "note": "调整原因以医生记录为准",
          "source": "门诊记录"
        }
      ],
      "saved_trials": []
    }
  ],
  "trials": [
    {
      "trialKey": "DEMO-MPN-001",
      "fictional": true,
      "title": "（虚构示例）口服 JAK2 抑制剂用于高危 PV/MF 的 I 期研究",
      "shortTitle": "虚构示例 · JAK2 抑制剂 I 期",
      "registry": "DEMO-MPN-001",
      "phase": "Phase 1",
      "status": "Recruiting",
      "studyType": "Interventional",
      "sponsor": "虚构申办方（示例）",
      "countries": [
        "中国",
        "澳大利亚"
      ],
      "startDate": "2025-11-01",
      "conditions": [
        "Polycythemia Vera",
        "Primary Myelofibrosis"
      ],
      "source": "合成示例",
      "url": "",
      "eligibilityText": "Inclusion: confirmed PV or MF; documented JAK2 V617F; age >= 18; ECOG 0-1. Exclusion: prior JAK inhibitor within 4 weeks; prior splenectomy.",
      "snapshotDate": "2026-11-15"
    },
    {
      "trialKey": "DEMO-MPN-002",
      "fictional": true,
      "title": "（虚构示例）CALR 突变肽疫苗在 ET/PMF 中的 I 期研究",
      "shortTitle": "虚构示例 · CALR 疫苗 I 期",
      "registry": "DEMO-MPN-002",
      "phase": "Phase 1",
      "status": "Active, not recruiting",
      "studyType": "Interventional",
      "sponsor": "虚构学术中心（示例）",
      "countries": [
        "中国"
      ],
      "startDate": "2023-04-04",
      "conditions": [
        "Essential Thrombocythemia",
        "Primary Myelofibrosis"
      ],
      "source": "合成示例",
      "url": "",
      "eligibilityText": "Inclusion: confirmed chronic phase ET or PMF; verified CALR exon 9 mutation; age >= 18; PS <= 2; stable hydroxyurea for 8 weeks. Exclusion: current JAK inhibitor; current interferon; active autoimmune disease.",
      "snapshotDate": "2026-11-15"
    }
  ],
  "trialSnapshot": {
    "snapshotDate": "2026-11-15",
    "recordCount": 3,
    "relevant": 3,
    "returned": 3,
    "candidateScope": "本地快照 3 条；本轮检索返回 3 条；不是全库扫描",
    "channels": [
      {
        "id": "ctv",
        "label": "ClinicalTrials.gov（CTV 本地索引）",
        "state": "SUCCESS",
        "count": 3,
        "note": "本地 1,434 条索引；零命中只代表索引未命中"
      },
      {
        "id": "chinadrugtrials",
        "label": "中国药物临床试验登记平台",
        "state": "NO_RESULTS",
        "count": 0,
        "note": "本地受控归档；不代表官网无该试验"
      },
      {
        "id": "chictr_online",
        "label": "ChiCTR 在线",
        "state": "FAILED",
        "count": null,
        "note": "UPSTREAM_MCP_FAILED：连接关闭，不算查过"
      },
      {
        "id": "ictrp",
        "label": "WHO ICTRP",
        "state": "FAILED",
        "count": null,
        "note": "上游返回错误；不算查过"
      }
    ],
    "disclaimer": "登记状态，未核实；登记 ≠ 有效 ≠ 安全 ≠ 可入组。快照会过期。"
  },
  "groupOrder": [
    "血细胞",
    "炎症与代谢",
    "脾脏与体型",
    "其他"
  ],
  "recordKinds": [
    {
      "kind": "symptom",
      "label": "症状",
      "icon": "◌"
    },
    {
      "kind": "lab",
      "label": "血常规",
      "icon": "⌁"
    },
    {
      "kind": "treatment",
      "label": "治疗",
      "icon": "⊕"
    },
    {
      "kind": "question",
      "label": "问题",
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
      "label": "文档",
      "icon": "◇"
    },
    {
      "kind": "mind",
      "label": "心情",
      "icon": "○"
    }
  ],
  "meta": {
    "generatedBy": "scripts/build-demo-data.mjs",
    "synthetic": true,
    "warning": "全部为合成示例，不对应任何真实患者。"
  }
};
