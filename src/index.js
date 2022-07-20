/**
 * AMap component extension
 */

import AMapCoordSys from './AMapCoordSys'
import AMapModel from './AMapModel'
import AMapView from './AMapView'
import { isNewEC, ecVer } from './helper'

export { version, name } from '../package.json'

export function install(registers) {
  // add coordinate system support for pie series for ECharts < 5.4.0
  if (!isNewEC || (ecVer[0] == 5 && ecVer[1] < 4)) {
    registers.registerLayout(function(ecModel, api) {
      ecModel.eachSeriesByType('pie', function (seriesModel) {
        const coordSys = seriesModel.coordinateSystem
        const data = seriesModel.getData()
        const valueDim = data.mapDimension('value')
        if (coordSys && coordSys.type === 'amap') {
          const center = seriesModel.get('center')
          const point = coordSys.dataToPoint(center)
          const cx = point[0]
          const cy = point[1]
          data.each(valueDim, function (value, idx) {
            const layout = data.getItemLayout(idx)
            layout.cx = cx
            layout.cy = cy
          })
        }
      })
    })
  }
  // Model
  isNewEC
    ? registers.registerComponentModel(AMapModel)
    : registers.extendComponentModel(AMapModel)
  // View
  isNewEC
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
