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

// export const MOUSE_EVENTS = 'click dblclick mousewheel wheel mouseout mouseup mousedown mousemove contextmenu'.split(' ')
// export const POINTER_EVENTS = 'pointerout pointerup pointerdown pointermove'.split(' ')
// export const TOUCH_EVENTS = 'touchstart touchend touchmove'.split(' ')

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
    evt = new eventArgs.constructor(eventArgs.type, evtInitDict)
  }
  else {
    const evtType = original.constructor.name
    evt = document.createEvent(evtType)

    if (evtType === 'MouseEvent') {
      original.initMouseEvent(
        original.type, false, true,
        original.view, original.detail,
        original.screenX, original.screenY,
        original.clientX, original.clientY,
        original.ctrlKey, original.altKey,
        original.shiftKey, original.metaKey,
        original.button, original.relatedTarget
      )
    }
    if (evtType === 'WheelEvent') {
      original.initWheelEvent(
        original.type, false, true,
        original.view, original.detail,
        original.screenX, original.screenY,
        original.clientX, original.clientY,
        original.button, original.relatedTarget, modifiersList,
        original.deltaX, original.deltaY, original.deltaZ, original.deltaMode
      )
    }
    if (evtType === 'PointerEvent') {
      original.initPointerEvent(
        original.type, false, true,
        original.view, original.detail,
        original.screenX, original.screenY,
        original.clientX, original.clientY,
        original.ctrlKey, original.altKey,
        original.shiftKey, original.metaKey,
        original.button, original.relatedTarget,
        original.offsetX, original.offsetY,
        original.width, original.height,
        original.pressure, original.rotation,
        original.tiltX, original.tiltY,
        original.pointerId, original.pointerType,
        original.timeStamp, original.isPrimary
      )
    }
    if (evtType === 'TouchEvent') {
      original.initTouchEvent(
        original.type, false, true,
        original.view, original.detail, original.screenX, original.screenY,
        original.clientX, original.clientY, original.ctrlKey,
        original.altKey, original.shiftKey, original.metaKey,
        original.touches, original.targetTouches, original.changedTouches,
        original.scale, original.rotation
      )
    }
    // if (evtType === 'TextEvent') {
    //   original.initTextEvent(
    //     original.type, false, true,
    //     original.view,
    //     original.data, original.inputMethod, original.locale
    //   )
    // }
    // if (evtType === 'CompositionEvent') {
    //   original.initTextEvent(
    //     original.type, false, true,
    //     original.view,
    //     original.data, original.inputMethod, original.locale
    //   )
    // }
    // if (evtType === 'KeyboardEvent') {
    //   original.initKeyboardEvent(
    //     original.type, false, true,
    //     original.view, original.char, original.key,
    //     original.location,
    //     original.getModifierState
    //       && zrUtil.filter(ALL_MODIFIERS, original.getModifierState, original).join(' '),
    //     original.repeat
    //   )
    // }
    // if (evtType === 'InputEvent' || eventType === 'UIEvent') {
    //   original.initUIEvent(
    //     original.type, false, true,
    //     original.view, original.detail
    //   )
    // }
    // if (evtType === 'FocusEvent') {
    //   original.initFocusEvent(
    //     original.type, false, true,
    //     original.view, original.detail, original.relatedTarget
    //   )
    // }
  }
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
