/* global AMap */

import { getInstanceByDom, ComponentView } from 'echarts/lib/echarts'
import debounce from 'lodash.debounce'

export default ComponentView.extend({
  type: 'amap',

  init() {
    this._isFirstRender = true
  },

  render(amapModel, ecModel, api) {
    let rendering = true

    const amap = amapModel.getAMap()
    const viewportRoot = api.getZr().painter.getViewportRoot()
    const offsetEl = amap.getContainer()
    const coordSys = amapModel.coordinateSystem

    const renderOnMoving = amapModel.get('renderOnMoving')
    const resizeEnable = amapModel.get('resizeEnable')
    const largeMode = amapModel.get('largeMode')

    // `AMap.version` only exists in AMap 2.x
    // For AMap 1.x, it's `AMap.v`
    const is2X = AMap.version >= 2
    const is3DMode = amap.getViewMode_() === '3D'

    let moveHandler = function() {
      if (rendering) {
        return
      }

      const offsetElStyle = offsetEl.style
      const mapOffset = [
        -parseInt(offsetElStyle.left, 10) || 0,
        -parseInt(offsetElStyle.top, 10) || 0
      ]
      // only update style when map offset changed
      const viewportRootStyle = viewportRoot.style
      const offsetLeft = mapOffset[0] + 'px'
      const offsetTop = mapOffset[1] + 'px'
      if (viewportRootStyle.left !== offsetLeft) {
        viewportRootStyle.left = offsetLeft
      }
      if (viewportRootStyle.top !== offsetTop) {
        viewportRootStyle.top = offsetTop
      }

      coordSys.setMapOffset(amapModel.__mapOffset = mapOffset)

      api.dispatchAction({
        type: 'amapRoam',
        animation: {
          // compatible with ECharts 5.x
          // no delay for rendering but remain animation of elements
          duration: 0
        }
      })
    }

    amap.off('mapmove', this._moveHandler)
    amap.off('moveend', this._moveHandler)
    amap.off('viewchange', this._moveHandler)
    amap.off('camerachange', this._moveHandler)
    amap.off('zoom', this._moveHandler)

    if (this._resizeHandler) {
      amap.off('resize', this._resizeHandler)
    }
    if (this._moveStartHandler) {
      amap.off('movestart', this._moveStartHandler)
    }
    if (this._moveEndHandler) {
      amap.off('moveend', this._moveEndHandler)
      amap.off('zoomend', this._moveEndHandler)
    }

    amap.on(
      renderOnMoving
        ? (is2X
          ? 'viewchange'
          : is3DMode
            ? 'camerachange'
            : 'mapmove')
        : 'moveend',
      // FIXME: bad performance in 1.x in the cases with large data, use debounce?
      // moveHandler
      (!is2X && largeMode) ? (moveHandler = debounce(moveHandler, 20)) : moveHandler
    )

    this._moveHandler = moveHandler

    if (renderOnMoving && !(is2X && is3DMode)) {
      // need to listen to zoom if 1.x & 2D mode
      // FIXME: unnecessary `mapmove` event triggered when zooming
      amap.on('zoom', moveHandler)
    }

    if (!renderOnMoving) {
      amap.on('movestart', this._moveStartHandler = function(e) {
        setTimeout(function() {
          amapModel.setEChartsLayerVisiblity(false)
        }, 0)
      })
      const moveEndHandler = this._moveEndHandler = function(e) {
        ;(!e || e.type !== 'moveend') && moveHandler()
        setTimeout(function() {
          amapModel.setEChartsLayerVisiblity(true)
        }, is2X || !largeMode ? 0 : 20)
      }
      amap.on('moveend', moveEndHandler)
      amap.on('zoomend', moveEndHandler)
      if (this._isFirstRender && is3DMode) {
        // FIXME: not rewrite AMap instance method
        const nativeSetPicth = amap.setPitch
        const nativeSetRotation = amap.setRotation
        amap.setPitch = function() {
          nativeSetPicth.apply(this, arguments)
          moveEndHandler()
        }
        amap.setRotation = function() {
          nativeSetRotation.apply(this, arguments)
          moveEndHandler()
        }
      }
    }

    if (resizeEnable) {
      let resizeHandler = function() {
        getInstanceByDom(api.getDom()).resize()
      }
      if (!is2X && largeMode) {
        resizeHandler = debounce(resizeHandler, 20)
      }
      amap.on('resize', this._resizeHandler = resizeHandler)
    }

    this._isFirstRender = rendering = false
  },

  dispose(ecModel) {
    const component = ecModel.getComponent('amap')
    if (component) {
      component.getAMap().destroy()
      component.setAMap(null)
      component.setEChartsLayer(null)
      if (component.coordinateSystem) {
        component.coordinateSystem.setAMap(null)
        component.coordinateSystem = null
      }
      delete this._moveHandler
      delete this._resizeHandler
      delete this._moveStartHandler
      delete this._moveEndHandler
    }
  }
})
