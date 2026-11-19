# CLINICAL-DATA · traps-workbench（M0 骨架版）

> 0 临床审核（如实标注：本文档医学内容未经临床医生审核，阈值/频次类一律【待核】）；0 患者访谈（如实标注）。

## 临床数据库快照状态

- **实测（2026-11-16）**：ClinicalTrials.gov API v2 `query.cond="TNF Receptor-Associated Periodic Syndrome"`，`countTotal=true` → **6 条**（接口应答 totalCount=6 已核）。逐条 NCT：NCT02466217（表型组学，泛炎症）、NCT01002521（糖尿病伤口愈合，条件模糊匹配）、NCT06838143（Ilaris NIS Korea，招募中）、NCT01242813（ACZ885/canakinumab 活动性复发性或慢性 TNF 受体相关周期热综合征，完成）、NCT02334748（canakinumab 系统型 JIA 或遗传性周期热，完成）、NCT02911857（canakinumab 日本周期热延伸，完成）。
- **相关条数口径**：6 条中 ≥4 条直接相关（TRAPS/遗传性周期热），2 条为条件模糊匹配（表型组学/糖尿病）——M4 快照落库后按标题/研究对象关键词单独统计并写进 manifest.relevant。
- **决策**：试验线**保留**（含 canakinumab 干预试验与招募中研究）。M4 落 `research/traps/` 四件套（manifest/jsonl/sqlite/README）后按 35 号四段链路接入；M4 前前端不出现检索入口（不写假入口）。
- 中国试验通道（chictr/chinadrugtrials/ictrp）未实测：M4 补，FAILED 如实记。

## 内容边界

- 指南只定内容边界，不转成自测或选治疗；未过临床审核的阈值与求助短语作待核占位。
- 发作持续天数阈值（如「>5 天」）为文献描述【待核】，工作台不做自动诊断或分型判定、不落判读列。
- 中国适应证只认中国官方来源（NMPA），canakinumab 国内适应证状态未取得原件前一律【待核】。
- 化验指标口径：只列医生原文与日期；CRP/SAA 不同方法/机构不合并、不跨方法做差。


## 2026-11-20 医学事实台账（研究子代理产出，逐条带 URL，2026-11-20 HEAD 核验见 primer-data.js note）
- 定义/遗传：TNFRSF1A 杂合、常显（外显率不完全）、OMIM #142680（omim.org/entry/142680）；患病率二手估计 ~1/100 万（medlineplus.gov/genetics/condition/tumor-necrosis-factor-receptor-associated-periodic-syndrome）。
- 发作特征：7–21 天（GeneReviews NBK586171，原件 200）；游走性肌痛+移动性红斑、眶周水肿、结膜炎、腹痛、关节痛。
- 分类标准：Eurofever/PRINTO 2019（Gattorno, Ann Rheum Dis 2019;78(8):1025-35，PMID 31018962 题录；出版社直链 403 未取得——只能记题录）。
- 并发症监测：AA 淀粉样变（肾最常受累，蛋白尿可为首发）（PMC9307948）；SAA 持续升高为主要驱动（二手，EULAR 2016 语境）。
- 治疗类别与证据分层：NSAIDs/激素（综述共识层面，PMC7246474）；依那西普（队列/病例系列，PMC7722275）；卡那单抗（RCT+FDA 2016-09-23 批准，诺华官方新闻稿 200）；托珠单抗（个案）；HSCT（个案/综述，无指南级推荐）。
- 中国官方：未查到 TRAPS 专门指南；卡那单抗截至 2025 年中未见 NMPA 获批（二手报道，NMPA 数据库未直接核到——标「待核」）；托珠单抗/依那西普中国适应证均不含 TRAPS（二手）。
- 患者教育：PRINTO 中文版 TRAPS 家长手册（printo.it/pediatric-rheumatology/CN/info/25，200）；中国本土患者组织未查到。
- 红线执行：以上全部只进「解释层」；阈值/求助短语 0 条未经临床审核，S03 页保持待核占位。
