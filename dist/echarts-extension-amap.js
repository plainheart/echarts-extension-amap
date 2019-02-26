(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("echarts"));
	else if(typeof define === 'function' && define.amd)
		define(["echarts"], factory);
	else if(typeof exports === 'object')
		exports["amap"] = factory(require("echarts"));
	else
		root["amap"] = factory(root["echarts"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_echarts__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, description, main, scripts, repository, keywords, author, license, bugs, homepage, devDependencies, dependencies, default */
/***/ (function(module) {

eval("module.exports = {\"name\":\"echarts-extension-amap\",\"version\":\"1.0.0-rc.3\",\"description\":\"An AMap(https://lbs.amap.com) extension for echarts(https://github.com/apache/incubator-echarts)\",\"main\":\"dist/echarts-extension-amap.min.js\",\"scripts\":{\"build\":\"webpack -p\",\"dev\":\"webpack -d\",\"test\":\"echo \\\"Error: no test specified\\\" && exit 1\"},\"repository\":{\"type\":\"git\",\"url\":\"git+https://github.com/plainheart/echarts-extension-amap.git\"},\"keywords\":[\"echarts\",\"amap\",\"autonavi\",\"echarts-extention\",\"data-visualization\",\"map\",\"gaode\"],\"author\":\"plainheart\",\"license\":\"MIT\",\"bugs\":{\"url\":\"https://github.com/plainheart/echarts-extension-amap/issues\"},\"homepage\":\"https://github.com/plainheart/echarts-extension-amap#readme\",\"devDependencies\":{\"webpack\":\"^4.29.5\",\"webpack-cli\":\"^3.2.3\"},\"dependencies\":{\"echarts\":\"^4.1.0\"}};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWNrYWdlLmpzb24uanMiLCJzb3VyY2VzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./package.json\n");

/***/ }),

/***/ "./src/AMapCoordSys.js":
/*!*****************************!*\
  !*** ./src/AMapCoordSys.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var echarts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! echarts */ \"echarts\");\n/* harmony import */ var echarts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(echarts__WEBPACK_IMPORTED_MODULE_0__);\n/* global AMap */\n\n\n\nfunction AMapCoordSys(amap, api) {\n  this._amap = amap;\n  this.dimensions = [\"lng\", \"lat\"];\n  this._mapOffset = [0, 0];\n  this._api = api;\n}\n\nAMapCoordSys.prototype.dimensions = [\"lng\", \"lat\"];\n\nAMapCoordSys.prototype.setZoom = function(zoom) {\n  this._zoom = zoom;\n};\n\nAMapCoordSys.prototype.setCenter = function(center) {\n  this._center = this._amap.lnglatToPixel(\n    new AMap.LngLat(center[0], center[1])\n  );\n};\n\nAMapCoordSys.prototype.setMapOffset = function(mapOffset) {\n  this._mapOffset = mapOffset;\n};\n\nAMapCoordSys.prototype.getAMap = function() {\n  return this._amap;\n};\n\nAMapCoordSys.prototype.dataToPoint = function(data) {\n  var lnglat = new AMap.LngLat(data[0], data[1]);\n  var px = this._amap.lngLatToContainer(lnglat);\n  var mapOffset = this._mapOffset;\n  return [px.x - mapOffset[0], px.y - mapOffset[1]];\n};\n\nAMapCoordSys.prototype.pointToData = function(pt) {\n  var mapOffset = this._mapOffset;\n  var lnglat = this._amap.containerToLngLat(\n    AMap.Pixel(pt[0] + mapOffset[0], pt[1] + mapOffset[1])\n  );\n  return [lnglat.lng, lnglat.lat];\n};\n\nAMapCoordSys.prototype.getViewRect = function() {\n  var api = this._api;\n  return new echarts__WEBPACK_IMPORTED_MODULE_0__[\"graphic\"].BoundingRect(0, 0, api.getWidth(), api.getHeight());\n};\n\nAMapCoordSys.prototype.getRoamTransform = function() {\n  return echarts__WEBPACK_IMPORTED_MODULE_0__[\"matrix\"].create();\n};\n\nAMapCoordSys.prototype.prepareCustoms = function(data) {\n  var rect = this.getViewRect();\n  return {\n    coordSys: {\n      // The name exposed to user is always 'cartesian2d' but not 'grid'.\n      type: \"amap\",\n      x: rect.x,\n      y: rect.y,\n      width: rect.width,\n      height: rect.height\n    },\n    api: {\n      coord: echarts__WEBPACK_IMPORTED_MODULE_0__[\"util\"].bind(this.dataToPoint, this),\n      size: echarts__WEBPACK_IMPORTED_MODULE_0__[\"util\"].bind(dataToCoordSize, this)\n    }\n  };\n};\n\nfunction dataToCoordSize(dataSize, dataItem) {\n  dataItem = dataItem || [0, 0];\n  return echarts__WEBPACK_IMPORTED_MODULE_0__[\"util\"].map(\n    [0, 1],\n    function(dimIdx) {\n      var val = dataItem[dimIdx];\n      var halfSize = dataSize[dimIdx] / 2;\n      var p1 = [];\n      var p2 = [];\n      p1[dimIdx] = val - halfSize;\n      p2[dimIdx] = val + halfSize;\n      p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];\n      return Math.abs(\n        this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx]\n      );\n    },\n    this\n  );\n}\n\n// For deciding which dimensions to use when creating list data\nAMapCoordSys.dimensions = AMapCoordSys.prototype.dimensions;\n\nAMapCoordSys.create = function(ecModel, api) {\n  var amapCoordSys;\n  var root = api.getDom();\n\n  // TODO Dispose\n  ecModel.eachComponent(\"amap\", function(amapModel) {\n    var painter = api.getZr().painter;\n    var viewportRoot = painter.getViewportRoot();\n    if (typeof AMap === \"undefined\") {\n      throw new Error(\"AMap api is not loaded\");\n    }\n    if (amapCoordSys) {\n      throw new Error(\"Only one amap component can exist\");\n    }\n    if (!amapModel.__amap) {\n      // Not support IE8\n      var amapRoot = root.querySelector(\".ec-extension-amap\");\n      if (amapRoot) {\n        // Reset viewport left and top, which will be changed\n        // in moving handler in AMapView\n        viewportRoot.style.left = \"0px\";\n        viewportRoot.style.top = \"0px\";\n        root.removeChild(amapRoot);\n      }\n      amapRoot = document.createElement(\"div\");\n      amapRoot.style.cssText = \"width:100%;height:100%\";\n      // Not support IE8\n      amapRoot.classList.add(\"ec-extension-amap\");\n      root.appendChild(amapRoot);\n\n      var options = amapModel.get();\n      var amap = (amapModel.__amap = new AMap.Map(amapRoot, options));\n      var echartsLayer = new AMap.CustomLayer(viewportRoot, {\n        zIndex: options.echartsLayerZIndex\n      });\n      amapModel.__echartsLayer = echartsLayer;\n      amap.add(echartsLayer);\n\n      // Override\n      painter.getViewportRootOffset = function() {\n        return { offsetLeft: 0, offsetTop: 0 };\n      };\n    }\n    var amap = amapModel.__amap;\n    var center = amap.getCenter();\n    var zoom = amap.getZoom();\n\n    amapCoordSys = new AMapCoordSys(amap, api);\n    amapCoordSys.setMapOffset(amapModel.__mapOffset || [0, 0]);\n    amapCoordSys.setZoom(zoom);\n    amapCoordSys.setCenter([center.lng, center.lat]);\n\n    amapModel.coordinateSystem = amapCoordSys;\n  });\n\n  ecModel.eachSeries(function(seriesModel) {\n    if (seriesModel.get(\"coordinateSystem\") === \"amap\") {\n      seriesModel.coordinateSystem = amapCoordSys;\n    }\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (AMapCoordSys);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQU1hcENvb3JkU3lzLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vW25hbWVdLy4vc3JjL0FNYXBDb29yZFN5cy5qcz8xZDUzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCBBTWFwICovXG5cbmltcG9ydCB7IHV0aWwgYXMgenJVdGlsLCBncmFwaGljLCBtYXRyaXggfSBmcm9tIFwiZWNoYXJ0c1wiO1xuXG5mdW5jdGlvbiBBTWFwQ29vcmRTeXMoYW1hcCwgYXBpKSB7XG4gIHRoaXMuX2FtYXAgPSBhbWFwO1xuICB0aGlzLmRpbWVuc2lvbnMgPSBbXCJsbmdcIiwgXCJsYXRcIl07XG4gIHRoaXMuX21hcE9mZnNldCA9IFswLCAwXTtcbiAgdGhpcy5fYXBpID0gYXBpO1xufVxuXG5BTWFwQ29vcmRTeXMucHJvdG90eXBlLmRpbWVuc2lvbnMgPSBbXCJsbmdcIiwgXCJsYXRcIl07XG5cbkFNYXBDb29yZFN5cy5wcm90b3R5cGUuc2V0Wm9vbSA9IGZ1bmN0aW9uKHpvb20pIHtcbiAgdGhpcy5fem9vbSA9IHpvb207XG59O1xuXG5BTWFwQ29vcmRTeXMucHJvdG90eXBlLnNldENlbnRlciA9IGZ1bmN0aW9uKGNlbnRlcikge1xuICB0aGlzLl9jZW50ZXIgPSB0aGlzLl9hbWFwLmxuZ2xhdFRvUGl4ZWwoXG4gICAgbmV3IEFNYXAuTG5nTGF0KGNlbnRlclswXSwgY2VudGVyWzFdKVxuICApO1xufTtcblxuQU1hcENvb3JkU3lzLnByb3RvdHlwZS5zZXRNYXBPZmZzZXQgPSBmdW5jdGlvbihtYXBPZmZzZXQpIHtcbiAgdGhpcy5fbWFwT2Zmc2V0ID0gbWFwT2Zmc2V0O1xufTtcblxuQU1hcENvb3JkU3lzLnByb3RvdHlwZS5nZXRBTWFwID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9hbWFwO1xufTtcblxuQU1hcENvb3JkU3lzLnByb3RvdHlwZS5kYXRhVG9Qb2ludCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgdmFyIGxuZ2xhdCA9IG5ldyBBTWFwLkxuZ0xhdChkYXRhWzBdLCBkYXRhWzFdKTtcbiAgdmFyIHB4ID0gdGhpcy5fYW1hcC5sbmdMYXRUb0NvbnRhaW5lcihsbmdsYXQpO1xuICB2YXIgbWFwT2Zmc2V0ID0gdGhpcy5fbWFwT2Zmc2V0O1xuICByZXR1cm4gW3B4LnggLSBtYXBPZmZzZXRbMF0sIHB4LnkgLSBtYXBPZmZzZXRbMV1dO1xufTtcblxuQU1hcENvb3JkU3lzLnByb3RvdHlwZS5wb2ludFRvRGF0YSA9IGZ1bmN0aW9uKHB0KSB7XG4gIHZhciBtYXBPZmZzZXQgPSB0aGlzLl9tYXBPZmZzZXQ7XG4gIHZhciBsbmdsYXQgPSB0aGlzLl9hbWFwLmNvbnRhaW5lclRvTG5nTGF0KFxuICAgIEFNYXAuUGl4ZWwocHRbMF0gKyBtYXBPZmZzZXRbMF0sIHB0WzFdICsgbWFwT2Zmc2V0WzFdKVxuICApO1xuICByZXR1cm4gW2xuZ2xhdC5sbmcsIGxuZ2xhdC5sYXRdO1xufTtcblxuQU1hcENvb3JkU3lzLnByb3RvdHlwZS5nZXRWaWV3UmVjdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXBpID0gdGhpcy5fYXBpO1xuICByZXR1cm4gbmV3IGdyYXBoaWMuQm91bmRpbmdSZWN0KDAsIDAsIGFwaS5nZXRXaWR0aCgpLCBhcGkuZ2V0SGVpZ2h0KCkpO1xufTtcblxuQU1hcENvb3JkU3lzLnByb3RvdHlwZS5nZXRSb2FtVHJhbnNmb3JtID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBtYXRyaXguY3JlYXRlKCk7XG59O1xuXG5BTWFwQ29vcmRTeXMucHJvdG90eXBlLnByZXBhcmVDdXN0b21zID0gZnVuY3Rpb24oZGF0YSkge1xuICB2YXIgcmVjdCA9IHRoaXMuZ2V0Vmlld1JlY3QoKTtcbiAgcmV0dXJuIHtcbiAgICBjb29yZFN5czoge1xuICAgICAgLy8gVGhlIG5hbWUgZXhwb3NlZCB0byB1c2VyIGlzIGFsd2F5cyAnY2FydGVzaWFuMmQnIGJ1dCBub3QgJ2dyaWQnLlxuICAgICAgdHlwZTogXCJhbWFwXCIsXG4gICAgICB4OiByZWN0LngsXG4gICAgICB5OiByZWN0LnksXG4gICAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICAgIGhlaWdodDogcmVjdC5oZWlnaHRcbiAgICB9LFxuICAgIGFwaToge1xuICAgICAgY29vcmQ6IHpyVXRpbC5iaW5kKHRoaXMuZGF0YVRvUG9pbnQsIHRoaXMpLFxuICAgICAgc2l6ZTogenJVdGlsLmJpbmQoZGF0YVRvQ29vcmRTaXplLCB0aGlzKVxuICAgIH1cbiAgfTtcbn07XG5cbmZ1bmN0aW9uIGRhdGFUb0Nvb3JkU2l6ZShkYXRhU2l6ZSwgZGF0YUl0ZW0pIHtcbiAgZGF0YUl0ZW0gPSBkYXRhSXRlbSB8fCBbMCwgMF07XG4gIHJldHVybiB6clV0aWwubWFwKFxuICAgIFswLCAxXSxcbiAgICBmdW5jdGlvbihkaW1JZHgpIHtcbiAgICAgIHZhciB2YWwgPSBkYXRhSXRlbVtkaW1JZHhdO1xuICAgICAgdmFyIGhhbGZTaXplID0gZGF0YVNpemVbZGltSWR4XSAvIDI7XG4gICAgICB2YXIgcDEgPSBbXTtcbiAgICAgIHZhciBwMiA9IFtdO1xuICAgICAgcDFbZGltSWR4XSA9IHZhbCAtIGhhbGZTaXplO1xuICAgICAgcDJbZGltSWR4XSA9IHZhbCArIGhhbGZTaXplO1xuICAgICAgcDFbMSAtIGRpbUlkeF0gPSBwMlsxIC0gZGltSWR4XSA9IGRhdGFJdGVtWzEgLSBkaW1JZHhdO1xuICAgICAgcmV0dXJuIE1hdGguYWJzKFxuICAgICAgICB0aGlzLmRhdGFUb1BvaW50KHAxKVtkaW1JZHhdIC0gdGhpcy5kYXRhVG9Qb2ludChwMilbZGltSWR4XVxuICAgICAgKTtcbiAgICB9LFxuICAgIHRoaXNcbiAgKTtcbn1cblxuLy8gRm9yIGRlY2lkaW5nIHdoaWNoIGRpbWVuc2lvbnMgdG8gdXNlIHdoZW4gY3JlYXRpbmcgbGlzdCBkYXRhXG5BTWFwQ29vcmRTeXMuZGltZW5zaW9ucyA9IEFNYXBDb29yZFN5cy5wcm90b3R5cGUuZGltZW5zaW9ucztcblxuQU1hcENvb3JkU3lzLmNyZWF0ZSA9IGZ1bmN0aW9uKGVjTW9kZWwsIGFwaSkge1xuICB2YXIgYW1hcENvb3JkU3lzO1xuICB2YXIgcm9vdCA9IGFwaS5nZXREb20oKTtcblxuICAvLyBUT0RPIERpc3Bvc2VcbiAgZWNNb2RlbC5lYWNoQ29tcG9uZW50KFwiYW1hcFwiLCBmdW5jdGlvbihhbWFwTW9kZWwpIHtcbiAgICB2YXIgcGFpbnRlciA9IGFwaS5nZXRacigpLnBhaW50ZXI7XG4gICAgdmFyIHZpZXdwb3J0Um9vdCA9IHBhaW50ZXIuZ2V0Vmlld3BvcnRSb290KCk7XG4gICAgaWYgKHR5cGVvZiBBTWFwID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBTWFwIGFwaSBpcyBub3QgbG9hZGVkXCIpO1xuICAgIH1cbiAgICBpZiAoYW1hcENvb3JkU3lzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IG9uZSBhbWFwIGNvbXBvbmVudCBjYW4gZXhpc3RcIik7XG4gICAgfVxuICAgIGlmICghYW1hcE1vZGVsLl9fYW1hcCkge1xuICAgICAgLy8gTm90IHN1cHBvcnQgSUU4XG4gICAgICB2YXIgYW1hcFJvb3QgPSByb290LnF1ZXJ5U2VsZWN0b3IoXCIuZWMtZXh0ZW5zaW9uLWFtYXBcIik7XG4gICAgICBpZiAoYW1hcFJvb3QpIHtcbiAgICAgICAgLy8gUmVzZXQgdmlld3BvcnQgbGVmdCBhbmQgdG9wLCB3aGljaCB3aWxsIGJlIGNoYW5nZWRcbiAgICAgICAgLy8gaW4gbW92aW5nIGhhbmRsZXIgaW4gQU1hcFZpZXdcbiAgICAgICAgdmlld3BvcnRSb290LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICB2aWV3cG9ydFJvb3Quc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChhbWFwUm9vdCk7XG4gICAgICB9XG4gICAgICBhbWFwUm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBhbWFwUm9vdC5zdHlsZS5jc3NUZXh0ID0gXCJ3aWR0aDoxMDAlO2hlaWdodDoxMDAlXCI7XG4gICAgICAvLyBOb3Qgc3VwcG9ydCBJRThcbiAgICAgIGFtYXBSb290LmNsYXNzTGlzdC5hZGQoXCJlYy1leHRlbnNpb24tYW1hcFwiKTtcbiAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoYW1hcFJvb3QpO1xuXG4gICAgICB2YXIgb3B0aW9ucyA9IGFtYXBNb2RlbC5nZXQoKTtcbiAgICAgIHZhciBhbWFwID0gKGFtYXBNb2RlbC5fX2FtYXAgPSBuZXcgQU1hcC5NYXAoYW1hcFJvb3QsIG9wdGlvbnMpKTtcbiAgICAgIHZhciBlY2hhcnRzTGF5ZXIgPSBuZXcgQU1hcC5DdXN0b21MYXllcih2aWV3cG9ydFJvb3QsIHtcbiAgICAgICAgekluZGV4OiBvcHRpb25zLmVjaGFydHNMYXllclpJbmRleFxuICAgICAgfSk7XG4gICAgICBhbWFwTW9kZWwuX19lY2hhcnRzTGF5ZXIgPSBlY2hhcnRzTGF5ZXI7XG4gICAgICBhbWFwLmFkZChlY2hhcnRzTGF5ZXIpO1xuXG4gICAgICAvLyBPdmVycmlkZVxuICAgICAgcGFpbnRlci5nZXRWaWV3cG9ydFJvb3RPZmZzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHsgb2Zmc2V0TGVmdDogMCwgb2Zmc2V0VG9wOiAwIH07XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgYW1hcCA9IGFtYXBNb2RlbC5fX2FtYXA7XG4gICAgdmFyIGNlbnRlciA9IGFtYXAuZ2V0Q2VudGVyKCk7XG4gICAgdmFyIHpvb20gPSBhbWFwLmdldFpvb20oKTtcblxuICAgIGFtYXBDb29yZFN5cyA9IG5ldyBBTWFwQ29vcmRTeXMoYW1hcCwgYXBpKTtcbiAgICBhbWFwQ29vcmRTeXMuc2V0TWFwT2Zmc2V0KGFtYXBNb2RlbC5fX21hcE9mZnNldCB8fCBbMCwgMF0pO1xuICAgIGFtYXBDb29yZFN5cy5zZXRab29tKHpvb20pO1xuICAgIGFtYXBDb29yZFN5cy5zZXRDZW50ZXIoW2NlbnRlci5sbmcsIGNlbnRlci5sYXRdKTtcblxuICAgIGFtYXBNb2RlbC5jb29yZGluYXRlU3lzdGVtID0gYW1hcENvb3JkU3lzO1xuICB9KTtcblxuICBlY01vZGVsLmVhY2hTZXJpZXMoZnVuY3Rpb24oc2VyaWVzTW9kZWwpIHtcbiAgICBpZiAoc2VyaWVzTW9kZWwuZ2V0KFwiY29vcmRpbmF0ZVN5c3RlbVwiKSA9PT0gXCJhbWFwXCIpIHtcbiAgICAgIHNlcmllc01vZGVsLmNvb3JkaW5hdGVTeXN0ZW0gPSBhbWFwQ29vcmRTeXM7XG4gICAgfVxuICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFNYXBDb29yZFN5cztcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/AMapCoordSys.js\n");

/***/ }),

