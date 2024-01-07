import { ComponentView, getInstanceByDom, throttle } from 'echarts/lib/echarts'
import { COMPONENT_TYPE, isNewEC, isAMap2X, clearLogMap } from './helper'

let _isAMap2X

const AMapView = {
  type: COMPONENT_TYPE,

  init() {
    this._isFirstRender = true

    _isAMap2X = isAMap2X()
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
    const returnMapCameraState = amapModel.get('returnMapCameraState')

    const viewMode = amap.getViewMode_()
    const is3DMode = viewMode === '3D'

    let moveHandler = function(e) {
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

      const actionParams = {
        type: 'amapRoam',
        animation: {
          // compatible with ECharts 5.x
          // no delay for rendering but remain animation of elements
          duration: 0
        }
      }

      if (returnMapCameraState) {
        e = e || {}
        let center = e.center
        if (!center) {
          // normalize center LngLat to Array
          center = amap.getCenter()
          center = [center.lng, center.lat]
        }
        actionParams.camera = {
          viewMode,
          center,
          zoom: e.zoom || amap.getZoom(),
          rotation: e.rotation == null ? amap.getRotation() : e.rotation,
          pitch: e.pitch == null ? amap.getPitch() : e.pitch,
          scale: amap.getScale(),
          bounds: amap.getBounds()
        }
      }

      api.dispatchAction(actionParams)
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
        ? (_isAMap2X
          ? 'viewchange'
          : is3DMode
            ? 'camerachange'
            : 'mapmove')
        : 'moveend',
      // FIXME: bad performance in 1.x in the cases with large data, use debounce?
      // moveHandler
      (!_isAMap2X && largeMode) ? (moveHandler = throttle(moveHandler, 20, true)) : moveHandler
    )

    this._moveHandler = moveHandler

    if (renderOnMoving && !(_isAMap2X && is3DMode)) {
      // need to listen to zoom if 1.x & 2D mode
      // FIXME: unnecessary `mapmove` event triggered when zooming
      amap.on('zoom', moveHandler)
    }

    if (!renderOnMoving) {
      amap.on('movestart', this._moveStartHandler = function() {
        setTimeout(function() {
          amapModel.setEChartsLayerVisibility(false)
        }, 0)
      })
      const moveEndHandler = this._moveEndHandler = function(e) {
        ;(!e || e.type !== 'moveend') && moveHandler(e)
        setTimeout(function() {
          amapModel.setEChartsLayerVisibility(true)
        }, _isAMap2X || !largeMode ? 0 : 20)
      }
      amap.on('moveend', moveEndHandler)
      amap.on('zoomend', moveEndHandler)
      if (this._isFirstRender && is3DMode) {
        // FIXME: not rewrite AMap instance method
        const nativeSetPitch = amap.setPitch
        const nativeSetRotation = amap.setRotation
        amap.setPitch = function() {
          nativeSetPitch.apply(this, arguments)
          moveEndHandler()
        }
        amap.setRotation = function() {
          nativeSetRotation.apply(this, arguments)
          moveEndHandler()
        }
      }
    }

    if (resizeEnable) {
      let resizeHandler = () => {
        clearTimeout(this._resizeTimeout)
        this._resizeTimeout = setTimeout(() => getInstanceByDom(api.getDom()).resize(), 0)
      }
      if (!_isAMap2X && largeMode) {
        resizeHandler = throttle(resizeHandler, 20, true)
      }
      amap.on('resize', this._resizeHandler = resizeHandler)
    }

    this._isFirstRender = rendering = false
  },

  dispose() {
    clearTimeout(this._resizeTimeout)
    clearLogMap()
    const component = this.__model
    if (component) {
      component.getAMap().destroy()
      component.setAMap(null)
      component.setEChartsLayer(null)
      if (component.coordinateSystem) {
        component.coordinateSystem.setAMap(null)
        component.coordinateSystem = null
      }
    }
    delete this._moveHandler
    delete this._moveStartHandler
    delete this._moveEndHandler
    delete this._resizeHandler
    delete this._resizeTimeout
  }
}

export default isNewEC
  ? ComponentView.extend(AMapView)
  : AMapView
