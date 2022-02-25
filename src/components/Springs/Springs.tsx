import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Moons from '../Moons/Moons'
import { transform } from '../../libs/transform'
import { Controller, AnalyzerConfig, MoonValue } from '../Moon/types'
import { SpringsApi, SpringValue } from './useSpringsApi'
import { MoveInfo } from '../../libs/NumericalAnalyzer'

export type SpringsProps<T, R> = {
  items: R[]
  springsApi: SpringsApi<T>
  children: (item: R, value: SpringValue<T>, index: number) => React.ReactElement;
  getItemId: (item: R) => number | string
}

const Springs = <T, R>({ springsApi, children, items, getItemId }: SpringsProps<T, R>) => {
  const [TENSION, FRICTION] = [30, 10]
  const [controller, setController] = useState<Controller>()
  const moonValuesRef = useRef<MoonValue<T>[]>([])
  const isFirstUpdatedRef = useRef(true)
  const [toValueFn, setToValueFn] = useState(() => (index: number) =>
    transform(springsApi.config(index), ({ to }) => to)
  )

  const [moonConfigFn, setMoonConfigFn] = useState(() => (index:number) =>
    transform(springsApi.config(index), ({ from, to }) => createMoonCofing(from, to))
  )

  const createMoonCofing = (from: number, to: number) => (
    {
      equation: ({ displacement, velocity }: MoveInfo) =>
        (-1 * TENSION * (displacement - to)) - (FRICTION * 1 * velocity),
      initial: {
        displacement: from, velocity: 0
      }
    }
  )

  useLayoutEffect(() => {
    if (isFirstUpdatedRef.current) {
      isFirstUpdatedRef.current = false; return
    }
    const configFn = function (index: number) {
      const toValue = toValueFn(index)
      const fromValue = moonValuesRef.current[index]
      const configs = {} as {[key in keyof T]: AnalyzerConfig}
      for (const key in toValue) {
        const to = toValue[key]
        const { displacement: from } = fromValue[key]
        configs[key] = createMoonCofing(from, to)
      }
      return configs
    }
    setMoonConfigFn(() => configFn)
  }, [toValueFn])

  useEffect(() => {
    if (!controller) return
    springsApi._stop = controller.cancle
    springsApi._start = controller.start
    springsApi.update = (valueFn) => setToValueFn(() => valueFn)
  }, [springsApi, controller])

  return (
    <Moons
      getItemId={getItemId}
      config={moonConfigFn}
      depths={[moonConfigFn]}
      items={items}
      onRest={springsApi.onRest}
      onStart={springsApi.onStart}
      controllerRef={setController}
      moonValuesRef={(moonValues) => { moonValuesRef.current = moonValues }}>
      {children}
    </Moons>
  )
}

export default Springs
