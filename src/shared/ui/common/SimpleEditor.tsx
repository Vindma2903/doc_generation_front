import React, { useEffect, useState } from "react"
import { useEditor, EditorContent, EditorContext } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import TextAlign from "@tiptap/extension-text-align"
import Typography from "@tiptap/extension-typography"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Image from "@tiptap/extension-image"
import TextStyle from "@tiptap/extension-text-style"
import FontFamily from "@tiptap/extension-font-family"
import Link from "@tiptap/extension-link"

import { TextAlignButton } from "@/shared/ui/common/document/text-align-button"
import { UndoRedoButton } from "@/shared/ui/common/document/undo-redo-button"
import { HeadingDropdownMenu } from "@/shared/ui/common/document/heading-dropdown-menu"

import "@/shared/styles/document.css"

type Props = {
  content: string
  onChange: (html: string) => void
  onCancel?: () => void
  onBack?: () => void
}

export const SimpleEditor: React.FC<Props> = ({ content, onChange }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      Underline,
      Superscript,
      Subscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Typography,
      TaskList,
      TaskItem.configure({ nested: true }),
      Image,
      TextStyle,
      FontFamily.configure({ types: ["textStyle"] }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])


  if (!editor) return null

  const formatButton = (label: React.ReactNode, action: () => void, title?: string) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault()
        action()
      }}
    >
      {label}
    </button>
  )

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="editor-container">
        <div className="editor-toolbar">
          <UndoRedoButton editor={editor} action="undo" />
          <UndoRedoButton editor={editor} action="redo" />

          <HeadingDropdownMenu editor={editor} levels={[1, 2, 3, 4, 5, 6]} />

          <select
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            defaultValue="Arial"
          >
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>

          <select
            onChange={(e) => editor.chain().focus().setMark("textStyle", { fontSize: e.target.value }).run()}
            defaultValue="16px"
          >
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="24px">24</option>
          </select>

          {formatButton("B", () => editor.chain().focus().toggleBold().run(), "Bold")}
          {formatButton(<img src="/Italic.svg" alt="Italic" className="editor-icon" />, () => editor.chain().focus().toggleItalic().run(), "Italic")}
          {formatButton(<img src="/underline-icon.svg" alt="Underline" className="editor-icon" />, () => editor.chain().focus().toggleUnderline().run(), "Underline")}

          {formatButton("🔗", () => {
            const url = prompt("Введите URL")
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }, "Insert link")}

          <div className="dropdown">
            <button
              type="button"
              className="dropdown-trigger"
              onMouseDown={(e) => {
                e.preventDefault()
                setDropdownOpen((prev) => !prev)
              }}
            >
              <img src="/align-left.svg" alt="Align" className="editor-icon" />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-content horizontal">
                <TextAlignButton editor={editor} align="left" onClick={() => setDropdownOpen(false)}>
                  <img src="/align-left.svg" alt="Align Left" className="editor-icon" />
                </TextAlignButton>
                <TextAlignButton editor={editor} align="center" onClick={() => setDropdownOpen(false)}>
                  <img src="/align-center.svg" alt="Align Center" className="editor-icon" />
                </TextAlignButton>
                <TextAlignButton editor={editor} align="right" onClick={() => setDropdownOpen(false)}>
                  <img src="/align-right.svg" alt="Align Right" className="editor-icon" />
                </TextAlignButton>
                <TextAlignButton editor={editor} align="justify" onClick={() => setDropdownOpen(false)}>
                  <img src="/justify.svg" alt="Justify" className="editor-icon" />
                </TextAlignButton>
              </div>
            )}
          </div>

          {formatButton("•", () => editor.chain().focus().toggleBulletList().run(), "Bullet List")}
          {formatButton("1.", () => editor.chain().focus().toggleOrderedList().run(), "Numbered List")}
          {formatButton("☑", () => editor.chain().focus().toggleTaskList().run(), "Task List")}

          {formatButton("S", () => editor.chain().focus().toggleStrike().run(), "Strikethrough")}
          {formatButton("</>", () => editor.chain().focus().toggleCode().run(), "Code")}
          {formatButton("x²", () => editor.chain().focus().toggleSuperscript().run(), "Superscript")}
          {formatButton("x₂", () => editor.chain().focus().toggleSubscript().run(), "Subscript")}
        </div>

        <div className="editor-workspace">
          <EditorContent editor={editor} className="editor-document editor-content" />
        </div>
      </div>
    </EditorContext.Provider>
  )
}
