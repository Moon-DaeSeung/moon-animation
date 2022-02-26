import { ComponentMeta } from '@storybook/react'
import React, { useState } from 'react'
import 'twin.macro'
import Moons from '.'
import { MoveInfo } from '../../libs/NumericalAnalyzer'

export default {
  title: 'ANIMATION/Moons',
  component: Moons
} as ComponentMeta<typeof Moons>

export const Primary = () => {
  const [items, setItems] = useState([
    { id: 1, color: 'red' },
    { id: 2, color: 'blue' }
  ])
  const handleClick = () => setItems([...items].reverse())
  return (
    <>
      <button tw='p-2.5' onClick={handleClick}>reverse</button>
      <div
        tw='relative flex justify-center items-center width[500px] height[80px] border[solid 2px]'
      >
        <Moons
          items={items}
          config={(index: number) => ({
            x: {
              initial: { displacement: index === 0 ? 200 : -200, velocity: 0 },
              equation: ({ displacement, velocity }: {displacement: number, velocity: number}) => -2 * (displacement - (index === 0 ? 150 : -150)) - 1 * velocity
            }
          })}
          getItemId={({ id }) => id}
        >
          {({ id, color }, { x }) =>
            <div key={id} style={{ position: 'absolute', transform: `translateX(${x}px)`, backgroundColor: color, width: '50px', height: '50px', borderRadius: '9999px' }}/>
          }
        </Moons>
      </div>
    </>
  )
}
