/* global AMap */

import { util as zrUtil, graphic, matrix } from 'echarts';

function AMapCoordSys(amap, api) {
  this._amap = amap;
  this.dimensions = ['lng', 'lat'];
  this._mapOffset = [0, 0];
  this._api = api;
}

var AMapCoordSysProto = AMapCoordSys.prototype;

// exclude private and unsupported options
var excludedOptions = [
  'echartsLayerZIndex',
  'renderOnMoving',
  'layers'
  //'hideOnZooming'
  //'trackPitchAndRotation'
];

AMapCoordSysProto.dimensions = ['lng', 'lat'];

AMapCoordSysProto.setZoom = function(zoom) {
  this._zoom = zoom;
};

AMapCoordSysProto.setCenter = function(center) {
  var lnglat = new AMap.LngLat(center[0], center[1]);
  this._center = this._amap.lngLatToContainer(lnglat);
};

AMapCoordSysProto.setMapOffset = function(mapOffset) {
  this._mapOffset = mapOffset;
};

AMapCoordSysProto.setAMap = function(amap) {
  this._amap = amap;
};

AMapCoordSysProto.getAMap = function() {
  return this._amap;
};

AMapCoordSysProto.dataToPoint = function(data) {
  var lnglat = new AMap.LngLat(data[0], data[1]);
  var px = this._amap.lngLatToContainer(lnglat);
  var mapOffset = this._mapOffset;
  return [px.x - mapOffset[0], px.y - mapOffset[1]];
};

AMapCoordSysProto.pointToData = function(pt) {
  var mapOffset = this._mapOffset;
  var lnglat = this._amap.containerToLngLat(
    new AMap.Pixel(pt[0] + mapOffset[0], pt[1] + mapOffset[1])
  );
  return [lnglat.lng, lnglat.lat];
};

AMapCoordSysProto.getViewRect = function() {
  var api = this._api;
  return new graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};

AMapCoordSysProto.getRoamTransform = function() {
  return matrix.create();
};

