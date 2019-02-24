import * as echarts from "echarts";

function v2Equal(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}

export default echarts.extendComponentModel({
  type: "amap",

  getAMap: function() {
    // __amap is injected when creating AMapCoordSys
    return this.__amap;
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
    echartsLayerZIndex: 2000
  }
});
