[![NPM version](https://img.shields.io/npm/v/echarts-extension-amap.svg?style=flat)](https://www.npmjs.org/package/echarts-extension-amap)
[![Build Status](https://travis-ci.org/plainheart/echarts-extension-amap.svg?branch=master)](https://travis-ci.org/plainheart/echarts-extension-amap)
[![Downloads](https://img.shields.io/npm/dm/echarts-extension-amap.svg)](https://npmcharts.com/compare/echarts-extension-amap?minimal=true)
[![License](https://img.shields.io/npm/l/echarts-extension-amap.svg)](https://www.npmjs.com/package/echarts-extension-amap)

## ECharts 高德地图扩展

[ECharts](http://echarts.baidu.com) 高德地图扩展，可以在高德地图上展现 [点图](http://echarts.baidu.com/option.html#series-scatter)，[线图](http://echarts.baidu.com/option.html#series-line)，[热力图](http://echarts.baidu.com/option.html#series-heatmap) 等可视化。

### 示例

参见 [examples/index.html](http://github.com/plainheart/echarts-extension-amap/tree/master/examples/index.html)

![示例](https://user-images.githubusercontent.com/26999792/53300484-e2979680-3882-11e9-8fb4-143c4ca4c416.png)

### 安装

```js
npm install echarts-extension-amap --save
```

### 引入

可以直接引入打包好的扩展文件和高德地图的 Javascript API

```html
<!--引入高德地图的Javascript API，这里需要使用你在高德地图开发者平台申请的 ak-->
<script src="https://webapi.amap.com/maps?v=1.4.13&key=ak&plugin=AMap.Scale,AMap.ToolBar"></script>
<!-- 引入 ECharts -->
<script src="/path/to/echarts.min.js"></script>
<!-- 引入高德地图扩展 -->
<script src="dist/echarts-extension-amap.min.js"></script>
```

如果是 webpack 打包，也可以 require 引入

```js
require("echarts");
require("echarts-extension-amap");
```

使用 CDN

```html
<script src="https://cdn.jsdelivr.net/npm/echarts-extension-amap@latest/dist/echarts-extension-amap.min.js"></script>
```

插件会自动注册相应的组件。

### 使用

扩展主要提供了跟 geo 一样的坐标系和底图的绘制，因此配置方式非常简单，如下

```js
option = {
  // 加载 amap 组件
  amap: {
    // 高德地图支持的初始化地图配置
    // 高德地图初始中心经纬度
    center: [120.13066322374, 30.240018034923],
    // 高德地图初始缩放级别
    zoom: 14,
    // 是否开启resize
    resizeEnable: true,
    // 自定义地图样式主题
    mapStyle: "amap://styles/dark",
    // 高德地图自定义EchartsLayer的zIndex，默认2000
    echartsLayerZIndex: 2019
    // 说明：如果想要添加卫星、路网等图层
    // 暂时先不要使用layers配置，因为存在Bug
    // 建议使用amap.add的方式，使用方式参见最下方代码
  },
  series: [
    {
      type: "scatter",
      // 使用高德地图坐标系
      coordinateSystem: "amap",
      // 数据格式跟在 geo 坐标系上一样，每一项都是 [经度，纬度，数值大小，其它维度...]
      data: [[120, 30, 8], [120.1, 30.2, 20]],
      encode: {
        value: 2
      }
    }
  ]
};

// 获取高德地图实例，使用高德地图自带的控件(需要在高德地图js API script标签手动引入)
var amap = chart
  .getModel()
  .getComponent("amap")
  .getAMap();
// 添加控件
amap.addControl(new AMap.Scale());
amap.addControl(new AMap.ToolBar());
// 添加图层
var satelliteLayer = new AMap.TileLayer.Satellite();
var roadNetLayer = new AMap.TileLayer.RoadNet();
amap.add([satelliteLayer, roadNetLayer]);
```
