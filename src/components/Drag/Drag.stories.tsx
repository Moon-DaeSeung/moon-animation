import React, { useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import tw from 'twin.macro'
import { css } from '@emotion/react'
import Drag from '.'
import colors from '../../colors'

export default {
  title: 'UI/Drag',
  component: Drag
} as ComponentMeta<typeof Drag>

export const Primary = () => {
  const [isDragEntered, setIsDragEntered] = useState(false)
  return (
    <div tw='height[50vh] bg-blue-200 flex justify-center items-center' >
      <Drag>
        <div css={[tw`py-2 px-4 text-2xl shadow-md rounded-2xl`, css`background: ${colors[7].css};`]}>
          Drag
        </div>
      </Drag>
      <div
        onDragEnter={() => { setIsDragEntered(true); console.log('hi') }}
        onDragLeave={() => setIsDragEntered(false)}
        css={[tw`absolute bg-red-200 width[200px] flex justify-center font-bold py-5 rounded shadow-md right[30px]`, isDragEntered && tw`bg-blue-300`]}
      >
        {isDragEntered ? 'Hi!' : 'Drag over here!'}
      </div>
    </div>
  )
}
