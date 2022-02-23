import React, { Children, useCallback, useEffect, useMemo, useState } from 'react'
import Moon from '../Moon/Moon'
import { transform } from '../../libs/transform'
import { Controller, MoonConfig, MoveInfos } from '../Moon/types'
import { SpringApi } from './useSpringRef'
import { MoveInfo } from '../../libs/NumericalAnalyzer'

export type SpringProps<T> = {
  springRef: SpringApi<T>
  children: (value: SpringValue<T>) => React.ReactElement;
}

type SpringValue<T> = {
  [key in keyof T]: number
}

const Spring = <T, _>({ springRef, children }: SpringProps<T>) => {
  const [TENSION, FRICTION] = [10, 6]
  const [controller, setController] = useState<Controller>()
  const [moveInfos, setMoveInfos] = useState<MoveInfos<T>>()
  const [toInfos, setToInfos] = useState<SpringValue<T>>()
  const [renderedBySpringRefChanged, setRenderdBySpringRefChagned] = useState(false)
  const [moonConfigs, setMoonConfigs] = useState<{[key in keyof T]: MoonConfig}>()
  const createMoonCofing = (from: number, to: number) => ({
    equation: ({ displacement, velocity }: MoveInfo) =>
      (-1 * TENSION * (displacement - to)) - (FRICTION * 1 * velocity),
    moveInfo: {
      displacement: from, velocity: (to - from) * 3.5
    }
  })
  const convertSpringToMoon = (configs: typeof springRef.config) =>
    transform<typeof configs, MoonConfig>(configs, ({ from, to }) =>
      createMoonCofing(from, to)
    )

  useEffect(() => {
    setMoonConfigs(convertSpringToMoon(springRef.config))
    setToInfos(transform<typeof springRef.config, number>(springRef.config, ({ to }) => to))
    setRenderdBySpringRefChagned(true)
  }, [springRef])

  useEffect(() => {
    if (!toInfos || !moveInfos || renderedBySpringRefChanged) return
    const configs = {} as {[key in keyof T]: MoonConfig}
    for (const key in toInfos) {
      const to = toInfos[key]
      const { displacement: from } = moveInfos[key]
      configs[key] = createMoonCofing(from, to)
    }
    setMoonConfigs(configs)
  }, [toInfos])

  useEffect(() => {
    if (!controller || !moveInfos || !toInfos) return
    const { cancle } = controller
    for (const key in moveInfos) {
      const { displacement, velocity } = moveInfos[key]
      const to = toInfos[key]
      if (Math.abs(displacement - to) > 0.1 || Math.abs(velocity) > 10) return
    }
    cancle()
  }, [moveInfos, controller, toInfos])

  useEffect(() => {
    if (!controller) return
    springRef.stop = controller.cancle
    springRef.start = controller.start
    springRef.update = (value) => {
      setToInfos(value)
      setRenderdBySpringRefChagned(false)
    }
  }, [springRef, controller])

  return (
    moonConfigs
      ? <Moon configs={moonConfigs} controllerRef={setController} moveInfosRef={setMoveInfos}>
      {children}
    </Moon>
      : <div/>
  )
}

export default Spring
