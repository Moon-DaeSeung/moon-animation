import React from 'react'
import { ComponentMeta } from '@storybook/react'
import tw from 'twin.macro'
import { css } from '@emotion/react'
import Drag from '.'
import colors from '../../colors'

/*
export default {
  title: 'UI/Drag',
  component: Drag
} as ComponentMeta<typeof Drag>
*/

export const Primary = () => {
  return (
    <div tw='height[50vh] bg-blue-200 flex justify-center items-center' >
      <Drag>
        <div css={[tw`py-2 px-4 text-2xl shadow-md rounded-2xl`, css`background: ${colors[7].css};`]}>
          Drag
        </div>
      </Drag>
    </div>
  )
}
