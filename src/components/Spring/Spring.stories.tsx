import { ComponentMeta } from '@storybook/react'
import React, { useState } from 'react'
import Spring from '.'
import { useSpringApi } from './useSpringApi'

export default {
  title: 'ANIMATION/Spring',
  component: Spring
} as ComponentMeta<typeof Spring>

export const Primary = () => {
  const springApi = useSpringApi({ from: { x: 200 }, to: { x: 0 } })
  const [toggle, setToggle] = useState(false)
  const handleClick = () => {
    springApi.update({ x: !toggle ? 200 : 0 })
    setToggle(!toggle)
  }
  return (
    <>
      <button tw="p-2.5" onClick={handleClick}>
        move
      </button>
      <Spring springApi={springApi}>
        {({ x }) => (
          <div tw="relative flex justify-center items-center width[500px] height[80px] border[solid 2px]">
            <div
              tw="relative bg-blue-400 width[50px] height[50px] rounded-full"
              style={{ left: x + 'px' }}
            />
          </div>
        )}
      </Spring>
    </>
  )
}
