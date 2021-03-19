import { use } from 'echarts/core'
import EChartsV4 from 'echarts/lib/echarts'

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

type Push<T extends any[], V> = [...T, V]

type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
  true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>

type EChartsExtensionInstallRegisters = Parameters<TuplifyUnion<Parameters<typeof use>[0]>[0]>[0]

type EChartsRegisters = EChartsExtensionInstallRegisters extends never
  ? typeof EChartsV4
  : EChartsExtensionInstallRegisters

/**
 * To install AMap component
 * @param registersregisters echarts registers. If using v4, it should be echarts namespace.
 */
declare function install(registers: EChartsRegisters): void

export * from './types'
export { install }
