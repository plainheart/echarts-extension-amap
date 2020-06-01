import * as echarts from "echarts";

export default echarts.extendComponentView({
  type: "amap",

  render: function(amapModel, ecModel, api) {
    var rendering = true;

    var amap = amapModel.getAMap();
    var viewportRoot = api.getZr().painter.getViewportRoot();
    var offsetEl = amap.getContainer();
    var amape = offsetEl.querySelector(".amap-e");
    var coordSys = amapModel.coordinateSystem;
    var echartsLayer = amapModel.getEChartsLayer();

    var renderOnMoving = amapModel.get("renderOnMoving");
    var hideOnZooming = amapModel.get("hideOnZooming");
    var resizeEnable = amapModel.get("resizeEnable");

    amape && amape.classList.add("ec-amap-not-zoom");

    var moveHandler = function(e) {
      if (rendering) {
        return;
      }

      var mapOffset = [
        -parseInt(offsetEl.style.left, 10) || 0,
        -parseInt(offsetEl.style.top, 10) || 0
      ];
      viewportRoot.style.left = mapOffset[0] + "px";
      viewportRoot.style.top = mapOffset[1] + "px";

      coordSys.setMapOffset(mapOffset);
      amapModel.__mapOffset = mapOffset;

      api.dispatchAction({
        type: "amapRoam"
      });
    };

    var zoomStartHandler = function(e) {
      if (rendering) {
        return;
      }

      hideOnZooming && echartsLayer.setOpacity(0.01);
    };

    var zoomEndHandler = function(e) {
      if (rendering) {
        return;
      }

      echartsLayer.setOpacity(1);

      api.dispatchAction({
        type: "amapRoam",
      });
    };

    var resizeHandler;

    amap.off("mapmove", this._oldMoveHandler);
    amap.off("moveend", this._oldMoveHandler);
    amap.off("amaprender", this._oldMoveHandler);
    amap.off("zoomstart", this._oldZoomStartHandler);
    amap.off("zoomend", this._oldZoomEndHandler);
    amap.off("resize", this._oldResizeHandler);

    amap.on(renderOnMoving ? "mapmove" : "moveend", moveHandler);
    amap.on("amaprender", moveHandler);
    amap.on("zoomstart", zoomStartHandler);
    amap.on("zoomend", zoomEndHandler);

    if (resizeEnable) {
      resizeHandler = function(e) {
        clearTimeout(this._resizeDelay);

        this._resizeDelay = setTimeout(function() {
          echarts.getInstanceByDom(api.getDom()).resize();
        }, 100);
      };

      resizeHandler = echarts.util.bind(resizeHandler, this);
      amap.on("resize", resizeHandler);
    }

    this._oldMoveHandler = moveHandler;
    this._oldZoomStartHandler = zoomStartHandler;
    this._oldZoomEndHandler = zoomEndHandler;

    resizeEnable && (this._oldResizeHandler = resizeHandler);

    rendering = false;
  },

  dispose: function(ecModel, api) {
    clearTimeout(this._resizeDelay);

    var component = ecModel.getComponent("amap");
    component.getAMap().destroy();
    component.setAMap(null);
    component.setEChartsLayer(null);
    component.coordinateSystem.setAMap(null);
  }
});
