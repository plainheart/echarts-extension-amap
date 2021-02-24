import * as echarts from 'echarts/lib/echarts'
import { install } from './src/index'

if (echarts.version.split('.')[0] > 4) {
  echarts.use(install)
} else {
  install(echarts)
}

export { name, version } from './src/index'
