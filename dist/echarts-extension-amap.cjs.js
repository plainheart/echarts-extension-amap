/*!
 * echarts-extension-amap 
 * @version 1.9.1
 * @author plainheart
 * 
 * MIT License
 * 
 * Copyright (c) 2019-2021 Zhongxiang.Wang
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

Object.defineProperty(exports, '__esModule', { value: true });

var echarts$1 = require('echarts/lib/echarts');

/* global AMap */

function dataToCoordSize(dataSize, dataItem) {
  dataItem = dataItem || [0, 0];
  return echarts$1.util.map([0, 1], function (dimIdx) {
    var val = dataItem[dimIdx];
    var halfSize = dataSize[dimIdx] / 2;
    var p1 = [];
    var p2 = [];
    p1[dimIdx] = val - halfSize;
    p2[dimIdx] = val + halfSize;
    p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];
    return Math.abs(this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx]);
  }, this);
} // exclude private and unsupported options


var excludedOptions = ['echartsLayerZIndex', // DEPRECATED since v1.9.0
'echartsLayerInteractive', 'renderOnMoving', 'largeMode', 'layers'];

function AMapCoordSys(amap, api) {
  this._amap = amap;
  this._api = api;
  this._mapOffset = [0, 0]; // this.dimensions = ['lng', 'lat']
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
  return new echarts$1.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};

AMapCoordSysProto.getRoamTransform = function () {
  return echarts$1.matrix.create();
};

AMapCoordSysProto.prepareCustoms = function () {
  var rect = this.getViewRect();
  return {
    coordSys: {
      // The name exposed to user is always 'cartesian2d' but not 'grid'.
      type: 'amap',
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    },
    api: {
      coord: echarts$1.util.bind(this.dataToPoint, this),
      size: echarts$1.util.bind(dataToCoordSize, this)
    }
  };
};

AMapCoordSys.create = function (ecModel, api) {
  var amapCoordSys;
  ecModel.eachComponent('amap', function (amapModel) {
    if (typeof AMap === 'undefined') {
      throw new Error('AMap api is not loaded');
    }

    if (amapCoordSys) {
      throw new Error('Only one amap component can exist');
    }

    var amap = amapModel.getAMap();
    var echartsLayerInteractive = amapModel.get('echartsLayerInteractive');

    if (!amap) {
      var root = api.getDom();
      var painter = api.getZr().painter;
      var viewportRoot = painter.getViewportRoot(); // PENDING not hidden?

      viewportRoot.style.visibility = 'hidden'; // Not support IE8

      var amapRoot = root.querySelector('.ec-extension-amap');

      if (amapRoot) {
        // Reset viewport left and top, which will be changed
        // in moving handler in AMapView
        viewportRoot.style.left = '0px';
        viewportRoot.style.top = '0px';
        root.removeChild(amapRoot);
      }

      amapRoot = document.createElement('div');
      amapRoot.className = 'ec-extension-amap';
      amapRoot.style.cssText = 'position:absolute;top:0;left:0;bottom:0;right:0;';
      root.appendChild(amapRoot);
      var options = echarts$1.util.clone(amapModel.get());

      if ('echartsLayerZIndex' in options) {
        console.warn('[ECharts][Extension][AMap] DEPRECATED: the option `echartsLayerZIndex` has been removed since v1.9.0, use `echartsLayerInteractive` instead.');
      } // delete excluded options


      echarts$1.util.each(excludedOptions, function (key) {
        delete options[key];
      });
      amap = new AMap.Map(amapRoot, options);
      amapModel.setAMap(amap); // use `complete` callback to avoid NPE when first load amap

      amap.on('complete', function () {
        amapRoot.querySelector('.amap-maps').appendChild(viewportRoot); // PENDING

        viewportRoot.style.visibility = '';
      });
      amapModel.setEChartsLayer(viewportRoot); // Override

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
    } // update map style(#13)


    var originalMapStyle = amapModel.__mapStyle;
    var newMapStyle = amapModel.get('mapStyle');

    if (originalMapStyle !== newMapStyle) {
      amap.setMapStyle(newMapStyle);
      amapModel.__mapStyle = newMapStyle;
    } // update map lang
    // PENDING: AMap 2.x does not support `setLang` yet


    if (amap.setLang) {
      var originalMapLang = amapModel.__mapLang;
      var newMapLang = amapModel.get('lang');

      if (originalMapLang !== newMapLang) {
        amap.setLang(newMapLang);
        amapModel.__mapLang = newMapLang;
      }
    }

    amapCoordSys = new AMapCoordSys(amap, api);
    amapCoordSys.setMapOffset(amapModel.__mapOffset || [0, 0]);
    amapCoordSys.setZoom(zoom);
    amapCoordSys.setCenter(center);
    amapModel.coordinateSystem = amapCoordSys;
  });
  ecModel.eachSeries(function (seriesModel) {
    if (seriesModel.get('coordinateSystem') === 'amap') {
      seriesModel.coordinateSystem = amapCoordSys;
    }
  });
};

AMapCoordSysProto.dimensions = AMapCoordSys.dimensions = ['lng', 'lat'];

var isV5 = echarts$1.version.split('.')[0] > 4;
function v2Equal(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}

var AMapModel = {
  type: 'amap',
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
  setEChartsLayerVisiblity: function setEChartsLayerVisiblity(visible) {
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
    largeMode: false
  }
};
var AMapModel$1 = isV5 ? echarts$1.ComponentModel.extend(AMapModel) : AMapModel;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */

var FUNC_ERROR_TEXT = 'Expected a function';
/** Used as references for various `Number` constants. */

var NAN = 0 / 0;
/** `Object#toString` result references. */

