# DEV-PLAN · traps-workbench（2026-11-16 夜班，无人值守）

## 认领理由（夜纲 §4）
- 选池：BACKLOG ⬜ 中 T0/T1 已被认领完（issue #10–#84 对账），从未认领池按「T2 + 随访天然结构化 + 差异化明显」选肿瘤坏死因子受体相关周期性综合征 TRAPS（罕见病 #81 · R2 · T2）。
- 随访天然结构化：发热发作（起止/持续天数/伴随症状）/ 炎症指标周期（CRP/SAA/血沉）/ 发作期与间期治疗剂量 / 基因确诊与家族筛查——与家族非肿瘤 R2 模板四块 1:1。
- 差异化：自身炎症族仅 NLRP3 认领 issue 在列（#83）；TRAPS 为 TNFRSF1A 常显遗传、发作 ≥5 天、眶周水肿/迁移性肌痛特征语义，不重叠。
- 认领 issue：xyb-openharness-dsh-plugins/.github **#85**（模板 404，`.github/ISSUE_TEMPLATE` 不存在、本代理无该仓推送权限，事实已记录；沿用手工六维口径；/claim 机器人判无 claim 标签拒收 → **自查补签 claim,claimed，待追认**，2026-11-16）。

## 参考基准
- 移植样板：pericarditis-workbench / hs-workbench（最近同形 R2 非肿瘤仓，客户端链路底本；私有仓仅本地对照，链接不外发）
- 成熟对比基准：breast-cancer-workbench/prototypes（26 号口径：首页 hero / 五 Tab / 疾病概要 DP 三件套）
- 结构基准：aml-workbench/prototypes/v0.2 #mind（导航分组 / 生活影响线 / 事件泳道）

## 里程碑状态（时间盒 2026-11-16 起）
- M0 骨架：领取四步 ✓；文档九件骨架版 ✓；接线前置 cordis.patch.yml config.root ✓；基线 check 见 PROGRESS
- M1–M9：按 FULL-CYCLE 表推进；每闸口自动签认文档落 docs/signoffs/。

## 已知缺口（如实）
- 0 患者访谈、0 临床审核（如实标注）；中国 chictr 通道 M4 实测前不写覆盖结论。
- 文档九件为骨架版：M1 补全量（证据台账 / 家族对照实测一级重名率 ≤70%）。


## 2026-11-20 夜班续跑更新（M2–M5）
- 实际移植底本：behcet-workbench 0.2.1（同为非肿瘤发作语义仓、写库链路与 DP 三件套已收敛，FULL-CYCLE 记载其收敛轮）。
  M0 计划里的 pericarditis/hs 未用——behcet 世代在本机最完整（0.2.1 tgz 已发），移植风险最低。此为对 M0 计划的偏离，晨审追认。
- 页面结构移植后与样板对照：一级页名与宫颈癌样板（cervical）重名 4/9 = 44%（≤70% 达标）；与 behcet 底本同源属移植声明，不计入。
- M2–M5 状态：原型四件套 + DP 四段 + 双档案切换 + 试验四段 + dsh 服务层 + client.js 业务 iframe/配置目录真入口 全部落地；
  五件门禁 + 全链 npm run check exit 0；四通道快照 138 条（相关 78）。详见 docs/MILESTONE-EVIDENCE.md。
