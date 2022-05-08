import React, { useRef, useState } from 'react'
import tw from 'twin.macro'
import { css } from '@emotion/react'
import colors from './colors'
import { Transition } from '.'

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
  const selectedItemRef = useRef<Item>()

  const shuffle = (intersected: Item) => {
    if (!selectedItemRef.current) return
    if (selectedItemRef.current.id === intersected.id) return

    setItems(prev => {
      return prev.map(item => {
        if (selectedItemRef.current!.id === item.id) return intersected
        if (intersected.id === item.id) return selectedItemRef.current!
        return item
      })
    })
  }

  return (
    <div tw='height[50vh] bg-blue-50 flex justify-center items-center'>
      <Transition
        items={items}
        getItemId={({ id }) => id}
        customCss={tw`flex flex-col gap-2`}
      >
        {item => {
          const { name, background } = item
          return (
            <div
              draggable
              onDragEnter={() => shuffle(item)}
              onMouseDown={() => { selectedItemRef.current = item } }
              onMouseUp={() => { selectedItemRef.current = undefined }}
              css={[tw`width[150px] pl-10 py-2 rounded shadow-md`, css`background: ${background};`]}>
              {name}
            </div>
          )
        }
        }
      </Transition>
    </div>
  )
}
