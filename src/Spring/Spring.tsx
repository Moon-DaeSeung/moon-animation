import React from 'react'
import tw from 'twin.macro'
import { Equation, Moon } from '../libs/moon'

const Spring = () => {
  const equation: Equation = ({ displacement }) => {
    return -0.01 * displacement
  }
  const moon = new Moon(equation, { velocity: 0, displacement: 100 })
  const a = '100' + 'px'
  return (
    <div tw='flex justify-center items-center border-solid border-2 width[500px] height[80px]'>
      <div css={[tw`bg-blue-300 w-12 aspect-ratio[1] rounded-full relative left[${a}]`]}/>
    </div>
  )
}

export default Spring