/***/ "./src/AMapModel.js":
/*!**************************!*\
  !*** ./src/AMapModel.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var echarts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! echarts */ \"echarts\");\n/* harmony import */ var echarts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(echarts__WEBPACK_IMPORTED_MODULE_0__);\n\n\nfunction v2Equal(a, b) {\n  return a && b && a[0] === b[0] && a[1] === b[1];\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (echarts__WEBPACK_IMPORTED_MODULE_0__[\"extendComponentModel\"]({\n  type: \"amap\",\n\n  getAMap: function() {\n    // __amap is injected when creating AMapCoordSys\n    return this.__amap;\n  },\n\n  setCenterAndZoom: function(center, zoom) {\n    this.option.center = center;\n    this.option.zoom = zoom;\n  },\n\n  centerOrZoomChanged: function(center, zoom) {\n    var option = this.option;\n    return !(v2Equal(center, option.center) && zoom === option.zoom);\n  },\n\n  defaultOption: {\n    center: [116.397428, 39.90923],\n    zoom: 5,\n    isHotspot: false,\n    echartsLayerZIndex: 2000\n  }\n}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQU1hcE1vZGVsLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vW25hbWVdLy4vc3JjL0FNYXBNb2RlbC5qcz8zYWVmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjaGFydHMgZnJvbSBcImVjaGFydHNcIjtcblxuZnVuY3Rpb24gdjJFcXVhbChhLCBiKSB7XG4gIHJldHVybiBhICYmIGIgJiYgYVswXSA9PT0gYlswXSAmJiBhWzFdID09PSBiWzFdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBlY2hhcnRzLmV4dGVuZENvbXBvbmVudE1vZGVsKHtcbiAgdHlwZTogXCJhbWFwXCIsXG5cbiAgZ2V0QU1hcDogZnVuY3Rpb24oKSB7XG4gICAgLy8gX19hbWFwIGlzIGluamVjdGVkIHdoZW4gY3JlYXRpbmcgQU1hcENvb3JkU3lzXG4gICAgcmV0dXJuIHRoaXMuX19hbWFwO1xuICB9LFxuXG4gIHNldENlbnRlckFuZFpvb206IGZ1bmN0aW9uKGNlbnRlciwgem9vbSkge1xuICAgIHRoaXMub3B0aW9uLmNlbnRlciA9IGNlbnRlcjtcbiAgICB0aGlzLm9wdGlvbi56b29tID0gem9vbTtcbiAgfSxcblxuICBjZW50ZXJPclpvb21DaGFuZ2VkOiBmdW5jdGlvbihjZW50ZXIsIHpvb20pIHtcbiAgICB2YXIgb3B0aW9uID0gdGhpcy5vcHRpb247XG4gICAgcmV0dXJuICEodjJFcXVhbChjZW50ZXIsIG9wdGlvbi5jZW50ZXIpICYmIHpvb20gPT09IG9wdGlvbi56b29tKTtcbiAgfSxcblxuICBkZWZhdWx0T3B0aW9uOiB7XG4gICAgY2VudGVyOiBbMTE2LjM5NzQyOCwgMzkuOTA5MjNdLFxuICAgIHpvb206IDUsXG4gICAgaXNIb3RzcG90OiBmYWxzZSxcbiAgICBlY2hhcnRzTGF5ZXJaSW5kZXg6IDIwMDBcbiAgfVxufSk7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/AMapModel.js\n");

