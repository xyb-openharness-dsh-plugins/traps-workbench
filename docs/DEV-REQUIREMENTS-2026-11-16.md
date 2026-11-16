# 可验证开发强约束（2026-11-16）

| 约束 | 自动验证/证据 | 状态 |
|---|---|---|
| 不存诊断/风险/预后/疗效/入组适配判读列 | `npm run check` 中 schema words + freeze gate | 通过 |
| 示例患者档案必须合成，不入真实患者数据 | `npm test` synthetic assertion + data/demo-data.json | 通过 |
| 试验来自公开登记，附 URL / retrievedAt / manifest hash | `npm run check` trial snapshot gate | 通过；3 条非穷尽 |
| UI 不把病历字段转成个人入组评分 | `npm test` public research safety assertion | 通过 |
| 私密条目不得进入公共读模型 | write API privacy 测试 | 通过 |
| 发作区间与观察日期单独记录并事务写入 | flare API round-trip 测试 | 通过 |
| Agent pane 创建会话、优先工作区并订阅变化 | Agent pane contract checker | 通过静态检查；真实 Desktop 未验证 |
| 数据根不选择 home / Desktop / Downloads / tmp 根 | `scripts/check-data-dir.mjs` | 通过静态检查 |
| DSH Desktop 安装、退出重开、点击走查 | 必须正确 Desktop profile 实机人工验证 | 未验证：sam 没有 DSH Desktop |
| 版本保持 0.2.0；不发布/tag/改 BACKLOG | VERSION/package/docs 对照、远端状态 | 通过 |
| 占位品牌标待用户追认 | README、package、市场草稿 | 待用户追认 |
