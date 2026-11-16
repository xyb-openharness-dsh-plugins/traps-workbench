# API 与服务契约（M5）

数据服务为 Node 22 `node:sqlite` 本地服务，开发/集成入口由 `scripts/dev-server.mjs` 提供；默认只监听 `127.0.0.1:4173`，数据根由 `TRAPS_DATA_ROOT` 指定。数据库默认 `~/.traps-workbench/traps.sqlite`。静态公共页面和 JSON API 同源；写请求最多 64 KB，响应 `no-store`。此本机 dev server 不等于 DSH Desktop 安装验证。

| 路由 | 方法 | 用途 | 错误/边界 |
|---|---|---|---|
| `/api/traps-workbench/health` | GET | 版本、能力、数据根 | health only endpoint at native host plugin |
| `/api/traps-workbench/bootstrap` | GET | 档案、隐私过滤读模型、公开登记快照 | 不返回私密条目 |
| `/api/traps-workbench/subjects` | POST | 创建用户档案 | 名称必填 |
| `/api/traps-workbench/entries` | POST | 写通用记录/原始指标 | kind 白名单；提交后回全量 bootstrap |
| `/api/traps-workbench/flares` | POST | 原子写发作区间及观察 | 日期校验、症状枚举白名单、自评影响 0–10；不是临床评分 |
| `/api/traps-workbench/privacy` | POST | 更新私密标志 | profile/id 限定 |
| `/api/traps-workbench/saved-trials` | POST | 收藏公开登记 | 只保存登记 ID/state |
| `/api/traps-workbench/trials?keyword=` | GET | 本地快照文本检索 | 小型非穷尽快照，不推荐入组 |
| `/api/traps-workbench/root` | GET/POST | 查询/切换数据根 | 禁止 home 根、桌面/下载根和 tmp 根 |
| `/api/traps-workbench/ui/` | GET | public 静态入口 | 路径限制在 public/ |

写入事务成功后返回一致的 `bootstrap`；记录 ID 稳定映射 SQLite rowid。发作日期和逐条症状观察日期分开；修订与来源在 schema 字段保留。`newSession()` 与 `subscribe()` 是 Agent pane 宿主能力合同：已有会话先复用，未有时经宿主创建，取消时不写记录；订阅变化只触发重绘，不自动发送对话。无宿主能力时展示不可用提示。

桌面宿主 API route 注册当前仅提供 health/auth 检查；完整 CRUD/SQLite 契约在本地服务模块和集成服务实现，打包不会启动独立开发服务器。Desktop 中完整服务启动/端口权限/安装重启点击链路未验证，故不可称 Desktop 端到端通过。
