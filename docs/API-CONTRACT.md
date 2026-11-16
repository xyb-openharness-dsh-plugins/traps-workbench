# API 与服务契约（M5）

数据层为 Node 22 `node:sqlite`。DSH 插件从 `config.root` 初始化数据库；`cordis.patch.yml` 用 `dshHomePath('traps-workbench')` 指向宿主应用数据根。开发/集成服务由 `scripts/dev-server.mjs` 提供，默认只监听 `127.0.0.1:4173`，可用 `TRAPS_DATA_ROOT` 指定临时数据根。静态页面通过同源业务 iframe 加载；写请求最多 64 KB，响应 `no-store`。插件路由与本地服务共享同一 Workbench 数据层。Desktop 实机安装仍未验证。

| 路由 | 方法 | 用途 | 错误/边界 |
|---|---|---|---|
| `/api/traps-workbench/health` | GET | 版本与能力 | connection 鉴权失败返回 503/拒绝 |
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

DSH 插件注册 health、CRUD、目录、研究与 public 静态资源路由，全部经过 connection 鉴权；开发服务器复用相同领域层。桌面安装/退出重开/真实点击链路仍未验证，不能据桩测推断通过。
