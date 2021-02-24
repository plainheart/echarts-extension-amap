import { version } from 'echarts/lib/echarts'

export const isV5 = version.split('.')[0] > 4

export const objFn = obj => obj
