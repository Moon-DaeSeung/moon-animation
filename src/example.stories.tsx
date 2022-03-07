import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import tw from 'twin.macro'
import { css } from '@emotion/react'
import colors from './colors'
import { Transition } from '.'
import Drag from './components/Drag'

export default {
  title: 'Example'
}

export const Shuffle = () => {
  type Item = { id: number, background: string, name: string}
  const [items, setItems] = useState<Item[]>([
    { id: 1, background: colors[1].css, name: 'LOREM' },
    { id: 2, background: colors[2].css, name: 'IPSUM' },
    { id: 3, background: colors[3].css, name: 'DOLOR' },
    { id: 4, background: colors[4].css, name: 'SIT' }
  ])
  const itemsRef = useRef<(HTMLElement | null)[]>([])
  const [unitY, setUnitY] = useState<number>()

  useEffect(() => {
    const itemRects = itemsRef.current.filter(child => child !== null)
      .map((child) => child!.getBoundingClientRect())
    if (itemRects.length === 0) return
    setUnitY(itemRects[1].y - itemRects[0].y)
  }, [])

  const handleDrag = ({ args: item, movement: [_, dy] }: {args: Item, movement: [number, number]}) => {
    if (!unitY) return
    const index = items.findIndex((value) => value === item)
    const next = clamp(index + Math.floor(dy / unitY))
    const copied = [...items]
    copied[index] = copied[next]
    copied[next] = item
    setItems(copied)
  }

  const clamp = (index: number) => {
    if (index <= 0) return 0
    if (index >= (items.length - 1)) return items.length - 1
    return index
  }

  return (
    <div tw='height[50vh] bg-blue-50 flex justify-center items-center'>
      <Transition
        items={items}
        getItemId={({ id }) => id}
        customCss={tw`flex flex-col gap-2`}
      >
        {(item, index) => {
          const { name, background } = item
          return (
            <Drag ref={ (node: any) => { itemsRef.current[index] = node }}
              args={item}
              onDrag={handleDrag}
              axis='y'
            >
              <div
                css={[tw`width[150px] pl-10 py-2 rounded shadow-md`, css`background: ${background};`]}>
                {name}
              </div>
            </Drag>
          )
        }
        }
      </Transition>
    </div>
  )
}
