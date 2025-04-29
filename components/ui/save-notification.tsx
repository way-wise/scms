"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"

interface SaveNotificationProps {
  success: boolean
  message: string
  visible: boolean
  onClose: () => void
}

export function SaveNotification({ success, message, visible, onClose }: SaveNotificationProps) {
  const [isVisible, setIsVisible] = useState(visible)

  useEffect(() => {
    setIsVisible(visible)

    if (visible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [visible, onClose])

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg flex items-center gap-3 transition-all duration-300 ${
        success ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
      }`}
    >
      {success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
      <p>{message}</p>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose()
        }}
        className="ml-2 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
    </div>
  )
}