/***/ }),

/***/ "./src/AMapView.js":
/*!*************************!*\
  !*** ./src/AMapView.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var echarts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! echarts */ \"echarts\");\n/* harmony import */ var echarts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(echarts__WEBPACK_IMPORTED_MODULE_0__);\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (echarts__WEBPACK_IMPORTED_MODULE_0__[\"extendComponentView\"]({\n  type: \"amap\",\n\n  render: function(aMapModel, ecModel, api) {\n    var rendering = true;\n\n    var amap = aMapModel.getAMap();\n    var echartsLayer = aMapModel.__echartsLayer;\n    var viewportRoot = api.getZr().painter.getViewportRoot();\n    var coordSys = aMapModel.coordinateSystem;\n\n    var moveHandler = function(e) {\n      if (rendering) {\n        return;\n      }\n      var offsetEl = viewportRoot.parentNode.parentNode.parentNode;\n      var mapOffset = [\n        -parseInt(offsetEl.style.left, 10) || 0,\n        -parseInt(offsetEl.style.top, 10) || 0\n      ];\n      viewportRoot.style.left = mapOffset[0] + \"px\";\n      viewportRoot.style.top = mapOffset[1] + \"px\";\n\n      coordSys.setMapOffset(mapOffset);\n      aMapModel.__mapOffset = mapOffset;\n\n      api.dispatchAction({\n        type: \"amapRoam\"\n      });\n    };\n\n    var zoomStartHandler = function(e) {\n      if (rendering) {\n        return;\n      }\n      echartsLayer.setOpacity(0);\n    };\n\n    var zoomEndHandler = function(e) {\n      if (rendering) {\n        return;\n      }\n      echartsLayer.setOpacity(1);\n      api.dispatchAction({\n        type: \"amapRoam\"\n      });\n    };\n\n    var resizeHandler = function(e) {\n      echarts__WEBPACK_IMPORTED_MODULE_0__[\"getInstanceByDom\"](api.getDom()).resize();\n      moveHandler.call(this, e);\n    };\n\n    var resizeEnable = amap.getStatus().resizeEnable;\n\n    amap.off(\"movestart\", this._oldMoveHandler);\n    //amap.off(\"mapmove\", this._oldMoveHandler);\n    amap.off(\"moveend\", this._oldZoomEndHandler);\n    amap.off(\"complete\", this._oldZoomEndHandler);\n    amap.off(\"zoomstart\", this._oldZoomStartHandler);\n    amap.off(\"zoomend\", this._oldZoomEndHandler);\n    resizeEnable && amap.off(\"resize\", this._oldResizeHandler);\n\n    amap.on(\"movestart\", moveHandler);\n    //amap.on(\"mapmove\", moveHandler);\n    amap.on(\"moveend\", zoomEndHandler);\n    amap.on(\"complete\", zoomEndHandler);\n    amap.on(\"zoomstart\", zoomStartHandler);\n    amap.on(\"zoomend\", zoomEndHandler);\n    resizeEnable && amap.on(\"resize\", resizeHandler);\n\n    this._oldMoveHandler = moveHandler;\n    this._oldZoomStartHandler = zoomStartHandler;\n    this._oldZoomEndHandler = zoomEndHandler;\n    resizeEnable && (this._oldResizeHandler = resizeHandler);\n\n    rendering = false;\n  },\n\n  dispose: function() {}\n}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvQU1hcFZpZXcuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9bbmFtZV0vLi9zcmMvQU1hcFZpZXcuanM/NDdlMSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlY2hhcnRzIGZyb20gXCJlY2hhcnRzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGVjaGFydHMuZXh0ZW5kQ29tcG9uZW50Vmlldyh7XG4gIHR5cGU6IFwiYW1hcFwiLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oYU1hcE1vZGVsLCBlY01vZGVsLCBhcGkpIHtcbiAgICB2YXIgcmVuZGVyaW5nID0gdHJ1ZTtcblxuICAgIHZhciBhbWFwID0gYU1hcE1vZGVsLmdldEFNYXAoKTtcbiAgICB2YXIgZWNoYXJ0c0xheWVyID0gYU1hcE1vZGVsLl9fZWNoYXJ0c0xheWVyO1xuICAgIHZhciB2aWV3cG9ydFJvb3QgPSBhcGkuZ2V0WnIoKS5wYWludGVyLmdldFZpZXdwb3J0Um9vdCgpO1xuICAgIHZhciBjb29yZFN5cyA9IGFNYXBNb2RlbC5jb29yZGluYXRlU3lzdGVtO1xuXG4gICAgdmFyIG1vdmVIYW5kbGVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKHJlbmRlcmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgb2Zmc2V0RWwgPSB2aWV3cG9ydFJvb3QucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgICB2YXIgbWFwT2Zmc2V0ID0gW1xuICAgICAgICAtcGFyc2VJbnQob2Zmc2V0RWwuc3R5bGUubGVmdCwgMTApIHx8IDAsXG4gICAgICAgIC1wYXJzZUludChvZmZzZXRFbC5zdHlsZS50b3AsIDEwKSB8fCAwXG4gICAgICBdO1xuICAgICAgdmlld3BvcnRSb290LnN0eWxlLmxlZnQgPSBtYXBPZmZzZXRbMF0gKyBcInB4XCI7XG4gICAgICB2aWV3cG9ydFJvb3Quc3R5bGUudG9wID0gbWFwT2Zmc2V0WzFdICsgXCJweFwiO1xuXG4gICAgICBjb29yZFN5cy5zZXRNYXBPZmZzZXQobWFwT2Zmc2V0KTtcbiAgICAgIGFNYXBNb2RlbC5fX21hcE9mZnNldCA9IG1hcE9mZnNldDtcblxuICAgICAgYXBpLmRpc3BhdGNoQWN0aW9uKHtcbiAgICAgICAgdHlwZTogXCJhbWFwUm9hbVwiXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIHpvb21TdGFydEhhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAocmVuZGVyaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGVjaGFydHNMYXllci5zZXRPcGFjaXR5KDApO1xuICAgIH07XG5cbiAgICB2YXIgem9vbUVuZEhhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAocmVuZGVyaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGVjaGFydHNMYXllci5zZXRPcGFjaXR5KDEpO1xuICAgICAgYXBpLmRpc3BhdGNoQWN0aW9uKHtcbiAgICAgICAgdHlwZTogXCJhbWFwUm9hbVwiXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIHJlc2l6ZUhhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICBlY2hhcnRzLmdldEluc3RhbmNlQnlEb20oYXBpLmdldERvbSgpKS5yZXNpemUoKTtcbiAgICAgIG1vdmVIYW5kbGVyLmNhbGwodGhpcywgZSk7XG4gICAgfTtcblxuICAgIHZhciByZXNpemVFbmFibGUgPSBhbWFwLmdldFN0YXR1cygpLnJlc2l6ZUVuYWJsZTtcblxuICAgIGFtYXAub2ZmKFwibW92ZXN0YXJ0XCIsIHRoaXMuX29sZE1vdmVIYW5kbGVyKTtcbiAgICAvL2FtYXAub2ZmKFwibWFwbW92ZVwiLCB0aGlzLl9vbGRNb3ZlSGFuZGxlcik7XG4gICAgYW1hcC5vZmYoXCJtb3ZlZW5kXCIsIHRoaXMuX29sZFpvb21FbmRIYW5kbGVyKTtcbiAgICBhbWFwLm9mZihcImNvbXBsZXRlXCIsIHRoaXMuX29sZFpvb21FbmRIYW5kbGVyKTtcbiAgICBhbWFwLm9mZihcInpvb21zdGFydFwiLCB0aGlzLl9vbGRab29tU3RhcnRIYW5kbGVyKTtcbiAgICBhbWFwLm9mZihcInpvb21lbmRcIiwgdGhpcy5fb2xkWm9vbUVuZEhhbmRsZXIpO1xuICAgIHJlc2l6ZUVuYWJsZSAmJiBhbWFwLm9mZihcInJlc2l6ZVwiLCB0aGlzLl9vbGRSZXNpemVIYW5kbGVyKTtcblxuICAgIGFtYXAub24oXCJtb3Zlc3RhcnRcIiwgbW92ZUhhbmRsZXIpO1xuICAgIC8vYW1hcC5vbihcIm1hcG1vdmVcIiwgbW92ZUhhbmRsZXIpO1xuICAgIGFtYXAub24oXCJtb3ZlZW5kXCIsIHpvb21FbmRIYW5kbGVyKTtcbiAgICBhbWFwLm9uKFwiY29tcGxldGVcIiwgem9vbUVuZEhhbmRsZXIpO1xuICAgIGFtYXAub24oXCJ6b29tc3RhcnRcIiwgem9vbVN0YXJ0SGFuZGxlcik7XG4gICAgYW1hcC5vbihcInpvb21lbmRcIiwgem9vbUVuZEhhbmRsZXIpO1xuICAgIHJlc2l6ZUVuYWJsZSAmJiBhbWFwLm9uKFwicmVzaXplXCIsIHJlc2l6ZUhhbmRsZXIpO1xuXG4gICAgdGhpcy5fb2xkTW92ZUhhbmRsZXIgPSBtb3ZlSGFuZGxlcjtcbiAgICB0aGlzLl9vbGRab29tU3RhcnRIYW5kbGVyID0gem9vbVN0YXJ0SGFuZGxlcjtcbiAgICB0aGlzLl9vbGRab29tRW5kSGFuZGxlciA9IHpvb21FbmRIYW5kbGVyO1xuICAgIHJlc2l6ZUVuYWJsZSAmJiAodGhpcy5fb2xkUmVzaXplSGFuZGxlciA9IHJlc2l6ZUhhbmRsZXIpO1xuXG4gICAgcmVuZGVyaW5nID0gZmFsc2U7XG4gIH0sXG5cbiAgZGlzcG9zZTogZnVuY3Rpb24oKSB7fVxufSk7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/AMapView.js\n");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: version, name */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../package.json */ \"./package.json\");\nvar _package_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../package.json */ \"./package.json\", 1);\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"version\", function() { return _package_json__WEBPACK_IMPORTED_MODULE_0__[\"version\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"name\", function() { return _package_json__WEBPACK_IMPORTED_MODULE_0__[\"name\"]; });\n\n/* harmony import */ var echarts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! echarts */ \"echarts\");\n/* harmony import */ var echarts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(echarts__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _AMapCoordSys__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AMapCoordSys */ \"./src/AMapCoordSys.js\");\n/* harmony import */ var _AMapModel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AMapModel */ \"./src/AMapModel.js\");\n/* harmony import */ var _AMapView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AMapView */ \"./src/AMapView.js\");\n/**\n * AMap component extension\n */\n\n\n\n\n\n\n\n\n\necharts__WEBPACK_IMPORTED_MODULE_1__[\"registerCoordinateSystem\"](\"amap\", _AMapCoordSys__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n\n// Action\necharts__WEBPACK_IMPORTED_MODULE_1__[\"registerAction\"](\n  {\n    type: \"amapRoam\",\n    event: \"amapRoam\",\n    update: \"updateLayout\"\n  },\n  function(payload, ecModel) {\n    ecModel.eachComponent(\"amap\", function(aMapModel) {\n      var amap = aMapModel.getAMap();\n      var center = amap.getCenter();\n      aMapModel.setCenterAndZoom([center.lng, center.lat], amap.getZoom());\n    });\n  }\n);\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9bbmFtZV0vLi9zcmMvaW5kZXguanM/YjYzNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFNYXAgY29tcG9uZW50IGV4dGVuc2lvblxuICovXG5cbmltcG9ydCB7IHZlcnNpb24sIG5hbWUgfSBmcm9tIFwiLi4vcGFja2FnZS5qc29uXCI7XG5cbmltcG9ydCAqIGFzIGVjaGFydHMgZnJvbSBcImVjaGFydHNcIjtcbmltcG9ydCBBTWFwQ29vcmRTeXMgZnJvbSBcIi4vQU1hcENvb3JkU3lzXCI7XG5cbmltcG9ydCBcIi4vQU1hcE1vZGVsXCI7XG5pbXBvcnQgXCIuL0FNYXBWaWV3XCI7XG5cbmVjaGFydHMucmVnaXN0ZXJDb29yZGluYXRlU3lzdGVtKFwiYW1hcFwiLCBBTWFwQ29vcmRTeXMpO1xuXG4vLyBBY3Rpb25cbmVjaGFydHMucmVnaXN0ZXJBY3Rpb24oXG4gIHtcbiAgICB0eXBlOiBcImFtYXBSb2FtXCIsXG4gICAgZXZlbnQ6IFwiYW1hcFJvYW1cIixcbiAgICB1cGRhdGU6IFwidXBkYXRlTGF5b3V0XCJcbiAgfSxcbiAgZnVuY3Rpb24ocGF5bG9hZCwgZWNNb2RlbCkge1xuICAgIGVjTW9kZWwuZWFjaENvbXBvbmVudChcImFtYXBcIiwgZnVuY3Rpb24oYU1hcE1vZGVsKSB7XG4gICAgICB2YXIgYW1hcCA9IGFNYXBNb2RlbC5nZXRBTWFwKCk7XG4gICAgICB2YXIgY2VudGVyID0gYW1hcC5nZXRDZW50ZXIoKTtcbiAgICAgIGFNYXBNb2RlbC5zZXRDZW50ZXJBbmRab29tKFtjZW50ZXIubG5nLCBjZW50ZXIubGF0XSwgYW1hcC5nZXRab29tKCkpO1xuICAgIH0pO1xuICB9XG4pO1xuXG5leHBvcnQgeyB2ZXJzaW9uLCBuYW1lIH07XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/index.js\n");

/***/ }),

/***/ "echarts":
/*!**************************!*\
  !*** external "echarts" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_echarts__;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNoYXJ0cy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovL1tuYW1lXS9leHRlcm5hbCBcImVjaGFydHNcIj84YzY3Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9lY2hhcnRzX187Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///echarts\n");

/***/ })

/******/ });
});