import * as echarts from "echarts";

export default echarts.extendComponentView({
  type: "amap",

  render: function(aMapModel, ecModel, api) {
    var rendering = true;

    var amap = aMapModel.getAMap();
    var viewportRoot = api.getZr().painter.getViewportRoot();
    var coordSys = aMapModel.coordinateSystem;
    var offsetEl = amap.getContainer();
    var echartsLayer = aMapModel.getEChartsLayer();
    var renderOnMoving = aMapModel.get("renderOnMoving");
    var resizeEnable = aMapModel.get("resizeEnable");
    var resizeDelay;

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

      if (renderOnMoving) {
        var amape = offsetEl.querySelector(".amap-e");
        amape.classList.remove("not-zoom");
      }
    };

    var zoomEndHandler = function(e) {
      if (rendering) {
        return;
      }

      if (renderOnMoving) {
        var amape = offsetEl.querySelector(".amap-e");
        amape.classList.add("not-zoom");
      }

      echartsLayer.setOpacity(1);

      api.dispatchAction({
        type: "amapRoam",
      });
    };

    var resizeHandler = function(e) {
      clearTimeout(resizeDelay);

      resizeDelay = setTimeout(function() {
        echarts.getInstanceByDom(api.getDom()).resize();
      }, 100);
    };

    amap.off(renderOnMoving ? "mapmove" : "moveend", this._oldMoveHandler);
    amap.off("zoomstart", this._oldZoomStartHandler);
    amap.off("zoomend", this._oldZoomEndHandler);

    resizeEnable && amap.off("resize", this._oldResizeHandler);

    amap.on(renderOnMoving ? "mapmove" : "moveend", moveHandler);
    amap.on("zoomstart", zoomStartHandler);
    amap.on("zoomend", zoomEndHandler);

    resizeEnable && amap.on("resize", resizeHandler);

    this._oldMoveHandler = moveHandler;
    this._oldZoomStartHandler = zoomStartHandler;
    this._oldZoomEndHandler = zoomEndHandler;

    resizeEnable && (this._oldResizeHandler = resizeHandler);

    rendering = false;
  },

  dispose: function(ecModel, api) {
    var component = ecModel.getComponent("amap");
    var amapInstance = component.getAMap();
    amapInstance.destroy();
    component.setAMap(null);
    component.setEChartsLayer(null);
  }
});
