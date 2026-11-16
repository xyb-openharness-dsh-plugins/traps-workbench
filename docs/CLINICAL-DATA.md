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
