import { util as zrUtil, graphic, matrix } from 'echarts/lib/echarts'
import { COMPONENT_TYPE, logWarn } from './helper'

function dataToCoordSize(dataSize, dataItem) {
  dataItem = dataItem || [0, 0];
  return zrUtil.map(
    [0, 1],
    function(dimIdx) {
      const val = dataItem[dimIdx]
      const halfSize = dataSize[dimIdx] / 2
      const p1 = []
      const p2 = []
      p1[dimIdx] = val - halfSize
      p2[dimIdx] = val + halfSize
      p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx]
      return Math.abs(
        this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx]
      )
    },
    this
  )
}

// exclude private and unsupported options
const excludedOptions = [
  'echartsLayerZIndex', // DEPRECATED since v1.9.0
  'echartsLayerInteractive',
  'renderOnMoving',
  'largeMode',
  'returnMapCameraState',
  'layers'
]

function AMapCoordSys(amap, api) {
  this._amap = amap
  this._api = api
  this._mapOffset = [0, 0]
  // this.dimensions = ['lng', 'lat']
}

const AMapCoordSysProto = AMapCoordSys.prototype

AMapCoordSysProto.setZoom = function(zoom) {
  this._zoom = zoom
}

AMapCoordSysProto.setCenter = function(center) {
  const lnglat = new AMap.LngLat(center[0], center[1])
  this._center = this._amap.lngLatToContainer(lnglat)
}

AMapCoordSysProto.setMapOffset = function(mapOffset) {
  this._mapOffset = mapOffset
}

AMapCoordSysProto.setAMap = function(amap) {
  this._amap = amap
}

AMapCoordSysProto.getAMap = function() {
  return this._amap
}

AMapCoordSysProto.dataToPoint = function(data) {
  const lnglat = new AMap.LngLat(data[0], data[1])
  const px = this._amap.lngLatToContainer(lnglat)
  const mapOffset = this._mapOffset
  return [px.x - mapOffset[0], px.y - mapOffset[1]]
}

AMapCoordSysProto.pointToData = function(pt) {
  const mapOffset = this._mapOffset
  const lnglat = this._amap.containerToLngLat(
    new AMap.Pixel(
      pt[0] + mapOffset[0],
      pt[1] + mapOffset[1]
    )
  )
  return [lnglat.lng, lnglat.lat]
}

AMapCoordSysProto.getViewRect = function() {
  const api = this._api
  return new graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight())
}

AMapCoordSysProto.getRoamTransform = function() {
  return matrix.create()
}

AMapCoordSysProto.prepareCustoms = function() {
  const rect = this.getViewRect()
  return {
    coordSys: {
      type: COMPONENT_TYPE,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    },
    api: {
      coord: zrUtil.bind(this.dataToPoint, this),
      size: zrUtil.bind(dataToCoordSize, this)
    }
  }
}

AMapCoordSysProto.convertToPixel = function(ecModel, finder, value) {
  // here we don't use finder as only one amap component is allowed
  return this.dataToPoint(value);
}

AMapCoordSysProto.convertFromPixel = function(ecModel, finder, value) {
  // here we don't use finder as only one amap component is allowed
  return this.pointToData(value);
}

// less useful
// AMapCoordSysProto.containPoint = function(point) {
//   return this._amap.getBounds().contains(this.pointToData(point));
// }

