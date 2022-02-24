import { useEffect, useRef } from 'react'

export const usePrev = <T, >(current: T, initial?: any) => {
  const prevRef = useRef<T>(initial)
  useEffect(() => {
    prevRef.current = current
  })
  return prevRef.current
}
