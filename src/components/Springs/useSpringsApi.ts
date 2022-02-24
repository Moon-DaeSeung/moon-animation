import { useState } from 'react'

export const useSpringsApi = <T, >(config: (index: number) => Config<T>) => {
  const [api] = useState(() => new SpringsApi(config))
  return api
}

export class SpringsApi<T> {
  update: (updateFn: (index: number) => SpringValue<T>) => void
  stop: () => void
  start: () => void
  config: (index: number) => SpringConfig<T>
  constructor (configFn: (index: number) => Config<T>) {
    this.update = (_: (index: number) => SpringValue<T>) => {}
    this.stop = () => {}
    this.start = () => {}
    this.config = (index: number) => this.resolve(configFn(index))
  }

  private resolve (config: Config<T>): SpringConfig<T> {
    const { to, from } = config
    const internalConfig = {} as SpringConfig<T>
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
export type SpringConfig<T> = {
    [key in keyof T]: {
      from: number,
      to: number
    }
}

export type SpringValue<T> = {
  [key in keyof T]: number
}

type Config<T> = {
  from?: {
    [key in keyof T]?: number
  }
  to: {
    [key in keyof T]: number
  }
}