AMapCoordSys.create = function(ecModel, api) {
  let amapCoordSys
  ecModel.eachComponent(COMPONENT_TYPE, function(amapModel) {
    if (typeof AMap === 'undefined') {
      throw new Error('AMap api is not loaded')
    }
    if (amapCoordSys) {
      throw new Error('Only one amap component is allowed')
    }
    let amap = amapModel.getAMap()
    const echartsLayerInteractive = amapModel.get('echartsLayerInteractive')
    if (!amap) {
      const root = api.getDom()
      const painter = api.getZr().painter
      const viewportRoot = painter.getViewportRoot()
      viewportRoot.className = COMPONENT_TYPE + '-ec-layer'
      // PENDING not hidden?
      viewportRoot.style.visibility = 'hidden'
      const className = 'ec-extension-' + COMPONENT_TYPE
      // Not support IE8
      let amapRoot = root.querySelector('.' + className)
      if (amapRoot) {
        // Reset viewport left and top, which will be changed
        // in moving handler in AMapView
        viewportRoot.style.left = '0px'
        viewportRoot.style.top = '0px'
        root.removeChild(amapRoot)
      }
      amapRoot = document.createElement('div')
      amapRoot.className = className
      amapRoot.style.cssText = 'position:absolute;top:0;left:0;bottom:0;right:0;'
      root.appendChild(amapRoot)

      const options = zrUtil.clone(amapModel.get())
      if ('echartsLayerZIndex' in options) {
        logWarn('DEPRECATED', 'the option `echartsLayerZIndex` has been removed since v1.9.0, use `echartsLayerInteractive` instead.')
      }
      // delete excluded options
      zrUtil.each(excludedOptions, function(key) {
        delete options[key]
      })

      amap = new AMap.Map(amapRoot, options)

      // PENDING: should update the model option when the user call map.setXXX?

      // const nativeSetMapStyle = amap.setMapStyle
      // const nativeSetLang = amap.setLang

      // // PENDING
      // amap.setMapStyle = function () {
      //   nativeSetMapStyle.apply(this, arguments)
      //   amapModel.__mapStyle = amap.getMapStyle()
      // }

      // // PENDING
      // nativeSetLang && (amap.setLang = function() {
      //   nativeSetLang.apply(this, arguments)
      //   amapModel.__mapLang = amap.getLang()
      // })

      // use `complete` callback to avoid NPE when first load amap
      amap.on('complete', function() {
        amapRoot.querySelector('.amap-maps').appendChild(viewportRoot)
        // PENDING
        viewportRoot.style.visibility = ''
      })

      amapModel.setAMap(amap)
      amapModel.setEChartsLayer(viewportRoot)

      // Override
      painter.getViewportRootOffset = function() {
        return { offsetLeft: 0, offsetTop: 0 }
      }
    }

    const oldEChartsLayerInteractive = amapModel.__echartsLayerInteractive
    if (oldEChartsLayerInteractive !== echartsLayerInteractive) {
      amapModel.setEChartsLayerInteractive(echartsLayerInteractive)
      amapModel.__echartsLayerInteractive = echartsLayerInteractive
    }

    const center = amapModel.get('center')
    const zoom = amapModel.get('zoom')
    if (center && zoom) {
      const amapCenter = amap.getCenter()
      const amapZoom = amap.getZoom()
      const centerOrZoomChanged = amapModel.centerOrZoomChanged(
        [amapCenter.lng, amapCenter.lat],
        amapZoom
      )
      if (centerOrZoomChanged) {
        amap.setZoomAndCenter(zoom, new AMap.LngLat(center[0], center[1]))
      }
    }

    // update map style(#13)
    const originalMapStyle = amapModel.__mapStyle
    const newMapStyle = amapModel.get('mapStyle')
    if (originalMapStyle !== newMapStyle) {
      amap.setMapStyle(amapModel.__mapStyle = newMapStyle)
    }

    // update map lang
    // PENDING: AMap 2.x does not support `setLang` yet
    if (amap.setLang) {
      const originalMapLang = amapModel.__mapLang
      const newMapLang = amapModel.get('lang')
      if (originalMapLang !== newMapLang) {
        amap.setLang(amapModel.__mapLang = newMapLang)
      }
    }
    else {
      logWarn('CAVEAT', 'The current map doesn\'t support `setLang` API!', true)
    }

    amapCoordSys = new AMapCoordSys(amap, api)
    amapCoordSys.setMapOffset(amapModel.__mapOffset || [0, 0])
    amapCoordSys.setZoom(zoom)
    amapCoordSys.setCenter(center)

    amapModel.coordinateSystem = amapCoordSys
  })

  ecModel.eachSeries(function(seriesModel) {
    if (seriesModel.get('coordinateSystem') === COMPONENT_TYPE) {
      // inject coordinate system
      seriesModel.coordinateSystem = amapCoordSys
    }
  })

  // return created coordinate systems
  return amapCoordSys && [amapCoordSys]
}

AMapCoordSysProto.dimensions = AMapCoordSys.dimensions = ['lng', 'lat']

AMapCoordSysProto.type = COMPONENT_TYPE


export default AMapCoordSys
