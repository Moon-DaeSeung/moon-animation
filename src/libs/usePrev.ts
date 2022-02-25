import { useEffect, useRef } from 'react'

export const usePrev = <T, >(current: T) => {
  const prevRef = useRef<T>(current)
  useEffect(() => {
    prevRef.current = current
  })
  return prevRef.current
}
