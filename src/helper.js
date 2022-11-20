import { version } from 'echarts/lib/echarts'

export const ecVer = version.split('.')

export const isNewEC = ecVer[0] > 4

export const COMPONENT_TYPE = 'amap'

/* global AMap */

// `AMap.version` only exists in AMap 2.x
// For AMap 1.x, it's `AMap.v`
// use function instead of constant to allow importing the plugin before AMap is loaded
export const isAMap2X = () => AMap.version && AMap.version.split('.')[0] >= 2

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
