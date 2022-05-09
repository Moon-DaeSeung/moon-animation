import React, { useImperativeHandle, useRef } from 'react'
import Spring from '../Spring'
import tw from 'twin.macro'
import { useSpringApi } from '../Spring/useSpringApi'

export type DragProps = {
  children: React.ReactElement
  type?: 'reset'
  axis?: 'x' | 'y' | 'both'
  onMouseDown?: (e: React.DragEvent<HTMLDivElement>) => void
  onMouseUp?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void
}

const Drag = ({ children, type = 'reset', axis = 'both', onMouseDown, onMouseUp, onDragEnter, onDragLeave }: DragProps, ref?: any) => {
  const childrenRef = useRef<HTMLElement | null>(null)
  useImperativeHandle(ref, () => childrenRef.current)
  const springApi = useSpringApi({ to: { x: 0, y: 0 } })
  const selectedXYRef = useRef<[number, number]>([0, 0])
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    selectedXYRef.current = [e.pageX, e.pageY]
    const canvas = document.createElement('canvas')
    e.dataTransfer.setDragImage(canvas, 0, 0)
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    type === 'reset' && springApi.update({ x: 0, y: 0 })
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.dropEffect = 'copy'
    const { pageX, pageY } = e
    const [originX, originY] = selectedXYRef.current
    const [x, y] = [pageX - originX, pageY - originY]
    springApi.update({ x, y })
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
        {({ x, y }) =>
        <div>
          {React.cloneElement(children, {
            style: {
              ...children.props.style,
              touchAction: 'none',
              cursor: 'pointer',
              margin: 0,
              userSelect: 'none',
              position: 'absolute',
              boxSizing: 'border-box',
              width: '100%',
              height: '100%',
              top: `${(axis === 'x' ? 0 : y)}px`,
              left: `${(axis === 'y' ? 0 : x)}px`
            }
          })}</div>}
      </Spring>
    </div>
  )
}

export default React.forwardRef(Drag)
