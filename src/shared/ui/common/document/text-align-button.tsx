import React from "react"
import { Editor } from "@tiptap/react"

type Props = {
  editor: Editor
  align: "left" | "center" | "right" | "justify"
  children?: React.ReactNode
  onClick?: () => void
}

export const TextAlignButton: React.FC<Props> = ({ editor, align, children, onClick }) => {
  const isActive = editor.isActive({ textAlign: align })

  return (
    <button
      onClick={() => {
        editor.chain().focus().setTextAlign(align).run()
        if (onClick) onClick()
      }}
      style={{
        fontWeight: isActive ? "bold" : "normal",
        padding: "6px",
        border: "none",
        background: "none",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  )
}
