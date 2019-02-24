import * as echarts from "echarts";

export default echarts.extendComponentView({
  type: "amap",

  render: function(aMapModel, ecModel, api) {
    var rendering = true;

    var amap = aMapModel.getAMap();
    var echartsLayer = aMapModel.__echartsLayer;
    var viewportRoot = api.getZr().painter.getViewportRoot();
    var coordSys = aMapModel.coordinateSystem;

    var moveHandler = function(e) {
      if (rendering) {
        return;
      }
      var offsetEl = viewportRoot.parentNode.parentNode.parentNode;
      var mapOffset = [
        -parseInt(offsetEl.style.left, 10) || 0,
        -parseInt(offsetEl.style.top, 10) || 0
      ];
      viewportRoot.style.left = mapOffset[0] + "px";
      viewportRoot.style.top = mapOffset[1] + "px";

      coordSys.setMapOffset(mapOffset);
      aMapModel.__mapOffset = mapOffset;

      api.dispatchAction({
        type: "amapRoam"
      });
    };

    var zoomStartHandler = function(e) {
      if (rendering) {
        return;
      }
      echartsLayer.setOpacity(0);
    };

    var zoomEndHandler = function(e) {
      if (rendering) {
        return;
      }
      echartsLayer.setOpacity(1);
      api.dispatchAction({
        type: "amapRoam"
      });
    };

    var resizeHandler = function(e) {
      echarts.getInstanceByDom(api.getDom()).resize();
      moveHandler.call(this, e);
    };

    var resizeEnable = amap.getStatus().resizeEnable;

    amap.off("movestart", this._oldMoveHandler);
    //amap.off("mapmove", this._oldMoveHandler);
    amap.off("moveend", this._oldZoomEndHandler);
    amap.off("complete", this._oldZoomEndHandler);
    amap.off("zoomstart", this._oldZoomStartHandler);
    amap.off("zoomend", this._oldZoomEndHandler);
    resizeEnable && amap.off("resize", this._oldResizeHandler);

    amap.on("movestart", moveHandler);
    //amap.on("mapmove", moveHandler);
    amap.on("moveend", zoomEndHandler);
    amap.on("complete", zoomEndHandler);
    amap.on("zoomstart", zoomStartHandler);
    amap.on("zoomend", zoomEndHandler);
    resizeEnable && amap.on("resize", resizeHandler);

    this._oldMoveHandler = moveHandler;
    this._oldZoomStartHandler = zoomStartHandler;
    this._oldZoomEndHandler = zoomEndHandler;
    resizeEnable && (this._oldResizeHandler = resizeHandler);

    rendering = false;
  },

  dispose: function() {}
});
