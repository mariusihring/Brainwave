import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { createSwapy } from "swapy"
export const Route = createFileRoute('/_authenticated/swappy')({
  component: () => <SwappyTest />
})


function SwappyTest() {
  useEffect(() => {
    const container = document.querySelector('.container')!
    const swapy = createSwapy(container)
    swapy.onSwap(({ data }) => {
      localStorage.setItem('slotItem', JSON.stringify(data.object))
    })
  }, [])
  return (
    <div className="container">
      <div className="slot a" data-swapy-slot="1">
        <div className='cursor-pointer' data-swapy-item="a">test</div>
      </div>
      <div className="second-row">
        <div className="slot b" data-swapy-slot="2">
          <div className='cursor-pointer' data-swapy-item="b">test2</div>
        </div>
        <div className="slot c" data-swapy-slot="3">
          <div className='cursor-pointer' data-swapy-item="c">test3</div>
        </div>
      </div>
      <div className="slot d" data-swapy-slot="4">
        <div className='cursor-pointer' data-swapy-item="d">test4</div>
      </div>
    </div>
  )
}
