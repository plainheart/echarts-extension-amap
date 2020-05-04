import * as echarts from "echarts";

export default echarts.extendComponentView({
  type: "amap",

  render: function(aMapModel, ecModel, api) {
    var rendering = true;

    var amap = aMapModel.getAMap();
    var viewportRoot = api.getZr().painter.getViewportRoot();
    var coordSys = aMapModel.coordinateSystem;
    var offsetEl = amap.getContainer();
    var renderOnMoving = aMapModel.get("renderOnMoving");
    var resizeEnable = amap.getStatus().resizeEnable;

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
      if (renderOnMoving) {
        var amape = offsetEl.querySelector(".amap-e");
        amape.classList.remove("not-zoom");
      }

      moveHandler.call(this, e);
    };

    var zoomEndHandler = function(e) {
      if (rendering) {
        return;
      }
      if (renderOnMoving) {
        var amape = offsetEl.querySelector(".amap-e");
        amape.classList.add("not-zoom");
      }

      api.dispatchAction({
        type: "amapRoam",
      });
    };

    var resizeHandler = function(e) {
      echarts.getInstanceByDom(api.getDom()).resize();
      moveHandler.call(this, e);
    };

    if (renderOnMoving) {
      amap.off("mapmove", this._oldMoveHandler);
    } else {
      amap.off("moveend", this._oldMoveHandler);
    }
    amap.off("zoomstart", this._oldZoomStartHandler);
    amap.off("zoomend", this._oldZoomEndHandler);

    resizeEnable && amap.off("resize", this._oldResizeHandler);

    if (renderOnMoving) {
      amap.on("mapmove", moveHandler);
    } else {
      amap.on("moveend", moveHandler);
    }
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
    component.setEchartsLayer(null);
  }
});
