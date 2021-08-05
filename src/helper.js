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

const ALL_MODIFIERS = 'Alt AltGraph CapsLock Control Meta NumLock Scroll Shift Win'.split(' ')

// NOT SUPPORT IE <= 10
export function dispatchEvent(ele, eventArgs) {
  let evt
  if (typeof Event === 'function') {
    const evtInitDict = {}
    for (const key in eventArgs) {
      evtInitDict[key] = eventArgs[key]
    }
    evtInitDict.cancelBubble = true
    evtInitDict.bubbles = false
    evtInitDict.cancelable = true
    // FIXME
    // zrender is still using the stale un-standard layerX/layerY in Firefox
    // but Firefox has supported offsetX/offsetY since version 39
    // To make this feature working, some changes need to be applied to zrender
    // https://github.com/ecomfe/zrender/blob/master/src/core/event.ts#L69
    // add one condition `&& env.browser.version < '39'`
    evt = new eventArgs.constructor(eventArgs.type, evtInitDict)
  }
  else {
    // FIXME: recursive issue in IE and some old versions of firefox
    const evtType = eventArgs.constructor.toString().split(' ')[1].slice(0, -1)
    evt = document.createEvent(evtType)

    if (evtType === 'MouseEvent') {
      evt.initMouseEvent(
        eventArgs.type, false, true,
        eventArgs.view, eventArgs.detail,
        eventArgs.screenX, eventArgs.screenY,
        eventArgs.clientX, eventArgs.clientY,
        eventArgs.ctrlKey, eventArgs.altKey,
        eventArgs.shiftKey, eventArgs.metaKey,
        eventArgs.button, eventArgs.relatedTarget
      )
    }
    if (evtType === 'WheelEvent') {
      evt.initWheelEvent(
        eventArgs.type, false, true,
        eventArgs.view, eventArgs.detail,
        eventArgs.screenX, eventArgs.screenY,
        eventArgs.clientX, eventArgs.clientY,
        eventArgs.button, eventArgs.relatedTarget,
        // modifiersList
        eventArgs.getModifierState
          && zrUtil.filter(ALL_MODIFIERS, eventArgs.getModifierState, eventArgs).join(' '),
        eventArgs.deltaX, eventArgs.deltaY, eventArgs.deltaZ, eventArgs.deltaMode
      )
    }
    if (evtType === 'PointerEvent') {
      evt.initPointerEvent(
        eventArgs.type, false, true,
        eventArgs.view, eventArgs.detail,
        eventArgs.screenX, eventArgs.screenY,
        eventArgs.clientX, eventArgs.clientY,
        eventArgs.ctrlKey, eventArgs.altKey,
        eventArgs.shiftKey, eventArgs.metaKey,
        eventArgs.button, eventArgs.relatedTarget,
        eventArgs.offsetX, eventArgs.offsetY,
        eventArgs.width, eventArgs.height,
        eventArgs.pressure, eventArgs.rotation,
        eventArgs.tiltX, eventArgs.tiltY,
        eventArgs.pointerId, eventArgs.pointerType,
        eventArgs.timeStamp, eventArgs.isPrimary
      )
    }
    if (evtType === 'TouchEvent') {
      evt.initTouchEvent(
        eventArgs.type, false, true,
        eventArgs.view, eventArgs.detail, eventArgs.screenX, eventArgs.screenY,
        eventArgs.clientX, eventArgs.clientY, eventArgs.ctrlKey,
        eventArgs.altKey, eventArgs.shiftKey, eventArgs.metaKey,
        eventArgs.touches, eventArgs.targetTouches, eventArgs.changedTouches,
        eventArgs.scale, eventArgs.rotation
      )
    }
  }
  // FIXME potential IllegalState error in IE
  ele.dispatchEvent(evt)
}

export function on(ele, evt, handler, opts) {
  evt = zrUtil.isArray(evt) ? evt : evt.split(' ')
  for (let i = 0; i < evt.length; i++) {
    ele.addEventListener(evt[i], handler, opts)
  }
}

export function off(ele, evt, handler, opt) {
  evt = zrUtil.isArray(evt) ? evt : evt.split(' ')
  for (let i = 0; i < evt.length; i++) {
    ele.removeEventListener(evt[i], handler, opt)
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