AMapCoordSysProto.prepareCustoms = function(data) {
  var rect = this.getViewRect();
  return {
    coordSys: {
      // The name exposed to user is always 'cartesian2d' but not 'grid'.
      type: 'amap',
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

function addCssRule(selector, rules, index) {
  // 2.0
  var is2X = AMap.version >= 2;
  var sheet = is2X
    ? document.getElementById('AMap_Dynamic_style').sheet
    : document.getElementsByClassName('AMap.style')[0].sheet;
  index = index || 0;
  if (sheet.insertRule) {
    sheet.insertRule(selector + '{' + rules + '}', index);
  }
  else if (sheet.addRule) {
    sheet.addRule(selector, rules, index);
  }
}

// For deciding which dimensions to use when creating list data
AMapCoordSys.dimensions = AMapCoordSysProto.dimensions;

// var nativeRotation = AMap.Map.prototype.setRotation;
// var nativePitch = AMap.Map.prototype.setPitch;

// function setRotation(rotation) {
//   var amap = this.getAMap();
//   // for 2.x which has animation for rotation
//   nativeRotation.apply(amap, [rotation, true]);

//   var rotateEnable = amap.getStatus().rotateEnable;
//   if (rotateEnable) {
//     var amapCoordSys = this.coordinateSystem;
//     var newRotation = amap.getRotation();
//     // emit amaprender event
//     newRotation !== amapCoordSys._rotation && amap.emit('amaprender', {
//       type: 'rotation',
//       oldRotation: amapCoordSys._rotation,
//       newRotation: newRotation
//     });
//     amapCoordSys._rotation = newRotation;
//   }
// }

// function setPitch(pitch) {
//   var amap = this.getAMap();
//   // for 2.x which has animation for pitch
//   nativePitch.apply(amap, [pitch, true]);

//   var pitchEnable = amap.getStatus().pitchEnable;
//   if (pitchEnable) {
//     var amapCoordSys = this.coordinateSystem;
//     var newPitch = amap.getPitch();
//     // emit amaprender event
//     newPitch !== amapCoordSys._pitch && amap.emit('amaprender', {
//       type: 'pitch',
//       oldPitch: amapCoordSys._pitch,
//       newPitch: newPitch
//     });
//     amapCoordSys._pitch = newPitch;
//   }
// }

AMapCoordSys.create = function(ecModel, api) {
  var amapCoordSys;
  var root = api.getDom();

  // FIXME: a hack for AMap 2.0
  // if (AMap.version >= 2) {
  //   if(root.style.overflow !== 'auto') {
  //     root.style.overflow = 'auto';
  //     console.warn('[hack hint] Currently in AMap API 2.0, the overflow of echarts container must be `auto`.');
  //   }
  // }

  ecModel.eachComponent('amap', function(amapModel) {
    var painter = api.getZr().painter;
    var viewportRoot = painter.getViewportRoot();
    if (typeof AMap === 'undefined') {
      throw new Error('AMap api is not loaded');
    }
    if (amapCoordSys) {
      throw new Error('Only one amap component can exist');
    }
    var amap = amapModel.getAMap();
    if (!amap) {
      // Not support IE8
      var amapRoot = root.querySelector('.ec-extension-amap');
      if (amapRoot) {
        // Reset viewport left and top, which will be changed
        // in moving handler in AMapView
        viewportRoot.style.left = '0px';
        viewportRoot.style.top = '0px';
        root.removeChild(amapRoot);
      }
      amapRoot = document.createElement('div');
      amapRoot.className = 'ec-extension-amap';
      amapRoot.style.cssText = 'position:absolute;width:100%;height:100%';
      root.appendChild(amapRoot);

      var options = zrUtil.clone(amapModel.get());
      var echartsLayerZIndex = options.echartsLayerZIndex;
      // delete excluded options
      zrUtil.each(excludedOptions, function(key) {
        delete options[key];
      });

      amap = new AMap.Map(amapRoot, options);
      amapModel.setAMap(amap);

      var echartsLayer = new AMap.CustomLayer(viewportRoot, {
        zIndex: echartsLayerZIndex
      });
      amapModel.setEChartsLayer(echartsLayer);
      amap.add(echartsLayer);

      addCssRule('.ec-amap-not-zoom', 'left:0!important;top:0!important', Infinity);

      // Override
      painter.getViewportRootOffset = function() {
        return { offsetLeft: 0, offsetTop: 0 };
      };
    }

    // track pitch and rotation
    //var trackPitchAndRotation = amapModel.get('trackPitchAndRotation');
    //AMap.Map.prototype.setRotation = trackPitchAndRotation ? setRotation.bind(amapModel) : nativeRotation;
    //AMap.Map.prototype.setPitch = trackPitchAndRotation ? setPitch.bind(amapModel) : nativePitch;

    var center = amapModel.get('center');
    var zoom = amapModel.get('zoom');
    if (center && zoom) {
      var amapCenter = amap.getCenter();
      var amapZoom = amap.getZoom();
      var centerOrZoomChanged = amapModel.centerOrZoomChanged([amapCenter.lng, amapCenter.lat], amapZoom);
      if (centerOrZoomChanged) {
        var pt = new AMap.LngLat(center[0], center[1]);
        amap.setZoomAndCenter(zoom, pt);
      }
    }

    amapCoordSys = new AMapCoordSys(amap, api);
    amapCoordSys.setMapOffset(amapModel.__mapOffset || [0, 0]);
    amapCoordSys.setZoom(zoom);
    amapCoordSys.setCenter(center);

    amapModel.coordinateSystem = amapCoordSys;
  });

  ecModel.eachSeries(function(seriesModel) {
    if (seriesModel.get('coordinateSystem') === 'amap') {
      seriesModel.coordinateSystem = amapCoordSys;
    }
  });
};

export default AMapCoordSys;
