import React, { useRef, useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import Transition from './Transition'
import tw from 'twin.macro'
import { css } from '@emotion/react'
import colors from '../../colors'
import Drag from '../Drag'

export default {
  title: 'Animation/Transition',
  component: Transition
} as ComponentMeta<typeof Transition>

export const Flex = () => {
  const [nums, setNums] = useState([1, 2, 3, 4])
  const [direction, setDirection] = useState(0)
  const directions = ['row', 'column', 'row-reverse', 'column-reverse']
  const handleDirection = () => {
    setDirection(direction % 4 + 1)
  }
  const handleAddNums = () => {
    setNums(values => {
      const copied = [...values]
      copied.push(copied.length + 1)
      return copied
    })
  }
  const handleSubtractNums = () => {
    setNums(values => {
      const copied = [...values]
      copied.pop()
      return copied
    })
  }
  return (
    <div tw='height[50vh]'>
      <div tw='flex gap-2 flex-row-reverse flex-1'>
        <button tw='h-8 text-xl' onClick={handleAddNums}>add</button>
        <button tw='h-8 text-xl'onClick={handleSubtractNums}>minus</button>
        <button tw='h-8 text-xl' onClick={handleDirection}>direction</button>
      </div>
      <div tw='h-full flex justify-center items-center'>
        <Transition
          customCss={[tw`flex gap-5`, css`flex-direction: ${directions[direction]};`]}
          items={nums}
          getItemId={(value) => value}
        >
          {((value) =>
            <div key={value}
              tw='w-16 h-16 text-2xl rounded-2xl shadow-lg' css={center}
              style={{
                background: colors[(value - 1) % colors.length].css
              }}>
                {value}
            </div>)
          }
        </Transition>
      </div>
    </div>
  )
}

export const Grid = () => {
  const [items, setItems] = useState([{ id: 1, ...colors[0] }])
  const add = () => {
    setItems([
      {
        id: items.length + 1,
        ...colors[items.length % colors.length]
      }, ...items
    ])
  }
  const minus = () => {
    const copied = [...items]
    copied.shift()
    setItems(copied)
  }
  return (
    <div tw='height[50vh]'>
      <div tw='flex justify-end gap-2'>
        <button tw='text-2xl shadow-md' onClick={add}>add</button>
        <button tw='text-2xl shadow-md' onClick={minus}>minus</button>
      </div>
      <div tw='h-full'>
        <Transition
          items={items}
          getItemId={({ id }) => id}
          customCss={tw`grid grid-cols-4 gap-2 h-full grid-auto-rows[40px]`}
        >
          {({ name, css }) =>
            <div
            tw='flex justify-center rounded text-2xl p-1 shadow-md truncate h-7'
            style={{ background: css }}
            >
              {name}
            </div>}
        </Transition>
      </div>
    </div>
  )
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
    <div css={[tw`height[50vh] bg-blue-50`, center]}>
      <Transition
        items={items}
        getItemId={({ id }) => id}
        customCss={tw`flex flex-col gap-2`}
      >
        {item => {
          const { name, background } = item
          return (
            <Drag
              axis='y'
              onDragEnter={() => shuffle(item)}
              onMouseDown={() => { selectedItemRef.current = item } }
              onMouseUp={() => { selectedItemRef.current = undefined }}
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

const center = tw`flex justify-center items-center`
