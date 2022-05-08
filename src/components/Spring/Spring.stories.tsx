import { ComponentMeta } from '@storybook/react'
import React, { useState } from 'react'
import Spring from '.'
import colors from '../../colors'
import { useSpringApi } from './useSpringApi'

export default {
  title: 'ANIMATION/Spring',
  component: Spring
} as ComponentMeta<typeof Spring>

export const Primary = () => {
  const springApi = useSpringApi({ from: { x: -300 }, to: { x: 0 } })
  const [toggle, setToggle] = useState(false)
  const handleClick = () => {
    springApi.update({ x: !toggle ? -300 : 0 })
    setToggle(!toggle)
  }
  return (
    <>
      <button tw="p-2.5" onClick={handleClick}>
        move
      </button>
      <Spring springApi={springApi}>
        {({ x }) => (
          <div tw="relative flex justify-center items-center height[80px]">
            <div
              tw="relative  width[50px] height[50px] rounded-full"
              style={{ left: x + 'px', background: colors[5].css }}
            />
          </div>
        )}
      </Spring>
    </>
  )
}
