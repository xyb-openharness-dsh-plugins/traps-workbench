
## M6 sam 本机打包/profile 核验

- `npm run pack:check` dry-run：48 文件包含 SQLite 快照，通过。
- `npm run smoke:activate`：桩宿主契约通过；不构成 DSH Desktop 安装证据。
- `node scripts/check-workbench-package.mjs .`：静态包检查通过，列出宿主/API/真实 tgz 内容须另行验证。
- `node scripts/check-install.mjs`：本机没有 DSH Desktop（io.dsh.desktop），profile 部署未验证。Desktop 安装、重启、点击走查均未验证。

## M7 Release 草稿（不发布）

拟定版本：0.2.0。品牌显示名仍为「TRAPS 工作台（占位名）」，待用户追认。拟定摘要：按时间记录 TRAPS 发作、观察、检验与就诊问题，并查阅注明来源的公开研究登记。边界：不诊断、不做疾病严重度/预后/入组适配判定，不提供治疗或用药建议；档案示例为合成数据。此文件仅草稿，不创建 Release/tag。

发布前阻塞：晨审追认 G1/G2；医学/患者审核；服务/API 接入真实 Desktop 宿主；Desktop 正确 profile 安装、退出重开及主要流程点击走查；审核登记快照时效与来源范围。未解除之前不得宣称可发布。
