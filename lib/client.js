window.__ModuleLoader__.load({
  id: "@xyb-community/traps-workbench",
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const META = {"title":"TRAPS 患者工作台","description":"面向肿瘤坏死因子受体相关周期性综合征（TRAPS）患者与家长照护者的本机病程资料、发热发作记录、炎症指标随访、发作期与间期治疗管理、就诊准备工作台设计项目"}
    const theme = "/* Scope to business content; never style host navigation globally. */\n.wb-traps-workbench {\n  --wb-paper: #f7faf8; --wb-surface: #ffffff; --wb-ink: #34413c;\n  --wb-muted: #596c62; --wb-line: #dce7df; --wb-mint: #e2f2ea;\n  --wb-mint-ink: #22664e; --wb-action: #b95023; --wb-action-ink: #ffffff;\n  --wb-pink: #f8e8eb; --wb-blue: #eaf1f6; --wb-yellow: #faf2d8;\n  --wb-radius: 18px; --wb-gap: 16px; --wb-group-gap: 24px;\n  color: var(--wb-ink); background: var(--wb-paper); font: 16px/1.65 -apple-system,BlinkMacSystemFont,\"PingFang SC\",\"Microsoft YaHei\",sans-serif;\n  font-variant-numeric: tabular-nums; min-width: 0; min-height: 0; container-type: inline-size;\n}\n.wb-traps-workbench[data-font=large] { font-size: 19px; }\n.wb-traps-workbench * { box-sizing: border-box; }\n.wb-traps-workbench button,.wb-traps-workbench input,.wb-traps-workbench select { font: inherit; }\n.wb-traps-workbench button { min-height: 44px; cursor: pointer; }\n.wb-traps-workbench :focus-visible { outline: 3px solid var(--wb-mint-ink); outline-offset: 3px; }\n.wb-traps-workbench .wb-primary { background: var(--wb-action); color: var(--wb-action-ink); border: 0; border-radius: 999px; padding: 9px 20px; }\n.wb-traps-workbench .wb-flower { display: inline-block; width: 24px; height: 24px; flex: 0 0 auto; margin-inline-end: 10px; animation: wb-flower-turn 12s linear infinite; }\n@keyframes wb-flower-turn { to { transform: rotate(360deg); } }\n@media (prefers-color-scheme: dark) {\n  .wb-traps-workbench { --wb-paper:#17231f; --wb-surface:#20322a; --wb-ink:#edf5ef; --wb-muted:#c0d2c6; --wb-line:#496354; --wb-mint:#294f3f; --wb-mint-ink:#a0ddbd; --wb-action:#f3a578; --wb-action-ink:#39200e; --wb-pink:#45333a; --wb-blue:#283d4c; --wb-yellow:#473e25; }\n}\n@media (prefers-reduced-motion: reduce) {\n  .wb-traps-workbench .wb-flower { animation:none; }\n}\n"
    const UI_ENTRY = '/api/traps/ui/'
    const DATA_ROOT_URL = '/api/traps/api/root'
    /* 资料目录硬拒口径：主目录本身 / 桌面 / 下载根目录 / tmp（客户端与服务端各判一遍，服务端在 dsh/server.js 二次校验）。 */
    const FORBIDDEN_DIR = /((Desktop|桌面)$|(Downloads?|下载(夹)?)$|^(\/tmp|\/private\/tmp|\/var\/folders\/|\/private\/var\/folders\/))/i
    const isForbiddenDir = (dir) => FORBIDDEN_DIR.test(String(dir || ''))
    const frameStyle = { width: '100%', height: '100%', border: 0, background: 'var(--wb-surface, #fff)' }

    /* ---- 原生 AI 对话面板：宽度与草稿常量（家族同一契约） ----
     * 为什么骨架就带这套接线：check-agent-pane-contract 是 init check 链的一员，
     * 骨架若不接线，新仓第一天基线必红（2026-11-12 cidp-workbench 夜班实测，
     * 回流见 docs/LESSONS.md L90）。这里是与家族仓同一套判定：会话归属看
     * service.ownsSession / currentSession，不用 conversation prop 的真值判断
     * （customFrame 下宿主恒传一个隐藏的 conversation 容器，真值判断必误判）。 */
    const AGENT_MIN = 0.25
    const AGENT_MAX = 0.45
    const AGENT_DEFAULT = 0.35
    const AGENT_STEP = 0.02
    const NARROW_BELOW = 900
    const DRAWER_MAX = 420
    const WIDTH_KEY = 'traps-workbench.agentWidth'
    const DRAFT_KEY = 'traps-workbench.agentDraft'
    const NO_SESSION_CAPABILITY_NOTE = '宿主没有提供会话创建能力（service.newSession 不可用），AI 对话暂时打不开。'

    function loadWidth() {
      try {
        const saved = Number(localStorage.getItem(WIDTH_KEY))
        if (Number.isFinite(saved) && saved >= AGENT_MIN && saved <= AGENT_MAX) return saved
      } catch { /* 隐私模式忽略 */ }
      return AGENT_DEFAULT
    }
    function saveWidth(value) {
      try { localStorage.setItem(WIDTH_KEY, String(value)) } catch { /* 隐私模式忽略 */ }
    }
    const round4 = (n) => Math.round(n * 10000) / 10000
    const snapWidth = (n) => Math.min(AGENT_MAX, Math.max(AGENT_MIN, n))

    function buildPanel(React, host) {
      const { useState, useEffect, useRef } = React
      const service = host?.desktopWorkbenches

      /* ---------------- 会话归属（与家族各仓同一套判定） ---------------- */

      function currentSession() {
        if (typeof service?.currentSession === 'function') return service.currentSession() || null
        const snapshot = host?.sessions?.list?.getSnapshot?.()
        return snapshot?.current || Object.keys(snapshot?.byId || {}).find((id) =>
          (snapshot.byId[id]?.retainedBy?.mainView ?? 0) > 0) || null
      }
      function workbenchOwnsSession(sessionId) {
        if (!sessionId) return false
        return typeof service?.ownsSession === 'function' ? Boolean(service.ownsSession(sessionId)) : false
      }
      function ownedSession() {
        const id = currentSession()
        return workbenchOwnsSession(id) ? id : null
      }

      /* ---------------- 原生草稿：只填不发 ---------------- */

      function appendDraft(sessionId, prompt) {
        if (!sessionId || ownedSession() !== sessionId) throw new Error('会话已切换，请回到本工作台再操作')
        const scoped = host.sessions.scope?.(sessionId)
        const conversation = scoped?.get?.('conversation')
        if (!conversation) throw new Error('对话输入不可用')
        const input = conversation.input.for(scoped)
        const snapshot = input.state.getSnapshot()
        if (snapshot.occurrences?.length || (snapshot.phase && snapshot.phase !== 'plain')) {
          throw new Error('当前草稿含引用或正在提交，请先在原生会话里处理')
        }
        const current = snapshot.draft || ''
        input.setDraft(current.trim() ? `${current}\n\n${prompt}` : prompt)
      }

      let pendingDraft = null
      try {
        const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')
        if (saved?.sessionId && saved?.prompt) pendingDraft = saved
      } catch { /* 隐私模式忽略 */ }
      function rememberDraft(entry) {
        pendingDraft = entry
        try {
          if (entry) localStorage.setItem(DRAFT_KEY, JSON.stringify(entry))
          else localStorage.removeItem(DRAFT_KEY)
        } catch { /* 隐私模式忽略 */ }
      }
      function flushDraft() {
        if (!pendingDraft) return false
        try {
          appendDraft(pendingDraft.sessionId, pendingDraft.prompt)
          rememberDraft(null)
          return true
        } catch { return false /* composer 未就绪：留到下一轮 */ }
      }

      function onboardingPrompt() {
        return [
          `你正在协助我使用「${META.title}」。它只整理本机资料，不做诊断、不给处置建议、不做病情判定。`,
          '里面是我自己记录的病程与检查经过；分工：你帮我汇总已记录的内容、指出缺项；判断和处置由我和我的医生决定。',
          '没有记录的项请写"没有"，不要补写或推测；标了私密的内容不要复述。',
        ].join('\n')
      }

      /* ---------------- 样式（骨架阶段内联；M5 移植 public 主题） ---------------- */

      const rootStyle = { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--wb-paper, #f7faf8)' }
      const headerStyle = {
        display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', padding: '10px 16px',
        borderBottom: '1px solid var(--wb-line, #dce7df)', minHeight: 38,
        paddingInlineStart: 'var(--dsh-frame-leading-clearance, 0px)',
      }
      const hintStyle = { marginLeft: 'auto', color: 'var(--wb-muted, #596c62)', fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
      const bodyStyle = { position: 'relative', flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }
      const businessStyle = { flex: '1 1 auto', minWidth: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16, padding: 20 }
      const paneStyle = {
        position: 'relative', flex: '0 0 auto', display: 'flex', flexDirection: 'column',
        minHeight: 0, overflow: 'hidden', background: 'var(--wb-surface, #fff)', borderLeft: '1px solid var(--wb-line, #dce7df)',
      }
      const drawerStyle = { position: 'absolute', inset: '0 0 0 auto', borderLeft: '1px solid var(--wb-line, #dce7df)', boxShadow: '-8px 0 24px rgba(0,0,0,0.14)' }
      const splitterStyle = {
        position: 'absolute', top: 0, bottom: 0, width: 1, marginRight: -0.5,
        zIndex: 2, background: 'var(--wb-line, #dce7df)', cursor: 'col-resize', touchAction: 'none',
      }
      const splitterHoverStyle = { ...splitterStyle, background: 'var(--wb-action, #b95023)', boxShadow: '0 0 6px rgba(185,80,35,0.55)' }
      const splitterDragStyle = { ...splitterHoverStyle, boxShadow: '0 0 10px rgba(185,80,35,0.8)' }
      const splitterHitStyle = { position: 'absolute', top: 0, bottom: 0, left: -5, width: 11, background: 'transparent', cursor: 'col-resize' }
      const dragShieldStyle = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 4, cursor: 'col-resize', background: 'transparent', touchAction: 'none' }
      const buttonStyle = { minHeight: 30, border: 0, borderRadius: 999, padding: '5px 12px', whiteSpace: 'nowrap', background: 'var(--wb-action, #b95023)', color: 'var(--wb-action-ink, #fff)', font: 'inherit', fontWeight: 600, cursor: 'pointer' }
      const ghostStyle = { ...buttonStyle, background: 'transparent', color: 'var(--wb-action, #b95023)', border: '1px solid var(--wb-line, #dce7df)' }
      const padStyle = { display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', padding: 20, color: 'var(--wb-muted, #596c62)', fontSize: 12.5, lineHeight: 1.75 }
      const cardStyle = { background: 'var(--wb-surface, #fff)', border: '1px solid var(--wb-line, #dce7df)', borderRadius: 'var(--wb-radius, 18px)', padding: 20 }

      return function Panel({ conversation }) {
        const [health, setHealth] = useState(null)
        const [error, setError] = useState('')
        const [large, setLarge] = useState(false)
        const [attempt, setAttempt] = useState(0)
        const [width, setWidth] = useState(loadWidth)
        const [paneOpen, setPaneOpen] = useState(true)
        const [connecting, setConnecting] = useState(false)
        const [narrow, setNarrow] = useState(false)
        const [dragging, setDragging] = useState(false)
        const [hovering, setHovering] = useState(false)
        const [dataDir, setDataDir] = useState('')
        const [dirNote, setDirNote] = useState('')
        const [note, setNote] = useState('')
        const [, setSessionRevision] = useState(0)

        const dragHostRef = useRef(null)
        const frameRef = useRef(null)
        const creatingRef = useRef(false)

        /* customFrame 下宿主始终传 conversation 容器；无会话时只是 display:none。
           用归属服务判断当前工作台是否真的有会话，不能用 prop 是否为真值。 */
        const activeSession = ownedSession()
        const hasConversation = Boolean(activeSession)
        const canOpenSession = typeof service?.newSession === 'function'

        useEffect(() => {
          setError('')
          const controller = new AbortController()
          fetch('/api/traps-workbench/health', { signal: controller.signal, credentials: 'same-origin' })
            .then(async (response) => {
              if (!response.ok) throw new Error(`服务连接失败 (${response.status})`)
              const result = await response.json()
              if (!controller.signal.aborted) setHealth(result)
            })
            .catch((failure) => { if (!controller.signal.aborted) setError(failure.message) })
          return () => controller.abort()
        }, [attempt])

        // 挂载后消化未送达的草稿（composer 就绪一轮一次），并订阅会话变化触发重渲染。
        useEffect(() => {
          const interval = setInterval(() => { if (flushDraft()) setNote('草稿已填入会话，按回车发送') }, 500)
          const unsubscribe = service?.subscribe?.(() => {
            setSessionRevision((revision) => revision + 1)
            setNote('')
          })
          return () => { clearInterval(interval); unsubscribe?.() }
        }, [])

        // 窄屏判定用容器宽度而不是窗口宽度：宿主主区宽度不等于窗口宽度。
        useEffect(() => {
          const node = dragHostRef.current
          if (!node || typeof ResizeObserver !== 'function') return undefined
          const observer = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect?.width ?? 0
            setNarrow(w > 0 && w < NARROW_BELOW)
          })
          observer.observe(node)
          return () => observer.disconnect()
        }, [])

        const applyWidth = (next) => {
          const snapped = round4(snapWidth(next))
          setWidth(snapped)
          saveWidth(snapped)
        }
        const stopDrag = () => { dragHostRef.current = null; setDragging(false) }

        useEffect(() => {
          if (!dragging) return undefined
          const onMove = (event) => {
            const rect = dragHostRef.current?.getBoundingClientRect?.()
            if (!rect?.width) return
            applyWidth((rect.right - event.clientX) / rect.width)
          }
          document.addEventListener('pointermove', onMove)
          document.addEventListener('pointerup', stopDrag)
          document.addEventListener('pointercancel', stopDrag)
          return () => {
            document.removeEventListener('pointermove', onMove)
            document.removeEventListener('pointerup', stopDrag)
            document.removeEventListener('pointercancel', stopDrag)
          }
        }, [dragging])

        const onSplitterPointerDown = (event) => {
          event.preventDefault()
          try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* 旧宿主无指针捕获 */ }
          dragHostRef.current = dragHostRef.current || event.currentTarget.parentElement
          setDragging(true)
        }
        const onSplitterKeyDown = (event) => {
          const delta = { ArrowLeft: AGENT_STEP, ArrowRight: -AGENT_STEP }[event.key]
          if (delta !== undefined) { event.preventDefault(); applyWidth(width + delta); return }
          if (event.key === 'Home') { event.preventDefault(); applyWidth(AGENT_MAX); return }
          if (event.key === 'End') { event.preventDefault(); applyWidth(AGENT_MIN) }
        }

        /* 当前资料目录：开面板读一次；切换后立即回显。读不到就不显示，别编一个路径。 */
        const refreshDataDir = React.useCallback(() => {
          fetch(DATA_ROOT_URL, { credentials: 'same-origin' })
            .then((rsp) => (rsp.ok ? rsp.json() : null))
            .then((info) => { if (info && info.dir) setDataDir(info.dir) })
            .catch(() => { /* 未连接就不显示，不编造路径 */ })
        }, [])
        useEffect(() => { refreshDataDir() }, [refreshDataDir])

        /* 「配置目录」= 真入口：宿主选择器 → 口径校验 → 落盘 → 回显。
           「本原型为示意，目录未真实挂载」只允许出现在宿主没有选择能力的降级路径。 */
        const pickDataDir = React.useCallback(async () => {
          const ui = service?.uiWorkspace
          if (!ui || typeof ui.pickDirectory !== 'function') {
            const error = '本原型为示意，目录未真实挂载：当前宿主没有提供目录选择能力，数据仍写在默认位置。'
            setDirNote(error)
            return { ok: false, error }
          }
          let dir = ''
          try { dir = await ui.pickDirectory() } catch (failure) {
            const error = '没能打开目录选择器：' + ((failure && failure.message) || failure)
            setDirNote(error)
            return { ok: false, error }
          }
          if (!dir) {
            const error = '已取消选择目录；当前资料目录没有更改。'
            setDirNote(error)
            return { ok: false, error }
          }
          if (isForbiddenDir(dir)) {
            const error = '这个位置不能当资料目录（主目录本身 / 桌面 / 下载根目录 / tmp）。请在里面新建一个专用文件夹再选。'
            setDirNote(error)
            return { ok: false, error }
          }
          try {
            const rsp = await fetch(DATA_ROOT_URL, {
              method: 'POST', credentials: 'same-origin',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ dir }),
            })
            const body = await rsp.json().catch(() => ({}))
            if (!rsp.ok) {
              const error = body.error || body.detail || '目录切换失败'
              setDirNote(error)
              return { ok: false, error }
            }
            const finalDir = body.dir || dir
            setDataDir(finalDir)
            setDirNote('资料目录已切换到：' + finalDir + '（旧目录数据不会自动搬迁）')
            /* 业务区必须跟着换库：否则它还在用旧档案键写新库，保存会报"档案不存在"。 */
            try {
              frameRef.current?.contentWindow?.postMessage({ type: 'traps-workbench:root-changed', dir: finalDir }, window.location.origin)
            } catch { /* iframe 已卸载 */ }
            return { ok: true, dir: finalDir }
          } catch (failure) {
            const error = '目录切换失败：' + ((failure && failure.message) || failure)
            setDirNote(error)
            return { ok: false, error }
          }
        }, [])

        /* ---- 打开 / 复用 AI 会话（不自动发送） ---- */

        async function openAgent(prompt = null) {
          setNote('')
          if (!canOpenSession) { setNote(NO_SESSION_CAPABILITY_NOTE); return }
          const existing = ownedSession()
          if (existing) {
            setPaneOpen(true)
            if (prompt) {
              rememberDraft({ sessionId: existing, prompt })
              setNote(flushDraft() ? '已填入会话草稿，按回车发送' : '会话输入框还没就绪；内容已暂存')
            }
            return
          }
          // 快速连点时不并发创建出两条会话。
          if (creatingRef.current) return
          creatingRef.current = true
          setConnecting(true)
          try {
            // 优先用宿主默认工作区；没有可用工作区时把 undefined 交给宿主，
            // 由宿主按它的流程提示选择资料目录，并负责创建、绑定和激活会话。
            let workspaceId
            try { workspaceId = service.defaultWorkspace?.()?.workspaceId } catch { workspaceId = undefined }
            const id = await service.newSession(workspaceId)
            if (!id) {
              setNote('已取消资料目录选择，没有创建会话。可以再次点击「AI 对话」重试。')
              return
            }
            setPaneOpen(true)
            rememberDraft({ sessionId: id, prompt: prompt || onboardingPrompt() })
            setNote(flushDraft()
              ? '会话已就绪：草稿已填入右侧输入框，按回车发送'
              : '会话已就绪；输入框就绪后草稿会自动填入')
          } catch (error) {
            setNote(`没能调起会话：${error?.message ?? error}。可以再次点击「AI 对话」重试。`)
          } finally {
            creatingRef.current = false
            setConnecting(false)
          }
        }

        function onAgentClick() {
          if (!hasConversation) { void openAgent(); return }
          setPaneOpen((open) => !open)
          setNote('')
        }

        async function deliverContext(prompt) {
          const id = ownedSession()
          if (id) {
            setPaneOpen(true)
            rememberDraft({ sessionId: id, prompt })
            setNote(flushDraft() ? '已填入会话草稿，按回车发送' : '会话输入框还没就绪；内容已暂存')
            return
          }
          await openAgent(prompt)
        }

        // 业务页只认「自己 + 同源」发来的消息；handler 每轮换最新闭包，effect 只注册一次。
        const deliverRef = useRef(null)
        deliverRef.current = deliverContext
        useEffect(() => {
          function onMessage(event) {
            const data = event.data
            if (!data || typeof data !== 'object') return
            if (frameRef.current && event.source !== frameRef.current.contentWindow) return
            if (event.origin !== window.location.origin) return
            if (data.type === 'traps-workbench:agent-open') { void openAgent(); return }
            if (data.type === 'traps-workbench:pick-directory') {
              void pickDataDir().then((result) => {
                try {
                  frameRef.current?.contentWindow?.postMessage({ type: 'traps-workbench:directory-result', ...result }, window.location.origin)
                } catch { /* iframe 已卸载 */ }
              })
              return
            }
            /* 外链三步兜底（docs/40 §1.4 / L129）：业务页 window.open 返回空时发 <pkg>:open-external，壳层代开。 */
            if (data.type === 'traps-workbench:open-external' && typeof data.url === 'string' && /^https?:/i.test(data.url)) {
              try { window.open(data.url, '_blank', 'noopener') } catch { /* 沙箱拦截是静默的 */ }
              return
            }
            if (data.type !== 'traps-workbench:agent-draft') return
            const prompt = typeof data.prompt === 'string' ? data.prompt.trim() : ''
            if (prompt) void deliverRef.current?.(prompt.slice(0, 8000))
          }
          window.addEventListener('message', onMessage)
          return () => window.removeEventListener('message', onMessage)
        }, [])

        const agentLabel = !canOpenSession
          ? 'AI 对话暂不可用'
          : connecting ? '正在连接…'
            : !hasConversation ? 'AI 对话'
              : paneOpen ? '收起 AI 对话' : '打开 AI 对话'
        // 能力缺失时的说明不能被会话订阅回调里的 setNote('') 冲掉：渲染期兜一层。
        const shownNote = note || (canOpenSession ? '' : NO_SESSION_CAPABILITY_NOTE)

        const percent = Math.round(width * 100)
        const paneVisible = paneOpen && (hasConversation || connecting)

        return h('main', { className: 'wb-traps-workbench', 'data-font': large ? 'large' : 'standard', style: rootStyle },
          // 首个子元素必须是语义 <header>：避让 macOS 窗口按钮（--dsh-frame-leading-clearance）。
          h('header', { style: headerStyle },
            h('strong', null, META.title),
            h('span', { 'aria-live': 'polite' }, health ? `v${health.version}` : '连接中'),
            h('button', {
              type: 'button',
              style: ghostStyle,
              onClick: () => { void pickDataDir() },
              'aria-label': dataDir ? `配置目录：当前 ${dataDir}` : '配置资料目录',
              title: dirNote || (dataDir ? `当前资料目录：${dataDir}` : '选择本机资料目录'),
            }, dataDir ? '配置目录 · 已设' : '配置目录'),
            h('button', { type: 'button', 'aria-pressed': large, onClick: () => setLarge(!large) }, large ? '标准字' : '大字'),
            h('span', { style: hintStyle, title: shownNote || '界面由业务区提供' },
              shownNote || dirNote || '本机数据 · 仅回顾不解读'),
            h('button', {
              type: 'button',
              style: buttonStyle,
              onClick: onAgentClick,
              disabled: connecting || (!hasConversation && !canOpenSession),
              'aria-label': `AI 对话：${agentLabel}`,
            }, agentLabel),
            hasConversation && paneOpen && h('button', {
              type: 'button', style: ghostStyle, onClick: () => setPaneOpen(false),
              'aria-label': '收起 AI 对话面板',
            }, '×')),
          h('style', null, theme),
          h('div', { ref: dragHostRef, style: bodyStyle },
            h('div', { style: businessStyle },
              h('iframe', {
                ref: frameRef,
                src: UI_ENTRY,
                title: '小热宝 · TRAPS 工作台',
                style: frameStyle,
                sandbox: 'allow-scripts allow-same-origin allow-forms allow-downloads allow-popups allow-popups-to-escape-sandbox',
                onLoad: () => { setError(''); setNote('') },
              })),
            // 分隔线夹在业务区与会话之间；业务区 = public/index.html 的 iframe（UI_ENTRY）。
            !narrow && paneVisible && h('div', {
              role: 'separator',
              'aria-orientation': 'vertical',
              'aria-label': '调整 AI 对话面板宽度',
              'aria-valuemin': Math.round(AGENT_MIN * 100),
              'aria-valuemax': Math.round(AGENT_MAX * 100),
              'aria-valuenow': percent,
              tabIndex: 0,
              style: {
                ...(dragging ? splitterDragStyle : hovering ? splitterHoverStyle : splitterStyle),
                right: `${percent}%`,
              },
              onPointerDown: onSplitterPointerDown,
              onPointerEnter: () => setHovering(true),
              onPointerLeave: () => setHovering(false),
              onKeyDown: onSplitterKeyDown,
            },
              h('span', { style: splitterHitStyle, 'aria-hidden': 'true' })),
            // 原生会话始终挂载：隐藏走 display，不卸载（否则丢输入框与草稿状态）。
            h('aside', {
              style: {
                ...paneStyle,
                ...(narrow ? drawerStyle : null),
                width: narrow ? `min(92%, ${DRAWER_MAX}px)` : `${percent}%`,
                display: paneVisible ? 'flex' : 'none',
              },
              'aria-label': 'AI 对话',
              'aria-hidden': paneVisible ? undefined : 'true',
            }, hasConversation && conversation ? conversation : h('div', { style: padStyle },
              h('b', null, connecting ? '正在准备 AI 对话' : 'AI 对话还没开始'),
              h('span', null, connecting
                ? '宿主正在恢复会话或等待你选择资料目录。'
                : '点顶栏「AI 对话」创建或打开本工作台的原生会话。'),
              h('span', null, '没有会话也不影响记录：业务区的资料整理照常可用。'))),
            dragging && !narrow && h('div', { 'aria-hidden': 'true', style: dragShieldStyle })))
      }
    }

    function apply(ctx) {
      const Panel = buildPanel(React, ctx)
      ctx.effect(() => ctx.desktopWorkbenches.register({"title":"TRAPS 患者工作台","repository":"https://github.com/xyb-openharness-dsh-plugins/traps-workbench","description":"面向肿瘤坏死因子受体相关周期性综合征（TRAPS）患者与家长照护者的本机病程资料、发热发作记录、炎症指标随访、发作期与间期治疗管理、就诊准备工作台设计项目","customFrame":true}, Panel))
    }
    return { apply, inject: ['desktopWorkbenches'] }
  }
})
