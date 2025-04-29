"use client"

import type React from "react"

import { useState } from "react"
import { Upload, LinkIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { MediaPreview } from "./media-preview"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MediaUploadProps {
  name: string
  value: any
  onChange: (value: any) => void
  type?: "image" | "video" | "file"
}

export function MediaUpload({ name, value, onChange, type = "file" }: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [externalUrl, setExternalUrl] = useState("")

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Create a URL for the file
    const fileUrl = URL.createObjectURL(file)

    // Update the value with file information
    onChange({
      name: file.name,
      type: file.type,
      size: file.size,
      url: fileUrl,
      lastModified: file.lastModified,
    })
  }

  const handleExternalUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (externalUrl) {
      onChange({
        name: externalUrl.split("/").pop() || "external-image",
        type: type === "image" ? "image/jpeg" : type === "video" ? "video/mp4" : "application/octet-stream",
        size: 0,
        url: externalUrl,
        isExternal: true,
      })
      setExternalUrl("")
    }
  }

  const handleRemove = () => {
    onChange({ type: type, url: "", name: "", size: 0 })
  }

  const getAcceptTypes = () => {
    switch (type) {
      case "image":
        return "image/*"
      case "video":
        return "video/*"
      default:
        return "*/*"
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case "image":
        return "Image"
      case "video":
        return "Video"
      default:
        return "File"
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`property-${name}`}>{getTypeLabel()}</Label>

      {value && value.url && <MediaPreview value={value} onRemove={handleRemove} />}

      {(!value || !value.url) && (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="external">External URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center ${
                dragActive ? "border-primary" : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                id={`property-${name}-upload`}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={getAcceptTypes()}
              />
              <label htmlFor={`property-${name}-upload`} className="flex flex-col items-center gap-2 cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Drag & drop or click to upload</div>
                <div className="text-xs text-muted-foreground">
                  {type === "image" ? "JPG, PNG, GIF, SVG" : type === "video" ? "MP4, WebM, MOV" : "Any file type"}
                </div>
              </label>
            </div>
          </TabsContent>

          <TabsContent value="external">
            <form onSubmit={handleExternalUrlSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="flex-1"
                />
              </div>
              <Button type="submit" disabled={!externalUrl} className="w-full">
                Use External URL
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Enter a direct URL to an online {getTypeLabel().toLowerCase()}
              </p>
            </form>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
