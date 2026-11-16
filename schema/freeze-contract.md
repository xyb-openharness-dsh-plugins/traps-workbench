# Schema 冻结合同（MPN）

0001_initial.sql 已冻结。后续只允许新增 `0002_*.sql`，不得改本文件；改历史迁移必须重新走审阅并更新下表。

| 文件 | sha256 | 冻结日期 | 内容边界 |
| --- | --- | --- | --- |
| `0001_initial.sql` | `c8615b40a0286d2ef35f5bc17b41c4f05140a4ff8413e4145d3c8249932a3b43` | 2026-11-15 | 档案 2、通用记录 8 类、指标、治疗、试验收藏、导入批次/条目/冲突、应用设置；无判读列 |

## 不可让步

- 不存 `diagnosis` / `risk_level` / `eligible` / `suitability` / 百分数。
- 个人记录表都有 `is_private`；缺测 NULL，不用空串冒充。
- `profiles.is_demo` 区分合成示例与用户档案。
