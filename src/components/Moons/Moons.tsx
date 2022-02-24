import { isEqual } from 'lodash'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FrameLoop } from '../../libs/FrameLoop'
import { NumericalAnalyzer } from '../../libs/NumericalAnalyzer'
import { transform } from '../../libs/transform'
import { usePrev } from '../../libs/usePrev'
import { Controller, AnalyzerConfig, MoonValue } from '../Moon/types'

type ConfigFn<T> = (index: number) => { [key in keyof T]: AnalyzerConfig }
export type MoonsProps<T, R> = {
  config: ConfigFn<T>
  items: R[]
  resetOnConfigChanged?: boolean
  getItemId: (item: R) => string | number
  children: (item: R, value: { [key in keyof T]: number}, index: number) => React.ReactElement
  controllerRef?: (controller: Controller) => void
  moonValuesRef? :(moonValues: MoonValue<T>[]) => void
}

const Moons = <T, R>({ children, config: configFn, items, getItemId, controllerRef, moonValuesRef, resetOnConfigChanged }: MoonsProps<T, R>) => {
  const internalControllRef = useRef<Controller>()
  const [moonValues, setMoonValues] = useState<MoonValue<T>[]>([])
  const [prevItems, prevConfigFn, prevMoonValues] = [usePrev(items), usePrev(configFn), usePrev(moonValues)]
  const isItemOrderChanged = (current: R[], prev?: R[]) => {
    if (!prev) return true
    if (prev === current) return false
    if (prev.length !== current.length) return true
    for (let index = 0; index < current.length; index++) {
      if (getItemId(current[index]) !== getItemId(prev[index])) return true
    }
    return false
  }
  const isConfigFnChanged = (current: ConfigFn<T>, prev?: ConfigFn<T>) => {
    if (!prev) return true
    if (prev === current) return false
    const createConfigs = (fn: ConfigFn<T>) => Array.from({ length: items.length }, (_, index) => fn(index))
    return !isEqual(createConfigs(prev), createConfigs(current))
  }

  useLayoutEffect(() => {
    const [itemOrderChagned, configFnChanged] = [isItemOrderChanged(items, prevItems), isConfigFnChanged(configFn, prevConfigFn)]
    if (!itemOrderChagned && !configFnChanged) return
    const configs = Array.from({ length: items.length }, (_, index) => configFn(index))
    const itemOrders = items.map(item => {
      return prevItems ? prevItems.findIndex(prevItem => getItemId(prevItem) === getItemId(item)) : -1
    })
    const analyzers = configs.map((config, index) => {
      const analyzer = {} as {[key in keyof T]: NumericalAnalyzer}
      for (const key in config) {
        const { initial, equation } = config[key]
        const itemOrder = itemOrders[index]
        const moveInfo = (itemOrder === -1 || (configFnChanged && resetOnConfigChanged)) ? initial : moonValues[itemOrder][key]
        analyzer[key] = new NumericalAnalyzer(equation, moveInfo)
      }
      return analyzer
    })
    const hook = (dt: number) => {
      setMoonValues(
        analyzers.map(analyzer => transform(analyzer, a => a.move(dt)))
      )
    }
    const controller = FrameLoop(hook)
    const { start, cancle } = controller
    controllerRef && controllerRef(controller)
    internalControllRef.current = controller
    start()
    return () => cancle()
  }, [configFn, items])

  useEffect(() => {
    moonValuesRef && moonValuesRef(moonValues)
    const internalController = internalControllRef.current
    if (!prevMoonValues || !internalController || moonValues.length !== prevMoonValues.length) return
    for (let i = 0; i < moonValues.length; i++) {
      const [prevMoonValue, moonValue] = [prevMoonValues[i], moonValues[i]]
      for (const key in moonValue) {
        const { displacement, velocity } = moonValue[key]
        const { displacement: prevDisplacement } = prevMoonValue[key]
        if (Math.abs(displacement - prevDisplacement) > 0.001 || Math.abs(velocity) > 0.01) return
      }
    }
    internalController.cancle()
  }, [moonValues])

  return (
    <>
      {
        items.map((item, index) =>
          React.cloneElement(
            children(item, transform(moonValues[index], ({ displacement }) => displacement), index)
            , { key: getItemId(item) })
        )
      }
    </>
  )
}

export default Moons
