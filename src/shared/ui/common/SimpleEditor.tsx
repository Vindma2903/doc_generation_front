import React, { useEffect, useState } from "react"
import { useEditor, EditorContent, EditorContext } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import TextAlign from "@tiptap/extension-text-align"
import Typography from "@tiptap/extension-typography"
import Image from "@tiptap/extension-image"
import TextStyle from "@tiptap/extension-text-style"
import FontFamily from "@tiptap/extension-font-family"
import Link from "@tiptap/extension-link"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import axios from "axios"

import { FontSize } from "@/shared/extensions/FontSize"
import { TextAlignButton } from "@/shared/ui/common/document/text-align-button"
import { UndoRedoButton } from "@/shared/ui/common/document/undo-redo-button"
import { HeadingDropdownMenu } from "@/shared/ui/common/document/heading-dropdown-menu"
import { MarkerListButton } from "@/shared/ui/common/document/marker"
import { OrderedListButton } from "@/shared/ui/common/document/ordered-list"
import { LayoutListButton } from "@/shared/ui/common/document/layout-list"
import { VariablePanel } from "@/shared/ui/common/document/VariablePanel"



import "@/shared/styles/document.css"

type Props = {
  content: string
  onChange: (html: string) => void
  onCancel?: () => void
  onBack?: () => void
  documentId: number
  documentName: string
}

export const SimpleEditor: React.FC<Props> = ({ content, onChange, documentId }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList.configure({ keepMarks: true, keepAttributes: false }),
      OrderedList,
      ListItem,
      TaskList,
      TaskItem.configure({ nested: true }),
      Underline,
      Superscript,
      Subscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Typography,
      Image,
      TextStyle,
      FontFamily.configure({ types: ["textStyle"] }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      FontSize,
    ],
    content,
    onUpdate({ editor }) {
      const html = editor.getHTML()
      onChange(html)

      if (documentId) {
        axios.put("http://localhost:8080/templates/update-content", {
          id: documentId,
          content: html,
        }).catch(err => console.error("❌ Ошибка обновления контента:", err))
      }
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

  const fontSizes = ["10px", "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px", "72px"]
  const currentFontSize = editor.getAttributes("fontSize")?.fontSize || "16px"

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="editor-container-with-sidebar">
        {/* Левая часть: редактор */}
        <div className="editor-container">
          <div className="editor-toolbar">
            <UndoRedoButton editor={editor} action="undo" />
            <UndoRedoButton editor={editor} action="redo" />
            <HeadingDropdownMenu editor={editor} levels={[1, 2, 3, 4, 5, 6]} />
            <MarkerListButton editor={editor} />
            <OrderedListButton editor={editor} />
            <LayoutListButton editor={editor} />
            <select
              onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
              value={editor.getAttributes("textStyle")?.fontFamily || "Roboto"}
            >
              <option value="Roboto">Roboto</option>
              <option value="Times New Roman Custom">Times New Roman</option>
            </select>
            <select
              value={currentFontSize}
              onChange={(e) => {
                const size = e.target.value
                if (size === "default") {
                  editor.chain().focus().unsetFontSize().run()
                } else {
                  editor.chain().focus().setFontSize(size).run()
                }
              }}
            >
              <option value="default">По умолчанию</option>
              {fontSizes.map((size) => (
                <option key={size} value={size}>{size.replace("px", "")}</option>
              ))}
            </select>
            {formatButton(<img src="/document/Bold.svg" alt="Bold" className="editor-icon" />, () => editor.chain().focus().toggleBold().run(), "Bold")}
            {formatButton(<img src="/Italic.svg" alt="Italic" className="editor-icon" />, () => editor.chain().focus().toggleItalic().run(), "Italic")}
            {formatButton(<img src="/underline-icon.svg" alt="Underline" className="editor-icon" />, () => editor.chain().focus().toggleUnderline().run(), "Underline")}
            {formatButton(<img src="/document/paperclip.svg" alt="Insert link" className="editor-icon" />, () => {
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
            {formatButton("S", () => editor.chain().focus().toggleStrike().run(), "Strikethrough")}
            {formatButton("</>", () => editor.chain().focus().toggleCode().run(), "Code")}
            {formatButton("x²", () => editor.chain().focus().toggleSuperscript().run(), "Superscript")}
            {formatButton("x₂", () => editor.chain().focus().toggleSubscript().run(), "Subscript")}
          </div>
          <div className="editor-workspace">
            <div className="page">
              <EditorContent editor={editor} className="editor-document editor-content" />
            </div>
          </div>
        </div>

        {/* Правая часть: панель переменных */}
        <VariablePanel onInsert={(value) => editor?.chain().focus().insertContent(value).run()} />
      </div>
    </EditorContext.Provider>
  )

}
