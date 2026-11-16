/* 公开研究字段对照，不判断诊断、治疗或试验资格。 */
(function (global) {
  'use strict'
  function norm(x) { return String(x == null ? '' : x).toLowerCase() }
  function calcTrialMatch(profile, trial) {
    var diagnosis = (profile && profile.facts || []).find(function (f) { return f.field === 'diagnosis' && Number(f.confirmed) === 1 })
    var conditions = norm((trial && trial.conditions || []).join(' '))
    var includesTraps = /traps|tnf receptor-associated periodic/.test(conditions)
    var state = !diagnosis ? 'unknown' : norm(diagnosis.value).includes('traps') && includesTraps ? 'yes' : 'unknown'
    var criteria = [{
      key: 'disease-scope', cat: '登记疾病范围', hard: false,
      label: '登记记录的疾病范围包含 TRAPS',
      state: state,
      recordText: diagnosis ? diagnosis.value : '未有经用户确认的结构化档案字段',
      source: diagnosis ? (diagnosis.source || '来源未标注') : '档案未记录',
      requirement: '请打开原始登记页面核对研究范围和入排条件；此处不作个人资格判断。'
    }]
    return {
      pct: null, matched: 0, compared: 0, pending: 1,
      tier: '只展示登记范围', hardNo: false, criteria: criteria,
      note: '登记字段对照不是诊断或入组资格；登记状态可能过期。'
    }
  }
  global.calcTrialMatch = calcTrialMatch
  global.TRAPS_TRIAL_MATCH = { calcTrialMatch: calcTrialMatch }
})(typeof window !== 'undefined' ? window : globalThis)
