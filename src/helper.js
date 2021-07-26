import { version, util as zrUtil } from 'echarts/lib/echarts'

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


export function dispatchEvent(ele, eventArgs) {
  // NOT SUPPORT IE <= 10
  const evt = document.createEvent('MouseEvents')
  evt.initMouseEvent(
    eventArgs.type, false, true,
    eventArgs.view, eventArgs.detail,
    eventArgs.screenX, eventArgs.screenY,
    eventArgs.clientX, eventArgs.clientY,
    eventArgs.ctrlKey, eventArgs.altKey, eventArgs.shiftKey, eventArgs.metaKey,
    eventArgs.button,
    eventArgs.relatedTarget
  )
  ele.dispatchEvent(evt)
}

export function on(ele, evt, handler) {
  evt = evt.split(' ')
  for (let i = 0; i < evt.length; i++) {
    ele.addEventListener(evt[i], handler)
  }
}

export function off(ele, evt, handler) {
  evt = evt.split(' ')
  for (let i = 0; i < evt.length; i++) {
    ele.removeEventListener(evt[i], handler)
  }
}

const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

export function watchStyle(el, onStyleChange) {
  let observer = el.__styleObserver
  if (observer) {
    observer.disconnect()
  }
  observer = el.__styleObserver = new MutationObserver(function(mutations) {
    for (let i = 0, mutation; i < mutations.length; i++) {
      mutation = mutations[i];
      if (mutation.type === 'attributes') {
        return onStyleChange(mutation.target.style)
      }
    }
  })
  observer.observe(el, {
    attributes: true,
    attributeFilter: ['style']
  })
  return observer
}

export function unwatchStyle(el) {
  const styleObserver = el.__styleObserver
  if (styleObserver) {
    styleObserver.disconnect()
    el.__styleObserver = null
  }
}
