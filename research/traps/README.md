# TRAPS 临床试验快照（research/traps）

- 采集工具：`scripts/fetch-traps-trials-2026.mjs`（唯一入口 unified-trial-mcp · MCP stdio；绝不自拼 URL）
- 快照日期与通道终态、查询词、sha256：见 `manifest.json`（终态值如实原样：SUCCESS / NO_RESULTS / FAILED / NEEDS_SETUP / TIMEOUT）
- 本轮（2026-11-20）实测：138 条（合并前 138；ctv 3 + ictrp 135）；chinadrugtrials 与 xyb 归档 NO_RESULTS（真查过、真的没有）；
  chictr_online FAILED（不算"查过"，不计覆盖率）；chictr_pancreatic_archive NEEDS_SETUP（离线语料仅覆盖胰腺癌，不适用本病）
- 相关条数：`manifest.relevantCount`（按标题规则统计，规则见 `manifest.relevantRule`）；相关 0 ≠ 没有研究——检索词命中才进池、通道召回有限
- 三处计数一致断言：`manifest.recordCount = trials-2026.jsonl 行数 = sqlite trials 行数`（`node scripts/check-trial-snapshot.mjs .` 对账）
- 用途：只作检索线索与登记字段展示；登记 ≠ 有效 ≠ 安全 ≠ 可入组，状态一律「登记状态，未核实」
