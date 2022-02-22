import React, { Children, useCallback, useEffect, useMemo, useState } from 'react'
import Moon from '../Moon/Moon'
import { transform } from '../../libs/transform'
import { Controller, MoonConfig, MoveInfos } from '../Moon/types'
import { SpringApi } from '../../hooks/useSpringRef'

export type SpringProps<T> = {
  springRef: SpringApi<T>
  children: (values: {
    [key in keyof T]: number
  }) => React.ReactElement;
}

const Spring = <T, _>({ springRef, children }: SpringProps<T>) => {
  const [controller, setController] = useState<Controller>()
  const [moveInfos, setMoveInfos] = useState<MoveInfos<T>>()
  const tention = 10
  const friction = 6
  const config = springRef.config
  const moonConfigs = useMemo(() => transform<typeof config, MoonConfig>(springRef.config, ({ from, to }) =>
    ({
      equation: ({ displacement, velocity }) =>
        (-1 * tention * (displacement - to)) - (friction * 1 * velocity),
      initial: {
        displacement: from, velocity: (to - from) * 3.5
      }
    })
  ), [springRef])

  useEffect(() => {
    if (!controller || !moveInfos) return
    const { cancle } = controller
    for (const key in moveInfos) {
      const { displacement, velocity } = moveInfos[key]
      const { to } = config[key]
      if (Math.abs(displacement - to) > 0.1 || Math.abs(velocity) > 10) return
    }
    cancle()
  }, [moveInfos, controller, springRef])

  useEffect(() => {
    console.log('hi')
  }, [springRef])

  return (
    <Moon configs={moonConfigs} controllerRef={setController} moveInfosRef={setMoveInfos}>
      {children}
    </Moon>
  )
}

export default Spring
