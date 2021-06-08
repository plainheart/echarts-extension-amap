import { ComponentModel, getInstanceByDom } from 'echarts/lib/echarts'
import {
  isV5,
  v2Equal,
  getScreenshot,
  isAMap2X,
  overrideCanvasGetContext,
  logWarn
} from './helper'

const AMapModel = {
  type: 'amap',

  // injected __api

  setAMap(amap) {
    this.__amap = amap
  },

  getAMap() {
    return this.__amap
  },

  getScreenshot(opts) {
    if (!this.option.supportScreenshotFor3DMode && isAMap2X && this.__amap.getViewMode_() === '3D') {
      return logWarn('CAVEAT', 'To get a screenshot, when AMap version is 2.x and the map is in 3D mode, `amap.supportScreenshotFor3DMode` MUST be set as `true` BEFORE initializing the map.')
    }
    return getScreenshot(getInstanceByDom(this.__api.getDom()), this.__amap, opts)
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
    this.__echartsLayer.style.pointerEvents = interactive ? 'auto' : 'none'
  },

  setCenterAndZoom(center, zoom) {
    this.option.center = center
    this.option.zoom = zoom
  },

  centerOrZoomChanged(center, zoom) {
    const option = this.option
    return !(v2Equal(center, option.center) && zoom === option.zoom)
  },

  init(option) {
    // isV5
      // ? ComponentModel.prototype.init.apply(this, arguments)
      // : this.constructor.superApply(this, 'init', arguments)
    this.constructor.superApply(this, 'init', arguments)
    // override canvas getContext when amap 2.x and 3D mode
    if (option.supportScreenshotFor3DMode && (isAMap2X && option.viewMode === '3D')) {
      overrideCanvasGetContext()
      logWarn('CAVEAT', '`amap.supportScreenshotFor3DMode` is now experimental! To support screenshot for 3D mode, the function `getContext` of `HTMLCanvasElement` will be overriden as follows:\n\n' + overrideCanvasGetContext.toString() + '\n\nSet it to be `false` to avoid the overriding.')
    }
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
    returnMapCameraState: false,
    // since v1.10.0
    supportScreenshotFor3DMode: false
  }
}

export default isV5
  ? ComponentModel.extend(AMapModel)
  : AMapModel
