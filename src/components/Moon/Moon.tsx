import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FrameLoop } from '../../libs/FrameLoop'
import { Equation, MoveInfo, NumericalAnalyzer } from '../../libs/NumericalAnalyzer'
import { transform } from '../../libs/transform'
import { Controller, MoonConfig, MoveInfos } from './types'

export type MoonProps<T> = {
  configs: { [key in keyof T]: MoonConfig }
  children: (value: { [key in keyof T]: number}) => React.ReactElement
  controllerRef?: (controller: Controller) => void
  moveInfosRef? :(moveInfos: MoveInfos<T>) => void
}

const Moon = <T, >({ children, configs, controllerRef, moveInfosRef }: MoonProps<T>) => {
  const [moveInfos, setMoveInfos] = useState<MoveInfos<T>>(() =>
    transform(configs, ({ moveInfo: initial }) => initial)
  )

  const analyzers = useMemo(() =>
    transform(configs, ({ equation, moveInfo: initial }) => new NumericalAnalyzer(equation, initial))
  , [configs])

  const hook = useCallback((dt: number) => {
    setMoveInfos(transform(analyzers, analyzer => analyzer.move(dt)))
  }, [analyzers])

  const controller = useMemo(() => FrameLoop(hook), [hook])

  useEffect(() => {
    const { start, cancle } = controller
    controllerRef && controllerRef(controller)
    start()
    return () => cancle()
  }, [controller])

  useEffect(() => {
    moveInfosRef && moveInfosRef(moveInfos)
  }, [moveInfos])

  return children(transform(moveInfos, ({ displacement }) => displacement))
}

export default Moon
