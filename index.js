/**
 * TODO use `echarts/core` rather than `echarts/lib/echarts`
 * to avoid self-registered `CanvasRenderer` and `DataSetComponent` in Apache ECharts 5
 * but it's not compatible with echarts v4. Leave it to 2.0.
 */
import * as echarts from 'echarts/lib/echarts'
import { install } from './src/index'
import { isNewEC } from './src/helper'

isNewEC ? echarts.use(install) : install(echarts)

export { name, version } from './src/index'
