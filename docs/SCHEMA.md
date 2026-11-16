# TRAPS 数据模型（M3 冻结）

## 核心实体与关系

| 实体 | 主键 | 关系/要点 | 生命周期与来源 |
| --- | --- | --- | --- |
| profiles | profile_key | 合成或用户档案；`is_demo` 标识 | 用户可编辑/删除；合成种子仅演示 |
| profile_facts | id | profile 外键、来源、确认状态 | 档案事实可更正 |
| entries | id | profile 外键；叙述/问题/化验/症状等通用条目 | 原始表达，按时间查询 |
| metrics | id | profile 外键；指标、数值/单位/方法/机构/采样日 | 不自动判读或评分 |
| flare_events | id | profile 外键；开始/结束日、可选时间、来源 | 回忆或记录区间，允许未结束 |
| flare_observations | id | flare 外键；症状特征、观察时间、部位、患者自评影响 0–10 | 每条观察独立带隐私与来源 |
| trials / source_statuses | record_id / (query,source_id) | 公开登记快照与查询覆盖状态 | 依来源、快照日期重建 |
| saved_trial | id | 用户档案收藏公开登记 ID | 可删除 |
| treatments | id | 用户自行记录的名称/日期/备注 | 非治疗建议 |
| import_batches/items/conflicts | id | 私密导入草稿与冲突 | 未确认不提升为事实 |
| app_setting | key | 本地偏好 | 可重建 |

**关系图：** `profiles ─┬─ entries / metrics / treatments / flare_events ─ flare_observations`；`profiles ─ saved_trial ─ trials`。公开登记快照单独保存，不混入个体病历。所有个人记录保留 `is_private`、可撤销记录保留 `in_use`；外键级联删除。

## 迁移与存储选择

持久化等级 A（本地 SQLite）：跨会话个人记录需要事务、外键、索引与离线工作；预计单用户低并发、小规模。公开登记使用可重建 JSONL 快照。外部记忆 API 不使用；派生页面状态仅内存缓存。以 SQL 迁移为权威；提交逐条事实使用事务，修正通过来源/修订字段或新记录表示，不覆盖公开源快照。恢复方式为 SQLite 备份及从 manifest/JSONL 重建登记库；尚未在 Desktop 宿主运行时实测，标未验证。

缺测统一为 NULL。日期不替代未知时间；不自动计算疾病活动/风险或入组适合度。记录来源和访问日期；档案合成示例来源明确注明 synthetic。

## UI/流程变化承受能力

页面布局可变只调整读模型；新普通指标调整指标定义/校验；新症状枚举需迁移并兼容未知值；修正来源保留历史来源并重建公开派生索引；候选导入保持隔离至用户确认；隐私过滤由查询投影统一执行。迁移不得清空旧库；并发写入、断电回滚、桌面宿主恢复均未验证。现有原型是候选交互，M5 API 实施后复核契约。

| 变化 | 稳定事实 | 修改层 | 恢复/验收 |
| --- | --- | --- | --- |
| 页面重排 | 档案及记录 IDs | UI/读模型 | 既有 SQLite 不迁移 |
| 新字段/类型 | 既有记录关系 | schema migration + API | 新字段 nullable，旧行可读 |
| 发作时间补录 | 原始日期/来源 | flare command | revision/source 保留 |
| 来源更新 | 原快照与 retrieved_at | research snapshot | 可从公开 JSONL 重建 |
| 旧客户端 | 迁移版本与读模型 | API version guard | 不支持时给兼容错误；未实机验证 |
