// list-type.tsx
import React from "react"
import { Editor } from "@tiptap/react"
import { ListButton } from "./list-button"

type Props = {
  editor: Editor
}

export const ListType: React.FC<Props> = ({ editor }) => {
  if (!editor) return null

  return (
    <>
      <ListButton editor={editor} type="bulletList" />
      <ListButton editor={editor} type="orderedList" />
      <ListButton editor={editor} type="taskList" />
    </>
  )
}
