import { version } from 'echarts/lib/echarts'

export const isV5 = version.split('.')[0] > 4

export function v2Equal(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1]
}
