import React from "react"
import { Editor } from "@tiptap/react"

type Props = {
  editor: Editor
}

export const LayoutListButton: React.FC<Props> = ({ editor }) => {
  const toggleTaskList = () => {
    editor.chain().focus().toggleTaskList().run()
  }

  const isActive = editor.isActive("taskItem") // taskItem, не taskList!

  return (
    <button
      type="button"
      title="Чек-лист"
      onMouseDown={(e) => {
        e.preventDefault()
        toggleTaskList()
      }}
      style={{
        backgroundColor: isActive ? "#e0e0e0" : "transparent",
        border: "none",
        padding: "4px",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      <img
        src="/document/layout-list.svg"
        alt="Чек-лист"
        className="editor-icon"
      />
    </button>
  )
}
