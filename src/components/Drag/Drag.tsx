import { useDrag } from '@use-gesture/react'
import React, { useEffect, useRef, useState } from 'react'
import { getContainerBlock } from '../../libs/getContainerBlock'
import { Portal } from '../../libs/Portal'
import Spring from '../Spring'
import { useSpringApi } from '../Spring/useSpringApi'

export type DragProps = {
  children: React.ReactElement,
  type?: 'stay' | 'reset'
}

const Drag = ({ children, type = 'reset' }: DragProps) => {
  const childrenRef = useRef<HTMLElement | null>(null)
  const [childrenRect, setChildrenRect] = useState({ width: 0, height: 0, x: 0, y: 0 })
  const containerBlockRef = useRef({ width: 0, height: 0, x: 0, y: 0 })
  const [isMoving, setIsMoving] = useState(false)

  const springApi = useSpringApi({ to: { x: 0, y: 0 } })
  const bind = useDrag(({ offset: [x, y], movement: [dx, dy], down }) => {
    if (type === 'reset') {
      down ? springApi.update({ x: dx, y: dy }) : springApi.update({ x: 0, y: 0 })
    } else {
      down && springApi.update({ x, y })
    }
    down !== isMoving && setIsMoving(down)
  })

  useEffect(() => {
    const childrenEl = childrenRef.current
    if (!childrenEl) return
    setChildrenRect(childrenEl.getBoundingClientRect())
    containerBlockRef.current = getContainerBlock(childrenEl).getBoundingClientRect()
  }, [isMoving])

  const { width: childrenWidth, height: childrenHeight, x: childrenX, y: childrenY } = childrenRect
  const { x: containerBlockX, y: containerBlockY } = containerBlockRef.current

  return (
    <>
     {React.cloneElement(children, {
       ref: (node: any) => { childrenRef.current = node },
       style: {
         ...children.props.style,
         backgroundColor: 'inherit',
         outline: 'dotted 2px #F8F8FF',
         boxShadow: 'none',
         outlineOffset: '-2px',
         color: 'rgba(0,0,0,0)',
         background: 'rgba(0,0,0,0)'
       }
     })}
     <Spring
      springApi={springApi}
     >
      {({ x, y }) => React.cloneElement(children, {
        ...bind(),
        style: {
          ...children.props.style,
          touchAction: 'none',
          cursor: 'pointer',
          margin: 0,
          userSelect: 'none',
          position: 'absolute',
          boxSizing: 'border-box',
          width: `${childrenWidth}px`,
          height: `${childrenHeight}px`,
          top: `${childrenY - containerBlockY + y}px`,
          left: `${childrenX - containerBlockX + x}px`
        }
      })}
     </Spring>
    </>
  )
}

export default Drag
