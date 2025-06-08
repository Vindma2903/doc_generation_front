import React, { useEffect } from "react"
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
import { ListType } from "@/shared/ui/common/document/list-type"

import "@/shared/styles/document.css"

type Props = {
  content: string
  onChange: (html: string) => void
  onCancel?: () => void
  onBack?: () => void
}

export const SimpleEditor: React.FC<Props> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
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
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="editor-container">
        <div className="editor-toolbar">
          {/* Undo / Redo */}
          <UndoRedoButton editor={editor} action="undo" />
          <UndoRedoButton editor={editor} action="redo" />

          {/* Heading and List */}
          <HeadingDropdownMenu editor={editor} levels={[1, 2, 3, 4, 5, 6]} />
          <ListType editor={editor} />

          {/* Alignment */}
          <TextAlignButton editor={editor} align="left" />
          <TextAlignButton editor={editor} align="center" />
          <TextAlignButton editor={editor} align="right" />
          <TextAlignButton editor={editor} align="justify" />

          {/* Font Family */}
          <select
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            defaultValue="Arial"
          >
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>

          {/* Font Size */}
          <select
            onChange={(e) =>
              editor.chain().focus().setMark("textStyle", { fontSize: e.target.value }).run()
            }
            defaultValue="16px"
          >
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="24px">24</option>
          </select>

          {/* Formatting buttons */}
          <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}>
            <img src="/Italic.svg" alt="Italic" className="editor-icon" />
          </button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <img src="/underline-icon.svg" alt="Underline" className="editor-icon" />
          </button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
          <button onClick={() => editor.chain().focus().toggleCode().run()}>{"</>"}</button>
          <button onClick={() => editor.chain().focus().toggleSuperscript().run()}>x²</button>
          <button onClick={() => editor.chain().focus().toggleSubscript().run()}>x₂</button>

          {/* Insert Link */}
          <button
            onClick={() => {
              const url = prompt("Введите URL")
              if (url) {
                editor.chain().focus().setLink({ href: url }).run()
              }
            }}
          >
            🔗
          </button>
        </div>

        <div className="editor-workspace">
          <EditorContent editor={editor} className="editor-document editor-content" />
        </div>
      </div>
    </EditorContext.Provider>
  )
}