var symbolTag = '[object Symbol]';
/** Used to match leading and trailing whitespace. */

var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */

var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */

var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */

var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */

var freeParseInt = parseInt;
/** Detect free variable `global` from Node.js. */

var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
/** Detect free variable `self`. */

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root = freeGlobal || freeSelf || Function('return this')();
/** Used for built-in method references. */

var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var objectToString = objectProto.toString;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max,
    nativeMin = Math.min;
/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */

var now = function () {
  return root.Date.now();
};
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */


function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  wait = toNumber(wait) || 0;

  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time; // Start the timer for the trailing edge.

    timerId = setTimeout(timerExpired, wait); // Invoke the leading edge.

    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;
    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime; // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.

    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();

    if (shouldInvoke(time)) {
      return trailingEdge(time);
    } // Restart the timer.


    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined; // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }

    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }

      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }

    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */


function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */


function isObjectLike(value) {
  return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */


function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */


function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }

  if (isSymbol(value)) {
    return NAN;
  }

  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }

  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }

  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

var lodash_debounce = debounce;

/* global AMap */

var AMapView = {
  type: 'amap',
  init: function init() {
    this._isFirstRender = true;
  },
  render: function render(amapModel, ecModel, api) {
    var rendering = true;
    var amap = amapModel.getAMap();
    var viewportRoot = api.getZr().painter.getViewportRoot();
    var offsetEl = amap.getContainer();
    var coordSys = amapModel.coordinateSystem;
    var renderOnMoving = amapModel.get('renderOnMoving');
    var resizeEnable = amapModel.get('resizeEnable');
    var largeMode = amapModel.get('largeMode'); // `AMap.version` only exists in AMap 2.x
    // For AMap 1.x, it's `AMap.v`

    var is2X = AMap.version >= 2;
    var is3DMode = amap.getViewMode_() === '3D';

    var moveHandler = function moveHandler() {
      if (rendering) {
        return;
      }

      var offsetElStyle = offsetEl.style;
      var mapOffset = [-parseInt(offsetElStyle.left, 10) || 0, -parseInt(offsetElStyle.top, 10) || 0]; // only update style when map offset changed

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
      api.dispatchAction({
        type: 'amapRoam',
        animation: {
          // compatible with ECharts 5.x
          // no delay for rendering but remain animation of elements
          duration: 0
        }
      });
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

    amap.on(renderOnMoving ? is2X ? 'viewchange' : is3DMode ? 'camerachange' : 'mapmove' : 'moveend', // FIXME: bad performance in 1.x in the cases with large data, use debounce?
    // moveHandler
    !is2X && largeMode ? moveHandler = lodash_debounce(moveHandler, 20) : moveHandler);
    this._moveHandler = moveHandler;

    if (renderOnMoving && !(is2X && is3DMode)) {
      // need to listen to zoom if 1.x & 2D mode
      // FIXME: unnecessary `mapmove` event triggered when zooming
      amap.on('zoom', moveHandler);
    }

    if (!renderOnMoving) {
      amap.on('movestart', this._moveStartHandler = function (e) {
        setTimeout(function () {
          amapModel.setEChartsLayerVisiblity(false);
        }, 0);
      });

      var moveEndHandler = this._moveEndHandler = function (e) {
        (!e || e.type !== 'moveend') && moveHandler();
        setTimeout(function () {
          amapModel.setEChartsLayerVisiblity(true);
        }, is2X || !largeMode ? 0 : 20);
      };

      amap.on('moveend', moveEndHandler);
      amap.on('zoomend', moveEndHandler);

      if (this._isFirstRender && is3DMode) {
        // FIXME: not rewrite AMap instance method
        var nativeSetPicth = amap.setPitch;
        var nativeSetRotation = amap.setRotation;

        amap.setPitch = function () {
          nativeSetPicth.apply(this, arguments);
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
        echarts.getInstanceByDom(api.getDom()).resize();
      };

      if (!is2X && largeMode) {
        resizeHandler = lodash_debounce(resizeHandler, 20);
      }

      amap.on('resize', this._resizeHandler = resizeHandler);
    }

    this._isFirstRender = rendering = false;
  },
  dispose: function dispose(ecModel) {
    var component = ecModel.getComponent('amap');

    if (component) {
      component.getAMap().destroy();
      component.setAMap(null);
      component.setEChartsLayer(null);

      if (component.coordinateSystem) {
        component.coordinateSystem.setAMap(null);
        component.coordinateSystem = null;
      }

      delete this._moveHandler;
      delete this._resizeHandler;
      delete this._moveStartHandler;
      delete this._moveEndHandler;
    }
  }
};
var AMapView$1 = isV5 ? echarts$1.ComponentView.extend(AMapView) : AMapView;

var name = "echarts-extension-amap";
var version = "1.9.1";

/**
 * AMap component extension
 */
function install(registers) {
  // Model
  isV5 ? registers.registerComponentModel(AMapModel$1) : registers.extendComponentModel(AMapModel$1); // View

  isV5 ? registers.registerComponentView(AMapView$1) : registers.extendComponentView(AMapView$1); // Coordinate System

  registers.registerCoordinateSystem('amap', AMapCoordSys); // Action

  registers.registerAction({
    type: 'amapRoam',
    event: 'amapRoam',
    update: 'updateLayout'
  }, function (payload, ecModel) {
    ecModel.eachComponent('amap', function (amapModel) {
      var amap = amapModel.getAMap();
      var center = amap.getCenter();
      amapModel.setCenterAndZoom([center.lng, center.lat], amap.getZoom());
    });
  });
}

isV5 ? echarts$1.use(install) : install(echarts$1);

exports.name = name;
exports.version = version;
