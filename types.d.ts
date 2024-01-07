declare const name = 'echarts-extension-amap'
declare const version = '1.12.0'

interface InnerAMapComponentOption {
  /**
   * The zIndex of echarts layer for AMap.
   * @default 2000
   * @deprecated deprecated since v1.9.0, use `echartsLayerInteractive` instead.
   */
  echartsLayerZIndex?: number
  /**
   * Whether echarts layer is interactive.
   * @default true
   * @since v1.9.0
   */
  echartsLayerInteractive?: Boolean
  /**
   * Whether to enable large mode
   * @default false
   * @since v1.9.0
   */
  largeMode?: false
  /**
   * Whether echarts layer should be rendered when the map is moving.
   * if `false`, it will only be re-rendered after the map `moveend`.
   * It's better to set this option to false if data is large.
   * @default true
   */
  renderOnMoving?: boolean
  /**
   * Whether to return map camera state in `amaproam` event
   * @default false
   * @since v1.10.0
   */
  returnMapCameraState?: boolean
}

/**
 * Extended AMap component option
 */
interface AMapComponentOption<AMapOption> {
  amap?: AMapOption extends never
    ? InnerAMapComponentOption
    : InnerAMapComponentOption & AMapOption
}

export { name, version, AMapComponentOption }
