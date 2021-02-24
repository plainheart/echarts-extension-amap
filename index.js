import * as echarts from 'echarts/lib/echarts'
import { install } from './src/index'
import { isV5 } from './src/helper'

isV5 ? echarts.use(install) : install(echarts)

export { name, version } from './src/index'
