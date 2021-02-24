[![NPM version](https://img.shields.io/npm/v/echarts-extension-amap.svg?style=flat)](https://www.npmjs.org/package/echarts-extension-amap)
[![Build Status](https://travis-ci.org/plainheart/echarts-extension-amap.svg?branch=master)](https://travis-ci.org/plainheart/echarts-extension-amap)
[![NPM Downloads](https://img.shields.io/npm/dm/echarts-extension-amap.svg)](https://npmcharts.com/compare/echarts-extension-amap?minimal=true)
[![jsDelivr Downloads](https://data.jsdelivr.com/v1/package/npm/echarts-extension-amap/badge?style=rounded)](https://www.jsdelivr.com/package/npm/echarts-extension-amap)
[![License](https://img.shields.io/npm/l/echarts-extension-amap.svg)](https://www.npmjs.com/package/echarts-extension-amap)

## AMap extension for Apache ECharts

[中文说明](https://github.com/plainheart/echarts-extension-amap/blob/master/README.zh-CN.md)

[Online example on CodePen](https://codepen.io/plainheart/pen/qBbdNYx)

This is an AMap extension for [Apache ECharts](https://echarts.apache.org/en/index.html) which is used to display visualizations such as [Scatter](https://echarts.apache.org/en/option.html#series-scatter), [Lines](https://echarts.apache.org/en/option.html#series-lines), [Heatmap](https://echarts.apache.org/en/option.html#series-heatmap).

### Examples

Scatter: [examples/scatter.html](https://github.com/plainheart/echarts-extension-amap/blob/master/examples/scatter.html)

![Preview-Scatter](https://user-images.githubusercontent.com/26999792/53300484-e2979680-3882-11e9-8fb4-143c4ca4c416.png)

Heatmap: [examples/heatmap.html](https://github.com/plainheart/echarts-extension-amap/blob/master/examples/heatmap.html)

![Preview-Heatmap](https://user-images.githubusercontent.com/26999792/101314208-fadb7880-3892-11eb-902a-8f6f41ffe0fc.png)

Lines: [examples/lines.html](https://github.com/plainheart/echarts-extension-amap/blob/master/examples/lines.html)

![Preview-Lines](https://user-images.githubusercontent.com/26999792/101313379-fca43c80-3890-11eb-9dea-46230dc432d5.gif)

### Installation

```shell
npm install echarts-extension-amap --save
```

### Import

Import packaged distribution file `echarts-extension-amap.min.js` and add AMap API script and ECharts script.

```html
<!-- import JavaScript API of AMap, please replace the ak with your own key and specify the version and plugins you need -->
<!-- Plugin `AMap.CustomLayer` is required if you are using a version of library less than v1.9.0 -->
<script src="https://webapi.amap.com/maps?v=1.4.15&key={ak}&plugin=AMap.Scale,AMap.ToolBar"></script>
<!-- import ECharts -->
<script src="/path/to/echarts.min.js"></script>
<!-- import echarts-extension-amap -->
<script src="dist/echarts-extension-amap.min.js"></script>
```

You can also import this extension by `require` or `import` if you are using `webpack`.

```js
require('echarts');
require('echarts-extension-amap');
```

Or use a CDN

[**jsDelivr**](https://www.jsdelivr.com/)

[https://cdn.jsdelivr.net/npm/echarts-extension-amap/dist/echarts-extension-amap.min.js](https://cdn.jsdelivr.net/npm/echarts-extension-amap/dist/echarts-extension-amap.min.js)

[**unpkg**](https://unpkg.com/)

[https://unpkg.com/echarts-extension-amap/dist/echarts-extension-amap.min.js](https://unpkg.com/echarts-extension-amap/dist/echarts-extension-amap.min.js)

This extension will register itself as a component of `echarts` after it is imported.

### Usage

This extension can be configured simply like [geo](https://echarts.apache.org/en/option.html#geo).

```js
option = {
  // load amap component
  amap: {
    // enable 3D mode
    // Note that it's suggested to enable 3D mode to improve echarts rendering.
    viewMode: '3D',
    // initial options of AMap
    // See https://lbs.amap.com/api/javascript-api/reference/map#MapOption for details
    // initial map center [lng, lat]
    center: [108.39, 39.9],
    // initial map zoom
    zoom: 4,
    // whether the map and echarts automatically handles browser window resize to update itself.
    resizeEnable: true,
    // customized map style, see https://lbs.amap.com/dev/mapstyle/index for details
    mapStyle: 'amap://styles/dark',
    // whether echarts layer should be rendered when the map is moving. Default is true.
    // if false, it will only be re-rendered after the map `moveend`.
    // It's better to set this option to false if data is large.
    renderOnMoving: true,
    // the zIndex of echarts layer for AMap, default value is 2000.
    // deprecated since v1.9.0, use `echartsLayerInteractive` instead.
    echartsLayerZIndex: 2019,
    // whether echarts layer is interactive. Default value is true
    // supported since v1.9.0
    echartsLayerInteractive: true,
    // whether to enable large mode. Default value is false
    // supported since v1.9.0
    largeMode: false
    // Note: Please DO NOT use the initial option `layers` to add Satellite/RoadNet/Other layers now.
    // There are some bugs about it, we can use `amap.add` instead.
    // Refer to the codes at the bottom.

    // More initial options...
  },
  series: [
    {
      type: 'scatter',
      // use `amap` as the coordinate system
      coordinateSystem: 'amap',
      // data items [[lng, lat, value], [lng, lat, value], ...]
      data: [[120, 30, 8], [120.1, 30.2, 20]],
      encode: {
        // encode the third element of data item as the `value` dimension
        value: 2
      }
    }
  ]
};

// Get AMap extension component
var amapComponent = chart.getModel().getComponent('amap');
// Get the instance of AMap
var amap = amapComponent.getAMap();
// Add some controls provided by AMap.
amap.addControl(new AMap.Scale());
amap.addControl(new AMap.ToolBar());
// Add SatelliteLayer and RoadNetLayer to map
var satelliteLayer = new AMap.TileLayer.Satellite();
var roadNetLayer = new AMap.TileLayer.RoadNet();
amap.add([satelliteLayer, roadNetLayer]);
// Add a marker to map
amap.add(new AMap.Marker({
  position: [115, 35]
}));
// Make the overlay layer of AMap interactive
amapComponent.setEChartsLayerInteractive(false);
```
