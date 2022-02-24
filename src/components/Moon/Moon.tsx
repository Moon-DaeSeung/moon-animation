import React, { useMemo } from 'react'
import Moons from '../Moons/Moons'
import { Controller, AnalyzerConfig, MoonValue } from './types'

export type MoonProps<T> = {
  config: { [key in keyof T]: AnalyzerConfig }
  children: (value: { [key in keyof T]: number}) => React.ReactElement
  controllerRef?: (controller: Controller) => void
  moonValueRef? :(moonValue: MoonValue<T>) => void
}

const Moon = <T, >({ children, config, controllerRef, moonValueRef }: MoonProps<T>) => {
  const items = useMemo<any>(() => ['dummy'], [])
  return (
    <Moons
      items={items}
      getItemId={() => ''}
      config={() => config}
      controllerRef={controllerRef}
      moonValuesRef={moonValueRef && ((moonValues: MoonValue<T>[]) => moonValues[0] && moonValueRef(moonValues[0]))}
    >
      {(_, moonValue) => children(moonValue) }
    </Moons>
  )
}

export default Moon
