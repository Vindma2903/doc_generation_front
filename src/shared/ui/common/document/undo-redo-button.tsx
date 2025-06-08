import React from "react"
import { Editor } from "@tiptap/react"

type Props = {
  editor: Editor
  action: "undo" | "redo"
}

export const UndoRedoButton: React.FC<Props> = ({ editor, action }) => {
  const handleClick = () => {
    editor.chain().focus()[action]().run()
  }

  const label = action === "undo" ? "↶" : "↷"

  return <button onClick={handleClick} title={action}>{label}</button>
}
