import { useState } from 'react'
import { SpringConfig, SpringsApi, SpringValue, useSpringsApi } from '../Springs/useSpringsApi'

export const useSpringApi = <T, >(config: SpringConfig<T>) => {
  const springsApi = useSpringsApi((_ :number) => config)
  const [springApi] = useState(() => new SpringApi(springsApi))
  return springApi
}

export class SpringApi<T> {
  springsApi: SpringsApi<T>
  constructor (springsApi: SpringsApi<T>) {
    this.springsApi = springsApi
  }

  update (springValue: SpringValue<T>) {
    this.springsApi.update((_: number) => springValue)
  }

  onStart (func: () => void) {
    this.springsApi.onStart = func
  }

  onRest (func: () => void) {
    this.springsApi.onRest = func
  }

  stop () {
    this.springsApi._stop()
  }

  start () {
    this.springsApi._start()
  }
}
