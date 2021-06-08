import { version } from 'echarts/lib/echarts'

export const isV5 = version.split('.')[0] > 4

// `AMap.version` only exists in AMap 2.x
// For AMap 1.x, it's `AMap.v`
export const isAMap2X = AMap.version >= 2

export function v2Equal(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1]
}

let logMap = {}

export function logWarn(tag, msg, once) {
  const log = `[ECharts][Extension][AMap]${tag ? ' ' + tag + ':' : ''} ${msg}`
  once && logMap[log] || console.warn(log)
  once && (logMap[log] = true)
}

export function clearLogMap() {
  logMap = {}
}

let canvasGetContextOverriden = false

export const nativeCanvasGetContext = HTMLCanvasElement.prototype.getContext

// FIXME not override?
export function overrideCanvasGetContext(recover) {
  HTMLCanvasElement.prototype.getContext = recover
    ? nativeCanvasGetContext
    : function(ctx, opts) {
        opts = opts || {}
        // make webgl canvas can use `toDataURL` API
        opts.preserveDrawingBuffer = true
        return nativeCanvasGetContext.call(this, ctx, opts)
      }
  canvasGetContextOverriden = !recover
}

export function getScreenshot(chartInstance, amapInstance, opts) {
  opts = opts || {}
  let chartDataURL
  // can't get screenshot when echarts canvas is tainted
  try {
    opts.excludeEChartsLayer || (chartDataURL = chartInstance.getDataURL.call(chartInstance, opts))
  }
  catch (e) {
    console.error('failed to get screenshot of echarts', e)
  }
  // map.getScreenShot(width, height)
  const size = amapInstance.getSize()
  const dpr = opts.devicePixelRatio || (chartInstance && chartInstance.getDevicePixelRatio()) || 1
  let width = opts.width || size.width
  let height = opts.height || size.height
  // const canvas = AMap.DomUtil.create('canvas')
  // canvas.style.position = 'absolute'
  // canvas.style.width = width + 'px'
  // canvas.style.height = height + 'px'
  // canvas.width = width *= dpr
  // canvas.height = height *= dpr
  // const ctx = canvas.getContext('2d')
  // const layerNodes = amapInstance.getContainer().querySelector('.amap-layers').childNodes
  // for (let i = 0, len = layerNodes.length, layer; i < len; i++) {
  //   layer = layerNodes[i]
  //   'CANVAS' === layer.tagName && ctx.drawImage(layer, 0, 0, width, height)
  // }
  // const mapDataURL = canvas.toDataURL()
  // console.log(chartDataURL, mapDataURL)
  // TODO dpr
  //const mapDataURL = amapInstance.getScreenShot(width, height)
  var c = size
              , d = document.createElement("canvas");
           var a = a || width;
          var  b = b ||height;
            c = opts
            c.width = width
            c.height = height
            d.width = a;
            d.height = b;
            var e = -(c.width - a) / 2;
            c = -(c.height - b) / 2;
            var f = d.getContext("2d")
            const layerNodes = amapInstance.getContainer().querySelector('.amap-layers').childNodes
            for (var h = layerNodes, k = [], l = 0; l < h.length; l += 1)
                k.push(h[l]);
            k.sort(function(a, b) {
                return a.style.zIndex - b.style.zIndex
            });
            for (l = 0; l < k.length; l += 1) {
                var m = k[l];
                if (AMap.DomUtil.hasClass(m, "amap-layer") || AMap.DomUtil.hasClass(m, "amap-e") || AMap.DomUtil.hasClass(m, "amap-labels"))
                    if ("CANVAS" === m.tagName) {
                        var h = c
                          , n = e
                          , p = parseFloat(m.style.width) || m.width
                          , q = parseFloat(m.style.height) || m.height
                          , r = 1;
                        m.style.transform && (r = parseFloat(m.style.transform.split("(")[1]));
                        f.drawImage(m, n, h, p * r, q * r)
                    } else if ("DIV" === m.tagName)
                        for (var r = m.childNodes, s = parseFloat(m.style.top) || 0 + c, m = parseFloat(m.style.left) || 0 + e, u = 0; u < r.length; u += 1) {
                            var v = r[u];
                            if ("CANVAS" === v.tagName || "IMG" === v.tagName)
                                h = parseFloat(v.style.top) || 0,
                                n = parseFloat(v.style.left) || 0,
                                p = parseFloat(v.style.width) || v.width,
                                q = parseFloat(v.style.height) || v.height,
                                f.drawImage(v, n + m, h + s, p, q)
                        }
            }
  const mapDataURL = d.toDataURL()
  const img = AMap.DomUtil.create('img', document.body)
  img.src = mapDataURL
}
