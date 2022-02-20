import React, { Children, useCallback, useEffect, useMemo, useState } from 'react'
import Moon from '../Moon/Moon'
import { transform } from '../../libs/transform'
import { Controller, MoonConfig, MoveInfos } from '../Moon/types'

export type SpringProps<T> = {
  config?: Config;
  values: {
    [key in keyof T]: {
      from: number
      to: number
    }
  }
  children: (values: {
    [key in keyof T]: number
  }) => React.ReactElement;
}

type Config = {
  tension?: number
  friction?: number
}

const Spring = <T, _>({ config, values, children }: SpringProps<T>) => {
  const [controller, setController] = useState<Controller>()
  const [moveInfos, setMoveInfos] = useState<MoveInfos<T>>()
  const tention = config?.tension || 10
  const friction = config?.friction || 6
  const moonConfigs = useMemo(() => transform<typeof values, MoonConfig>(values, ({ from, to }) =>
    ({
      equation: ({ displacement, velocity }) =>
        (-1 * tention * (displacement - to)) - (friction * 1 * velocity),
      initial: {
        displacement: from, velocity: (to < from ? -1 : 1) * 700
      }
    })
  ), [])

  useEffect(() => {
    if (!controller || !moveInfos) return
    const { cancle } = controller
    for (const key in moveInfos) {
      const { displacement, velocity } = moveInfos[key]
      const { to } = values[key]
      if (Math.abs(displacement - to) > 0.1 || Math.abs(velocity) > 10) return
    }
    cancle()
  }, [moveInfos, controller])

  return (
    <Moon configs={moonConfigs} controllerRef={setController} moveInfosRef={setMoveInfos}>
      {children}
    </Moon>
  )
}

export default Spring
