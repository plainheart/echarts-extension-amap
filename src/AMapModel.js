import { ComponentModel } from 'echarts/lib/echarts'
import { isV5, v2Equal, dispatchEvent, on, off, oldIE } from './helper'

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
    const mapContainer = this.__amap.getContainer()
    const handler = mapContainer.__evtHandler
    const pteHandler = echartsLayer.__pteHandler
    const evts = 'mousemove mousedown mouseup click dblclick mousewheel mouseout contextmenu mouseleave mouseenter mouseover'
    console.log('oldIE', oldIE, 'pteHandler', pteHandler)
    if (oldIE) {
      pteHandler || on(document, evts, echartsLayer.__pteHandler = function(e) {
        console.log(e)
        let target = e.target
        if (target.parentElement && target.parentElement === echartsLayer) {
          const style = echartsLayer.style
          const originalDisplay = style.display
          style.display = 'none'
          target = document.elementFromPoint(e.clientX, e.clientY)
          style.display = originalDisplay || ''
          dispatchEvent(target, e)
        }
      })
    }
    if (interactive) {
      handler || on(mapContainer, evts, mapContainer.__evtHandler = function(e) {
        dispatchEvent(echartsLayer, e)
      })
    }
    else {
      handler && off(mapContainer, evts, handler)
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
