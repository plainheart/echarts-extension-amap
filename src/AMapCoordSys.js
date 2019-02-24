/* global AMap */

import { util as zrUtil, graphic, matrix } from "echarts";

function AMapCoordSys(amap, api) {
  this._amap = amap;
  this.dimensions = ["lng", "lat"];
  this._mapOffset = [0, 0];
  this._api = api;
}

AMapCoordSys.prototype.dimensions = ["lng", "lat"];

AMapCoordSys.prototype.setZoom = function(zoom) {
  this._zoom = zoom;
};

AMapCoordSys.prototype.setCenter = function(center) {
  this._center = this._amap.lnglatToPixel(
    new AMap.LngLat(center[0], center[1])
  );
};

AMapCoordSys.prototype.setMapOffset = function(mapOffset) {
  this._mapOffset = mapOffset;
};

AMapCoordSys.prototype.getAMap = function() {
  return this._amap;
};

AMapCoordSys.prototype.dataToPoint = function(data) {
  var lnglat = new AMap.LngLat(data[0], data[1]);
  var px = this._amap.lngLatToContainer(lnglat);
  var mapOffset = this._mapOffset;
  return [px.x - mapOffset[0], px.y - mapOffset[1]];
};

AMapCoordSys.prototype.pointToData = function(pt) {
  var mapOffset = this._mapOffset;
  var lnglat = this._amap.containerToLngLat(
    AMap.Pixel(pt[0] + mapOffset[0], pt[1] + mapOffset[1])
  );
  return [lnglat.lng, lnglat.lat];
};

AMapCoordSys.prototype.getViewRect = function() {
  var api = this._api;
  return new graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};

AMapCoordSys.prototype.getRoamTransform = function() {
  return matrix.create();
};

AMapCoordSys.prototype.prepareCustoms = function(data) {
  var rect = this.getViewRect();
  return {
    coordSys: {
      // The name exposed to user is always 'cartesian2d' but not 'grid'.
      type: "amap",
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    },
    api: {
      coord: zrUtil.bind(this.dataToPoint, this),
      size: zrUtil.bind(dataToCoordSize, this)
    }
  };
};

function dataToCoordSize(dataSize, dataItem) {
  dataItem = dataItem || [0, 0];
  return zrUtil.map(
    [0, 1],
    function(dimIdx) {
      var val = dataItem[dimIdx];
      var halfSize = dataSize[dimIdx] / 2;
      var p1 = [];
      var p2 = [];
      p1[dimIdx] = val - halfSize;
      p2[dimIdx] = val + halfSize;
      p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];
      return Math.abs(
        this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx]
      );
    },
    this
  );
}

// For deciding which dimensions to use when creating list data
AMapCoordSys.dimensions = AMapCoordSys.prototype.dimensions;

AMapCoordSys.create = function(ecModel, api) {
  var amapCoordSys;
  var root = api.getDom();

  // TODO Dispose
  ecModel.eachComponent("amap", function(amapModel) {
    var painter = api.getZr().painter;
    var viewportRoot = painter.getViewportRoot();
    if (typeof AMap === "undefined") {
      throw new Error("AMap api is not loaded");
    }
    if (amapCoordSys) {
      throw new Error("Only one amap component can exist");
    }
    if (!amapModel.__amap) {
      // Not support IE8
      var amapRoot = root.querySelector(".ec-extension-amap");
      if (amapRoot) {
        // Reset viewport left and top, which will be changed
        // in moving handler in AMapView
        viewportRoot.style.left = "0px";
        viewportRoot.style.top = "0px";
        root.removeChild(amapRoot);
      }
      amapRoot = document.createElement("div");
      amapRoot.style.cssText = "width:100%;height:100%";
      // Not support IE8
      amapRoot.classList.add("ec-extension-amap");
      root.appendChild(amapRoot);

      var options = amapModel.get();
      var amap = (amapModel.__amap = new AMap.Map(amapRoot, options));
      var echartsLayer = new AMap.CustomLayer(viewportRoot, {
        zIndex: options.echartsLayerZIndex
      });
      amapModel.__echartsLayer = echartsLayer;
      amap.add(echartsLayer);

      // Override
      painter.getViewportRootOffset = function() {
        return { offsetLeft: 0, offsetTop: 0 };
      };
    }
    var amap = amapModel.__amap;
    var center = amap.getCenter();
    var zoom = amap.getZoom();

    amapCoordSys = new AMapCoordSys(amap, api);
    amapCoordSys.setMapOffset(amapModel.__mapOffset || [0, 0]);
    amapCoordSys.setZoom(zoom);
    amapCoordSys.setCenter([center.lng, center.lat]);

    amapModel.coordinateSystem = amapCoordSys;
  });

  ecModel.eachSeries(function(seriesModel) {
    if (seriesModel.get("coordinateSystem") === "amap") {
      seriesModel.coordinateSystem = amapCoordSys;
    }
  });
};

export default AMapCoordSys;
