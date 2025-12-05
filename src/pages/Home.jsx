import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatBox from '../components/ChatBox'
import { assets } from '../assets/assets'

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className='font-lato relative min-h-[100svh] dark:bg-gradient-to-b from-[#3e3b3b] to-[#000000] dark:text-white overflow-hidden'>
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className='absolute top-3 left-3 w-8 h-8 cursor-pointer z-30 not-dark:invert'
          onClick={() => setIsMenuOpen(true)}
          alt='menu'
        />
      )}

      <div className='flex min-h-[100svh] w-screen overflow-hidden'>
        <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <ChatBox />
      </div>
    </div>
  )
}

export default Home
