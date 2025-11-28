import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Messages = ({ message }) => {
  useEffect(() => {
    Prism.highlightAll()
  }, [message.content])

  // System messages (PDF upload success, etc.)
  if (message.role === 'system') {
    return (
      <div className='flex justify-center my-4'>
        <div className='px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-sm dark:text-white'>
          ✓ {message.content}
        </div>
      </div>
    )
  }

  // Error messages
  if (message.role === 'error') {
    return (
      <div className='flex justify-center my-4'>
        <div className='px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300'>
          ⚠ {message.content}
        </div>
      </div>
    )
  }

  // User messages
  if (message.role === 'user') {
    return (
      <div className='flex items-start justify-end my-4 gap-2'>
        <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl'>
          <p className='text-sm dark:text-primary text-[#314158]'>{message.content}</p>
          <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
            {moment(message.timestamp).fromNow()}
          </span>
        </div>
        <img src={assets.user_icon} alt="" className='w-8 rounded-full' />
      </div>
    )
  } 

  // AI messages
  return (
    <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md my-4'>
      {message.isImage ? (
        <img src={message.content} alt="" className='w-full max-w-md mt-2 rounded-md' />
      ) : (
        <div className='text-sm dark:text-primary reset-tw'>
          <Markdown>{message.content}</Markdown>
        </div>
      )}
      <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
        {moment(message.timestamp).fromNow()}
      </span>
    </div>
  )
}

export default Messages
