import { ComponentMeta } from '@storybook/react'
import React from 'react'
import Moon from '.'

export default {
  title: 'Animation/Moon',
  component: Moon
} as ComponentMeta<typeof Moon>

export const Primary = () => {
  return (
    <Moon
      config={{
        x: {
          initial: { displacement: 300, velocity: 0 },
          equation: ({ displacement, velocity }) =>
            -10 * displacement - 6 * velocity
        }
      }}
    >
      {({ x }) => {
        return (
          <div
            tw='flex justify-center items-center border[solid 2px] width[500px] height[80px]'
          >
            <div
              tw='relative bg-blue-400 width[50px] height[50px] rounded-full'
              style={{ left: x + 'px' }}
            />
          </div>
        )
      }}
    </Moon>
  )
}
