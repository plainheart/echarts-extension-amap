import { version } from 'echarts/lib/echarts'

export const isV5 = version.split('.')[0] > 4

// `AMap.version` only exists in AMap 2.x
// For AMap 1.x, it's `AMap.v`
export const isAMap2X = AMap.version >= 2

export function v2Equal(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1]
}

let logMap = {}

export function logWarn(tag, msg, once) {
  const log = `[ECharts][Extension][AMap]${tag ? ' ' + tag + ':' : ''} ${msg}`
  once && logMap[log] || console.warn(log)
  once && (logMap[log] = true)
}

export function clearLogMap() {
  logMap = {}
}
