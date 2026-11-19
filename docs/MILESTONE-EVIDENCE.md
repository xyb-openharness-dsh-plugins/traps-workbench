# MILESTONE-EVIDENCE · traps-workbench（2026-11-20 夜班）

每条完成结论回指证据；回指不到的结论已降级为「未验证」。

## M2 原型
- DP 探针：`node scripts/probe-disease-primer.mjs --url http://127.0.0.1:8892/prototypes/v0.2/index.html` → **10/10 通过**（P1–P9+排版；全文 docs/probe-dp-evidence.log）。裸跑失败关闭 exit=2（self-test 红 ✓）。
- primer 链接：`node scripts/check-primer-links.mjs .` → 42/42 通过。
- 页面视图探针：`probe-page-view.mjs --url …` → waitForSelector 超时退出（behcet 世代原型无 page-view 模块）→ 记 **跳过（原因：本世代无 page-view 集成；待人工）**。
- 两套合成档案：A=刚确诊记录少（demo-data.js 6 条）、B=长期随访（demo-data-b.js 17 条/8 指标序列），group-switch 整页联动；切换隔离由引擎状态重建保证（behcet 收敛轮已实测，本轮结构未动）→ 结构性通过，390px 实测未做（待人工）。

## M3
- schema/0001_initial.sql sha256=456ab790…；freeze-contract.md 对账由 check-schema-words ✓（"freeze-contract.md sha256 与文件一致"）。

## M4
- 采集：`node scripts/fetch-traps-trials-2026.mjs`（unified-trial-mcp @ ~/Downloads/unified_search_trials/dist/src/cli/main.js）→ 138 条（合并前 138）；bySource={ctv:3, ictrp:135}；通道终态：chinadrugtrials NO_RESULTS / xyb 归档 NO_RESULTS / ctv NO_RESULTS / ictrp SUCCESS / chictr_online FAILED / chictr_pancreatic NEEDS_SETUP；relevantCount=78（规则见 manifest.relevantRule）；manifest.recordCount=jsonl 行数=sqlite trials 行数=138（check-trial-snapshot ✓）。

## M5 / D1
- `npm run check` 全链 **exit 0**（/tmp/check-final.log；含 check-trial-matching 进链、--if-present 已摘除）。
- 五件门禁逐件 exit：data-dir=0 / trial-chain=0 / patient-create=0 / trial-snapshot=0 / trial-matching=0。
- `npm test`：write-api 4/4 + pack-contents 4 项，exit 0（无 SKIP 行；浏览器套件本世代未随 init 下发——behcet 世代测试在仓外）→ 浏览器级单测覆盖记「未实现（本世代不交付该形态）」。
- check-agent-pane-contract：pass=true，10 项 ✓；--self-test exit 0（红能力保持）。

## 未验证清单
- M6 装机加载、实机三键（AI 对话/配置目录/新建档案）、390px 窄宽实测、真机截图、README 实渲截图（33 号）——依赖 DSH Desktop 用户重启。
- 外部通道 chictr_online FAILED（如实未查过，不算覆盖率）。
