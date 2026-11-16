/* TRAPS 工作台（占位名，待用户追认）· 业务界面
   原则：只整理记录，不做个体判断；没有 API 时明示“演示态，刷新重置”。
   同一份文件被 scripts/migrate-public.mjs 逐字节复制到 public/，开发版由 /api/traps 提供数据。 */
(function () {
  'use strict'

  var ROUTES = ['dash', 'record', 'metrics', 'trials', 'files', 'settings'];
  var API = location.protocol === 'file:' || new URLSearchParams(location.search).has('prototype') ? null : '/api/traps'
  var DEMO = window.DEMO_DATA
  var isHost = false
  try { isHost = window.parent && window.parent !== window } catch (_) { isHost = false }
  if (isHost) document.body.classList.add('in-host')

  var state = {
    data: null, profileId: null, page: 'dash', api: false, ready: false,
    recordKind: 'symptom', metricsView: 'cards', trialTab: 'match', settingsTab: 'workspace', trialDetail: null,
    trialFilters: { keyword: '', subtype: '', status: '', phase: '', country: '', sort: 'updated' },
    matchPref: 'all', savedHidden: {}, bootError: ''
  }
  var modalRoot = document.getElementById('modal-root')
  var drawerRoot = document.getElementById('drawer-root')
  var toastTimer = null

  var PAGES = [
    { id: 'dash', label: '概览', num: '01' },
    { id: 'record', label: '记录', num: '02' },
    { id: 'metrics', label: '指标', num: '03' },
    { id: 'trials', label: '研究', num: '04' },
    { id: 'files', label: '资料', num: '05' },
    { id: 'settings', label: '设置', num: '06' }
  ]
  var COLORS = { CRP: '#b4552d', ESR: '#2f5d4e', SAA: '#7c6c48', TEMP: '#4d6f82' }
  var GROUP_ORDER = (DEMO && DEMO.groupOrder) || ['炎症指标', '发作观察', '其他']
  var CATEGORY_ORDER = { '炎症指标': 0, '发作观察': 1, '其他': 2 }

  /* ---------------- 基础工具 ---------------- */
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }
  function $(sel, root) { return (root || document).querySelector(sel) }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)) }
  function fmtNum(n) {
    if (n == null || n === '' || !isFinite(Number(n))) return '—'
    var v = Number(n)
    return Number.isInteger(v) ? String(v) : v.toFixed(v >= 100 ? 0 : 1).replace(/\.0$/, '')
  }
  function fmtDate(s) { return s ? String(s).slice(0, 10) : '—' }
  function daysFrom(date) {
    if (!date) return null
    var a = new Date(date + 'T00:00:00')
    var b = new Date((state.data.TODAY || new Date().toISOString().slice(0, 10)) + 'T00:00:00')
    if (isNaN(a.getTime())) return null
    return Math.max(0, Math.floor((b - a) / 86400000))
  }
  function profile() {
    if (!state.data) return null
    return state.data.profiles.find(function (p) { return p.id === state.profileId }) || state.data.profiles[0] || null
  }
  function findTrial(key) { return (state.data.trials || []).find(function (t) { return t.trialKey === key }) }
  function toast(msg, kind) {
    var old = $('.toast')
    if (old) old.remove()
    var el = document.createElement('div')
    el.className = 'toast'; el.setAttribute('role', 'status'); el.setAttribute('data-kind', kind || 'ok')
    el.textContent = msg
    document.body.appendChild(el)
    clearTimeout(toastTimer)
    toastTimer = setTimeout(function () { el.remove() }, kind === 'error' ? 6800 : 3800)
  }
  function post(path, body) {
    return fetch(API + path, {
      method: 'POST', credentials: 'same-origin',
      headers: { 'content-type': 'application/json' }, body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().catch(function () { return {} }).then(function (b) {
        if (!r.ok) throw new Error(b.error || ('HTTP ' + r.status))
        return b
      })
    })
  }
  function normalizeDemo() {
    var d = state.data
    if (!d) return
    if (!state.api) {
      d.trialSnapshot = d.trialSnapshot || {}
      var real = (d.trials || []).filter(function (t) { return !t.fictional })
      var fake = (d.trials || []).filter(function (t) { return t.fictional })
      d.trialSnapshot.recordCount = real.length
      d.trialSnapshot.relevant = real.length
      d.trialSnapshot.returned = d.trials.length
      d.trialSnapshot.candidateScope = '演示态：' + (d.trials.length) + ' 条虚构样例（不含真实快照）；不是全库扫描'
      d.trialSnapshot.snapshotDate = d.TODAY
      d.trialSnapshot.fictionalInThisView = fake.length
    }
    d.TODAY = d.TODAY || new Date().toISOString().slice(0, 10)
    if (!state.profileId) {
      try { var savedId = localStorage.getItem('traps.profileId'); if (savedId && d.profiles.some(function (p) { return p.id === savedId })) state.profileId = savedId } catch (_) { /* 隐私模式 */ }
    }
    if (!state.profileId || !d.profiles.some(function (p) { return p.id === state.profileId })) state.profileId = d.profiles[0] ? d.profiles[0].id : null
  }

  /* ---------------- 启动 ---------------- */
  function boot() {
    if (API) {
      fetch(API + '/bootstrap', { credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
        .then(function (data) { state.api = true; state.data = data; state.ready = true; normalizeDemo(); paint() })
        .catch(function (error) {
          state.api = false; state.bootError = error.message
          state.data = DEMO; state.ready = true; normalizeDemo(); paint()
          toast('本机服务未连接，已切到演示态：刷新会重置', 'error')
        })
    } else {
      state.data = DEMO; state.api = false; state.ready = true; normalizeDemo(); paint()
    }
  }
  function applyBootstrap(data) {
    if (!data || !Array.isArray(data.profiles)) return
    state.data = data
    normalizeDemo()
    paint({ keepScroll: true })
  }

  /* ---------------- 页面骨架 ---------------- */
  function paint(opts) {
    opts = opts || {}
    var p = profile()
    if (!p) {
      $('#app').innerHTML = '<div class="main"><div class="empty"><b>还没有档案</b>点「新建我的档案」开始；演示示例不会代替你的记录。</div></div>'
      return
    }
    var body = ''
    if (state.page === 'dash') body = pageDash(p)
    else if (state.page === 'record') body = pageRecord(p)
    else if (state.page === 'metrics') body = pageMetrics(p)
    else if (state.page === 'trials') body = pageTrials(p)
    else if (state.page === 'files') body = pageFiles(p)
    else if (state.page === 'settings') body = pageSettings(p)
    $('#app').innerHTML = '<div class="shell">' + rail(p) + '<div class="main">' + body + footer() + '</div></div>'
    updateTopbar(p)
    renderDrawer()
    if (!opts.keepScroll) window.scrollTo(0, 0)
  }
  function updateTopbar(p) {
    var status = document.getElementById('top-status')
    if (status) {
      status.innerHTML = state.api
        ? '本机数据库 · <b>' + esc(p.name) + '</b> · 只在本机'
        : '演示态 · 刷新重置 · <b>' + esc(p.name) + '</b>'
    }
    var mode = document.getElementById('app-mode')
    if (mode) mode.textContent = state.api ? 'sqlite · 已连接' : '演示态 · 未写库'
    document.title = 'TRAPS 工作台 · ' + (PAGES.find(function (x) { return x.id === state.page; }) || {}).label
  }
  function rail(p) {
    var isDemo = Number(p.is_demo) === 1
    return '<aside class="rail" aria-label="档案与导航">' +
      '<button class="rail-profile" type="button" data-action="profiles" aria-haspopup="dialog">' +
        '<span class="tag"><span class="badge ' + (isDemo ? 'clay' : 'green') + '">' + (isDemo ? '合成示例' : '我的档案') + '</span>TRAPS</span>' +
        '<strong>' + esc(p.name) + '</strong>' +
        '<span class="switch">切换 / 新建档案 →</span>' +
      '</button>' +
      '<nav class="nav" aria-label="一级导航">' + PAGES.map(function (x) {
        return '<button type="button" data-nav="' + x.id + '"' + (state.page === x.id ? ' aria-current="page"' : '') + '><span class="num">' + x.num + '</span>' + x.label + '</button>'
      }).join('') + '</nav>' +
      '<div class="rail-foot"><b>' + (state.api ? '已写入 sqlite' : '演示数据') + '</b><br>' +
        '数据只在本机。卸载工作台不会自动删除。' +
        '<br><br>说明：本台不提供诊断、用药或入组判断。' +
      '</div></aside>'
  }
  function footer() {
    return '<footer class="foot"><div class="fleft"><span>TRAPS 工作台（占位名，待用户追认）</span><span>版本 <b id="app-version">v0.2.0</b></span><span>更新 <b id="app-build">2026-11-16</b></span></div><span>0 患者访谈 · 0 临床审核 · 内容待追认</span></footer>'
  }
  function pageHead(eyebrow, title, desc, actions) {
    return '<header class="page-head"><div class="head-text"><p class="eyebrow">' + esc(eyebrow) + '</p><h1>' + esc(title) + '</h1>' +
      (desc ? '<p>' + desc + '</p>' : '') + '</div>' + (actions ? '<div class="head-actions">' + actions + '</div>' : '') + '</header>'
  }

  /* ---------------- 概览 ---------------- */
  function pageDash(p) {
    var metrics = p.metrics || []
    var entries = p.entries || []
    var latest = {}
    metrics.forEach(function (m) { latest[m.key] = m })
    var days = daysFrom(p.diagnosed_on)
    var symptom = entries.filter(function (e) { return e.kind === 'symptom' })[0]
    var questions = entries.filter(function (e) { return e.kind === 'question' })
    var recent = entries.slice(0, 4)
    if (!metrics.length && !entries.length) {
      return pageHead('OVERVIEW / 01', '从第一条记录开始', '这个档案还是空的。先记一次发作观察、检验报告或下次想问医生的问题。',
        '<button class="btn primary" data-nav="record">＋ 记一条</button>') +
        '<div class="empty"><b>空档案不是错误</b>你可以从任意一类开始；没有记录时，本台不会借用别人的数据填充。</div>'
    }
    var stats = [
      ['C反应蛋白', latest.CRP, 'CRP'],
      ['红细胞沉降率', latest.ESR, 'ESR'],
      ['血清淀粉样蛋白A', latest.SAA, 'SAA'],
      ['体温观察', latest.TEMP, 'TEMP']
    ].map(function (x) {
      var m = x[1]
      return '<div class="stat"><div class="k">' + x[0] + '</div><div class="v">' + (m ? fmtNum(m.value) : '—') + '</div>' +
        '<div class="s">' + (m ? esc(m.unit || '') + ' · ' + fmtDate(m.date) : '还没有记录') + '</div></div>'
    }).join('')
    var qHtml = questions.length
      ? questions.slice(0, 3).map(function (q, i) {
        return '<div class="quick" style="cursor:default"><span class="idx">Q' + (i + 1) + '</span><div><b>' + esc(q.title) + '</b><small>' + esc((q.body || '').slice(0, 65)) + '</small></div><span class="arr">→</span></div>'
      }).join('')
      : '<div class="empty"><b>还没有要问的问题</b>把“这次一定要问”的写下来，复诊前会出现在这里。</div>'
    var symptomBars = entries.filter(function (e) { return e.kind === 'symptom' }).slice(0, 5)
    if (!symptomBars.length) symptomBars = []
    var symHtml = symptomBars.length ? '<div class="symptom-bars">' + symptomBars.map(function (e) {
      var score = e.data && (e.data.score != null ? Number(e.data.score) : null)
      if (score == null) {
        var m = String(e.body || '').match(/(\d+)\s*\/\s*10/)
        score = m ? Number(m[1]) : 0
      }
      return '<div class="symptom-bar"><div class="top"><span>' + esc(e.title || '症状') + '</span><span class="mono">' + fmtNum(score) + ' / 10</span></div>' +
        '<div class="track"><div class="fill" style="width:' + Math.max(0, Math.min(100, score * 10)) + '%"></div></div><div class="tiny muted">' + fmtDate(e.date) + '</div></div>'
    }).join('') + '</div>' : '<div class="empty"><b>还没有症状记录</b>发热、肌肉疼痛、皮疹或其他观察都可以记；自评分只是个人感受。</div>'
    return pageHead('OVERVIEW / 01', '今天要带走的，先放在这里', '只看当前档案中你记录的发作、检验、症状和复诊问题。',
      '<button class="btn" data-nav="metrics">看趋势</button><button class="btn primary" data-action="new-record">＋ 记一条</button>') +
      '<div class="status-grid">' +
        '<section class="paper status-hero" aria-label="当前病程状态">' +
          '<div class="status-top"><span class="badge ' + (Number(p.is_demo) === 1 ? 'clay' : 'green') + '">' + (Number(p.is_demo) === 1 ? '合成示例' : '我的档案') + '</span>' +
            '<span class="badge">TRAPS</span><span class="badge">' + esc(p.tag || '资料整理中') + '</span></div>' +
          (days != null ? '<p class="days"><b>' + days + '</b><span>天 · 从档案日期 ' + fmtDate(p.diagnosed_on) + ' 起</span></p>' : '<p class="days"><b>—</b><span>档案日期未填</span></p>') +
          '<h2>' + esc(p.name) + '</h2><p class="lead">' + esc(p.summary || '还没有摘要。记录几条之后，这里会显示最近的状态。') + '</p>' +
          '<div class="stats-strip">' + stats + '</div>' +
          '<div class="note-box">本台只整理记录，不判断病情好坏。指标怎么看、下一步做什么，<b>这一句需要问你的医生</b>。</div>' +
        '</section>' +
        '<div class="status-side">' +
          '<section class="paper primer-card" aria-label="疾病概要入口">' +
            '<p class="kicker">DISEASE PRIMER</p><h2>这个病，大概是怎么回事？</h2>' +
            '<p>定义、指南与资料规范、治疗全景、已经发生的变化。四段整页，不是小弹窗。</p>' +
            '<button class="btn clay" type="button" data-primer-open data-primer-entry="status" aria-haspopup="dialog" aria-controls="disease-primer" aria-label="疾病概要：定义、医学资料与指南情况、治疗全景、发展趋势">打开疾病概要 →</button>' +
          '</section>' +
          '<section class="paper pad" aria-label="今日三件事">' +
            '<p class="kicker">TODAY / 3 THINGS</p>' +
            '<div class="quick-list">' +
              '<button class="quick" data-action="new-record" data-kind="symptom"><span class="idx">01</span><div><b>记录一次发作</b><small>起止、体温、疼痛位置与影响</small></div><span class="arr">→</span></button>' +
              '<button class="quick" data-action="new-record" data-kind="lab"><span class="idx">02</span><div><b>补一条检验结果</b><small>保留单位、参考范围和报告来源</small></div><span class="arr">→</span></button>' +
              '<button class="quick" data-nav="trials"><span class="idx">03</span><div><b>查看公开研究登记</b><small>来源与日期可回查，不判断入组资格</small></div><span class="arr">→</span></button>' +
            '</div>' +
          '</section>' +
        '</div>' +
      '</div>' +
      '<div class="two-col section">' +
        '<section><div class="section-head"><h2>最近记录</h2><span class="hint">按日期倒序</span></div>' +
          (recent.length ? '<div class="records">' + recent.map(recordLine).join('') + '</div>' : '<div class="empty"><b>没有记录</b>从上面任意一条开始。</div>') +
        '</section>' +
        '<section><div class="section-head"><h2>复诊准备</h2><span class="hint">从你写下的问题来</span></div><div class="quick-list">' + qHtml + '</div>' +
          '<div class="section-head" style="margin-top:22px"><h2>症状负担</h2><span class="hint">表达面自评，不做判断</span></div>' + symHtml +
        '</section>' +
      '</div>'
  }
  function recordLine(e) {
    var kind = (DEMO.recordKinds.find(function (k) { return k.kind === e.kind; }) || {}).label || e.kind
    return '<div class="record"><div><div class="date">' + fmtDate(e.date) + '</div></div><div><span class="kind-label">' + esc(kind) + '</span><b>' + esc(e.title || '未命名记录') + '</b>' +
      '<p>' + esc((e.body || '').slice(0, 140)) + '</p></div><div class="actions">' + (Number(e.is_private) ? '<span class="private-mark">私密</span>' : '') + '</div></div>'
  }

  /* ---------------- 记录 ---------------- */
  function pageRecord(p) {
    var kinds = (state.data.recordKinds || DEMO.recordKinds)
    var entries = p.entries || []
    var selectedKind = state.recordKind || 'symptom'
    return pageHead('RECORD / 02', '把发生过的事记下来', '日期 + 一项内容就能保存。写入本机数据库，刷新后仍在。演示态会明确写“刷新会重置”。',
      '<button class="btn" data-action="profiles">切换档案</button>') +
      '<div class="kind-grid" role="group" aria-label="记录类型">' + kinds.map(function (k) {
        return '<button class="kind" type="button" data-kind-btn="' + k.kind + '" aria-pressed="' + (selectedKind === k.kind) + '"><span class="ic">' + k.icon + '</span>' + k.label + '</button>'
      }).join('') + '</div>' +
      '<section class="paper pad section">' + recordForm(selectedKind, p) + '</section>' +
      '<section class="section"><div class="section-head"><h2>最近记录</h2><span class="hint">共 ' + entries.length + ' 条（私密记录不在此列表）</span></div>' +
        (entries.length ? '<div class="records">' + entries.slice(0, 18).map(function (e) {
          return recordLine(e) + '<div style="margin:-8px 0 10px 68px"><button class="btn text sm" data-action="toggle-private" data-id="' + esc(e.id) + '" data-kind="' + esc(e.kind) + '" data-private="' + (Number(e.is_private) ? '1' : '0') + '">设为私密</button></div>'
        }).join('') + '</div>' : '<div class="empty"><b>这个档案还没有记录</b>先选上面任意一类。</div>') +
      '</section>'
  }
  function recordForm(kind, p) {
    var label = (DEMO.recordKinds.find(function (k) { return k.kind === kind; }) || {}).label || kind
    var today = state.data.TODAY || new Date().toISOString().slice(0, 10)
    var extra = ''
    if (kind === 'symptom') {
      extra = '<div class="field full"><label for="f-score">自我感受（0–10，仅用于回顾）</label><div class="range-row"><input id="f-score" name="score" type="range" min="0" max="10" step="1" value="4" oninput="this.parentNode.querySelector(\'.range-val\').textContent=this.value"><span class="range-val">4</span></div><small>这是个人感受记录，不表示医学严重程度。</small></div>' +
        '<div class="field full"><label>观察到的表现（可多选）</label><div class="chips">' + ['发热', '肌肉疼痛', '皮疹/局部发红', '眼部不适', '腹部不适', '胸部不适', '关节疼痛', '其他'].map(function (x) { return '<label class="chip"><input type="checkbox" name="locations" value="' + x + '" style="margin-right:4px">' + x + '</label>' }).join('') + '</div></div>' +
        '<div class="field"><label for="f-duration">持续时间（原样记录）</label><input id="f-duration" name="duration" placeholder="例如：约 6 天 / 尚未结束"></div>'
    } else if (kind === 'lab') {
      extra = '<div class="field"><label for="f-metric">指标</label><select id="f-metric" name="metricKey">' +
        [['CRP', 'C反应蛋白（CRP）', 'mg/L', '炎症指标'], ['ESR', '红细胞沉降率（ESR）', 'mm/h', '炎症指标'], ['SAA', '血清淀粉样蛋白A（SAA）', 'mg/L', '炎症指标'], ['TEMP', '体温', '°C', '发作观察'], ['OTHER', '其他检验项目', '', '其他']].map(function (m, i) { return '<option value="' + m[0] + '" data-label="' + m[1] + '" data-unit="' + m[2] + '" data-cat="' + m[3] + '"' + (i === 0 ? ' selected' : '') + '>' + m[1] + '</option>' }).join('') + '</select></div>' +
        '<div class="field"><label for="f-value">数值</label><input id="f-value" name="value" type="number" step="0.1" inputmode="decimal" placeholder="例如 149"></div>' +
        '<div class="field"><label for="f-unit">单位</label><input id="f-unit" name="unit" value="g/L"></div>' +
        '<div class="field"><label for="f-institution">机构（可选）</label><input id="f-institution" name="institution" placeholder="例如：市一医院检验科"></div>' +
        '<div class="field"><label for="f-ref-low">参考下限（可选）</label><input id="f-ref-low" name="refLow" type="number" step="0.1"></div>' +
        '<div class="field"><label for="f-ref-high">参考上限（可选）</label><input id="f-ref-high" name="refHigh" type="number" step="0.1"></div>'
    } else if (kind === 'treatment') {
      extra = '<div class="field"><label for="f-drug">名称</label><input id="f-drug" name="drug" placeholder="药名或治疗名称"></div>' +
        '<div class="field"><label for="f-tstatus">状态</label><select id="f-tstatus" name="treatmentStatus"><option>正在用</option><option>已停用</option><option>准备问</option></select></div>'
    } else if (kind === 'question') {
      extra = '<div class="field"><label for="f-priority">优先级</label><select id="f-priority" name="priority"><option>高</option><option>中</option><option>低</option></select></div>' +
        '<div class="field"><label for="f-dept">想问谁</label><input id="f-dept" name="askWho" placeholder="血液科 / 主治医生"></div>'
    } else if (kind === 'hospital') {
      extra = '<div class="field"><label for="f-dept2">科室</label><input id="f-dept2" name="department" placeholder="血液科"></div>' +
        '<div class="field"><label for="f-doctor">医生（可选）</label><input id="f-doctor" name="doctor" placeholder="只写称呼即可"></div>'
    } else if (kind === 'report') {
      extra = '<div class="field"><label for="f-rtype">报告类型</label><select id="f-rtype" name="reportType"><option>检验报告</option><option>遗传</option><option>超声</option><option>分子检测</option><option>其他</option></select></div>'
    } else if (kind === 'doc') {
      extra = '<div class="field"><label for="f-dtype">文档类型</label><select id="f-dtype" name="docType"><option>门诊记录</option><option>出院小结</option><option>检查报告</option><option>其他</option></select></div>'
    } else if (kind === 'mind') {
      extra = '<div class="field"><label for="f-mood">此刻心情</label><select id="f-mood" name="mood"><option>平稳</option><option>低落</option><option>焦虑</option><option>疲惫</option><option>想说说话</option></select></div>'
    }
    return '<form id="record-form" data-kind="' + kind + '" novalidate>' +
      '<div class="section-head"><h2>新增' + esc(label) + '</h2><span class="hint">保存后写入当前档案：' + esc(p.name) + '</span></div>' +
      '<div class="form-grid">' +
        '<div class="field full"><label for="f-title">标题</label><input id="f-title" name="title" maxlength="160" placeholder="一句话说明这条记录"></div>' +
        '<div class="field"><label for="f-date">日期</label><input id="f-date" name="date" type="date" value="' + today + '" required></div>' +
        (kind === 'lab' ? extra : '<div class="field"><label for="f-source">来源</label><input id="f-source" name="source" value="患者自记" placeholder="自记 / 门诊记录 / 报告"></div>' + extra) +
        '<div class="field full"><label for="f-body">备注（原文照录，不写判断）</label><textarea id="f-body" name="body" placeholder="发生了什么、医生怎么说的、报告原文……"></textarea></div>' +
        '<div class="field full"><label class="chip" style="display:inline-flex;align-items:center;width:max-content"><input type="checkbox" name="private" style="margin-right:6px"> 设为私密（列表、导出、AI 上下文都不显示）</label></div>' +
      '</div>' +
      '<div class="form-foot"><span class="hint" id="save-hint">' + (state.api ? '将写入本机 sqlite。' : '演示态：只在本页内存中，刷新会重置。') + '</span>' +
        '<button class="btn text" type="button" data-action="cancel-record">取消</button>' +
        '<button class="btn" type="submit" data-mode="continue">保存并继续录入</button>' +
        '<button class="btn primary" type="submit" data-mode="close">保存并关闭</button></div>' +
    '</form>'
  }

  /* ---------------- 指标 ---------------- */
  function metricGroups(p) {
    var map = {}
    ;(p.metrics || []).forEach(function (m) {
      var cat = m.category || '其他'
      if (!map[cat]) map[cat] = {}
      var gid = metricGroupId(m)
      if (!map[cat][gid]) map[cat][gid] = []
      map[cat][gid].push(m)
    })
    return GROUP_ORDER.filter(function (g) { return map[g] }).map(function (g) { return { name: g, items: map[g] } })
  }
  /* 单位或检测方法变化 = 新的可比组，不把两次不同口径的化验连成一条线 */
  function metricGroupId(m) {
    var unit = String(m.unit || '').trim()
    var method = String(m.method || '').trim()
    return String(m.key || m.label || 'metric') + (unit ? '::' + unit : '') + (method ? '::' + method : '')
  }
  function metricBase(id) { return String(id).split('::')[0] }
  function metricGroupLabel(id, series) {
    var m = series && series[0] || {}
    var extra = []
    if (id.indexOf('::') < 0) return m.label || metricBase(id)
    if (m.unit) extra.push(m.unit)
    if (m.method) extra.push(m.method)
    return (m.label || metricBase(id)) + (extra.length ? ' · ' + extra.join(' / ') : '')
  }
  function metricStats(series) {
    var vals = series.map(function (m) { return Number(m.value) }).filter(isFinite)
    if (!vals.length) return null
    var last = series[series.length - 1]
    var prev = series.length > 1 ? series[series.length - 2] : null
    return { min: Math.min.apply(null, vals), max: Math.max.apply(null, vals), last: last, prev: prev, count: vals.length, delta: prev ? Number(last.value) - Number(prev.value) : null }
  }
  function sparkline(series, color) {
    var vals = series.map(function (m) { return Number(m.value) }).filter(isFinite)
    if (!vals.length) return ''
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), span = max - min || 1
    var pts = vals.map(function (v, i) {
      var x = vals.length === 1 ? 50 : 4 + i * (92 / (vals.length - 1))
      var y = 96 - ((v - min) / span) * 84
      return [x, y]
    })
    if (pts.length === 1) return '<circle cx="' + pts[0][0] + '" cy="' + pts[0][1] + '" r="4" fill="' + color + '"/>'
    return '<polyline fill="none" stroke="' + color + '" stroke-width="1.6" points="' + pts.map(function (p) { return p[0] + ',' + p[1] }).join(' ') + '"/>'
  }
  function pageMetrics(p) {
    return pageHead('OBSERVATIONS / 03', '按原始单位回看检验与发作观察', 'CRP、ESR、SAA 等按不同单位和方法分开呈现；不合成病情分，也不作个体判断。',
      '<button class="btn ' + (state.metricsView === 'cards' ? 'primary' : '') + '" data-action="metrics-view" data-view="cards">指标卡</button>' +
      '<button class="btn ' + (state.metricsView === 'chart' ? 'primary' : '') + '" data-action="metrics-view" data-view="chart">一图秀</button>' +
      '<button class="btn" data-action="new-record" data-kind="lab">＋ 记一条检验</button>') +
      (state.metricsView === 'chart' ? oneChart(p) : metricCards(p))
  }
  function metricCards(p) {
    var groups = metricGroups(p)
    if (!groups.length) return '<div class="empty"><b>还没有指标</b>记录一次检验结果或发作观察后，这里会按类别出现指标卡。</div>'
    return groups.map(function (g) {
      var keys = Object.keys(g.items)
      return '<section class="section"><div class="group-head"><h2>' + esc(g.name) + '</h2><span class="count">' + keys.length + ' 项 · ' + keys.reduce(function (n, k) { return n + g.items[k].length }, 0) + ' 次记录</span></div>' +
        '<div class="metric-grid">' + keys.map(function (key) {
          var series = g.items[key].slice().sort(function (a, b) { return a.date.localeCompare(b.date) || String(a.id).localeCompare(String(b.id)) })
          var stat = metricStats(series)
          if (!stat) return ''
          var delta = stat.delta
          var deltaText = delta == null ? '首次记录' : (delta > 0 ? '+' : '') + fmtNum(delta) + ' ' + (stat.last.unit || '')
          var deltaClass = delta == null || delta === 0 ? 'delta-flat' : delta > 0 ? 'delta-up' : 'delta-down'
          var color = COLORS[metricBase(key)] || '#2f5d4e'
          return '<button class="metric-card" type="button" data-action="flip-metric" aria-pressed="false" aria-label="' + esc(stat.last.label + '，最近 ' + fmtNum(stat.last.value) + stat.last.unit + '，点击翻看趋势') + '">' +
            '<div class="metric-inner"><div class="metric-face front">' +
              '<div class="m-top"><span class="m-label">' + esc(stat.last.label) + '</span><span class="m-count">' + stat.count + ' 次</span></div>' +
              '<div class="m-value">' + fmtNum(stat.last.value) + '<span class="m-unit">' + esc(stat.last.unit || '') + '</span></div>' +
              '<div class="m-delta ' + deltaClass + '">' + esc(deltaText) + '</div>' +
              '<div class="m-meta">' + fmtDate(stat.last.date) + ' · ' + esc(stat.last.institution || '未填机构') + '<br>' + esc(stat.last.method || '') + '<br>参考 ' + (stat.last.ref_low == null && stat.last.ref_high == null ? '未填' : fmtNum(stat.last.ref_low) + '–' + fmtNum(stat.last.ref_high)) + '</div>' +
            '</div><div class="metric-face back">' +
              '<h3>' + esc(stat.last.label) + ' · 全部记录</h3><div class="m-count">全期 ' + fmtNum(stat.min) + '–' + fmtNum(stat.max) + ' ' + esc(stat.last.unit || '') + '</div>' +
              '<div class="mini-chart"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + sparkline(series, color) + '</svg></div>' +
              '<div class="m-meta">按该指标自身全期最小/最大归一化；单点不连线。<br>日期 ' + fmtDate(series[0].date) + ' → ' + fmtDate(stat.last.date) + '</div>' +
            '</div></div></button>'
        }).join('') + '</div></section>'
    }).join('')
  }
  function oneChart(p) {
    var groups = metricGroups(p)
    var flat = {}
    groups.forEach(function (g) { Object.keys(g.items).forEach(function (k) { flat[k] = g.items[k] }) })
    var bases = ['CRP', 'ESR', 'SAA', 'TEMP']
    var chosen = Object.keys(flat).filter(function (k) { return bases.indexOf(metricBase(k)) >= 0 }).sort(function (a, b) {
      return bases.indexOf(metricBase(a)) - bases.indexOf(metricBase(b))
    })
    if (!chosen.length) return '<div class="empty"><b>还没有足够的数据</b>至少记一次指标后再来看一图秀。</div>'
    var seriesMap = {}
    var allDates = []
    chosen.forEach(function (k) {
      var arr = flat[k].slice().sort(function (a, b) { return a.date.localeCompare(b.date) })
      seriesMap[k] = arr
      arr.forEach(function (m) { if (allDates.indexOf(m.date) < 0) allDates.push(m.date) })
    })
    allDates.sort()
    var W = 900, H = 360, L = 74, R = 22, T = 26, B = 76
    var innerW = W - L - R, innerH = H - T - B
    var x = function (d) { return L + (allDates.length === 1 ? innerW / 2 : allDates.indexOf(d) * innerW / (allDates.length - 1)) }
    var y = function (v, series) {
      var vals = series.map(function (m) { return Number(m.value) })
      var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), span = max - min || 1
      return T + innerH - ((Number(v) - min) / span) * innerH
    }
    var grid = [0, 1, 2, 3, 4].map(function (i) { return '<line x1="' + L + '" y1="' + (T + i * innerH / 4) + '" x2="' + (W - R) + '" y2="' + (T + i * innerH / 4) + '" stroke="#e9e4d9" stroke-width="1"/>' }).join('')
    var xTicks = []
    var tickIdx = allDates.length <= 4 ? allDates.map(function (_, i) { return i }) : [0, Math.floor((allDates.length - 1) / 3), Math.floor(2 * (allDates.length - 1) / 3), allDates.length - 1]
    tickIdx.filter(function (v, i, a) { return a.indexOf(v) === i }).forEach(function (i) {
      var anchor = i === 0 ? 'start' : i === allDates.length - 1 ? 'end' : 'middle'
      xTicks.push('<text x="' + x(allDates[i]) + '" y="' + (H - 42) + '" text-anchor="' + anchor + '" font-size="10" fill="#76827b">' + fmtDate(allDates[i]) + '</text>')
    })
    var lines = chosen.map(function (k, idx) {
      var s = seriesMap[k]
      var pts = s.map(function (m) { return { x: x(m.date), y: y(m.value, s), v: Number(m.value), date: m.date, id: m.id } })
      var color = COLORS[metricBase(k)] || '#2f5d4e'
      var lineLabel = metricGroupLabel(k, s)
      var path = pts.length > 1 ? '<path d="' + smoothPath(pts) + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" data-line="' + k + '"/>' : ''
      var dots = pts.map(function (pt) { return '<circle cx="' + pt.x + '" cy="' + pt.y + '" r="3.2" fill="' + color + '" data-date="' + pt.date + '"><title>' + esc(k + ' ' + fmtNum(pt.v) + ' @ ' + pt.date) + '</title></circle>' }).join('')
      var last = s[s.length - 1]
      return path + dots + '<text x="' + (L - 10) + '" y="' + (T + idx * 15 + 11) + '" text-anchor="end" font-size="10" fill="' + color + '">' + esc(lineLabel) + ' ' + fmtNum(last.value) + '</text>'
    }).join('')
    var treatments = []
    ;(p.treatments || []).forEach(function (t) {
      if (!t.started_on || !allDates.length) return
      var start = Math.max(0, new Date(t.started_on) - new Date(allDates[0]))
      var end = t.ended_on ? new Date(t.ended_on) - new Date(allDates[0]) : new Date(state.data.TODAY) - new Date(allDates[0])
      var total = new Date(allDates[allDates.length - 1]) - new Date(allDates[0]) || 1
      var x1 = L + Math.max(0, Math.min(1, start / total)) * innerW
      var x2 = L + Math.max(0, Math.min(1, end / total)) * innerW
      treatments.push('<rect x="' + x1 + '" y="' + (H - 32) + '" width="' + Math.max(3, x2 - x1) + '" height="8" fill="' + (t.ended_on ? '#c8bfae' : '#b4552d') + '" data-layer="treatment"><title>' + esc(t.name + ' · ' + t.status) + '</title></rect>' +
        '<text x="' + x1 + '" y="' + (H - 18) + '" font-size="9" fill="#42524a">' + esc(t.name.slice(0, 10)) + '</text>')
    })
    var legend = chosen.map(function (k) {
      var s = seriesMap[k], vals = s.map(function (m) { return Number(m.value) })
      return '<span><i style="background:' + (COLORS[metricBase(k)] || '#2f5d4e') + '"></i>' + esc(metricGroupLabel(k, s)) + ' · 自身 ' + fmtNum(Math.min.apply(null, vals)) + '–' + fmtNum(Math.max.apply(null, vals)) + ' ' + esc(s[0].unit || '') + '</span>'
    }).join('')
    var events = (p.entries || []).filter(function (e) { return ['hospital', 'treatment', 'report', 'lab'].indexOf(e.kind) >= 0 }).slice(0, 6)
    return '<section class="section"><div class="section-head"><h2>多指标时间轴</h2><span class="hint">' + chosen.length + ' 条线 · 每条线独立归一化</span></div>' +
      '<div class="chart-wrap"><svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="多指标时间轴；每条线按自身全期范围归一化，不能互相比较高低" data-layer="data">' +
        grid + xTicks + lines + '<g data-layer="treatment">' + treatments.join('') + '</g>' +
        '<text x="' + L + '" y="14" font-size="10" fill="#76827b">各指标按自身全期 min/max 归一化 · 高低不可互比</text>' +
      '</svg><div class="chart-caption">治疗条单独放在底部，与数据区分层。图上没有“病情总分”：不同指标的量纲与临床意义不同，合成一条线会骗人。日期缺失或单位变化会拆成新的可比组。</div></div>' +
      '<div class="chart-key">' + legend + '</div>' +
      '<div class="event-lane"><div class="section-head"><h2 style="font-size:13px">事件泳道</h2><span class="hint">与数据点同一日期，不改变曲线</span></div>' +
        (events.length ? events.map(function (e) {
          return '<div class="event-row"><span class="ed">' + fmtDate(e.date) + '</span><span class="el"><span class="event-pill">' + esc((DEMO.recordKinds.find(function (k) { return k.kind === e.kind; }) || {}).label || e.kind) + '</span><span>' + esc(e.title) + '</span></span></div>'
        }).join('') : '<div class="empty">还没有事件记录。</div>') + '</div></section>'
  }
  /* Fritsch–Carlson 单调三次插值：不过冲、不制造假峰 */
  function smoothPath(points) {
    var n = points.length
    if (n < 2) return ''
    if (n === 2) return 'M' + points[0].x + ',' + points[0].y + 'L' + points[1].x + ',' + points[1].y
    var dx = [], dy = [], slope = [], m = []
    for (var i = 0; i < n - 1; i++) {
      dx[i] = points[i + 1].x - points[i].x
      dy[i] = points[i + 1].y - points[i].y
      slope[i] = dx[i] ? dy[i] / dx[i] : 0
    }
    m[0] = slope[0]
    for (i = 1; i < n - 1; i++) {
      if (slope[i - 1] * slope[i] <= 0) m[i] = 0
      else m[i] = (slope[i - 1] + slope[i]) / 2
    }
    m[n - 1] = slope[n - 2]
    for (i = 0; i < n - 1; i++) {
      if (slope[i] === 0) { m[i] = 0; m[i + 1] = 0; continue }
      var a = m[i] / slope[i], b = m[i + 1] / slope[i]
      var s = a * a + b * b
      if (s > 9) { var t = 3 / Math.sqrt(s); m[i] = t * a * slope[i]; m[i + 1] = t * b * slope[i] }
    }
    var d = 'M' + points[0].x + ',' + points[0].y
    for (i = 0; i < n - 1; i++) {
      var h = dx[i]
      d += 'C' + (points[i].x + h / 3) + ',' + (points[i].y + m[i] * h / 3) + ' ' +
        (points[i + 1].x - h / 3) + ',' + (points[i + 1].y - m[i + 1] * h / 3) + ' ' +
        points[i + 1].x + ',' + points[i + 1].y
    }
    return d
  }

  /* ---------------- 临床研究 ---------------- */
  function matchRows(p) {
    var rows = (state.data.trials || []).map(function (t) {
      var result = window.calcTrialMatch ? window.calcTrialMatch(p, t, { preference: state.matchPref }) : { pct: null, matched: 0, compared: 0, pending: 0, tier: '需补充信息', criteria: [] }
      return { trial: t, result: result }
    })
    var order = { '字段都对得上': 0, '部分对得上': 1, '需补充信息': 2, '硬性条件不满足': 3 }
    rows.sort(function (a, b) {
      if (order[a.result.tier] !== order[b.result.tier]) return order[a.result.tier] - order[b.result.tier]
      return (b.result.pct || -1) - (a.result.pct || -1)
    })
    return rows
  }
  function pageTrials(p) {
    var snap = state.data.trialSnapshot || {}
    return pageHead('RESEARCH / 04', '临床研究：先看分母，再看线索', '登记信息不是入组资格。这里只做字段对照，把“对得上、对不上、待确认”摊开给你和医生看。',
      '<button class="btn" data-action="ask-ai-trials">让 AI 帮我列问题</button>') +
      '<div class="tabs" role="tablist">' +
        [['match', '匹配'], ['search', '检索'], ['saved', '收藏与跟踪']].map(function (t) {
          return '<button role="tab" data-trial-tab="' + t[0] + '" aria-selected="' + (state.trialTab === t[0]) + '">' + t[1] + '</button>'
        }).join('') + '</div>' +
      (state.trialTab === 'match' ? trialMatchPage(p, snap) : state.trialTab === 'search' ? trialSearchPage(p, snap) : trialSavedPage(p, snap))
  }
  function poolHead(snap, returned) {
    var recordCount = snap.recordCount == null ? '—' : snap.recordCount
    return '<div class="pool-head"><span>已载 <b>' + recordCount + '</b> 条快照</span><span>本次返回 <b>' + returned + '</b> 条</span><span>不是全库扫描</span><span>快照 <b>' + esc(snap.snapshotDate || '未标注') + '</b></span>' +
      '<span>相关 ' + (snap.relevant == null ? '—' : snap.relevant) + ' 条</span><span class="muted">相关 0 也不等于“没有研究”：检索词命中才进池，通道召回有限。</span></div>'
  }
  function trialFacts(p) {
    var facts = p.facts || []
    return '<section class="paper pad"><div class="section-head"><h2>已确认的档案字段</h2><span class="hint">只有这些字段参与对照</span></div><div class="fact-grid">' +
      facts.map(function (f) {
        return '<div class="fact ' + (Number(f.confirmed) ? '' : 'pending') + '"><div class="k">' + esc(f.label || f.field) + (Number(f.confirmed) ? '' : ' · 待确认') + '</div><div class="v">' + esc(f.value || '未填') + '</div><div class="tiny muted">' + esc(f.source || '') + '</div></div>'
      }).join('') + '</div><p class="tiny muted" style="margin:10px 0 0">未确认字段不参与匹配；药物靶点不进分母。可对照项少于 2 项时不给百分数。</p></section>'
  }
  function trialMatchPage(p, snap) {
    var rows = matchRows(p)
    if (!rows.length) return trialFacts(p) + poolHead(snap, 0) + '<div class="empty"><b>本轮没有候选记录</b>不是“没有研究”。通道终态与快照日期见设置 → 临床数据库。</div>'
    return trialFacts(p) + poolHead(snap, rows.length) +
      '<div class="section-head"><h2>候选线索</h2><span class="hint">优先显示对不上与待确认；分数不是入组判断</span></div>' +
      rows.map(function (row) { return matchCard(row.trial, row.result) }).join('') +
      '<div class="note-box" style="margin-top:18px">登记状态，未核实；登记 ≠ 有效 ≠ 安全 ≠ 可入组。快照会过期，入排原文请到官方登记页核对；是否参加，<b>这一句需要问你的医生</b>。</div>'
  }
  function matchCard(t, r) {
    var criteria = (r.criteria || []).slice().sort(function (a, b) {
      var order = { no: 0, unknown: 1, yes: 2 }
      return order[a.state] - order[b.state]
    })
    var shown = criteria.slice(0, 4)
    var score = r.pct == null
      ? '<div class="score needs"><b>需补充<br>信息</b><span>可对照 &lt; 2 项</span></div>'
      : '<div class="score"><b>' + r.pct + '%</b><span>登记字段<br>符合度</span></div>'
    return '<article class="trial-card" data-trial="' + esc(t.trialKey) + '">' + score +
      '<div class="trial-main"><h3>' + esc(t.title) + '</h3>' +
      '<div class="trial-meta"><span>' + esc(t.registry) + '</span><span>' + esc(t.phase) + '</span><span>' + esc(t.status) + '</span><span>' + esc(t.sponsor) + '</span><span>' + esc((t.countries || []).join(' / ') || '地区未标注') + '</span></div>' +
      '<div class="denominator">' + r.matched + ' / ' + r.compared + ' 项对得上 · ' + r.pending + ' 项待确认</div>' +
      '<div class="criteria">' + shown.map(criterionHtml).join('') + '</div>' +
      '<div class="trial-foot"><span class="disclaimer">不是入组资格，也不代表效果。</span>' +
        '<button class="btn sm" data-action="trial-detail" data-key="' + esc(t.trialKey) + '">看证据链</button>' +
        '<button class="btn sm" data-action="save-trial" data-key="' + esc(t.trialKey) + '">收藏</button></div>' +
      '</div></article>'
  }
  function criterionHtml(c) {
    var mark = c.state === 'yes' ? '✓' : c.state === 'no' ? '✕' : '?'
    return '<div class="criterion ' + esc(c.state) + '"><span class="state">' + mark + '</span><div><b>' + esc(c.label) + '</b> ' +
      '<span class="why">记录里是：' + esc(c.recordText) + '（' + esc(c.source || '未标注') + '） · 条件要求：' + esc(c.requirement) + '</span></div></div>'
  }
  function trialSearchPage(p, snap) {
    var f = state.trialFilters
    var keyword = String(f.keyword || '').toLowerCase().trim()
    var rows = (state.data.trials || []).filter(function (t) {
      var hay = [t.title, t.registry, (t.conditions || []).join(' '), t.sponsor, (t.countries || []).join(' ')].join(' ').toLowerCase()
      if (keyword && hay.indexOf(keyword) < 0) return false
      if (f.subtype && (t.conditions || []).join(' ').toLowerCase().indexOf(f.subtype.toLowerCase()) < 0) return false
      if (f.status && String(t.status || '').toLowerCase().indexOf(f.status.toLowerCase()) < 0) return false
      if (f.phase && String(t.phase || '').toLowerCase().indexOf(f.phase.toLowerCase()) < 0) return false
      if (f.country && (t.countries || []).join(' ').toLowerCase().indexOf(f.country.toLowerCase()) < 0) return false
      return true
    })
    if (f.sort === 'date') rows.sort(function (a, b) { return String(b.startDate).localeCompare(String(a.startDate)) })
    else rows.sort(function (a, b) { return String(a.registry).localeCompare(String(b.registry)) })
    return poolHead(snap, rows.length) +
      '<form id="trial-search-form" class="trial-controls paper pad" aria-label="检索条件">' +
        '<div class="field"><label for="t-keyword">关键词 / 登记号</label><input id="t-keyword" name="keyword" value="' + esc(f.keyword) + '" placeholder="例如：ruxolitinib、NCT07469891"></div>' +
        '<div class="field"><label for="t-subtype">研究涉及</label><select id="t-subtype" name="subtype"><option value="">全部</option><option' + (f.subtype === 'TRAPS' ? ' selected' : '') + '>TRAPS</option><option' + (f.subtype === 'autoinflammatory disease' ? ' selected' : '') + '>autoinflammatory disease</option><option' + (f.subtype === 'periodic fever' ? ' selected' : '') + '>periodic fever</option></select></div>' +
        '<div class="field"><label for="t-status">状态</label><select id="t-status" name="status"><option value="">全部</option><option' + (f.status === 'Recruiting' ? ' selected' : '') + '>Recruiting</option><option' + (f.status === 'Active' ? ' selected' : '') + '>Active</option></select></div>' +
        '<div class="field"><label for="t-phase">阶段</label><select id="t-phase" name="phase"><option value="">全部</option><option' + (f.phase === 'Phase 1' ? ' selected' : '') + '>Phase 1</option><option' + (f.phase === 'Phase 2' ? ' selected' : '') + '>Phase 2</option></select></div>' +
        '<div class="field"><label for="t-country">地区</label><select id="t-country" name="country"><option value="">全部</option><option' + (f.country === 'China' ? ' selected' : '') + '>China</option><option' + (f.country === 'United States' ? ' selected' : '') + '>United States</option></select></div>' +
        '<div class="field" style="grid-column:1/-1;display:flex;gap:8px;align-items:center"><button class="btn primary" type="submit">按条件检索</button><button class="btn text" type="button" data-action="clear-search">清空条件</button><span class="tiny muted">按条件排，不掺分数</span></div>' +
      '</form>' +
      '<div class="search-row"><span>返回 ' + rows.length + ' 条</span><span>只按条件筛选；没有排序分</span></div>' +
      '<div class="trial-list">' + (rows.length ? rows.map(function (t) {
        return '<div class="trial-hit"><div><h3>' + esc(t.title) + '</h3><div class="meta"><span>' + esc(t.registry) + '</span><span>' + esc(t.phase) + '</span><span>' + esc(t.status) + '</span><span>' + esc((t.countries || []).join(' / ')) + '</span></div></div><button class="btn sm go" data-action="trial-detail" data-key="' + esc(t.trialKey) + '">详情</button></div>'
      }).join('') : '<div class="empty"><b>没有命中</b>清空条件重试；检索词命中才进池，不等于没有研究。</div>') + '</div>' +
      '<div class="note-box" style="margin-top:16px">检索页不显示分数、百分比或排名。匹配只在“匹配”子页按已确认字段对照。</div>'
  }
  function trialSavedPage(p, snap) {
    var saved = (p.saved_trials || []).filter(function (s) { return !state.savedHidden[s.trialKey] })
    return poolHead(snap, saved.length) +
      '<div class="section-head"><h2>我留下的线索</h2><span class="hint">收藏只存 {trialKey, savedOn, state}</span></div>' +
      (saved.length ? '<div class="saved-grid">' + saved.map(function (s) {
        var t = findTrial(s.trialKey)
        return '<div class="saved-row"><div><h3>' + esc(t ? t.title : s.trialKey) + '</h3><div class="meta">' + esc(t ? t.registry + ' · ' + t.phase + ' · ' + t.status : '快照中没有这条（可能已过期）') + ' · 收藏于 ' + fmtDate(s.savedOn) + '</div></div>' +
          '<div class="saved-controls">' + [['in_followup', '在跟'], ['preparing', '准备问'], ['archived', '已归档']].map(function (x) {
            return '<button class="btn sm ' + (s.state === x[0] ? 'primary' : '') + '" data-action="save-state" data-key="' + esc(s.trialKey) + '" data-state="' + x[0] + '">' + x[1] + '</button>'
          }).join('') + '<button class="btn sm text" data-action="reject-trial" data-key="' + esc(s.trialKey) + '">本次不感兴趣</button></div></div>'
      }).join('') + '</div>' : '<div class="empty"><b>还没有收藏</b>在匹配或检索里看到想留的线索，点“收藏”。收藏只记本机，不等于报名。</div>') +
      '<div class="note-box" style="margin-top:16px">快照没有登记状态变化时间线，所以这里不画进度条。状态是“在跟 / 准备问 / 已归档”的手工标记。</div>'
  }

  /* ---------------- 资料 / 设置 ---------------- */
  function pageFiles(p) {
    var pub = (p.entries || []).filter(function (e) { return e.kind === 'report' || e.kind === 'doc' })
    return pageHead('FILES / 05', '资料与复诊摘要', '这里只整理你写进档案的内容。导出文件在本机生成，不上传。',
      '<button class="btn" data-action="print-summary">打印摘要</button><button class="btn primary" data-action="export-summary">导出 HTML</button>') +
      '<div class="settings-grid">' +
        '<section class="paper setting-block"><h2>复诊摘要包含什么</h2><p>档案名、亚型、最近 3 次指标、最近 6 条记录、你在意的问题。私密记录不会进入摘要。</p>' +
          '<div class="export-list"><button class="btn" type="button" data-action="export-summary">一页 HTML <span class="tiny">可打印 / 可存本机</span></button>' +
          '<button class="btn" type="button" data-action="print-summary">直接打印 <span class="tiny">系统打印对话框</span></button></div></section>' +
        '<section class="paper setting-block"><h2>资料目录</h2><p>业务数据写在本机 sqlite。切换目录不自动搬迁旧数据；需要时先导出。</p>' +
          '<div class="path-box">' + esc((state.data.dataRoot && state.data.dataRoot.dir) || '演示态未接数据库') + '</div>' +
          '<button class="btn" data-action="pick-dir">配置资料目录</button></section>' +
      '</div>' +
      '<section class="section"><div class="section-head"><h2>报告与文档</h2><span class="hint">' + pub.length + ' 条</span></div>' +
        (pub.length ? '<div class="records">' + pub.map(recordLine).join('') + '</div>' : '<div class="empty"><b>还没有报告记录</b>在“记录 → 报告/文档”里写下报告类型与原文要点。</div>') + '</section>'
  }
  function pageSettings(p) {
    var snap = state.data.trialSnapshot || {}
    var channels = snap.channels || []
    var tab = state.settingsTab || 'workspace'
    return pageHead('SETTINGS / 06', '设置与资料来源', '资料目录、数据来源、隐私、导出和关于；未接通的能力会明确标记。', '') +
      '<div class="tabs" role="tablist">' +
        [['workspace', '我的资料'], ['mineru', '数据来源'], ['clinical', '公开研究']].map(function (t) {
          return '<button role="tab" data-settings-tab="' + t[0] + '" aria-selected="' + (tab === t[0]) + '">' + t[1] + '</button>'
        }).join('') + '</div>' +
      (tab === 'workspace' ? settingsWorkspace(p) : tab === 'mineru' ? settingsMineru() : settingsClinical(snap, channels))
  }
  function settingsWorkspace(p) {
    return '<div class="settings-grid">' +
      '<section class="paper setting-block"><h2>资料目录</h2><p>真选择器选目录；拒绝主目录本身、桌面、下载根目录、tmp。客户端与服务端各判一次。</p>' +
        '<div class="path-box" id="settings-dir">' + esc((state.data.dataRoot && state.data.dataRoot.dir) || '演示态未接数据库') + '</div>' +
        '<button class="btn" data-action="pick-dir">选择目录</button> <span class="tiny muted">重开 Desktop 应回显同一目录</span></section>' +
      '<section class="paper setting-block"><h2>隐私</h2><p>设为私密的记录不进列表、导出、AI 上下文。这里可取消私密。</p>' +
        privacyList(p) + '</section>' +
      '<section class="paper setting-block"><h2>导出与打印</h2><p>导出的是本机 HTML 文件，不含私密记录。</p><div class="export-list">' +
        '<button class="btn" data-action="export-summary">导出复诊摘要</button><button class="btn" data-action="print-summary">打印</button></div></section>' +
      '<section class="paper setting-block"><h2>关于</h2><p><b>TRAPS 工作台</b>（占位名，待用户追认）· v0.2.0。</p>' +
        '<p class="tiny muted">0 患者访谈 · 0 临床审核 · 所有医学表述待核。合成数据不对应真实患者。真实患者数据不进仓、不进报告。</p>' +
        '<p class="tiny muted">数据连接：' + (state.api ? '本机 sqlite 已连接' : '演示态（未连接 API）') + '</p></section>' +
    '</div>'
  }
  function settingsMineru() {
    var snap = state.data.trialSnapshot || {}
    return '<div class="settings-grid">' +
      '<section class="paper setting-block"><h2>患者资料</h2><p>档案和记录保存在本机。资料目录切换不会自动移动或删除旧数据。</p><div class="path-box">' + esc((state.data.dataRoot && state.data.dataRoot.dir) || '演示原型：未连接本机数据库') + '</div></section>' +
      '<section class="paper setting-block"><h2>临床参考与研究快照</h2><p>来源地区、访问日期和查询通道状态见“公开研究”页。登记记录可能过期，不视为完整检索结果。</p><p>最近快照：' + esc(snap.snapshotDate || '未取得') + '</p></section>' +
      '<section class="paper setting-block"><h2>资料解析</h2><p><b>未接入报告解析。</b>原型不上传文件、不接收密钥，也不将原件发送到任何外部服务。</p><p>未来如接入，解析内容会作为待核候选，须逐项确认后才进入档案。</p></section>' +
    '</div>'
  }
  function settingsClinical(snap, channels) {
    return '<div class="settings-grid">' +
      '<section class="paper setting-block" style="grid-column:1/-1"><h2>公开研究来源</h2><p>逐通道终态原样展示。FAILED / NEEDS_SETUP 不算“查过”，不计覆盖率。</p>' +
        '<div class="table-scroll"><table class="data-table"><thead><tr><th>通道</th><th>终态</th><th>返回</th><th>口径 / 失败原因</th></tr></thead><tbody>' +
        (channels.length ? channels.map(function (c) {
          return '<tr><td>' + esc(c.label || c.id) + '</td><td><span class="state ' + esc(c.state) + '">' + esc(c.state) + '</span></td><td class="mono">' + (c.count == null ? '—' : c.count) + '</td><td>' + esc(c.note || (c.state === 'FAILED' ? '本轮失败，不算查过' : '登记库口径')) + '</td></tr>'
        }).join('') : '<tr><td colspan="4">开发版从本机 TRAPS 公开研究快照读取。</td></tr>') +
        '</tbody></table></div>' +
        '<p class="tiny muted" style="margin-top:8px">快照日期 ' + esc(snap.snapshotDate || '未标注') + ' · 记录 ' + (snap.recordCount == null ? '—' : snap.recordCount) + ' 条 · 相关 ' + (snap.relevant == null ? '—' : snap.relevant) + ' 条。' + esc(snap.disclaimer || '') + '</p>' +
        '<p class="tiny muted" style="margin-top:6px">数据口径：仅回顾不解读 · 不同方法/机构不合并 · 解读归医生。登记状态未核实；快照会过期。</p></section>' +
    '</div>'
  }
  function privacyList(p) {
    var items = (p.privateEntries || []).slice(0, 12)
    if (!items.length) return '<div class="empty" style="margin-top:8px"><b>没有私密记录</b>在记录列表里点“设为私密”。</div>'
    return items.map(function (e) {
      return '<div class="privacy-row"><b>' + esc(e.title || '未命名记录') + '</b><span class="tiny muted">' + fmtDate(e.event_date || e.date) + '</span>' +
        '<button class="toggle" data-action="unprivate-entry" data-id="' + esc(e.id) + '" aria-checked="true" aria-label="取消私密：' + esc(e.title) + '"></button></div>'
    }).join('')
  }

  /* ---------------- 档案管理 ---------------- */
  function openProfiles() {
    var d = state.data
    modalRoot.innerHTML = '<div class="overlay" data-close-modal="1"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="pm-title">' +
      '<div class="modal-head"><h2 id="pm-title">档案管理</h2><button class="modal-close" data-close-modal="1" aria-label="关闭">✕</button></div>' +
      '<p class="tiny muted" style="margin:0 0 12px">合成示例不可删、不会被你的记录覆盖。新建档案从空记录开始。</p>' +
      '<div class="profile-list">' + (d.profiles || []).map(function (p) {
        return '<button class="profile-option" data-select-profile="' + esc(p.id) + '" aria-pressed="' + (p.id === state.profileId) + '"><b>' + esc(p.name) + '</b><span>' + esc(p.tag || 'TRAPS 资料') + ' · ' + (Number(p.is_demo) ? '合成示例' : '我的档案') + '</span><span>' + (p.entries || []).length + ' 条记录 · ' + (p.metrics || []).length + ' 个指标</span></button>'
      }).join('') + '</div>' +
      '<form id="profile-form" class="create-box"><h3>＋ 新建档案</h3><p class="tip" style="margin-top:2px">新建我的档案：只有名称必填，创建后立即切换；亚型/确诊年月可以之后再补。</p>' +
        '<div class="form-grid"><div class="field full"><label for="p-name">名称</label><input id="p-name" name="name" maxlength="80" required placeholder="例如：我的档案"></div>' +
        '<div class="field"><label for="p-subtype">疾病标签（可选）</label><select id="p-subtype" name="subtype"><option value="">未填</option><option>TRAPS（用户自填）</option></select></div>' +
        '<div class="field"><label for="p-date">确诊年月（可选）</label><input id="p-date" name="diagnosed_on" type="date"></div>' +
        '<div class="field full"><label for="p-tag">一句话标签（可选）</label><input id="p-tag" name="tag" maxlength="80" placeholder="例如：刚完成评估 / 长期随访"></div></div>' +
        '<div class="form-foot"><span class="hint">' + (state.api ? '创建后写入 sqlite（is_demo=0），并立即切换。' : '演示态：只在本页内存，刷新重置。') + '</span><button class="btn primary" type="submit">创建并切换</button></div>' +
      '</form></div></div>'
    var first = $('#p-name')
    if (first) first.focus()
  }
  function closeModal() { modalRoot.innerHTML = '' }

  function renderDrawer() {
    if (!state.trialDetail) { drawerRoot.innerHTML = ''; return }
    var t = findTrial(state.trialDetail)
    if (!t) { drawerRoot.innerHTML = ''; return }
    var result = window.calcTrialMatch ? window.calcTrialMatch(profile(), t, {}) : { criteria: [], matched: 0, compared: 0, pending: 0, pct: null, tier: '需补充信息' }
    var criteria = (result.criteria || []).slice().sort(function (a, b) { var o = { no: 0, unknown: 1, yes: 2 }; return o[a.state] - o[b.state] })
    drawerRoot.innerHTML = '<div class="drawer-scrim" data-close-drawer="1"></div><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="td-title">' +
      '<div class="drawer-head"><h2 id="td-title">' + esc(t.title) + '</h2><button class="close" data-close-drawer="1" aria-label="关闭详情">✕</button></div>' +
      '<div class="trial-meta"><span>' + esc(t.registry) + '</span><span>' + esc(t.phase) + '</span><span>' + esc(t.status) + '</span><span>' + esc(t.sponsor) + '</span></div>' +
      '<p class="denominator">' + result.matched + ' / ' + result.compared + ' 项对得上 · ' + result.pending + ' 项待确认 ' + (result.pct == null ? '· 可对照项不足 2，不给百分数' : '· 登记字段符合度 ' + result.pct + '%') + '</p>' +
      '<div class="note-box">不是入组资格，也不代表效果。以下是登记字段与档案字段的逐条对照；入排原文请到官方登记页核对。</div>' +
      '<h3>证据链</h3>' + (criteria.length ? criteria.map(criterionHtml).join('') : '<p>没有可对照字段。</p>') +
      '<h3>登记信息</h3><p>' + esc(t.summary || '本机快照只存登记的结构化字段。') + '</p>' +
      '<p class="tiny muted">条件要求来自登记摘要与入排原文；记录里是的值来自档案（含来源）。' + esc(t.snapshotDate || '') + ' 快照。</p>' +
      (t.sourceUrl ? '<a class="source-link" href="' + esc(t.sourceUrl) + '" target="_blank" rel="noopener noreferrer">打开官方登记页 ↗</a>' : '<p class="tiny muted">本机快照没有官方链接；请按登记号自行检索。</p>') +
      '<div class="trial-foot" style="margin-top:18px"><button class="btn primary sm" data-action="save-trial" data-key="' + esc(t.trialKey) + '">收藏这条线索</button></div>' +
      '</aside>'
    setTimeout(function () { var b = $('.drawer .close'); if (b) b.focus() }, 0)
  }
  function closeDrawer() { state.trialDetail = null; renderDrawer() }

  /* ---------------- 动作 ---------------- */
  function navigate(page) {
    if (!PAGES.some(function (x) { return x.id === page })) return
    state.page = page
    paint()
    var h = $('.page-head h1'); if (h) h.focus({ preventScroll: true })
  }
  function chooseDir() {
    if (!isHost) {
      if (window.showDirectoryPicker) {
        window.showDirectoryPicker().then(function (handle) {
          toast('浏览器只返回目录句柄，拿不到绝对路径；请在 DSH Desktop 顶栏使用「配置目录」。')
        }).catch(function () { toast('已取消目录选择。') })
      } else {
        toast('独立浏览器没有目录选择能力；请从 DSH Desktop 顶栏打开「配置目录」。', 'error')
      }
      return
    }
    window.parent.postMessage({ type: 'traps:pick-dir' }, location.origin)
    toast('已请求宿主打开目录选择器。')
  }
  function openRecord(kind) {
    state.recordKind = kind || state.recordKind || 'symptom'
    state.page = 'record'
    paint()
  }
  function submitRecord(form, mode) {
    var kind = form.getAttribute('data-kind')
    mode = mode || 'close'
    var fd = new FormData(form)
    var locations = fd.getAll('locations')
    var data = { date: fd.get('date'), title: fd.get('title'), body: fd.get('body'), source: fd.get('source'), private: fd.get('private') === 'on' }
    if (kind === 'symptom') { data.score = Number(fd.get('score') || 0); data.locations = locations; data.duration = fd.get('duration') }
    if (kind === 'lab') {
      var sel = $('#f-metric', form)
      var opt = sel && sel.options[sel.selectedIndex]
      var value = fd.get('value')
      data.metric = { key: sel ? sel.value : 'CRP', label: opt ? opt.getAttribute('data-label') : 'C反应蛋白', category: opt ? opt.getAttribute('data-cat') : '炎症指标', value: value, unit: fd.get('unit'), ref_low: fd.get('refLow') || null, ref_high: fd.get('refHigh') || null, method: '按报告填写', institution: fd.get('institution') || '' }
      if (!data.title) data.title = (opt ? opt.getAttribute('data-label') : '指标') + ' ' + (value || '')
    }
    if (kind === 'treatment') { data.drug = fd.get('drug'); data.status = fd.get('treatmentStatus') }
    if (kind === 'question') { data.priority = fd.get('priority'); data.askWho = fd.get('askWho') }
    if (kind === 'hospital') { data.department = fd.get('department'); data.doctor = fd.get('doctor') }
    if (kind === 'report') data.reportType = fd.get('reportType')
    if (kind === 'doc') data.docType = fd.get('docType')
    if (kind === 'mind') data.mood = fd.get('mood')
    if (!data.title && !data.body && !data.metric) { toast('至少写一个标题或内容。', 'error'); return }
    var btn = form.querySelector('button[type=submit][data-mode="' + mode + '"]')
    if (btn) { btn.disabled = true; btn.textContent = '保存中…' }
    if (state.api) {
      post('/entries', { profileKey: profile().id, kind: kind, data: data }).then(function (res) {
        applyBootstrap(res.bootstrap)
        toast(mode === 'continue' ? '已保存到本机数据库；可以接着录下一条' : '已保存到本机数据库')
        if (mode !== 'continue') navigate('dash')
      }).catch(function (error) { toast('保存失败：' + error.message, 'error'); if (btn) { btn.disabled = false; btn.textContent = mode === 'continue' ? '保存并继续录入' : '保存并关闭' } })
    } else {
      var p = profile()
      p.entries = p.entries || []
      var id = 'local-e' + Date.now()
      p.entries.unshift({ id: id, kind: kind, title: data.title || data.drug || data.reportType || '记录', body: data.body || '', data: data, date: data.date, source: data.source, is_private: data.private ? 1 : 0 })
      if (data.metric && data.metric.value) {
        p.metrics = p.metrics || []
        p.metrics.push({ id: 'local-m' + Date.now(), key: data.metric.key, label: data.metric.label, category: data.metric.category, value: Number(data.metric.value), unit: data.metric.unit, ref_low: data.metric.ref_low, ref_high: data.metric.ref_high, method: data.metric.method, institution: data.metric.institution, date: data.date, source: data.source, is_private: data.private ? 1 : 0 })
      }
      paint({ keepScroll: true })
      toast('演示态：已加入本页内存，刷新会重置')
      if (mode !== 'continue') navigate('dash')
    }
  }
  function togglePrivacy(id, kind, current) {
    var next = !current
    if (state.api) {
      post('/privacy', { profileKey: profile().id, kind: kind, id: id, private: next }).then(function (res) {
        applyBootstrap(res.bootstrap); toast(next ? '已设为私密：列表与导出不再显示' : '已取消私密')
      }).catch(function (e) { toast('切换失败：' + e.message, 'error') })
    } else {
      var p = profile()
      var e = (p.entries || []).find(function (x) { return x.id === id })
      if (e) e.is_private = next ? 1 : 0
      if (next) {
        p.privateEntries = p.privateEntries || []
        p.privateEntries.push(e)
        p.entries = p.entries.filter(function (x) { return x.id !== id })
      }
      paint({ keepScroll: true }); toast('演示态：私密标记只在本页内存')
    }
  }
  function unprivateEntry(id) {
    if (state.api) {
      post('/privacy', { profileKey: profile().id, kind: 'entry', id: id, private: false }).then(function (res) { applyBootstrap(res.bootstrap); toast('已取消私密') }).catch(function (e) { toast('失败：' + e.message, 'error') })
    } else {
      var p = profile()
      var e = (p.privateEntries || []).find(function (x) { return x.id === id || x.id === String(id).replace(/^.*-/, '') })
      if (e) { e.is_private = 0; p.entries.unshift(e); p.privateEntries = p.privateEntries.filter(function (x) { return x !== e }) }
      paint({ keepScroll: true }); toast('演示态：已取消私密')
    }
  }
  function saveTrial(key, stateValue) {
    var p = profile()
    var chosen = stateValue || 'in_followup'
    if (state.api) {
      post('/saved-trials', { profileKey: p.id, trialKey: key, state: chosen }).then(function (res) { applyBootstrap(res.bootstrap); toast('已收藏到本机') }).catch(function (e) { toast('收藏失败：' + e.message, 'error') })
    } else {
      p.saved_trials = p.saved_trials || []
      var found = p.saved_trials.find(function (s) { return s.trialKey === key })
      if (found) found.state = chosen
      else p.saved_trials.push({ id: 'local-s' + Date.now(), trialKey: key, state: chosen, savedOn: state.data.TODAY })
      paint({ keepScroll: true }); toast('演示态：收藏只在本页内存')
    }
  }
  function exportSummary() {
    var p = profile()
    var metrics = (p.metrics || []).slice(-12)
    var entries = (p.entries || []).filter(function (e) { return !Number(e.is_private) }).slice(0, 20)
    var html = '<!doctype html><meta charset="utf-8"><title>' + esc(p.name) + ' · 复诊摘要</title><style>body{font:14px/1.7 -apple-system,"PingFang SC",sans-serif;max-width:760px;margin:30px auto;padding:0 18px;color:#1e2a24}h1{font-size:22px}table{border-collapse:collapse;width:100%;margin:12px 0}td,th{border-bottom:1px solid #ddd;padding:6px 4px;text-align:left;font-size:12px}h2{font-size:15px;margin-top:24px}small{color:#666}</style>' +
      '<h1>' + esc(p.name) + ' · 复诊摘要</h1><p>生成日期 ' + fmtDate(state.data.TODAY) + ' · 亚型 ' + esc(p.subtype || '未填') + ' · 确诊 ' + fmtDate(p.diagnosed_on) + '</p><p><b>这是患者自记整理，不是诊断或治疗建议。</b></p>' +
      '<h2>最近指标</h2><table><tr><th>日期</th><th>指标</th><th>值</th><th>参考</th><th>来源</th></tr>' + metrics.map(function (m) { return '<tr><td>' + fmtDate(m.date) + '</td><td>' + esc(m.label) + '</td><td>' + fmtNum(m.value) + ' ' + esc(m.unit || '') + '</td><td>' + (m.ref_low == null && m.ref_high == null ? '—' : fmtNum(m.ref_low) + '–' + fmtNum(m.ref_high)) + '</td><td>' + esc(m.source || '') + '</td></tr>' }).join('') + '</table>' +
      '<h2>最近记录</h2>' + entries.map(function (e) { return '<p><b>' + fmtDate(e.date) + ' · ' + esc(e.title) + '</b><br>' + esc(e.body || '') + '</p>' }).join('') +
      '<h2>想问医生</h2>' + (p.entries || []).filter(function (e) { return e.kind === 'question' }).map(function (q) { return '<p>· ' + esc(q.title) + '<br><small>' + esc(q.body || '') + '</small></p>' }).join('') +
      '<p><small>私密记录已排除。本页由 TRAPS 工作台在本机生成。</small></p>'
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'TRAPS-复诊摘要-' + state.data.TODAY + '.html'; a.click()
    setTimeout(function () { URL.revokeObjectURL(a.href) }, 2000)
    toast('已生成摘要文件（私密记录未包含）')
  }
  function askTrialAI() {
    var p = profile()
    var prompt = '请只根据我档案里已记录的内容，帮我整理临床研究页的候选线索：列出每条试验的登记号、我记录里对得上的字段、对不上或待确认的字段，并列出 3 个我下次问医生的问题。不要判断我是否符合入组条件，不要建议我参加或放弃。档案：' + p.name + '；亚型：' + (p.subtype || '未填') + '。'
    if (!isHost) { toast('AI 对话由 DSH 宿主提供；独立打开时不可用。'); return }
    window.parent.postMessage({ type: 'traps:agent-draft', prompt: prompt }, location.origin)
    toast('已把整理请求填入 AI 草稿；请确认后自行发送。')
  }

  /* ---------------- 事件 ---------------- */
  document.addEventListener('click', function (e) {
    var nav = e.target.closest('[data-nav]')
    if (nav) { navigate(nav.getAttribute('data-nav')); return }
    var closeModalEl = e.target.closest('[data-close-modal]')
    if (closeModalEl && (e.target === closeModalEl || closeModalEl.classList.contains('modal-close'))) { closeModal(); return }
    var sel = e.target.closest('[data-select-profile]')
    if (sel) { state.profileId = sel.getAttribute('data-select-profile'); try { localStorage.setItem('traps.profileId', state.profileId) } catch (_) {} closeModal(); paint(); toast('已切换档案'); return }
    var closeDrawerEl = e.target.closest('[data-close-drawer]')
    if (closeDrawerEl && (e.target === closeDrawerEl || closeDrawerEl.classList.contains('close'))) { closeDrawer(); return }
    var action = e.target.closest('[data-action]')
    if (!action) return
    var a = action.getAttribute('data-action')
    if (a === 'profiles') openProfiles()
    else if (a === 'new-record') openRecord(action.getAttribute('data-kind'))
    else if (a === 'cancel-record') navigate('dash')
    else if (a === 'flip-metric') { var pressed = action.getAttribute('aria-pressed') === 'true'; action.setAttribute('aria-pressed', pressed ? 'false' : 'true') }
    else if (a === 'metrics-view') { state.metricsView = action.getAttribute('data-view'); paint({ keepScroll: true }) }
    else if (a === 'trial-detail') { state.trialDetail = action.getAttribute('data-key'); renderDrawer() }
    else if (a === 'save-trial') { saveTrial(action.getAttribute('data-key')); }
    else if (a === 'save-state') { saveTrial(action.getAttribute('data-key'), action.getAttribute('data-state')) }
    else if (a === 'reject-trial') { state.savedHidden[action.getAttribute('data-key')] = true; paint({ keepScroll: true }); toast('本次已从列表隐藏；没有改动档案或快照。') }
    else if (a === 'ask-ai-trials') askTrialAI()
    else if (a === 'pick-dir') chooseDir()
    else if (a === 'export-summary') exportSummary()
    else if (a === 'print-summary') window.print()
    else if (a === 'toggle-private') togglePrivacy(action.getAttribute('data-id'), action.getAttribute('data-kind'), action.getAttribute('data-private') === '1')
    else if (a === 'unprivate-entry') unprivateEntry(action.getAttribute('data-id'))
    else if (a === 'clear-search') { state.trialFilters = { keyword: '', subtype: '', status: '', phase: '', country: '', sort: 'updated' }; paint({ keepScroll: true }) }
  })
  document.addEventListener('click', function (e) {
    var tab = e.target.closest('[data-trial-tab]')
    if (tab) { state.trialTab = tab.getAttribute('data-trial-tab'); paint({ keepScroll: true }) }
    var stab = e.target.closest('[data-settings-tab]')
    if (stab) { state.settingsTab = stab.getAttribute('data-settings-tab'); paint({ keepScroll: true }) }
    var kind = e.target.closest('[data-kind-btn]')
    if (kind) { state.recordKind = kind.getAttribute('data-kind-btn'); state.page = 'record'; paint({ keepScroll: true }) }
  })
  document.addEventListener('submit', function (e) {
    if (e.target.id === 'record-form') { e.preventDefault(); submitRecord(e.target, e.submitter && e.submitter.getAttribute('data-mode')); return }
    if (e.target.id === 'profile-form') {
      e.preventDefault()
      var fd = new FormData(e.target)
      var body = { name: fd.get('name'), subtype: fd.get('subtype'), diagnosed_on: fd.get('diagnosed_on'), tag: fd.get('tag') }
      if (!body.name) { toast('档案名称必填', 'error'); return }
      if (state.api) {
        post('/subjects', body).then(function (res) {
          state.profileId = res.profileKey
          try { localStorage.setItem('traps.profileId', state.profileId) } catch (_) {}
          applyBootstrap(res.bootstrap); closeModal(); toast('已创建并切换；is_demo=0，已写入本机')
        }).catch(function (err) { toast('创建失败：' + err.message, 'error') })
      } else {
        var p = { id: 'local-p' + Date.now(), profile_key: 'local-p', name: body.name, tag: body.tag || '我的档案', subtype: body.subtype || '', diagnosed_on: body.diagnosed_on || '', summary: '还没有记录。从一条检验报告或症状开始。', is_demo: 0, facts: body.subtype ? [{ field: 'subtype', label: '亚型', value: body.subtype, source: '用户自填', confirmed: 1 }] : [], metrics: [], entries: [], treatments: [], saved_trials: [], privateEntries: [] }
        state.data.profiles.push(p); state.profileId = p.id; try { localStorage.setItem('traps.profileId', p.id) } catch (_) {} closeModal(); paint(); toast('演示态：新档案只在本页内存，刷新会重置')
      }
      return
    }
    if (e.target.id === 'trial-search-form') {
      e.preventDefault()
      var sf = new FormData(e.target)
      state.trialFilters = { keyword: sf.get('keyword') || '', subtype: sf.get('subtype') || '', status: sf.get('status') || '', phase: sf.get('phase') || '', country: sf.get('country') || '', sort: state.trialFilters.sort }
      paint({ keepScroll: true })
    }
  })
  document.addEventListener('change', function (e) {
    if (e.target.id === 'f-metric') {
      var opt = e.target.options[e.target.selectedIndex]
      var unit = $('#f-unit'); if (unit && opt) unit.value = opt.getAttribute('data-unit') || ''
    }
  })
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return
    if (state.trialDetail) { closeDrawer(); return }
    if (modalRoot.innerHTML) { closeModal(); return }
  })
  document.addEventListener('click', function (e) {
    if (e.target.id === 'dir-btn') { chooseDir(); return }
    if (e.target.id === 'ai-btn') {
      if (isHost) window.parent.postMessage({ type: 'traps:agent-open' }, location.origin)
      else toast('AI 对话由 DSH 宿主提供；独立打开时不可用。')
    }
  })
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin) return
    var d = e.data
    if (!d || typeof d !== 'object') return
    if (d.type === 'traps:root-changed') { if (d.dir) toast('资料目录已切换：' + d.dir); refresh() }
    if (d.type === 'traps:primer-open') { var trigger = document.querySelector('[data-primer-open][data-primer-entry="status"]'); if (trigger) trigger.click() }
    if (d.type === 'traps:focus') { /* 宿主切回业务区 */ }
  })
  function refresh() {
    if (!state.api) return
    fetch(API + '/bootstrap', { credentials: 'same-origin' }).then(function (r) { return r.json() }).then(applyBootstrap).catch(function () {})
  }

  /* 把应用暴露给探针：只读 + 导航，不用于隐藏逻辑 */
  window.TRAPSApp = {
    state: state,
    nav: navigate,
    refresh: refresh,
    openPrimer: function () { var b = document.querySelector('[data-primer-open][data-primer-entry="status"]'); if (b) b.click() }
  }
  boot()
})();
