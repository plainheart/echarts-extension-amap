[![NPM version](https://img.shields.io/npm/v/echarts-extension-amap.svg?style=flat)](https://www.npmjs.org/package/echarts-extension-amap)
[![Build Status](https://github.com/plainheart/echarts-extension-amap/actions/workflows/build.yml/badge.svg)](https://github.com/plainheart/echarts-extension-amap/actions/workflows/build.yml)
[![NPM Downloads](https://img.shields.io/npm/dm/echarts-extension-amap.svg)](https://npmcharts.com/compare/echarts-extension-amap?minimal=true)
[![jsDelivr Downloads](https://data.jsdelivr.com/v1/package/npm/echarts-extension-amap/badge?style=rounded)](https://www.jsdelivr.com/package/npm/echarts-extension-amap)
[![License](https://img.shields.io/npm/l/echarts-extension-amap.svg)](https://github.com/plainheart/echarts-extension-amap/blob/master/LICENSE)

## Apache ECharts 高德地图扩展

[README_EN](https://github.com/plainheart/echarts-extension-amap/blob/master/README.md)

[在线示例](https://codepen.io/plainheart/pen/qBbdNYx)

[Apache ECharts](https://echarts.apache.org/zh/index.html) 高德地图扩展，可以在高德地图上展现 [点图](https://echarts.apache.org/zh/option.html#series-scatter)，[线图](https://echarts.apache.org/zh/option.html#series-lines)，[热力图](https://echarts.apache.org/zh/option.html#series-heatmap)，[饼图](https://echarts.apache.org/zh/option.html#series-pie) 等可视化。

### 示例

Scatter 散点图: [examples/scatter.html](https://github.com/plainheart/echarts-extension-amap/blob/master/examples/scatter_zh_CN.html)

![Preview-Scatter](https://user-images.githubusercontent.com/26999792/53300484-e2979680-3882-11e9-8fb4-143c4ca4c416.png)

Heatmap 热力图: [examples/heatmap.html](https://github.com/plainheart/echarts-extension-amap/blob/master/examples/heatmap_zh_CN.html)

![Preview-Heatmap](https://user-images.githubusercontent.com/26999792/101314208-fadb7880-3892-11eb-902a-8f6f41ffe0fc.png)

Lines 线图: [examples/lines.html](https://github.com/plainheart/echarts-extension-amap/blob/master/examples/lines_zh_CN.html)

![Preview-Lines](https://user-images.githubusercontent.com/26999792/101313379-fca43c80-3890-11eb-9dea-46230dc432d5.gif)

Pie 饼图: [examples/pie.html](https://github.com/plainheart/echarts-extension-amap/blob/master/examples/pie_zh_CN.html) (**自 v1.11.0 开始支持**)

![Preview-Pie](https://user-images.githubusercontent.com/26999792/193215980-cd6736f5-a63d-4085-8012-d519e9e78398.png)

### 安装

```shell
npm install echarts-extension-amap --save
```

### 引入

可以直接引入打包好的扩展文件和高德地图的 JavaScript API

```html
<!-- 引入高德地图的JavaScript API，这里需要使用你在高德地图开发者平台申请的 ak -->
<!-- 如果你在使用的是 v1.9.0 之前的旧版本，还需要引入 `AMap.CustomLayer` 插件 -->
<script src="https://webapi.amap.com/maps?v=1.4.15&key={ak}&plugin=AMap.Scale,AMap.ToolBar"></script>
<!-- 引入 ECharts -->
<script src="/path/to/echarts.min.js"></script>
<!-- 引入高德地图扩展 -->
<script src="dist/echarts-extension-amap.min.js"></script>
```

如果 `webpack` 等工具打包，也可以通过 `require` 或者 `import` 引入

```js
// 使用 require
require('echarts');
require('echarts-extension-amap');

// 使用 import
import * as echarts from 'echarts';
import 'echarts-extension-amap';
```

> 如需动态引入高德地图 API 脚本，可以使用 [amap-jsapi-loader](https://www.npmjs.com/package/@amap/amap-jsapi-loader) 或自行借助 `Promise` 封装一个动态异步 script 加载器。

**使用 CDN**

[**jsDelivr**](https://www.jsdelivr.com/)

使用最新版

[https://cdn.jsdelivr.net/npm/echarts-extension-amap/dist/echarts-extension-amap.min.js](https://cdn.jsdelivr.net/npm/echarts-extension-amap/dist/echarts-extension-amap.min.js)

使用指定版本

[https://cdn.jsdelivr.net/npm/echarts-extension-amap@1.11.0/dist/echarts-extension-amap.min.js](https://cdn.jsdelivr.net/npm/echarts-extension-amap@1.11.0/dist/echarts-extension-amap.min.js)

[**unpkg**](https://unpkg.com/)

使用最新版

[https://unpkg.com/echarts-extension-amap/dist/echarts-extension-amap.min.js](https://unpkg.com/echarts-extension-amap/dist/echarts-extension-amap.min.js)

使用指定版本

[https://unpkg.com/echarts-extension-amap@1.11.0/dist/echarts-extension-amap.min.js](https://unpkg.com/echarts-extension-amap@1.11.0/dist/echarts-extension-amap.min.js)

插件会自动注册相应的组件。

**Apache ECharts 5 按需引入**

Apache ECharts 从 v5.0.1 开始提供了[新的按需引入](https://echarts.apache.org/zh/tutorial.html#%E5%9C%A8%E6%89%93%E5%8C%85%E7%8E%AF%E5%A2%83%E4%B8%AD%E4%BD%BF%E7%94%A8%20ECharts)接口，因此也可以按需引入高德地图扩展组件。引入方法如下：

```ts
// 按需引入 scatter、effectScatter 和 高德地图扩展
import * as echarts from 'echarts/core';
import {
  ScatterChart,
  ScatterSeriesOption,
  EffectScatterChart,
  EffectScatterSeriesOption
} from 'echarts/charts';
import {
  TooltipComponent,
  TitleComponentOption
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import {
  install as AMapComponent,
  AMapComponentOption
} from 'echarts-extension-amap/export';

// 引入高德地图官方提供的 2.0 类型定义文件
import '@amap/amap-jsapi-types';

// 组装所需的 option type
type ECOption = echarts.ComposeOption<
  | ScatterSeriesOption
  | EffectScatterSeriesOption
  | TitleComponentOption
  // 合并高德地图的地图初始配置项 AMap.MapOptions 到 AMapComponentOption
> & AMapComponentOption<AMap.MapOptions>;

// 注册渲染器、组件和图表
echarts.use([
  CanvasRenderer,
  TooltipComponent,
  AMapComponent,
  ScatterChart,
  EffectScatterChart
]);

// 定义 ECharts option
const option: ECOption = {
  // 高德地图组件 option
  amap: {
    // ...
  },
  title: {
    // ...
  },
  series: [
    {
      type: 'scatter',
      // 指定坐标系为高德地图
      coordinateSystem: 'amap',
      // ...
    }
  ]
  // ...
};
```

### 使用

```js
option = {
  // 加载 amap 组件
  amap: {
    // 3D模式，无论你使用的是1.x版本还是2.x版本，都建议开启此项以获得更好的渲染体验
    viewMode: '3D',
    // 高德地图支持的初始化地图配置
    // 高德地图初始中心经纬度
    center: [108.39, 39.9],
    // 高德地图初始缩放级别
    zoom: 4,
    // 是否开启resize
    resizeEnable: true,
    // 自定义地图样式主题
    mapStyle: 'amap://styles/dark',
    // 移动过程中实时渲染 默认为true 如数据量较大 建议置为false
    renderOnMoving: true,
    // ECharts 图层的 zIndex 默认 2000
    // 从 v1.9.0 起 此配置项已被弃用 请使用 `echartsLayerInteractive` 代替
    echartsLayerZIndex: 2019,
    // 设置 ECharts 图层是否可交互 默认为 true
    // 设置为 false 可实现高德地图自身图层交互
    // 此配置项从 v1.9.0 起开始支持
    echartsLayerInteractive: true,
    // 是否启用大数据模式 默认为 false
    // 此配置项从 v1.9.0 起开始支持
    largeMode: false
    // 说明：如果想要添加卫星、路网等图层
    // 暂时先不要使用layers配置，因为存在Bug
    // 建议使用amap.add的方式，使用方式参见最下方代码
  },
  series: [
    {
      type: 'scatter',
      // 使用高德地图坐标系
      coordinateSystem: 'amap',
      // 数据格式跟在 geo 坐标系上一样，每一项都是 [经度，纬度，数值大小，其它维度...]
      data: [[120, 30, 8], [120.1, 30.2, 20]],
      encode: {
        value: 2
      }
    }
  ]
};

// 获取 ECharts 高德地图组件
var amapComponent = chart.getModel().getComponent('amap');
// 获取高德地图实例，使用高德地图自带的控件(需要在高德地图js API script标签手动引入)
var amap = amapComponent.getAMap();
// 添加控件
amap.addControl(new AMap.Scale());
amap.addControl(new AMap.ToolBar());
// 添加图层
var satelliteLayer = new AMap.TileLayer.Satellite();
var roadNetLayer = new AMap.TileLayer.RoadNet();
amap.add([satelliteLayer, roadNetLayer]);
//  添加一个 Marker
amap.add(new AMap.Marker({
  position: [115, 35]
}));
// 禁用 ECharts 图层交互，从而使高德地图图层可以点击交互
amapComponent.setEChartsLayerInteractive(false);
```
