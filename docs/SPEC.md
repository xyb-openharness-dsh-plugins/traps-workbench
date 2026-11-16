# 项目规格 v0.1（M0 骨架版 · traps-workbench）

状态：草案（无人值守夜班，晨审追认）。确认人/日期：待补。不得把本模板当成已确认业务。0 患者访谈、0 临床审核（如实标注）。

## 设计者与研究/场景依据
设计者=「家长/患者双主体的小 X 宝家族信息整理者」：代表 TRAPS 患者与家长照护者，用病种公开资料+家族模板推演场景（无一手引语），取舍原则=患者信息维度优先、医生任务不冒充患者功能。DESIGNER-BRIEF 见 docs/DESIGNER-BRIEF.md；用户需求证据和专业约束分开，M1 落证据台账。

## 问题、用户与最小闭环
- 用户：TRAPS 确诊患者本人（成人/青少年）与家长照护者（儿童期起病为主）。
- 输入：发热发作（起止/持续天数/伴随症状）、化验（CRP/SAA/血沉/血象）、用药（发作期/间期）、报告与基因检测材料。
- 动作：选资料目录（真入口）→ 录入/核对 → 记录医生确认结论 → 复诊准备。
- 输出：发作规律时间轴、指标趋势（可比组）、复诊问题清单、带来源摘要导出（私密过滤）。
- 失败恢复：解析失败回退手工录入、写库失败提示并保留草稿、私密切换失败回退。
- 成功标准：家长能在 5 分钟内录入一次发作并回看持续天数；复诊前能导出问题清单。

## 方案与 ADR
- 布局：业务整页 customFrame（家族标准，40 号）；AI 面板右侧常挂载。与备选「左对话+右业务」相比，遵循家族定稿与 2026-10-19 真机反馈。
- 数据：SQLite 本机库（subjects/profile_facts/records/metrics），事实与读模型分离；JSON 全量 state 不可演进，弃。
- 目标宿主：DSH Desktop（io.dsh.desktop）；config.root 接 dshHomePath('traps-workbench')，服务端消费状态 M5/V1 核验。

## 功能范围
一级导航（草案）：看板 / 发作与缓解 / 用药与治疗 / 化验与复查 / 就诊与材料 / 临床研究 / 设置。FEATURE-INVENTORY.csv 由 init 下发，M2 按本表补齐并做双向映射（孤儿页=0）。

## 数据与 API
实体：subjects（is_demo）、profile_facts、records（八 kind：bleed→fever 发作、lab、treatment、question、hospital、report、doc、mind）、metrics（CRP/SAA/血沉等）、导入三表。schema/0001_initial.sql 于 M3 冻结（sha256），无 diagnosis/risk_level 判定列。API：GET bootstrap / POST subjects / POST records / POST privacy / GET trials，契约见 API-CONTRACT。

外部信息合同：疾病概要四段来源分级（原件/题录/二次/未取得分开标）；试验快照标 snapshotDate 且会过期；未核实不冒充确定结论。
