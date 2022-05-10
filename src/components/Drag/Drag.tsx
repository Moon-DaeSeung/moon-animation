import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import Spring from '../Spring'
import { useSpringApi } from '../Spring/useSpringApi'
import Portal from '../Portal'

export type DragProps = {
  children: React.ReactElement
  axis?: 'x' | 'y' | 'both'
  onMouseDown?: (e: React.DragEvent<HTMLDivElement>) => void
  onMouseUp?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void
}

const Drag = ({ children, axis = 'both', onMouseDown, onMouseUp, onDragEnter, onDragLeave }: DragProps, ref?: any) => {
  const childrenRef = useRef<HTMLElement | null>(null)
  useImperativeHandle(ref, () => childrenRef.current)
  const originRef = useRef({ x: 0, y: 0 })
  const springApi = useSpringApi({ to: originRef.current })

  useEffect(() => {
    springApi.onStart(() => {
      setIsMoving(true)
    })
    springApi.onRest(() => setIsMoving(false))
  }, [])

  const selectedXYRef = useRef<[number, number]>([0, 0])
  const [childrenRect, setChildrenRect] = useState({ x: 0, y: 0 })
  const [origin, setOrigin] = useState(originRef.current)
  const [isMoving, setIsMoving] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    selectedXYRef.current = [e.pageX, e.pageY]
    const canvas = document.createElement('canvas')
    e.dataTransfer.setDragImage(canvas, 0, 0)
    setIsMouseDown(true)
    const { x, y } = childrenRef.current!.getBoundingClientRect()
    setChildrenRect({ x, y })
    setOrigin(originRef.current)
  }

  const handleDragEnd = () => {
    setIsMouseDown(false)
    const { x: endX, y: endY } = childrenRef.current!.getBoundingClientRect()
    const { x: startX, y: startY } = childrenRect
    const { x: correctionX, y: correctionY } = originRef.current
    const { x, y } = { x: endX - startX, y: endY - startY }
    springApi.update({ x: x + correctionX, y: y + correctionY })
    originRef.current = { x: x + correctionX, y: y + correctionY }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const { pageX, pageY } = e
    const [selectedX, selectedY] = selectedXYRef.current
    const [offsetX, offsetY] = [pageX - selectedX, pageY - selectedY]
    const origin = originRef.current
    springApi.update({ x: offsetX + origin.x, y: offsetY + origin.y })
  }

  return (
    <div
      tw='relative'
      draggable
      onDragEnd={handleDragEnd}
      onDragOver={e => e.preventDefault()}
      onDrop={e => e.preventDefault()}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      {React.cloneElement(children, {
        ref: (node: any) => { childrenRef.current = node },
        style: (isMoving || isMouseDown)
          ? {
              ...children.props.style,
              backgroundColor: 'inherit',
              outline: 'dotted 2px #F8F8FF',
              boxShadow: 'none',
              outlineOffset: '-2px',
              color: 'rgba(0,0,0,0)',
              background: 'rgba(0,0,0,0.05)'
            }
          : children.props.style
      })}
      <Spring
        springApi={springApi}
      >
        {({ x, y }) =>
          (isMouseDown || isMoving)
            ? <Portal>
          {React.cloneElement(children, {
            style: {
              ...children.props.style,
              touchAction: 'none',
              cursor: 'pointer',
              pointerEvents: 'none',
              userSelect: 'none',
              position: 'fixed',
              top: `${childrenRect.y - origin.y + (axis === 'x' ? 0 : y)}px`,
              left: `${childrenRect.x - origin.x + (axis === 'y' ? 0 : x)}px`
            }
          })}
        </Portal>
            : <></>
      }
      </Spring>
    </div>
  )
}

export default React.forwardRef(Drag)
