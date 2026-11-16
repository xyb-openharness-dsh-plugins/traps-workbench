# PROGRESS

更新：2026-11-16 UTC（M9 收口）

## 当前里程碑

M0–M9 已完成并推送。

## 已完成

- M0：按 xyb-workbench-starter v1.10.0-rc.53 初始化；生成脚手架文档、工作台包骨架与项目配置。目标病种 TRAPS、目标用户患者与照护者、三步核心流程来自用户任务；名称为占位名「TRAPS 工作台」，待用户追认。
- 已阅读全文并核对 DSH 官方开发规范 https://dshdesktop.com/workbench/docs/development.md（版本 2026-10-27）。
- 设计入口：`docs/DESIGN-PROMPT.md`；癌种提示词：`prompts/NEW-CANCER-WORKBENCH.md`；Agent 面板合同：`prompts/DSH-AGENT-PANE-INTEGRATION.md`。
- M1：研究与来源分层、需求假设、差异矩阵、患者流程、四个优先场景、HVT 五层追踪、G1 自动签认草案完成。G1 标注待晨审追认；0 次患者访谈、0 次临床审核、独立 review 待完成。没有把二次来源摘要写成患者总体证据。
- M2：`prototypes/v0.2` 可交互 HTML 原型；涵盖两套合成档案、记录、指标卡/一图秀、公开登记、复诊摘要、设置与整页疾病概要。Chromium 桌面/窄屏预览完成，档案切换、记录类型、检验选项、研究登记、疾病概要开合已走查；浏览器异常 0；390px 窄屏无横向溢出。疾病概要浏览器探针 10/10，链接结构/HTTP 15/15，public parity 7 件一致。截图和 SHA-256 见 `docs/PROTOTYPE-REVIEW.md`。G2 自动签认待晨审追认，非用户真实确认。

- M3：冻结 TRAPS 初始 SQLite schema（14 表），发作区间与逐时观察为一等实体；记录来源、隐私/撤销边界及迁移策略。`node scripts/check-schema.mjs .` 9 项全过。并发/恢复和桌面宿主运行未验证。

- M4：以 ClinicalTrials.gov API v2 公开登记构建 3 条 TRAPS 种子快照（非穷尽），JSONL/SQLite 一致性、manifest 哈希、来源日期核对通过；清除了随模板带入的 MPN 试验快照。SQLite 因通用忽略规则漏入首个提交，已补入版本控制。无患者级数据。

- M5：TRAPS SQLite 服务层、事务性发作+观察写入、统一 bootstrap 与隐私过滤；桌面插件完整注册经 connection 鉴权的 API 与静态资源路由，业务区 iframe 接入公开页面。Agent pane `newSession`/`subscribe` 宿主契约通过静态/桩测。API 契约见 `docs/API-CONTRACT.md`；Desktop 实机仍未验证。

- M6：`npm run pack:check`（dry-run，48 个文件含 SQLite 快照）、`npm run smoke:activate`（桩宿主 apply/register/两种会话形态）和包静态检查通过。`node scripts/check-install.mjs` 显示本机没有 DSH Desktop，故 profile 安装、退出重开、点击走查均未验证；桩宿主烟测不等于装机。

- M7：Release 草稿仅在 `docs/RELEASE-DRAFT.md`，注明 0.2.0、占位品牌、医学边界与发布阻塞；未发布、未打 tag。

- M8：市场/目录条目草稿仅保存在 `docs/RELEASE-DRAFT.md`；未提交市场，未改组织 BACKLOG。

## M9 验收

- `npm run check`：通过；检查链内 14/14 测试通过。
- `npm test`：14/14 通过。
- `npm run audit`：40/40 通过，0 fail、0 待人工。
- `npm run pack:check`：dry-run 48 个文件通过；`npm run smoke:activate`：桩宿主通过。
- TRAPS 全路由 Chromium 探针 6/6、390px 无横向溢出；本机 API bootstrap 2 档案/3 条公开登记，发作写入和逐条观察回读通过。
- `DAY-REPORT.md` 已分别写入仓库根与 `~/dev/traps-run/`，同文并随 M9 推送。

## 阻塞与未验证

- DSH Desktop 安装、退出重开、实机点击走查：本机不可做，保持未验证。
- 患者访谈与临床审核尚未开展；不能声称需求或医学内容经患者/临床验证。
- G1 自动签认草案待晨审追认；G2 自动签认草案亦待晨审追认。品牌仍为占位名「TRAPS 工作台」，待用户追认。
