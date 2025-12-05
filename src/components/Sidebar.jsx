import React from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { theme, setTheme, navigate, logout } = useAppContext()

  // Get user info from localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {}
  const { name, email } = userData

  // App Version
  const APP_VERSION = "v1.0.0"

  return (
      <div
        className={`fixed top-0 left-0 min-h-[100svh] w-72 p-5 flex flex-col 
        bg-[#d8f7f0] dark:bg-slate-800 text-black dark:text-white 
        backdrop-blur-3xl transition-transform duration-500 z-20
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
      {/* Close Button */}
      <img
        onClick={() => setIsMenuOpen(false)}
        src={assets.close_icon}
        className='absolute top-3 right-3 h-5 cursor-pointer dark:invert'
        alt='close'
      />

      <div className="mt-8 flex items-end gap-2">
        <h1 className="text-3xl text-slate-600 dark:text-white bg-clip-text dark:opacity-100">
          PaperMind
        </h1>
        <span className="text-xs text-gray-600 dark:text-gray-300 mb-1">
          {APP_VERSION}
        </span>
      </div>

      {/* User Profile Section */}
      <div className='flex items-center w-full py-3 px-3 mt-8 text-slate-700 dark:text-white bg-amber-100 dark:bg-gradient-to-r from-[#1E293B]/80 to-[#334155]/80 shadow-lg rounded-md border border-white/10'>
        <img
          src={assets.user_icon}
          alt='User'
          className='w-10 h-10 rounded-full border-2 border-white/20 mr-3'
        />
        <div className='flex flex-col'>
          <p className='font-semibold text-sm leading-tight'>{name || 'Guest User'}</p>
          <p className='text-xs  dark:text-gray-300 leading-tight'>{email || 'No Email'}</p>
        </div>
      </div>

      {/* New Chat Button */}
      <button
        onClick={() => setIsMenuOpen(false)}
        className='flex justify-center items-center w-full py-2 mt-4 animate-pulse font-semibold text-[#FFFFFF] bg-[#16a883] dark:bg-[#27E0B3] text-sm rounded-md cursor-pointer shadow-md hover:opacity-90'
      >
        <span className='mr-2 text-xl'>+</span> New Chat
      </button>

      <div className='grow'></div>

      {/* Dark Mode Toggle */}
      <div className='flex items-center justify-between gap-2 p-3 mb-4 border border-gray-300 dark:border-white/15 rounded-md'>
        <div className='flex items-center gap-2 text-sm'>
          <img src={assets.theme_icon} className='w-4 dark:invert' alt='theme' />
          <p>Dark Mode</p>
        </div>

        <label className='relative inline-flex cursor-pointer'>
          <input 
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            type='checkbox' 
            className='sr-only peer' 
            checked={theme === 'dark'} 
          />
          <div className='w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all'></div>
          <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>
        </label>
      </div>

      <div className="text-center text-xs mb-3 opacity-70 dark:opacity-60">
        PaperMind • {APP_VERSION}
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className='flex items-center justify-center gap-2 py-2 text-white bg-slate-500 rounded-md hover:bg-white hover:text-black transition-colors'
      >
        <img src={assets.logout_icon} alt='logout' className='w-4 h-4 invert dark:invert-0' />
        Logout
      </button>
    </div>
  )
}

export default Sidebar
