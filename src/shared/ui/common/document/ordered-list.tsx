import React from "react"
import { Editor } from "@tiptap/react"

type Props = {
  editor: Editor
}

export const OrderedListButton: React.FC<Props> = ({ editor }) => {
  const toggleList = () => {
    editor.chain().focus().toggleOrderedList().run()
  }

  const isActive = editor.isActive("orderedList")

  return (
    <button
      type="button"
      title="Нумерованный список"
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
      <img src="/document/list-ordered.svg" alt="Нумерованный список" className="editor-icon" />
    </button>
  )
}
