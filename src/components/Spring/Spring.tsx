import React, { useMemo } from 'react'
import Springs from '../Springs'
import { SpringValue } from '../Springs/useSpringsApi'
import { SpringApi } from './useSpringApi'

export type SpringProps<T> = {
  springApi: SpringApi<T>
  children: (value: SpringValue<T>) => React.ReactElement;
}

const Spring = <T, > ({ springApi, children }: SpringProps<T>) => {
  const items = useMemo(() => ['dummy'], [])
  return (
    <Springs
      items={items}
      springsApi={springApi.springsApi}
      getItemId={() => ''}
    >
      {(_, springValue) => children(springValue) }
    </Springs>
  )
}

export default Spring
