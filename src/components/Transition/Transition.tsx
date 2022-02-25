import React, { useEffect, useLayoutEffect, useRef, useState, CSSProperties } from 'react'
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
  const childrenArray = items.map((value, i) => {
    return React.cloneElement(renderFn(value, i), { ref: (node: any) => { childrenRef.current[i] = node } })
  })
  const childrenRef = useRef<(HTMLElement | null)[]>(Array.from({ length: items.length }, () => null))
  const prevChildrenXYRef = useRef<XY[]>()
  const [isAnimating, setIsAnimating] = useState(false)
  const [springsApi, setSpringsApi] = useState<SpringsApi<{opacity: number, x: number, y: number}>>()

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

    const childrenXY = childrenRects.map(({ top, bottom, left, right }) => {
      const [childrenX, childrenY] = [(left + right) / 2, (top + bottom) / 2]
      return [childrenX - containerX, childrenY - containerY] as XY
    })

    if (isEqual(childrenXY, prevChildrenXYRef.current)) return
    prevChildrenXYRef.current = childrenXY

    if (springsApi) {
      springsApi.update((index: number) => ({ x: childrenXY[index][0], y: childrenXY[index][1], opacity: 1 }))
    } else {
      setSpringsApi(new SpringsApi((index: number) => ({
        to: {
          opacity: 1, x: childrenXY[index][0], y: childrenXY[index][1]
        }
      })))
    }
  }, depths ? [...depths] : [renderFn])
  return (
    <>
      <div ref={containerRef} style={!isAnimating ? style : { ...style, visibility: 'hidden' }} css={customCss}>
        {childrenArray}
      </div>
      <div css={[tw`absolute invisible`, isAnimating && tw`visible`]}>
        {(springsApi) && <Springs
          springsApi={springsApi}
          items={items}
          getItemId={getItemId}
        >
          {(item, { x, y, opacity }, index) => {
            return <div style={{ position: 'absolute', transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`, opacity }}>
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
