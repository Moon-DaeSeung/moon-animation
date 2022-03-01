import { ComponentMeta } from '@storybook/react'
import React, { useState } from 'react'
import 'twin.macro'
import Moons from '.'
import colors from '../../colors'

export default {
  title: 'ANIMATION/Moons',
  component: Moons
} as ComponentMeta<typeof Moons>

export const Primary = () => {
  const [items, setItems] = useState([
    { id: 1, color: colors[1].css },
    { id: 2, color: colors[2].css }
  ])
  const handleClick = () => setItems([...items].reverse())
  return (
    <>
      <button tw='p-2.5' onClick={handleClick}>reverse</button>
      <div tw='relative flex justify-center items-center height[80px]'>
        <Moons
          items={items}
          config={(index: number) => ({
            x: {
              initial: { displacement: index === 0 ? 400 : -400, velocity: 0 },
              equation: ({ displacement, velocity }: {displacement: number, velocity: number}) => -2 * (displacement - (index === 0 ? 200 : -200)) - 1 * velocity
            }
          })}
          getItemId={({ id }) => id}
        >
          {({ id, color }, { x }) =>
            <div key={id}
              tw='absolute width[50px] height[50px] shadow-md rounded-full'
              style={{ transform: `translateX(${x}px)`, background: color }}
            />
          }
        </Moons>
      </div>
    </>
  )
}
