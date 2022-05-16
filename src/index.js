/**
 * AMap component extension
 */

import AMapCoordSys from './AMapCoordSys'
import AMapModel from './AMapModel'
import AMapView from './AMapView'
import { isV5 } from './helper'

export { version, name } from '../package.json'

export function install(registers) {
  // PENDING implement in ECharts?
  registers.registerLayout(function(ecModel, api) {
    ecModel.eachSeriesByType('pie', function (seriesModel) {
      const coordSys = seriesModel.coordinateSystem
      const data = seriesModel.getData()
      const valueDim = data.mapDimension('value')
      if (coordSys && coordSys.type === 'amap') {
        const center = seriesModel.get('center')
        const [cx, cy] = coordSys.dataToPoint(center)
        data.each(valueDim, function (value, idx) {
          const layout = data.getItemLayout(idx)
          layout.cx = cx
          layout.cy = cy
        })
      }
    })
  })
  // Model
  isV5
    ? registers.registerComponentModel(AMapModel)
    : registers.extendComponentModel(AMapModel)
  // View
  isV5
    ? registers.registerComponentView(AMapView)
    : registers.extendComponentView(AMapView)
  // Coordinate System
  registers.registerCoordinateSystem('amap', AMapCoordSys)
  // Action
  registers.registerAction(
    {
      type: 'amapRoam',
      event: 'amapRoam',
      update: 'updateLayout'
    },
    function(payload, ecModel) {
      ecModel.eachComponent('amap', function(amapModel) {
        const amap = amapModel.getAMap()
        const center = amap.getCenter()
        amapModel.setCenterAndZoom([center.lng, center.lat], amap.getZoom())
      })
    }
  )
}
