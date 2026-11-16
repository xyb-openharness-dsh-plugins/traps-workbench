/* 面板参数唯一来源（客户端 constants 与此同步；宿主 register 硬上限 0.7）。 */
export const LAYOUT = Object.freeze({
  customFrame: true,
  businessSide: 'left',
  businessWidth: 0.65,
})
export const AGENT_PANE = Object.freeze({ min: 0.25, max: 0.45, default: 0.35, step: 0.02 })
export const UI_ENTRY = '/api/mpn/ui/'
