import React, { useEffect, useLayoutEffect, useRef, useState, CSSProperties, useMemo } from 'react'
import tw from 'twin.macro'
import isEqual from '../../libs/isEqual'
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

type XY = [number, number]

const Transition = <T, >({ children: renderFn, style, getItemId, items, customCss, depths }: TransitionProps<T>) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const childrenRef = useRef<(HTMLElement | null)[]>([])
  const prevChildrenXYRef = useRef<XY[]>()
  const [isAnimating, setIsAnimating] = useState(false)
  const [springsApi, setSpringsApi] = useState<SpringsApi<{x: number, y: number}>>()

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
      right: containerRight
    } = containerRef.current.getBoundingClientRect()
    const [containerX, containerY] =
     [(containerLeft + containerRight) / 2, (containerTop + containerBotton) / 2]

    const childrenRects = childrenRef.current.filter(child => child !== null)
      .map(child => (child as HTMLElement).getBoundingClientRect())
    console.log(childrenRects.length)

    const childrenXY = childrenRects.map(({ top, bottom, left, right }) => {
      const [childrenX, childrenY] = [(left + right) / 2, (top + bottom) / 2]
      return [childrenX - containerX, childrenY - containerY] as XY
    })

    if (isEqual(childrenXY, prevChildrenXYRef.current)) return
    prevChildrenXYRef.current = childrenXY

    if (springsApi) {
      springsApi.update((index: number) => ({ y: childrenXY[index][1], x: childrenXY[index][0] }))
    } else {
      setSpringsApi(new SpringsApi((index: number) => ({
        to: {
          y: childrenXY[index][1], x: childrenXY[index][0]
        }
      })))
    }
  }, depths ? [...depths, items.length] : [renderFn, items.length])
  return (
    <>
      <div ref={containerRef} style={!isAnimating ? style : { ...style, visibility: 'hidden' }} css={customCss}>
        {items.map((value, i) =>
          React.cloneElement(renderFn(value, i), { ref: (node: any) => { childrenRef.current[i] = node } })
        )}
      </div>
      <div css={[tw`absolute invisible`, isAnimating && tw`visible`]}>
        {(springsApi) && <Springs
          springsApi={springsApi}
          items={items}
          getItemId={getItemId}
        >
          {(item, { x, y }, index) => {
            return <div style={{ position: 'absolute', transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}>
              {renderFn(item, index)}
            </div>
          }}
        </Springs>
    }
    </div>
    </>
  )
}

export default Transition
