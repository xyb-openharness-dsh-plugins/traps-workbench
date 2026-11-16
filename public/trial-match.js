/* 临床试验粗筛：只读患者已确认字段与快照真实字段。
   pct = 符合 ÷ 已对照；待确认按 0 计（只会偏低）；可对照 <2 不给百分数。
   这不是入组资格，也不代表效果；证据链里的每条都要能回溯到记录或登记原文。快照会过期。 */
(function (global) {
  'use strict'
  var TIER = { perfect: '字段都对得上', partial: '部分对得上', needs: '需补充信息', hard: '硬性条件不满足' }

  function norm(value) { return String(value == null ? '' : value).toLowerCase() }
  function fact(profile, field) {
    return (profile && profile.facts || []).find(function (f) { return f.field === field && Number(f.confirmed) === 1 })
  }
  function factValue(profile, field) { var f = fact(profile, field); return f ? norm(f.value) : '' }
  function reqText(trial) { return norm([trial.eligibilityText, trial.conditions && trial.conditions.join(' '), trial.title].join(' ')) }
  function sourceOf(profile, field) { var f = fact(profile, field); return f && f.source || '档案未记录' }

  /* 每条判据只用一个真实字段；找不到结构化值就标 unknown，并写“需核方案原文”。 */
  function calcTrialMatch(profile, trial, preferences) {
    var criteria = []
    var sub = factValue(profile, 'subtype')
    var conditions = norm((trial.conditions || []).join(' '))
    var trialText = reqText(trial)

    /* 1 亚型 / 疾病范围 */
    if (sub) {
      var subtypeOk = false
      if (/pv|polycythemia/.test(sub)) subtypeOk = /polycythemia vera|myeloproliferative|myelofibrosis|essential thrombocythemia/.test(conditions)
      else if (/et|thrombocythemia/.test(sub)) subtypeOk = /essential thrombocythemia|myeloproliferative|myelofibrosis/.test(conditions)
      else if (/pmf|myelofibrosis/.test(sub)) subtypeOk = /myelofibrosis|myeloproliferative/.test(conditions)
      else subtypeOk = /myeloproliferative/.test(conditions)
      criteria.push({
        key: 'subtype', cat: '诊断', hard: true,
        label: '亚型 / 疾病范围',
        state: subtypeOk ? 'yes' : 'no',
        recordText: (fact(profile, 'subtype') || {}).value || '未填',
        source: sourceOf(profile, 'subtype'),
        requirement: (trial.conditions || []).join(' / ') || '登记条件未列出亚型',
      })
    } else {
      criteria.push({ key: 'subtype', cat: '诊断', hard: true, label: '亚型 / 疾病范围', state: 'unknown', recordText: '未记录', source: '档案缺字段', requirement: (trial.conditions || []).join(' / ') || '需核方案原文' })
    }

    /* 2 驱动突变：JAK2 / CALR */
    if (/calr/.test(trialText)) {
      var calr = factValue(profile, 'calr')
      criteria.push({
        key: 'calr', cat: '分子检测', hard: true, label: 'CALR 突变',
        state: calr ? (/阳性|positive|mutated/.test(calr) ? 'yes' : 'no') : 'unknown',
        recordText: calr || '未记录', source: sourceOf(profile, 'calr'),
        requirement: '需 CALR exon 9 突变；需核方案原文',
      })
    } else if (/jak2/.test(trialText)) {
      var driver = factValue(profile, 'driver')
      criteria.push({
        key: 'jak2', cat: '分子检测', hard: true, label: 'JAK2 V617F',
        state: driver ? (/jak2/.test(driver) ? 'yes' : (calr && /calr/.test(calr) ? 'no' : 'unknown')) : 'unknown',
        recordText: driver ? (fact(profile, 'driver') || {}).value : '未记录', source: sourceOf(profile, 'driver'),
        requirement: '登记写明 JAK2 V617F；具体以方案原文为准',
      })
    }

    /* 3 年龄 */
    var age = Number((fact(profile, 'age') || {}).value || 0)
    if (/\b18\b|age\s*>=?\s*18|≥\s*18/.test(trialText)) {
      criteria.push({
        key: 'age', cat: '年龄', hard: true, label: '年龄 ≥ 18 岁',
        state: age ? (age >= 18 ? 'yes' : 'no') : 'unknown',
        recordText: age ? age + ' 岁' : '未记录', source: sourceOf(profile, 'age'),
        requirement: '登记写入组年龄 ≥ 18 岁',
      })
    }

    /* 4 疾病阶段：加速/急变期试验 */
    if (/accelerated|blast.phase|加速|急变/.test(trialText)) {
      var phase = factValue(profile, 'phase')
      var advanced = /加速|急变|accelerated|blast/.test(phase)
      criteria.push({
        key: 'phase', cat: '疾病阶段', hard: true, label: '加速期 / 急变期',
        state: phase ? (advanced ? 'yes' : 'no') : 'unknown',
        recordText: (fact(profile, 'phase') || {}).value || '未记录', source: sourceOf(profile, 'phase'),
        requirement: '登记要求加速期或急变期 MPN（见方案原文）',
      })
    }

    /* 5 既往 JAK 抑制剂 / 既往治疗 */
    if (/current jak inhibitor|prior jak|jak inhibitor/.test(trialText)) {
      var jak = factValue(profile, 'prior_jak')
      var prior = factValue(profile, 'prior_therapy')
      if (/current jak inhibitor/.test(trialText)) {
        var onJak = /芦可替尼|ruxolitinib/.test(prior) && /正在用|current/.test(prior)
        criteria.push({
          key: 'current_jak', cat: '既往治疗', hard: true, label: '当前使用 JAK 抑制剂',
          state: (jak || prior) ? (onJak ? 'no' : 'yes') : 'unknown',
          recordText: prior || '未记录', source: sourceOf(profile, 'prior_therapy'),
          requirement: '排除当前使用 JAK 抑制剂',
        })
      } else if (/prior jak inhibitor within|prior jak inhibitor/.test(trialText)) {
        criteria.push({
          key: 'prior_jak', cat: '既往治疗', hard: true, label: '既往 JAK 抑制剂',
          state: jak ? (/有|yes|阳性/.test(jak) ? 'no' : 'yes') : 'unknown',
          recordText: (fact(profile, 'prior_jak') || {}).value || '未记录', source: sourceOf(profile, 'prior_jak'),
          requirement: '登记限制近期使用 JAK 抑制剂（以方案原文为准）',
        })
      }
    }

    /* 6 既往 DNMTi：档案一般没有，明确留待确认 */
    if (/dnmti|dnmt inhibitor|decitabine|阿扎胞苷/.test(trialText)) {
      criteria.push({
        key: 'prior_dnmt', cat: '既往治疗', hard: true, label: '既往 DNMT 抑制剂',
        state: 'unknown', recordText: '档案未记录该项', source: '档案缺字段',
        requirement: '登记要求既往未接受 DNMT 抑制剂；需核方案原文',
      })
    }

    /* 7 体能状态：没有结构化记录，标待确认，不猜 */
    if (/ecog|performance status|ps\s*≤|ps\s*<=/.test(trialText)) {
      criteria.push({
        key: 'ecog', cat: '体能状态', hard: false, label: 'ECOG 体能状态',
        state: 'unknown', recordText: '档案未记录 ECOG', source: '档案缺字段',
        requirement: '登记写入排要求的 ECOG 范围；需核方案原文',
      })
    }

    /* 8 患者偏好只影响排序，不进分母（preferences 保留给调用方排序） */
    var evaluated = criteria.filter(function (c) { return c.state === 'yes' || c.state === 'no' })
    var matched = criteria.filter(function (c) { return c.state === 'yes' }).length
    var compared = criteria.length
    var pending = criteria.filter(function (c) { return c.state === 'unknown' }).length
    var hardNo = criteria.some(function (c) { return c.hard && c.state === 'no' })
    var pct = compared >= 2 ? Math.round(matched * 100 / compared) : null
    var tier = hardNo ? TIER.hard : pct == null ? TIER.needs : pct === 100 ? TIER.perfect : pct >= 50 ? TIER.partial : TIER.needs
    return {
      pct: pct, matched: matched, compared: compared, pending: pending, tier: tier,
      hardNo: hardNo, criteria: criteria,
      note: '不是入组资格，也不代表效果；登记状态未核实；快照会过期。',
      preferenceNote: preferences && preferences.preference && preferences.preference !== 'all' ? '偏好只影响排序，不参与符合度计算' : '',
    }
  }

  global.calcTrialMatch = calcTrialMatch
  global.MPN_TRIAL_MATCH = { calcTrialMatch: calcTrialMatch, TIER: TIER }
})(typeof window !== 'undefined' ? window : globalThis)
