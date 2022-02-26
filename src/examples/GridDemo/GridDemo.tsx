import React, { useState } from 'react'
import tw from 'twin.macro'
import Transition from '../../components/Transition'

const GridDemo = () => {
  const [col, setCol] = useState(1)
  const [teachers] = useState([{ name: '문대승' }])
  const move = () => {
    setCol(col % 5 + 1)
  }
  return (
    <div tw='bg-blue-300 height[100px]' >
      <button tw='text-2xl' onClick={move}>hihihi</button>
         <Transition
           items={teachers}
           getItemId={({ name }) => name}
           style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}
          >
             {({ name }) =>
             <div
             tw='bg-green-300 border-green-500 rounded text-2xl '
             style={{ gridColumn: col }}
             >
               {name}
             </div>}
         </Transition>
    </div>
  )
}

export default GridDemo

const center = tw`flex justify-center items-center`
