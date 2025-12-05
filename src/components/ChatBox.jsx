import React, { useEffect, useState, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Messages from './Messages'
import { pdfApi } from '../api/pdfApi'


const ChatBox = () => {
  const { selectedChat, theme, setSelectedChat, setChats, createNewChat } = useAppContext()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadingFile, setUploadingFile] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  // Handle file upload
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) {
      setError('Please select at least one PDF file')
      return
    }

    // Validate all files are PDFs
    const invalidFiles = files.filter(file => file.type !== 'application/pdf')
    if (invalidFiles.length > 0) {
      setError('Please select only PDF files')
      return
    }

    setUploadingFile(true)
    setError(null)

    try {
      const result = await pdfApi.uploadPDF(files)
      
      // Add system message about successful upload
      const fileNames = files.map(f => f.name).join(', ')
      const systemMsg = {
        role: 'system',
        content: `${files.length} PDF${files.length > 1 ? 's' : ''} uploaded successfully: ${fileNames}`,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, systemMsg])
      setSelectedFiles([])
      setMode('text')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload PDF')
      console.error('Upload error:', err)
    } finally {
      setUploadingFile(false)
    }
  }

  // Handle question submit
  const onSubmit = async (e) => {
    e.preventDefault()

    // If files are selected, upload them instead
    if (selectedFiles.length > 0) {
      await handleFileUpload(selectedFiles)
      return
    }

    const text = prompt.trim()
    if (!text) return

    // Add user message
    const userMessage = {
      role: 'user',
      content: text,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setPrompt('')
    setLoading(true)
    setError(null)

    try {
      // Call backend API
      const response = await pdfApi.queryPDF(text)
      
      // Add AI response
      const assistantMsg = {
        role: 'assistant',
        content: response.answer,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get response')
      console.error('Query error:', err)
      
      // Add error message
      const errorMsg = {
        role: 'error',
        content: 'Sorry, I encountered an error. Please try again or upload a PDF first.',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  // Handle new chat
  const handleNewChat = async () => {
    try {
      await pdfApi.clearEmbeddings()
      setMessages([])
      setError(null)
      setSelectedFiles([])
      setMode('text')
      
      if (createNewChat) {
        createNewChat()
      }
    } catch (err) {
      setError('Failed to clear chat')
      console.error(err)
    }
  }

  // Remove individual file from selection
  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove))
    if (selectedFiles.length === 1) {
      setMode('text')
    }
  }

  useEffect(() => {
    if (selectedChat) setMessages(selectedChat.messages)
  }, [selectedChat])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className="relative flex flex-col justify-between items-center min-h-[100svh] w-full px-6 py-4 overflow-hidden bg-[#e4e2e2] dark:bg-linear-to-b from-[#242124] to-[#000000] text-white">
      {/* New Chat Button */}
      <div className="absolute top-5 right-5 z-10">
        <button
          onClick={handleNewChat}
          className="flex justify-center items-center px-4 py-2 font-semibold dark:text-white bg-[#16a883] dark:bg-[#27E0B3] text-sm rounded-md shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span className="mr-2 text-xl">+</span> New Chat
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="absolute top-20 right-5 z-10 bg-red-500/90 text-white px-4 py-2 rounded-md shadow-lg">
          {error}
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 w-full max-w-4xl overflow-y-auto mt-10 mb-6 text-slate-700 dark:text-white">
        {messages.length === 0 ? (
          <div className='flex flex-col justify-between items-center'>
            
            <img src={ theme=== "dark" ? assets.PaperMind_logo_white : assets.PaperMind_logo} alt="Logo" className="w-50 mb-5" />
              <div className="h-full flex flex-col items-center justify-center text-center gap-3">
              <p className=" dark:text-slate-200 text-slate-700 text-4xl md:text-6xl font-bold tracking-tight font-lato ">Your PDFs, now interactive !</p>
              <span className=' md:text-6xl bg-clip-text font-bold text-transparent bg-[#149c7a] dark:bg-[#27E0B3] animate-pulse duration-2000 font-lato '>
                    Chat, learn, and explore
              </span>
              <p className="mt-6 text-black font-medium dark:text-gray-400 text-xs md:text-2xl font-doto">Upload a PDF to get started....</p>
            </div>
          </div>
          
        ) : (
          messages.map((msg, index) => <Messages key={index} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File upload indicator */}
      {selectedFiles.length > 0 && (
        <div className="w-full max-w-2xl mb-5 px-4 py-3 bg-purple-500/20 border border-purple-500/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm">{selectedFiles.length} PDF{selectedFiles.length > 1 ? 's' : ''} Selected</span>
            <button
              onClick={() => {
                setSelectedFiles([])
                setMode('text')
              }}
              className="text-red-400 hover:text-red-300 text-xs font-medium"
            >
              Clear All ✕
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-purple-400/30">
                <span className="text-xs text-gray-200 max-w-[150px] truncate">
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input box */}
      <form
        onSubmit={onSubmit}
        className="bg-amber-100  dark:bg-[#1e1e1e]/60 border border-gray-600 rounded-full w-full max-w-2xl p-3 pl-4 flex items-center gap-3 backdrop-blur-md mb-10"
      >
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              const filesArray = Array.from(e.target.files)
              if (filesArray.length > 0) {
                setMode('file')
                setSelectedFiles(filesArray)
                setError(null)
              }
            }}
            disabled={uploadingFile || loading}
          />
          <img 
            src={assets.attachment_icon} 
            alt="Attach" 
            className={`w-6 h-6 ${(uploadingFile || loading) ? 'opacity-50' : ''}`} 
          />
        </label>

        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder={
            uploadingFile 
              ? "Uploading..." 
              : selectedFiles.length > 0
              ? `Click send to upload ${selectedFiles.length} PDF${selectedFiles.length > 1 ? 's' : ''}...` 
              : "Ask a question about your PDF..."
          }
          className="flex-1 bg-transparent outline-none text-sm text-slate-700 dark:text-white placeholder-gray-400"
          disabled={uploadingFile || loading}
        />

        <button disabled={uploadingFile || loading || (!prompt.trim() && selectedFiles.length === 0)} type="submit">
          <img
            src={uploadingFile || loading ? assets.stop_icon : assets.send_icon}
            className={`w-7 h-7 cursor-pointer ${(uploadingFile || loading || (!prompt.trim() && selectedFiles.length === 0)) ? 'opacity-50' : ''}`}
            alt="Send"
          />
        </button>
      </form>
    </div>
  )
}

export default ChatBox
