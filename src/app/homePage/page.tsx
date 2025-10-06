import Link from 'next/link'
import React from 'react'

const HomePage = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen gap-10'>
      <span className='text-5xl font-bold '>KLOUW</span>
      <Link className='hover:underline' href="/splitter">Go to App</Link>
    </div>
  )
}

export default HomePage
