// list-button.tsx
import React from "react"
import { Editor } from "@tiptap/react"

type Props = {
  editor: Editor
  type: "bulletList" | "orderedList" | "taskList"
}

export const ListButton: React.FC<Props> = ({ editor, type }) => {
  const handleClick = () => {
    const chain = editor.chain().focus()

    if (type === "taskList") {
      chain.toggleTaskList().run()
    } else if (type === "orderedList") {
      chain.toggleOrderedList().run()
    } else {
      chain.toggleBulletList().run()
    }
  }

  const label = {
    bulletList: "•",
    orderedList: "1.",
    taskList: "☑",
  }[type]

  return <button onClick={handleClick} title={type}>{label}</button>
}
