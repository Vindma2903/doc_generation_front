// src/shared/ui/common/document/marker.tsx
import React from "react"
import { Editor } from "@tiptap/react"

type Props = {
  editor: Editor
}

export const MarkerListButton: React.FC<Props> = ({ editor }) => {
  const toggleList = () => {
    editor.chain().focus().toggleBulletList().run()
  }

  const isActive = editor.isActive("bulletList")

  return (
    <button
      type="button"
      title="Маркированный список"
      onMouseDown={(e) => {
        e.preventDefault()
        toggleList()
      }}
      style={{
        backgroundColor: isActive ? "#e0e0e0" : "transparent",
        border: "none",
        padding: "4px",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      <img src="/list.svg" alt="Маркированный список" className="editor-icon" />
    </button>
  )
}
