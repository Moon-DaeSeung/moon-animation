import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FrameLoop } from '../../libs/FrameLoop'
import isEqual from '../../libs/isEqual'
import { NumericalAnalyzer } from '../../libs/NumericalAnalyzer'
import { transform } from '../../libs/transform'
import { Controller, AnalyzerConfig, MoonValue } from './types'

export type MoonProps<T> = {
  config: { [key in keyof T]: AnalyzerConfig }
  children: (value: { [key in keyof T]: number}) => React.ReactElement
  controllerRef?: (controller: Controller) => void
  moveInfosRef? :(moveInfos: MoonValue<T>) => void
}

const Moon = <T, >({ children, config: configProp, controllerRef, moveInfosRef }: MoonProps<T>) => {
  const [config, setConfig] = useState(configProp)

  useEffect(() => {
    if (isEqual(config, configProp)) return
    setConfig(configProp)
  }, [configProp])

  const [moonValue, setMoonValue] = useState<MoonValue<T>>(() =>
    transform(config, ({ initial }) => initial)
  )

  const analyzers = useMemo(() =>
    transform(config, ({ equation, initial }) => new NumericalAnalyzer(equation, initial))
  , [config])

  const hook = useCallback((dt: number) => {
    setMoonValue(transform(analyzers, analyzer => analyzer.move(dt)))
  }, [analyzers])

  const controller = useMemo(() => FrameLoop(hook), [hook])

  useEffect(() => {
    const { start, cancle } = controller
    controllerRef && controllerRef(controller)
    start()
    return () => cancle()
  }, [controller])

  useEffect(() => {
    moveInfosRef && moveInfosRef(moonValue)
  }, [moonValue])

  return children(transform(moonValue, ({ displacement }) => displacement))
}

export default Moon
