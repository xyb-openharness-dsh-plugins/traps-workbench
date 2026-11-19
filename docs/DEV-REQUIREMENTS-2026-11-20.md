# DEV-REQUIREMENTS-2026-11-20 · 硬约束与验证方式（audit 强约束对照）

> 规则：每条硬约束必须能被命令或截图验证；验证不了的写「待人工」并注明缺什么证据。
> 基线版本：0.1.0（本文件生成时 `git rev-parse --short HEAD` = 9aa806d 之后）。

| # | 硬约束 | 验证方式 | 2026-11-20 实测结果 |
| --- | --- | --- | --- |
| H1 | 患者档案能新建并落 sqlite（demo 不是唯一数据源；is_demo 区分） | `node scripts/check-patient-create.mjs .` | exit 0 |
| H2 | 「配置目录」真调宿主选择器；拒绝主目录/桌面/下载根/tmp；服务端二次校验；降级文案只允许出现在无选择能力路径 | `node scripts/check-data-dir.mjs .` | exit 0 |
| H3 | 临床试验 35 号四段链路 + 三张子页（基础档案/匹配检查/结果分析带分数与分母） | `node scripts/check-trial-chain.mjs .` | exit 0 |
| H4 | 有快照就必须对账（manifest=jsonl=sqlite 三处计数一致；逐字段映射；source_statuses 唯一） | `node scripts/check-trial-snapshot.mjs .`（check 链内**无** --if-present） | exit 0；138/138，statuses=30 |
| H5 | 匹配口径：符合÷已对照、待确认按 0 计、可对照<2 不给百分数、三态证据链、不是入组资格声明 | `node scripts/check-trial-matching.mjs .`（check 链内） | exit 0 |
| H6 | AI 面板九条（ownsSession/newSession/subscribe/禁 ensureSession({})/禁 Boolean(conversation)） | `node scripts/check-agent-pane-contract.mjs .`（--self-test 须能红） | exit 0；10 项 oks |
| H7 | 快照通道终态如实：chictr_online=failed、chictr_pancreatic_archive=unconfigured、ictrp=truncated 不计覆盖率 | `python3 -c "import json;m=json.load(open('research/traps/manifest.json'));print([ (s['source_id'],s['state']) for s in m['sourceStates']])"` | chinadrugtrials=ready NO_RESULTS；ctv=ready；ictrp=truncated；chictr_online=failed；xyb_archive=ready |
| H8 | 快照相关条数单独算并三处同口径（卡头/检索页/设置 tab） | manifest.relevantCount 与 index.html「相关」字样 grep | relevantCount=78；检索词命中才进池、不等于没有研究 |
| H9 | 演示数据唯一源、明示虚构；新档案 is_demo=0 且与 demo 并存 | `node scripts/check-patient-create.mjs .` + schema grep is_demo | exit 0 |
| H10 | 版本十处同源（package/VERSION/lib/chip…）；改包必升版 | `node scripts/check-version-literal.mjs` + `npm run audit` | check exit 0；audit 见当日运行记录 |
| H11 | ui-parity：public/ 与 prototypes/v0.2 定点移植一致 | `node scripts/check-ui-parity.mjs` | exit 0（6 件逐字节 + index.html 白名单替换点） |
| H12 | 随包文件占位符 = 0（版本注入 token `__VERSION_DISPLAY__` 按家族契约白名单） | `node scripts/check-placeholder-free.mjs .`（--self-test 能红） | exit 0 |

## 无人值守默认值（晨审追认清单，同步自 docs/DEV-REQUIREMENTS.md §五）
1. 服务主体=患者本人+家长代记双主体。
2. 病程覆盖=确诊前后全程随访。
3. 品牌=小热宝 TrapsPal（原型内显示「小热宝 HeatPal」字样，为同一占位名的英文拼写变体，晨审需统一）。
4. MinerU 未接入（设置页如实标注）。
5. 试验线保留（2026-11-20 重跑：138 条 / 相关 78 / ictrp truncated 135 条只入前 200 上限内的部分）。

## 冻结项（无授权不发）
- M7 tag / GitHub Release、M8 BACKLOG 回填 PR：只备草稿至 `docs/release-draft/`。
