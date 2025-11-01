"use client"

import React from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"
import { cn } from "@/lib/utils"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

// Define modules and formats separately
const quillModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
}

const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "link",
]

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter broadcast message...",
  className
}) => {
  const handleChange = (content: string) => {
    onChange(content)
  }

  return (
    <div className={cn("rich-text-editor-wrapper", className)}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={quillModules}
        formats={quillFormats}
        placeholder={placeholder}
        className="rich-text-editor"
      />
    </div>
  )
}

export default RichTextEditor

