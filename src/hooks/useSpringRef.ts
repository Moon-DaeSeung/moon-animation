import React, { useRef } from 'react'

export const useSpringRef = <T, >(config: Config<T>) => {
  const apiRef = useRef(() => new SpringApi(config))
  return apiRef.current
}

export class SpringApi<T> {
  update: (to: { [key in keyof T]: number}) => void
  stop: () => void
  config: InternalConfig<T>
  constructor (config: Config<T>) {
    this.update = (_: { [key in keyof T]: number}) => {}
    this.stop = () => {}
    this.config = this.resolve(config)
  }

  private resolve (config: Config<T>): InternalConfig<T> {
    const { to, from } = config
    const internalConfig = {} as InternalConfig<T>
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

type Config<T> = {
  from?: {
    [key in keyof T]?: number
  }
  to: {
    [key in keyof T]: number
  }
}

type InternalConfig<T> = {
    [key in keyof T]: {
      from: number,
      to: number
    }
}
