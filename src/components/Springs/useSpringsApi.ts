import { useState } from 'react'

export const useSpringsApi = <T, >(config: (index: number) => SpringConfig<T>) => {
  const [api] = useState(() => new SpringsApi(config))
  return api
}

export class SpringsApi<T> {
  update: (updateFn: (index: number) => SpringValue<T>) => void
  _stop: () => void
  _start: () => void
  config: (index: number) => SpringInternalConfig<T>
  onRest: () => void
  onStart: () => void
  constructor (configFn: (index: number) => SpringConfig<T>) {
    this.update = (_: (index: number) => SpringValue<T>) => {}
    this._stop = () => {}
    this._start = () => {}
    this.onRest = () => {}
    this.onStart = () => {}
    this.config = (index: number) => this.resolve(configFn(index))
  }

  stop () {
    this._stop()
    this.onRest()
  }

  start () {
    this._start()
    this.onStart()
  }

  private resolve (config: SpringConfig<T>): SpringInternalConfig<T> {
    const { to, from } = config
    const internalConfig = {} as SpringInternalConfig<T>
    for (const key in to) {
      if (from === undefined || from[key] === undefined) {
        internalConfig[key] = { from: to[key], to: to[key] }
      } else {
        internalConfig[key] = { from: from[key]!, to: to[key] }
      }
    }
    return internalConfig
  }
}
export type SpringInternalConfig<T> = {
    [key in keyof T]: {
      from: number,
      to: number
    }
}

export type SpringValue<T> = {
  [key in keyof T]: number
}

export type SpringConfig<T> = {
  from?: {
    [key in keyof T]?: number
  }
  to: {
    [key in keyof T]: number
  }
}
