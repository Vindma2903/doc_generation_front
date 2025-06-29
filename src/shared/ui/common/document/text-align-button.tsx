import React from "react"
import { Editor } from "@tiptap/react"

type Props = {
  editor: Editor
  align: "left" | "center" | "right" | "justify"
  isActive?: boolean
  children?: React.ReactNode
  onClick?: () => void
}

export const TextAlignButton: React.FC<Props> = ({ editor, align, isActive, children, onClick }) => {
  return (
    <button
      onClick={() => {
        editor.chain().focus().setTextAlign(align).run()
        if (onClick) onClick()
      }}
      className={`align-button ${isActive ? "active" : ""}`}
      title={`Выравнивание: ${align}`}
    >
      {children}
    </button>
  )
}
