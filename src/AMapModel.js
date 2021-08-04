import { ComponentModel, util as zrUtil } from 'echarts/lib/echarts'
import { isV5, v2Equal, dispatchEvent, on, off, watchStyle, unwatchStyle } from './helper'

const AMapModel = {
  type: 'amap',

  setAMap(amap) {
    this.__amap = amap
  },

  getAMap() {
    return this.__amap
  },

  setEChartsLayer(layer) {
    this.__echartsLayer = layer
  },

  getEChartsLayer() {
    return this.__echartsLayer
  },

  setEChartsLayerVisiblity(visible) {
    this.__echartsLayer.style.display = visible ? 'block' : 'none'
  },

  // FIXME: NOT SUPPORT <= IE 10
  setEChartsLayerInteractive(interactive) {
    this.option.echartsLayerInteractive = !!interactive
    const echartsLayer = this.__echartsLayer
    echartsLayer.style.pointerEvents = interactive ? 'auto' : 'none'

    // propagate map events to echarts layer
    const map = this.__amap
    const mapContainer = map.getContainer().querySelector('.amap-maps')
    const handler = mapContainer.__evtHandler4
    // PENDING no wheel
    const evts = 'click dblclick mousewheel mouseout mouseup mousedown mousemove contextmenu pointerout pointerup pointerdown pointermove touchstart touchend touchmove'
    if (interactive) {
      handler || on(mapContainer, evts, mapContainer.__evtHandler = function(e) {
        dispatchEvent(echartsLayer, e)
      }, { passive: true })
      // set amap cursor to be echarts cursor
      watchStyle(echartsLayer, function(newStyle) {
        map.setDefaultCursor(newStyle.cursor === 'default' ? '' : newStyle.cursor)
      })
    }
    else {
      handler && off(mapContainer, evts, handler)
      unwatchStyle(echartsLayer)
    }
  },

  setCenterAndZoom(center, zoom) {
    this.option.center = center
    this.option.zoom = zoom
  },

  centerOrZoomChanged(center, zoom) {
    const option = this.option
    return !(v2Equal(center, option.center) && zoom === option.zoom)
  },

  defaultOption: {
    center: [116.397428, 39.90923],
    zoom: 5,
    isHotspot: false,
    resizeEnable: true,

    // extension specific options
    // echartsLayerZIndex: 2000, // DEPRECATED since v1.9.0
    echartsLayerInteractive: true,
    renderOnMoving: true,
    largeMode: false,
    // since v1.10.0
    returnMapCameraState: false
  }
}

export default isV5
  ? ComponentModel.extend(AMapModel)
  : AMapModel
