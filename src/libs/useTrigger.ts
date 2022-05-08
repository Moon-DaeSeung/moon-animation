import { useCallback, useState } from 'react'

export const useTrigger = (): [number, () => void] => {
  const [trigger, setTrigger] = useState(0)
  const forceUpdate = useCallback(() => setTrigger(prev => prev + 1), [])
  return [trigger, forceUpdate]
}
