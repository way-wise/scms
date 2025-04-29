"use client"

import { useState } from "react"
import { Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MediaPreviewProps {
  value: {
    name: string
    type: string
    size: number
    url: string
    isExternal?: boolean
    lastModified?: number
  }
  onRemove: () => void
}

export function MediaPreview({ value, onRemove }: MediaPreviewProps) {
  const [isHovering, setIsHovering] = useState(false)

  if (!value || !value.url) {
    return null
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "Unknown size"
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  if (value.type.startsWith("image/") || value.isExternal) {
    return (
      <div
        className="mt-2 relative rounded-md overflow-hidden border group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img
          src={value.url || "/placeholder.svg"}
          alt={value.name}
          className="max-h-[200px] w-auto mx-auto object-contain"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg"
            e.currentTarget.alt = "Failed to load image"
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2 text-xs flex justify-between items-center">
          <div className="truncate mr-2">{value.name}</div>
          <div className="flex items-center gap-2">
            {value.isExternal && (
              <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">External</span>
            )}
            <span>{formatFileSize(value.size)}</span>
          </div>
        </div>
        {isHovering && (
          <div className="absolute top-2 right-2 flex gap-2">
            {value.isExternal && (
              <a
                href={value.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background/80 rounded-md p-1 hover:bg-background"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <Button variant="destructive" size="icon" className="h-6 w-6 opacity-90" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (value.type.startsWith("video/")) {
    return (
      <div
        className="mt-2 rounded-md overflow-hidden border relative group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <video src={value.url} controls className="max-h-[200px] w-full" />
        <div className="bg-background p-2 text-xs">
          {value.name} ({formatFileSize(value.size)})
        </div>
        {isHovering && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 opacity-90"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  // Generic file preview
  return (
    <div
      className="mt-2 rounded-md overflow-hidden border p-4 flex items-center gap-3 relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <div className="text-sm">
        <div>{value.name}</div>
        <div className="text-xs text-muted-foreground">{formatFileSize(value.size)}</div>
      </div>
      {isHovering && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 opacity-90"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
