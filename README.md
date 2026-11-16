# TRAPS 工作台（占位名，待用户追认）

供 TRAPS 患者与照护者整理发作、症状、检验与临床研究公开信息的工作台；不提供诊断或用药建议

TRAPS（TNFRSF1A 相关肿瘤坏死因子受体相关周期性综合征）患者与照护者的本地资料整理工作台。品牌名是占位名，**待用户追认**。概览、发作/症状记录、检验趋势、公开研究登记、复诊摘要和资料来源说明共同支持按日期与来源回看信息。

## 疾病概要

### 定义
TRAPS 是与 TNFRSF1A 相关的罕见自炎症性周期发热综合征。此处为通俗背景说明，不用于确认个人诊断；参见 [NIH GeneReviews](https://www.ncbi.nlm.nih.gov/books/NBK586171/)。访问日期：2026-11-16。

### 医学资料规范和指南情况
工作台仅链接公开注册信息与医学文献，保留来源、登记号和检索日期。已有 EULAR/ACR 自炎症疾病分类与管理建议文献可作背景阅读，但尚未完成本地临床适用性审查；参见 [PMC9531906](https://pmc.ncbi.nlm.nih.gov/articles/PMC9531906/)。访问日期：2026-11-16。

### 目前治疗全景概要
本工作台不提供治疗或用药建议、不承诺疗效。用户可以整理自己已有的资料并与医生讨论；个体治疗决策应由患者与专业医疗团队共同作出。GeneReviews 和指南为二次医学资料，不代替专业意见。

### 发展趋势
公开研究登记快照包含 3 条与 TRAPS 相关的 ClinicalTrials.gov 记录，是 2026-11-16 获取的非穷尽种子集。快照状态会变化，具体方案和当前招募情况以 [ClinicalTrials.gov](https://clinicaltrials.gov/) 原始登记页为准。自然史登记可见 [NIH 94-HG-0105](https://clinicalstudies.info.nih.gov/protocoldetails.aspx?id=94-HG-0105)。访问日期：2026-11-16。

## 开发顺序

HTML 原型：[`prototypes/v0.2/index.html`](prototypes/v0.2/index.html)，交互路径与自动评审记录见 [`docs/PROTOTYPE-REVIEW.md`](docs/PROTOTYPE-REVIEW.md)。所有页面示例档案为合成数据。M2 原型写入仅内存；M3–M5 已实现 SQLite 服务层及宿主 API 代码，Desktop 实机验证仍未完成。

## 当前能力

- 原型包含两档合成档案：一套记录少、一套随访记录多；可记录发作、症状、检验、就诊、报告与复诊问题。
- 趋势只按各指标原单位/方法分组，不合成诊断、严重程度或治疗建议。
- 公开登记入口只展示来源和快照状态，不判个人入组资格。原型样例登记记录注明出处与访问日。
- 真实患者资料严禁入仓；医学内容没有患者访谈或临床审核背书。

## 开发与本地验收

需要 Node.js 22+、Git、包管理器和可用 DSH Desktop；采用 SQLite 时另核验 node:sqlite 版本条件。宿主 peers 的范围仅是模板基线，请与目标 Desktop 实际依赖核对。

```bash
npm install
npm run check
npm run pack:check
npm pack
```

`npm run check`、`npm test` 和 `npm run audit` 的最终结果见 [`PROGRESS.md`](PROGRESS.md) 和 [`DAY-REPORT.md`](DAY-REPORT.md)。静态检查不能替代真实 DSH Desktop 安装与交互验收。

跑的时间点：**每次改完**跑 `check`；**G2 原型确认后、写业务代码前**先跑一次 `audit`（这时缺的多是 `lib/layout.js`、`VERSION` 这类结构，越早补越便宜）；**交付/装机前**必须跑 `release:check`；**发布或投稿前**把 `npm run audit --json` 的 `xx/xx 通过 · N 失败 · M 待人工` 抄进 `docs/RELEASE.md` 的「家族一致性」一行。`✗` 是结构缺口（补齐，或在 `docs/DEV-REQUIREMENTS-<日期>.md` 写明偏离理由并由用户确认），`!` 是需人工判断的项（逐条给「已人工确认 / 确实没有」）。

`npm install` 可能按 npm 策略解析 peer；勿为消警告重复打包宿主 runtime。客户端本身是单文件；引入 TS/组件库后需添加构建步骤并保留单文件导出。

本地安装入口以当前 Desktop/CLI 帮助为准。安装后按 [docs/06-VALIDATION-AND-RELEASE.md](docs/06-VALIDATION-AND-RELEASE.md) 与官方自测完成真实 UI 验收，并填写 [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md)。静态检查不代表已加载。

Logo 来源与使用限制见 assets/README.md。许可证、作者、仓库/发布策略由本项目维护者确认后填写；模板默认为 private/UNLICENSED。

感谢小x宝社区、DataElement 社区，以及 sam / hhx / 繁华的 ❤️ 贡献。

初始化来源记录见 `.dsh-wb-starter.json`。更新社区脚手架不会覆盖本项目；需要升级时先用相同确认配置在临时目录生成，再审阅差异。CLI 用法见 [docs/CLI-GIT.md](docs/CLI-GIT.md)。

## HTML先行与数据演进

业务开发前先交付HTML交互工作台原型、实际预览并由用户确认版本/hash和范围。数据设计先区分领域事实、流程状态和页面读模型，走查前端/流程变化、兼容与迁移；原型对象不直接作为表。见[规范](docs/14-HTML-AND-DATA-CONTRACT.md)。
