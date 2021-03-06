import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FrameLoop } from '../../libs/FrameLoop'
import isEqual from '../../libs/isEqual'
import { NumericalAnalyzer } from '../../libs/NumericalAnalyzer'
import { transform } from '../../libs/transform'
import { usePrev } from '../../libs/usePrev'
import { Controller, AnalyzerConfig, MoonValue } from '../Moon/types'

type ConfigFn<T> = (index: number) => { [key in keyof T]: AnalyzerConfig }
export type MoonsProps<T, R> = {
  config: ConfigFn<T>
  items: R[]
  getItemId: (item: R) => string | number
  children: (item: R, value: { [key in keyof T]: number}, index: number) => React.ReactElement
  onRest?: () => void
  onStart?: () => void
  controllerRef?: (controller: Controller) => void
  moonValuesRef? :(moonValues: MoonValue<T>[]) => void
  depths?: any[]
}

const Moons = <T, R>({ children, config: configFn, items, getItemId, controllerRef, moonValuesRef, onRest, onStart, depths }: MoonsProps<T, R>) => {
  const internalControllRef = useRef<Controller>()
  const isFirstRendered = useRef(true)
  const [moonValues, setMoonValues] = useState<MoonValue<T>[]>([])
  const [prevConfigFn, prevMoonValues] = [usePrev(configFn), usePrev(moonValues)]
  const prevItemsRef = useRef(items)
  const isItemOrderChanged = (current: R[], prev: R[]) => {
    if (prev === current) return false
    if (prev.length !== current.length) return true
    for (let index = 0; index < current.length; index++) {
      if (getItemId(current[index]) !== getItemId(prev[index])) return true
    }
    return false
  }
  const isConfigFnChanged = (current: ConfigFn<T>, prev: ConfigFn<T>) => {
    if (prev === current) return false
    const createConfigs = (fn: ConfigFn<T>) => Array.from({ length: items.length }, (_, index) => fn(index))
    return !isEqual(createConfigs(prev), createConfigs(current))
  }

  useLayoutEffect(() => {
    const prevItems = prevItemsRef.current
    if (!isFirstRendered.current && !isItemOrderChanged(items, prevItems) && !(depths ? true : isConfigFnChanged(configFn, prevConfigFn))) {
      return
    }
    let configs
    try {
      /** if items and configFn are changed at the same time, this effect is invoked twice.
       * On first invoked items are changed (configFn is not)
       * there is some case in which configFn depends on items'length
       * in that case, configFn(index) may return error. so I wrapped try-catch. when next invoked, it will work properly
       * */
      configs = Array.from({ length: items.length }, (_, index) => configFn(index))
    } catch (error) {
      return
    }
    const itemOrders = items.map(item => {
      return !isFirstRendered.current ? prevItems.findIndex(prevItem => getItemId(prevItem) === getItemId(item)) : -1
    })
    const analyzers = configs.map((config, index) => {
      const analyzer = {} as {[key in keyof T]: NumericalAnalyzer}
      for (const key in config) {
        const { initial, equation } = config[key]
        const itemOrder = itemOrders[index]
        const moveInfo = moonValues[itemOrder] ? moonValues[itemOrder][key] : initial
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
    onStart && onStart()
    prevItemsRef.current = items
    return () => cancle()
  }, depths ? [items, ...depths] : [items, configFn])

  useEffect(() => {
    if (isFirstRendered.current) {
      isFirstRendered.current = false
      return
    }
    moonValuesRef && moonValuesRef(moonValues)
    const internalController = internalControllRef.current
    if (!internalController || moonValues.length !== prevMoonValues.length) return
    for (let i = 0; i < moonValues.length; i++) {
      const [prevMoonValue, moonValue] = [prevMoonValues[i], moonValues[i]]
      for (const key in moonValue) {
        const { displacement, velocity } = moonValue[key]
        const { displacement: prevDisplacement } = prevMoonValue[key]
        if (Math.abs(displacement - prevDisplacement) > 0.01 || Math.abs(velocity) > 1) return
      }
    }
    internalController.cancle()
    onRest && onRest()
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
