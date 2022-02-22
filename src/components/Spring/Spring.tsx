import React, { Children, useCallback, useEffect, useMemo, useState } from 'react'
import Moon from '../Moon/Moon'
import { transform } from '../../libs/transform'
import { Controller, MoonConfig, MoveInfos } from '../Moon/types'
import { SpringApi } from '../../hooks/useSpringRef'

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
  const [moonConfigs, setMoonConfigs] = useState(() => convertSpringToMoon(springRef.config))
  const convertSpringToMoon = (configs: typeof springRef.config) =>
    transform<typeof configs, MoonConfig>(configs, ({ from, to }) =>
      ({
        equation: ({ displacement, velocity }) =>
          (-1 * TENSION * (displacement - to)) - (FRICTION * 1 * velocity),
        moveInfo: {
          displacement: from, velocity: (to - from) * 3.5
        }
      })
    )

  useEffect(() => {
    setMoonConfigs(convertSpringToMoon(springRef.config))
    setToInfos(transform<typeof springRef.config, number>(springRef.config, ({ to }) => to))
  }, [springRef])

  useEffect(() => {
    if (!controller || !moveInfos || !toInfos) return
    const { cancle } = controller
    for (const key in moveInfos) {
      const { displacement, velocity } = moveInfos[key]
      const to = toInfos[key]
      if (Math.abs(displacement - to) > 0.1 || Math.abs(velocity) > 10) return
    }
    cancle()
  }, [moveInfos, controller, springRef, toInfos])

  useEffect(() => {
    if (!controller) return
    springRef.stop = controller.cancle
    springRef.start = controller.start
    springRef.update = setToInfos
  }, [springRef, controller])

  return (
    <Moon configs={moonConfigs} controllerRef={setController} moveInfosRef={setMoveInfos}>
      {children}
    </Moon>
  )
}

export default Spring
