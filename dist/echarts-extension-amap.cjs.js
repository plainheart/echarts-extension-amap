/*!
 * echarts-extension-amap 
 * @version 1.12.0
 * @author plainheart
 * 
 * MIT License
 * 
 * Copyright (c) 2019-2024 Zhongxiang Wang
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */
'use strict';

var echarts = require('echarts/lib/echarts');

var ecVer = echarts.version.split('.');
var isNewEC = ecVer[0] > 4;
var COMPONENT_TYPE = 'amap';

/* global AMap */

// The version property is `AMap.v` in AMap 1.x,
// but `AMap.version` may also exist (See #51)
// In AMap 2.x, it's `AMap.version` (Not sure if `AMap.v` exists)
// use function instead of constant to allow importing the plugin before AMap is loaded
var isAMap2X = function isAMap2X() {
  return !AMap.v && AMap.version && AMap.version.split('.')[0] >= 2;
};
function v2Equal(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}
var logMap = {};
function logWarn(tag, msg, once) {
  var log = "[ECharts][Extension][AMap]".concat(tag ? ' ' + tag + ':' : '', " ").concat(msg);
  once && logMap[log] || console.warn(log);
  once && (logMap[log] = true);
}
function clearLogMap() {
  logMap = {};
}

function dataToCoordSize(dataSize, dataItem) {
  dataItem = dataItem || [0, 0];
  return echarts.util.map([0, 1], function (dimIdx) {
    var val = dataItem[dimIdx];
    var halfSize = dataSize[dimIdx] / 2;
    var p1 = [];
    var p2 = [];
    p1[dimIdx] = val - halfSize;
    p2[dimIdx] = val + halfSize;
    p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];
    return Math.abs(this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx]);
  }, this);
}

// exclude private and unsupported options
var excludedOptions = ['echartsLayerZIndex',
// DEPRECATED since v1.9.0
'echartsLayerInteractive', 'renderOnMoving', 'largeMode', 'returnMapCameraState', 'layers'];
function AMapCoordSys(amap, api) {
  this._amap = amap;
  this._api = api;
  this._mapOffset = [0, 0];
  // this.dimensions = ['lng', 'lat']
}
var AMapCoordSysProto = AMapCoordSys.prototype;
AMapCoordSysProto.setZoom = function (zoom) {
  this._zoom = zoom;
};
AMapCoordSysProto.setCenter = function (center) {
  var lnglat = new AMap.LngLat(center[0], center[1]);
  this._center = this._amap.lngLatToContainer(lnglat);
};
AMapCoordSysProto.setMapOffset = function (mapOffset) {
  this._mapOffset = mapOffset;
};
AMapCoordSysProto.setAMap = function (amap) {
  this._amap = amap;
};
AMapCoordSysProto.getAMap = function () {
  return this._amap;
};
AMapCoordSysProto.dataToPoint = function (data) {
  var lnglat = new AMap.LngLat(data[0], data[1]);
  var px = this._amap.lngLatToContainer(lnglat);
  var mapOffset = this._mapOffset;
  return [px.x - mapOffset[0], px.y - mapOffset[1]];
};
AMapCoordSysProto.pointToData = function (pt) {
  var mapOffset = this._mapOffset;
  var lnglat = this._amap.containerToLngLat(new AMap.Pixel(pt[0] + mapOffset[0], pt[1] + mapOffset[1]));
  return [lnglat.lng, lnglat.lat];
};
AMapCoordSysProto.getViewRect = function () {
  var api = this._api;
  return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};
AMapCoordSysProto.getRoamTransform = function () {
  return echarts.matrix.create();
};
AMapCoordSysProto.prepareCustoms = function () {
  var rect = this.getViewRect();
  return {
    coordSys: {
      type: COMPONENT_TYPE,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    },
    api: {
      coord: echarts.util.bind(this.dataToPoint, this),
      size: echarts.util.bind(dataToCoordSize, this)
    }
  };
};
AMapCoordSysProto.convertToPixel = function (ecModel, finder, value) {
  // here we don't use finder as only one amap component is allowed
  return this.dataToPoint(value);
};
AMapCoordSysProto.convertFromPixel = function (ecModel, finder, value) {
  // here we don't use finder as only one amap component is allowed
  return this.pointToData(value);
};

// less useful
// AMapCoordSysProto.containPoint = function(point) {
//   return this._amap.getBounds().contains(this.pointToData(point));
// }

