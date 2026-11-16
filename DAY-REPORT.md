# TRAPS Workbench M0–M9 完成报告

日期：2026-11-16 UTC  
仓库：`xyb-openharness-dsh-plugins/traps-workbench`  
本地路径：`~/dev/traps-workbench`  
目标：TRAPS（R2 表 #81，T2）  
版本：**0.2.0**  
品牌：**「TRAPS 工作台」为占位名，待用户追认**

## 里程碑状态

| 里程碑 | 状态 | 交付与边界 |
|---|---|---|
| M0 | 完成 | 按 xyb-workbench-starter v1.10.0-rc.53 初始化既有仓库，建立包骨架、文档、配置和远端基线。Issue #85 沿用既有认领。 |
| M1 | 完成（待晨审追认） | NIH GeneReviews、EULAR/ACR、NIH 自然史登记及患者经验资料收口；HVT 与 G1 自动签认草案完成。0 次患者访谈、0 次临床审核；自动签认不等于用户或临床签认。 |
| M2 | 完成（待晨审追认） | HTML 原型 v0.2.0、两套合成档案、六路由探针、截图与复核记录。M9 已移除个人病历对试验条件的评分/匹配，只保留公开登记检索、筛选和收藏。 |
| M3 | 完成 | 14 表 SQLite schema 冻结；发作区间与逐条观察独立建模，9 项 schema 冻结契约检查通过。 |
| M4 | 完成 | ClinicalTrials.gov API v2 公开登记快照，3 条 TRAPS 种子记录；JSONL/SQLite 对账与 manifest 哈希通过，数据标注 2026-11-16 获取、非穷尽、无患者级数据。另有 NIH 94-HG-0105 外链。 |
| M5 | 完成代码实现 | SQLite 数据层、事务性发作/观察写入、隐私过滤 bootstrap、宿主鉴权 API/静态路由、业务 iframe、Agent pane `newSession`/`subscribe` 契约。Desktop 实机仍未验证。 |
| M6 | 完成本机可做部分 | npm 包 dry-run、激活桩测与静态包检查通过。sam 没有 DSH Desktop，故目标 profile 安装未验证。 |
| M7 | 草稿完成 | Release 文案只存于 `docs/RELEASE-DRAFT.md`；没有发布 Release 或 tag。 |
| M8 | 草稿完成 | 市场/目录条目只存于草稿；没有提交市场，也没有改组织 BACKLOG。 |
| M9 | 完成 | 全量静态/数据/文案检查、测试、家族一致性审计与本报告完成。 |

## 五项门禁/验证结果

1. `npm run check`：通过；含语法、宿主包、六路由探针覆盖、版本、来源链接、Agent pane、数据根、schema、公开研究、个人档案及文案检查。检查链内测试 **14/14** 通过。
2. `npm test`：**14/14** 通过，0 失败。
3. `npm run audit`：**40/40** 通过，0 fail、0 待人工。
4. `npm run pack:check`：npm pack dry-run 通过，包清单 **48 个文件**，含公开快照 SQLite。
5. `npm run smoke:activate`：apply/register 桩宿主检查通过。它只证明桩环境激活，不等于 Desktop 安装。

额外本机验证：TRAPS 浏览器路由探针 **6/6** 通过；390px 窄屏无横向溢出；浏览器脚本异常 0。临时 SQLite/API 冒烟读到 2 个合成档案与 3 条研究登记，并完成一条合成发作及逐条观察的写入/回读。临时数据仅在 `/tmp`，未入仓。

## 医学与数据边界

- 只纳入公开来源元数据和明确标注的合成档案；**没有真实患者数据**。
- 公开快照来源、访问日期、登记 URL、记录数和文件哈希见 `research/traps-2026/manifest.json`。三条注册记录并非全面检索；登记状态可能变化，须回到官方记录核实。
- 医学资料主要包括 NIH GeneReviews、EULAR/ACR 全文和 NIH Clinical Center 94-HG-0105；来源与局限见 `docs/CLINICAL-DATA.md`。
- 不承诺疗效，不提供诊断、治疗或用药建议，也不计算个人入组资格/适配分。

## 未验证及阻塞

- sam 未安装 DSH Desktop（`node scripts/check-install.mjs` 明确报告未找到 `io.dsh.desktop`）。正确 Desktop profile 安装、退出重开、原生会话操作和真实点击走查均为**未验证**；静态检查与桩宿主不能替代实机检查。
- G1、G2 自动签认均待晨审追认。无患者/照护者访谈、临床审核或独立医学审核。
- 病名工作台品牌仍是占位名，待用户决定正式名称。
- 公开登记只有三条种子快照，当前检索覆盖有限，不能视为完整试验目录。

## 待用户决定

1. 是否追认「TRAPS 工作台」作为正式品牌名称，或提供正式名称。
2. 是否追认 G1/G2 自动签认草案，并安排患者/照护者与临床审核。
3. 是否在具备 DSH Desktop 的环境完成正确 profile 安装、重启和业务走查；完成前不声称已安装可用。
4. 是否建立公开研究登记快照的后续更新与医学复核周期。

## 远端与发布状态

M0 至 M8 的阶段提交均已推送；本报告、M9 收口和全部修正随最终 M9 提交推送到既有仓库 `main`。没有新建仓库、重复认领 Issue、发布 Release、打 tag 或修改组织 BACKLOG。
