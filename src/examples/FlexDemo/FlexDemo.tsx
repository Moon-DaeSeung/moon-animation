import React, { useState } from 'react'
import tw from 'twin.macro'
import { css } from '@emotion/react'
import Transition from '../../components/Transition'
import colors from '../../colors'

const FlexDemo = () => {
  const [nums, setNums] = useState([1, 2, 3, 4])
  const [direction, setDirection] = useState<'row' | 'row-reverse'>('row')
  const handleDirection = () => {
    // setNums(nums => [...nums].reverse())
    setDirection(direction === 'row' ? 'row-reverse' : 'row')
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
    <div tw='bg-blue-200 w-full h-screen' css={center}>
      <button tw='absolute top[50px] min-w-full h-8 text-xl' onClick={handleAddNums}>add</button>
      <button tw='absolute top[100px] min-w-full h-8 text-xl' onClick={handleSubtractNums}>minus</button>
      <button tw='absolute top[0px] min-w-full h-8 text-xl' onClick={handleDirection}>direction</button>
      <Transition
        customCss={[tw`flex`, css`flex-direction: ${direction};`]}
        items={nums}
        getItemId={(value) => value}
        depths={[direction]}
       >
        {((value) =>
          <div key={value}
            tw='rounded-full w-14 h-14 m-2.5' css={center}
            style={{
              background: colors[(value - 1) % colors.length].css
            }}>
              {value}
          </div>)
        }
      </Transition>
    </div>
  )
}

export default FlexDemo

const center = tw`flex justify-center items-center`
