import React, { useMemo } from 'react'
import Moons from '../Moons/Moons'
import { Controller, AnalyzerConfig, MoonValue } from './types'

export type MoonProps<T> = {
  config: { [key in keyof T]: AnalyzerConfig }
  children: (value: { [key in keyof T]: number}) => React.ReactElement
  controllerRef?: (controller: Controller) => void
  moonValueRef? :(moonValue: MoonValue<T>) => void
  onRest?: () => void
  onStart?: () => void
  depths?: any[]
}

const Moon = <T, >({ children, config, controllerRef, moonValueRef, onRest, onStart, depths }: MoonProps<T>) => {
  const items = useMemo<any>(() => ['dummy'], [])
  return (
    <Moons
      items={items}
      getItemId={() => ''}
      config={() => config}
      depths={depths}
      onRest={onRest}
      onStart={onStart}
      controllerRef={controllerRef}
      moonValuesRef={moonValueRef && ((moonValues: MoonValue<T>[]) => moonValues[0] && moonValueRef(moonValues[0]))}
    >
      {(_, moonValue) => children(moonValue) }
    </Moons>
  )
}

export default Moon
