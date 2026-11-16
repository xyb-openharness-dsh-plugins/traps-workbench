
## M6 sam 本机打包/profile 核验

- `npm run pack:check` dry-run：48 文件包含 SQLite 快照，通过。
- `npm run smoke:activate`：桩宿主契约通过；不构成 DSH Desktop 安装证据。
- `node scripts/check-workbench-package.mjs .`：静态包检查通过，列出宿主/API/真实 tgz 内容须另行验证。
- `node scripts/check-install.mjs`：本机没有 DSH Desktop（io.dsh.desktop），profile 部署未验证。Desktop 安装、重启、点击走查均未验证。

## M7 Release 草稿（不发布）

拟定版本：0.2.0。品牌显示名仍为「TRAPS 工作台（占位名）」，待用户追认。拟定摘要：按时间记录 TRAPS 发作、观察、检验与就诊问题，并查阅注明来源的公开研究登记。边界：不诊断、不做疾病严重度/预后/入组适配判定，不提供治疗或用药建议；档案示例为合成数据。此文件仅草稿，不创建 Release/tag。

发布前阻塞：晨审追认 G1/G2；医学/患者审核；服务/API 接入真实 Desktop 宿主；Desktop 正确 profile 安装、退出重开及主要流程点击走查；审核登记快照时效与来源范围。未解除之前不得宣称可发布。

## M8 市场/目录条目草稿（不提交）

- 名称：TRAPS 工作台（占位名，待用户追认）
- 一句话：帮助患者和照护者整理发作时间线、症状观察、检验来源与公开研究登记。
- 描述：本地记录工具和公开登记浏览入口；不替代专业医疗意见，不提供诊断、用药建议、疗效承诺或试验入组判断。示例数据为合成数据。
- 版本：0.2.0；仓库：本组织已有工作台仓。
- 截图：原型截图位于 `docs/screenshots/`，不代表已安装界面。
- 审核状态：晨审与临床/患者审核待完成；真实 DSH Desktop 加载及 UI 检验未验证；服务端宿主接线阻塞。

此内容只保存在仓库草稿，不写组织 BACKLOG、不向市场提交。
