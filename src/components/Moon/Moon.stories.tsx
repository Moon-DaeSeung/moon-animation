import { ComponentMeta } from '@storybook/react'
import React from 'react'
import Moon from '.'
import colors from '../../colors'

export default {
  title: 'Animation/Moon',
  component: Moon
} as ComponentMeta<typeof Moon>

export const Primary = () => {
  return (
    <Moon
      config={{
        x: {
          initial: { displacement: -300, velocity: 0 },
          equation: ({ displacement, velocity }) =>
            -2 * displacement - 0.2 * velocity
        }
      }}
    >
      {({ x }) => {
        return (
          <div tw='flex justify-center items-center height[80px]'>
            <div
              tw='relative bg-blue-400 width[50px] height[50px] rounded-full shadow-md'
              style={{ left: x + 'px', background: colors[1].css }}
            />
          </div>
        )
      }}
    </Moon>
  )
}
