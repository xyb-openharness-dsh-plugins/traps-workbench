# PROGRESS

更新：2026-11-16 UTC

## 当前里程碑

M0–M2 已完成并推送；M3–M9 进行中。

## 已完成

- M0：按 xyb-workbench-starter v1.10.0-rc.53 初始化；生成脚手架文档、工作台包骨架与项目配置。目标病种 TRAPS、目标用户患者与照护者、三步核心流程来自用户任务；名称为占位名「TRAPS 工作台」，待用户追认。
- 已阅读全文并核对 DSH 官方开发规范 https://dshdesktop.com/workbench/docs/development.md（版本 2026-10-27）。
- 设计入口：`docs/DESIGN-PROMPT.md`；癌种提示词：`prompts/NEW-CANCER-WORKBENCH.md`；Agent 面板合同：`prompts/DSH-AGENT-PANE-INTEGRATION.md`。
- M1：研究与来源分层、需求假设、差异矩阵、患者流程、四个优先场景、HVT 五层追踪、G1 自动签认草案完成。G1 标注待晨审追认；0 次患者访谈、0 次临床审核、独立 review 待完成。没有把二次来源摘要写成患者总体证据。
- M2：`prototypes/v0.2` 可交互 HTML 原型；涵盖两套合成档案、记录、指标卡/一图秀、公开登记、复诊摘要、设置与整页疾病概要。Chromium 桌面/窄屏预览完成，档案切换、记录类型、检验选项、研究登记、疾病概要开合已走查；浏览器异常 0；390px 窄屏无横向溢出。疾病概要浏览器探针 10/10，链接结构/HTTP 15/15，public parity 8 件一致。截图和 SHA-256 见 `docs/PROTOTYPE-REVIEW.md`。G2 自动签认待晨审追认，非用户真实确认。

## 下一步

1. M3：审核 TRAPS 领域实体、冻结 schema 与迁移策略。
2. M4–M5：仅用公开研究快照/合成患者资料接通 API、SQLite 与宿主会话契约。
3. M6–M9：pack/profile 可执行项、草稿、全量自检与报告；Desktop 实机不在 sam 验证。

## 阻塞与未验证

- DSH Desktop 安装、退出重开、实机点击走查：本机不可做，保持未验证。
- 患者访谈与临床审核尚未开展；不能声称需求或医学内容经患者/临床验证。
- G1 将采用自动签认，待晨审追认。
