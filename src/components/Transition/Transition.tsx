import React, { useEffect, useLayoutEffect, useRef, useState, CSSProperties, useMemo } from 'react'
import tw from 'twin.macro'
import { useTrigger } from '../../libs/useTrigger'
import Springs from '../Springs'
import { SpringsApi } from '../Springs/useSpringsApi'

export type TransitionProps<T> = {
  children: (item: T, index: number) => React.ReactElement
  style?: CSSProperties
  customCss?: any
  getItemId: (item: T) => string | number
  items: T[],
  depths?: any[]
}

const Transition = <T, >({ children: renderFn, style, getItemId, items, customCss, depths }: TransitionProps<T>) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const childrenRef = useRef<(HTMLElement | null)[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [springsApi, setSpringsApi] = useState<SpringsApi<{x: number, y: number}>>()
  const containerRectRef = useRef({ width: 0, height: 0, left: 0, top: 0 })
  const prevContainerRectRef = useRef({ width: 0, height: 0, left: 0, top: 0 })
  const [relativeRects, setRelativeRects] = useState<{x: number, y: number, width: number, height: number}[]>(
    Array.from({ length: items.length }, () => ({ x: 0, y: 0, width: 0, height: 0 }))
  )
  const [trigger, forceUpdate] = useTrigger()
  useEffect(() => {
    if (containerRef.current === null) return
    const resizeObserver = new ResizeObserver(() => {
      forceUpdate()
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!springsApi) return
    springsApi.onRest = () => setIsAnimating(false)
    springsApi.onStart = () => setIsAnimating(true)
  }, [springsApi])

  useLayoutEffect(() => {
    if (containerRef.current === null) return
    const {
      top: containerTop,
      bottom: containerBotton,
      left: containerLeft,
      right: containerRight,
      width: containerWidth,
      height: containerHeight
    } = containerRef.current.getBoundingClientRect()
    const [containerX, containerY] =
     [(containerLeft + containerRight) / 2, (containerTop + containerBotton) / 2]
    containerRectRef.current = {
      width: containerWidth,
      height: containerHeight,
      left: containerLeft,
      top: containerTop
    }

    const childrenRects = childrenRef.current.filter(child => child !== null)
      .map(child => (child as HTMLElement).getBoundingClientRect())

    const childrenRelativeRects = childrenRects.map(({ top, bottom, left, right, width, height }) => {
      const [childrenX, childrenY] = [(left + right) / 2, (top + bottom) / 2]
      return {
        x: childrenX - containerX,
        y: childrenY - containerY,
        width,
        height
      }
    })

    if (springsApi) {
      springsApi.update((index: number) => {
        const { x, y } = childrenRelativeRects[index]
        return { x, y }
      })
    } else {
      setSpringsApi(new SpringsApi((index: number) => {
        const { x, y } = childrenRelativeRects[index]
        return {
          to: { y, x }
        }
      }))
    }

    setRelativeRects(childrenRelativeRects)
    if (!isAnimating) prevContainerRectRef.current = containerRectRef.current
  }, depths ? [...depths, trigger, items] : [renderFn, trigger, items])
  const { height: containerHeight } = containerRectRef.current

  return (
    <div tw='relative'>
      <div
        ref={containerRef}
        style={{
          ...style,
          visibility: 'hidden'
        }}
        css={customCss}
      >
        {items.map((item, i) =>
          React.cloneElement(renderFn(item, i), {
            ref: (node: any) => {
              childrenRef.current[i] = node
            },
            key: getItemId(item)
          })
        )}
      </div>
      {springsApi && (
        <Springs springsApi={springsApi} items={items} getItemId={getItemId}>
          {(item, { x, y }, index) => {
            const { width, height } = relativeRects[index] || { width: 0, height: 0 }
            const children = renderFn(item, index)
            return (
            <div
              style={{
                margin: 0,
                boxSizing: 'border-box',
                width: `${width}px`,
                height: `${height}px`,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
              }}
            >
              {React.cloneElement(children, {
                style: {
                  ...children.props.style,
                  width: `${width}px`,
                  height: `${height}px`
                }
              })}
              </div>
            )
          }}
        </Springs>
      )}
      </div>
  )
}

export default Transition