AMapCoordSys.create = function (ecModel, api) {
  var amapCoordSys;
  ecModel.eachComponent(COMPONENT_TYPE, function (amapModel) {
    if (typeof AMap === 'undefined') {
      throw new Error('AMap api is not loaded');
    }
    if (amapCoordSys) {
      throw new Error('Only one amap component is allowed');
    }
    var amap = amapModel.getAMap();
    var echartsLayerInteractive = amapModel.get('echartsLayerInteractive');
    if (!amap) {
      var root = api.getDom();
      var painter = api.getZr().painter;
      var viewportRoot = painter.getViewportRoot();
      viewportRoot.className = COMPONENT_TYPE + '-ec-layer';
      // PENDING not hidden?
      viewportRoot.style.visibility = 'hidden';
      var className = 'ec-extension-' + COMPONENT_TYPE;
      // Not support IE8
      var amapRoot = root.querySelector('.' + className);
      if (amapRoot) {
        // Reset viewport left and top, which will be changed
        // in moving handler in AMapView
        viewportRoot.style.left = '0px';
        viewportRoot.style.top = '0px';
        root.removeChild(amapRoot);
      }
      amapRoot = document.createElement('div');
      amapRoot.className = className;
      amapRoot.style.cssText = 'position:absolute;top:0;left:0;bottom:0;right:0;';
      root.appendChild(amapRoot);
      var options = echarts.util.clone(amapModel.get());
      if ('echartsLayerZIndex' in options) {
        logWarn('DEPRECATED', 'the option `echartsLayerZIndex` has been removed since v1.9.0, use `echartsLayerInteractive` instead.');
      }
      // delete excluded options
      echarts.util.each(excludedOptions, function (key) {
        delete options[key];
      });
      amap = new AMap.Map(amapRoot, options);

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
      amap.on('complete', function () {
        amapRoot.querySelector('.amap-maps').appendChild(viewportRoot);
        // PENDING
        viewportRoot.style.visibility = '';
      });
      amapModel.setAMap(amap);
      amapModel.setEChartsLayer(viewportRoot);

      // Override
      painter.getViewportRootOffset = function () {
        return {
          offsetLeft: 0,
          offsetTop: 0
        };
      };
    }
    var oldEChartsLayerInteractive = amapModel.__echartsLayerInteractive;
    if (oldEChartsLayerInteractive !== echartsLayerInteractive) {
      amapModel.setEChartsLayerInteractive(echartsLayerInteractive);
      amapModel.__echartsLayerInteractive = echartsLayerInteractive;
    }
    var center = amapModel.get('center');
    var zoom = amapModel.get('zoom');
    if (center && zoom) {
      var amapCenter = amap.getCenter();
      var amapZoom = amap.getZoom();
      var centerOrZoomChanged = amapModel.centerOrZoomChanged([amapCenter.lng, amapCenter.lat], amapZoom);
      if (centerOrZoomChanged) {
        amap.setZoomAndCenter(zoom, new AMap.LngLat(center[0], center[1]));
      }
    }

    // update map style(#13)
    var originalMapStyle = amapModel.__mapStyle;
    var newMapStyle = amapModel.get('mapStyle');
    if (originalMapStyle !== newMapStyle) {
      amap.setMapStyle(amapModel.__mapStyle = newMapStyle);
    }

    // update map lang
    // PENDING: AMap 2.x does not support `setLang` yet
    if (amap.setLang) {
      var originalMapLang = amapModel.__mapLang;
      var newMapLang = amapModel.get('lang');
      if (originalMapLang !== newMapLang) {
        amap.setLang(amapModel.__mapLang = newMapLang);
      }
    } else {
      logWarn('CAVEAT', 'The current map doesn\'t support `setLang` API!', true);
    }
    amapCoordSys = new AMapCoordSys(amap, api);
    amapCoordSys.setMapOffset(amapModel.__mapOffset || [0, 0]);
    amapCoordSys.setZoom(zoom);
    amapCoordSys.setCenter(center);
    amapModel.coordinateSystem = amapCoordSys;
  });
  ecModel.eachSeries(function (seriesModel) {
    if (seriesModel.get('coordinateSystem') === COMPONENT_TYPE) {
      // inject coordinate system
      seriesModel.coordinateSystem = amapCoordSys;
    }
  });

  // return created coordinate systems
  return amapCoordSys && [amapCoordSys];
};
AMapCoordSysProto.dimensions = AMapCoordSys.dimensions = ['lng', 'lat'];
AMapCoordSysProto.type = COMPONENT_TYPE;

