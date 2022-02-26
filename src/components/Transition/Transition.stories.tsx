import React, { useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import Transition from './Transition'
import tw from 'twin.macro'
import { css } from '@emotion/react'
import colors from '../../colors'

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
    <div tw='bg-blue-200 height[500px]'>
      <div tw='flex gap-2 flex-row-reverse'>
        <button tw='h-8 text-xl' onClick={handleAddNums}>add</button>
        <button tw='h-8 text-xl'onClick={handleSubtractNums}>minus</button>
        <button tw='h-8 text-xl' onClick={handleDirection}>direction</button>
      </div>
      <div tw='flex h-full' css={center}>
        <Transition
          customCss={[tw`flex gap[5vw]`, css`flex-direction: ${directions[direction]};`]}
          items={nums}
          getItemId={(value) => value}
        >
          {((value) =>
            <div key={value}
              tw='width[8vw] height[8vw] font-size[5vw] rounded-full' css={center}
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
  const [col, setCol] = useState(1)
  const [item] = useState([{ name: 'item' }])
  const move = () => {
    setCol(col % 5 + 1)
  }
  return (
    <div tw='bg-blue-300' >
      <button tw='text-2xl' onClick={move}>move</button>
      <div tw='grid grid-cols-5'>
        {[1, 2, 3, 4, 5].map(value =>
          <div key={value} tw='p-1 border-solid border-0 border-l-2'>
            {value}
          </div>
        )}
      </div>
         <Transition
           items={item}
           getItemId={({ name }) => name}
           customCss={tw`grid grid-cols-5`}
          >
             {({ name }) =>
             <div
             tw='bg-green-300 border-green-500 flex justify-center rounded text-2xl '
             style={{ gridColumn: col }}
             >
               {name}
             </div>}
         </Transition>
    </div>
  )
}

const center = tw`flex justify-center items-center`
