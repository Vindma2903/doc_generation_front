import React from "react"
import { Editor } from "@tiptap/react"

type Props = {
  editor: Editor
  align: "left" | "center" | "right" | "justify"
}

export const TextAlignButton: React.FC<Props> = ({ editor, align }) => {
  const isActive = editor.isActive({ textAlign: align })

  return (
    <button
      onClick={() => editor.chain().focus().setTextAlign(align).run()}
      style={{ fontWeight: isActive ? "bold" : "normal" }}
    >
      {align}
    </button>
  )
}