var AMapModel = {
  type: COMPONENT_TYPE,
  setAMap: function setAMap(amap) {
    this.__amap = amap;
  },
  getAMap: function getAMap() {
    return this.__amap;
  },
  setEChartsLayer: function setEChartsLayer(layer) {
    this.__echartsLayer = layer;
  },
  getEChartsLayer: function getEChartsLayer() {
    return this.__echartsLayer;
  },
  setEChartsLayerVisibility: function setEChartsLayerVisibility(visible) {
    this.__echartsLayer.style.display = visible ? 'block' : 'none';
  },
  // FIXME: NOT SUPPORT <= IE 10
  setEChartsLayerInteractive: function setEChartsLayerInteractive(interactive) {
    this.option.echartsLayerInteractive = !!interactive;
    this.__echartsLayer.style.pointerEvents = interactive ? 'auto' : 'none';
  },
  setCenterAndZoom: function setCenterAndZoom(center, zoom) {
    this.option.center = center;
    this.option.zoom = zoom;
  },
  centerOrZoomChanged: function centerOrZoomChanged(center, zoom) {
    var option = this.option;
    return !(v2Equal(center, option.center) && zoom === option.zoom);
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
};
var AMapModel$1 = isNewEC ? echarts.ComponentModel.extend(AMapModel) : AMapModel;

var _isAMap2X;
var AMapView = {
  type: COMPONENT_TYPE,
  init: function init() {
    this._isFirstRender = true;
    _isAMap2X = isAMap2X();
  },
  render: function render(amapModel, ecModel, api) {
    var _this = this;
    var rendering = true;
    var amap = amapModel.getAMap();
    var viewportRoot = api.getZr().painter.getViewportRoot();
    var offsetEl = amap.getContainer();
    var coordSys = amapModel.coordinateSystem;
    var renderOnMoving = amapModel.get('renderOnMoving');
    var resizeEnable = amapModel.get('resizeEnable');
    var largeMode = amapModel.get('largeMode');
    var returnMapCameraState = amapModel.get('returnMapCameraState');
    var viewMode = amap.getViewMode_();
    var is3DMode = viewMode === '3D';
    var moveHandler = function moveHandler(e) {
      if (rendering) {
        return;
      }
      var offsetElStyle = offsetEl.style;
      var mapOffset = [-parseInt(offsetElStyle.left, 10) || 0, -parseInt(offsetElStyle.top, 10) || 0];
      // only update style when map offset changed
      var viewportRootStyle = viewportRoot.style;
      var offsetLeft = mapOffset[0] + 'px';
      var offsetTop = mapOffset[1] + 'px';
      if (viewportRootStyle.left !== offsetLeft) {
        viewportRootStyle.left = offsetLeft;
      }
      if (viewportRootStyle.top !== offsetTop) {
        viewportRootStyle.top = offsetTop;
      }
      coordSys.setMapOffset(amapModel.__mapOffset = mapOffset);
      var actionParams = {
        type: 'amapRoam',
        animation: {
          // compatible with ECharts 5.x
          // no delay for rendering but remain animation of elements
          duration: 0
        }
      };
      if (returnMapCameraState) {
        e = e || {};
        var center = e.center;
        if (!center) {
          // normalize center LngLat to Array
          center = amap.getCenter();
          center = [center.lng, center.lat];
        }
        actionParams.camera = {
          viewMode: viewMode,
          center: center,
          zoom: e.zoom || amap.getZoom(),
          rotation: e.rotation == null ? amap.getRotation() : e.rotation,
          pitch: e.pitch == null ? amap.getPitch() : e.pitch,
          scale: amap.getScale(),
          bounds: amap.getBounds()
        };
      }
      api.dispatchAction(actionParams);
    };
    amap.off('mapmove', this._moveHandler);
    amap.off('moveend', this._moveHandler);
    amap.off('viewchange', this._moveHandler);
    amap.off('camerachange', this._moveHandler);
    amap.off('zoom', this._moveHandler);
    if (this._resizeHandler) {
      amap.off('resize', this._resizeHandler);
    }
    if (this._moveStartHandler) {
      amap.off('movestart', this._moveStartHandler);
    }
    if (this._moveEndHandler) {
      amap.off('moveend', this._moveEndHandler);
      amap.off('zoomend', this._moveEndHandler);
    }
    amap.on(renderOnMoving ? _isAMap2X ? 'viewchange' : is3DMode ? 'camerachange' : 'mapmove' : 'moveend',
    // FIXME: bad performance in 1.x in the cases with large data, use debounce?
    // moveHandler
    !_isAMap2X && largeMode ? moveHandler = echarts.throttle(moveHandler, 20, true) : moveHandler);
    this._moveHandler = moveHandler;
    if (renderOnMoving && !(_isAMap2X && is3DMode)) {
      // need to listen to zoom if 1.x & 2D mode
      // FIXME: unnecessary `mapmove` event triggered when zooming
      amap.on('zoom', moveHandler);
    }
    if (!renderOnMoving) {
      amap.on('movestart', this._moveStartHandler = function () {
        setTimeout(function () {
          amapModel.setEChartsLayerVisibility(false);
        }, 0);
      });
      var moveEndHandler = this._moveEndHandler = function (e) {
        (!e || e.type !== 'moveend') && moveHandler(e);
        setTimeout(function () {
          amapModel.setEChartsLayerVisibility(true);
        }, _isAMap2X || !largeMode ? 0 : 20);
      };
      amap.on('moveend', moveEndHandler);
      amap.on('zoomend', moveEndHandler);
      if (this._isFirstRender && is3DMode) {
        // FIXME: not rewrite AMap instance method
        var nativeSetPitch = amap.setPitch;
        var nativeSetRotation = amap.setRotation;
        amap.setPitch = function () {
          nativeSetPitch.apply(this, arguments);
          moveEndHandler();
        };
        amap.setRotation = function () {
          nativeSetRotation.apply(this, arguments);
          moveEndHandler();
        };
      }
    }
    if (resizeEnable) {
      var resizeHandler = function resizeHandler() {
        clearTimeout(_this._resizeTimeout);
        _this._resizeTimeout = setTimeout(function () {
          return echarts.getInstanceByDom(api.getDom()).resize();
        }, 0);
      };
      if (!_isAMap2X && largeMode) {
        resizeHandler = echarts.throttle(resizeHandler, 20, true);
      }
      amap.on('resize', this._resizeHandler = resizeHandler);
    }
    this._isFirstRender = rendering = false;
  },
  dispose: function dispose() {
    clearTimeout(this._resizeTimeout);
    clearLogMap();
    var component = this.__model;
    if (component) {
      component.getAMap().destroy();
      component.setAMap(null);
      component.setEChartsLayer(null);
      if (component.coordinateSystem) {
        component.coordinateSystem.setAMap(null);
        component.coordinateSystem = null;
      }
    }
    delete this._moveHandler;
    delete this._moveStartHandler;
    delete this._moveEndHandler;
    delete this._resizeHandler;
    delete this._resizeTimeout;
  }
};
var AMapView$1 = isNewEC ? echarts.ComponentView.extend(AMapView) : AMapView;

var name = "echarts-extension-amap";
var version = "1.12.0";

/**
 * AMap component extension
 */


/**
 * @typedef {import('../export').EChartsExtensionRegisters} EChartsExtensionRegisters
 */

/**
 * AMap extension installer
 * @param {EChartsExtensionRegisters} registers
 */
function install(registers) {
  // add coordinate system support for pie series for ECharts < 5.4.0
  if (!isNewEC || ecVer[0] == 5 && ecVer[1] < 4) {
    registers.registerLayout(function (ecModel) {
      ecModel.eachSeriesByType('pie', function (seriesModel) {
        var coordSys = seriesModel.coordinateSystem;
        var data = seriesModel.getData();
        var valueDim = data.mapDimension('value');
        if (coordSys && coordSys.type === COMPONENT_TYPE) {
          var center = seriesModel.get('center');
          var point = coordSys.dataToPoint(center);
          var cx = point[0];
          var cy = point[1];
          data.each(valueDim, function (value, idx) {
            var layout = data.getItemLayout(idx);
            layout.cx = cx;
            layout.cy = cy;
          });
        }
      });
    });
  }
  // Model
  isNewEC ? registers.registerComponentModel(AMapModel$1) : registers.extendComponentModel(AMapModel$1);
  // View
  isNewEC ? registers.registerComponentView(AMapView$1) : registers.extendComponentView(AMapView$1);
  // Coordinate System
  registers.registerCoordinateSystem(COMPONENT_TYPE, AMapCoordSys);
  // Action
  registers.registerAction({
    type: COMPONENT_TYPE + 'Roam',
    event: COMPONENT_TYPE + 'Roam',
    update: 'updateLayout'
  }, function (payload, ecModel) {
    ecModel.eachComponent(COMPONENT_TYPE, function (amapModel) {
      var amap = amapModel.getAMap();
      var center = amap.getCenter();
      amapModel.setCenterAndZoom([center.lng, center.lat], amap.getZoom());
    });
  });
}

/**
 * TODO use `echarts/core` rather than `echarts/lib/echarts`
 * to avoid self-registered `CanvasRenderer` and `DataSetComponent` in Apache ECharts 5
 * but it's not compatible with echarts v4. Leave it to 2.0.
 */
isNewEC ? echarts.use(install) : install(echarts);

exports.name = name;
exports.version = version;
