import * as echarts from 'echarts';

function v2Equal(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}

export default echarts.extendComponentModel({
  type: 'amap',

  setAMap: function(amap) {
    this.__amap = amap;
  },

  getAMap: function() {
    return this.__amap;
  },

  setEChartsLayer: function(layer) {
    this.__echartsLayer = layer;
  },

  getEChartsLayer: function() {
    return this.__echartsLayer;
  },

  setCenterAndZoom: function(center, zoom) {
    this.option.center = center;
    this.option.zoom = zoom;
  },

  centerOrZoomChanged: function(center, zoom) {
    var option = this.option;
    return !(v2Equal(center, option.center) && zoom === option.zoom);
  },

  defaultOption: {
    center: [116.397428, 39.90923],
    zoom: 5,
    isHotspot: false,
    resizeEnable: true,

    // extension options
    echartsLayerZIndex: 2000,
    renderOnMoving: true
    //hideOnZooming: true,
    //trackPitchAndRotation: false
  }
});
