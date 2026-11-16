
## M6 sam 本机打包/profile 核验

- `npm run pack:check` dry-run：48 文件包含 SQLite 快照，通过。
- `npm run smoke:activate`：桩宿主契约通过；不构成 DSH Desktop 安装证据。
- `node scripts/check-workbench-package.mjs .`：静态包检查通过，列出宿主/API/真实 tgz 内容须另行验证。
- `node scripts/check-install.mjs`：本机没有 DSH Desktop（io.dsh.desktop），profile 部署未验证。Desktop 安装、重启、点击走查均未验证。
