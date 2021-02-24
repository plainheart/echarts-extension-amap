/**
 * AMap component extension
 */

import AMapCoordSys from './AMapCoordSys'
import AMapModel from './AMapModel'
import AMapView from './AMapView'
import { isV5 } from './helper'

export { version, name } from '../package.json'

export function install(registers) {
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
