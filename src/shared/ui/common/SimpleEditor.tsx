import React, { useEffect, useState, useRef } from "react"
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
import axios from "axios"

import { TextAlignButton } from "@/shared/ui/common/document/text-align-button"
import { UndoRedoButton } from "@/shared/ui/common/document/undo-redo-button"
import { HeadingDropdownMenu } from "@/shared/ui/common/document/heading-dropdown-menu"
import { MarkerListButton } from "@/shared/ui/common/document/marker"
import { OrderedListButton } from "@/shared/ui/common/document/ordered-list"
import { VariablePanel } from "@/shared/ui/common/document/VariablePanel"
import { SizeTextSelector } from "@/shared/ui/common/document/size-txt"
import { SelectFontFamily } from "@/shared/ui/common/document/select-font"
import { useTemplateStyles } from "@/shared/ui/common/document/style-txt"
import { StyleMark } from "@/shared/extensions/StyleMark"
import { LineRuler } from "@/shared/ui/common/document/line-txt"
import { IndentedParagraph } from "@/shared/extensions/IndentedParagraph"

import "@/shared/styles/document.css"

type TemplateStyle = {
  selector: string
  styles: Record<string, string>
  scope: "global" | "inline"
}

type Props = {
  content: string
  onChange: (html: string) => void
  onCancel?: () => void
  onBack?: () => void
  documentId: number
  documentName: string
}

const ExtendedTextStyle = TextStyle.extend({
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: el => el.getAttribute("style"),
        renderHTML: attrs => (attrs.style ? { style: attrs.style } : {}),
      },
    }
  },
})

function applyInlineStylesFromDB(html: string, styles: TemplateStyle[]) {
  let updatedHtml = html

  styles.forEach(style => {
    if (style.scope !== "inline") return
    const match = style.selector.match(/data-style-id="(.+?)"/)
    if (!match) return
    const styleId = match[1]

    const styleStr = Object.entries(style.styles)
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ")

    const regex = new RegExp(
      `(<span[^>]*data-style-id="${styleId}"(?![^>]*style=)[^>]*)(>)`,
      "g"
    )

    updatedHtml = updatedHtml.replace(regex, `$1 style="${styleStr}"$2`)
  })

  return updatedHtml
}

export const SimpleEditor: React.FC<Props> = ({ content, onChange, documentId }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [lastFontSize, setLastFontSize] = useState("12px")
  const [templateStyles, setTemplateStyles] = useState<TemplateStyle[]>([])
  const [initialContentLoaded, setInitialContentLoaded] = useState(false)
  const hasSetContent = useRef(false)

  const configuredStyleMark = StyleMark.configure({ editor: null })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        paragraph: false,
      }),
      IndentedParagraph,
      BulletList.configure({ keepMarks: true }),
      OrderedList,
      ListItem,
      Underline,
      Superscript,
      Subscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Typography,
      Image,
      ExtendedTextStyle,
      FontFamily.configure({ types: ["textStyle"] }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      configuredStyleMark,
    ],
    content,
    onUpdate({ editor }) {
      if (hasSetContent.current) {
        hasSetContent.current = false
        return
      }

      const html = editor.getHTML()
      onChange(html)

      axios.put("http://localhost:8080/templates/update-content", {
        id: documentId,
        content: html,
      }).catch(err => console.error("❌ Ошибка обновления контента:", err))
    }
  })

  useEffect(() => {
    if (editor && !configuredStyleMark.options.editor) {
      configuredStyleMark.options.editor = editor
    }
  }, [editor])

  useTemplateStyles(
    editor,
    documentId,
    setTemplateStyles,
    templateStyles,
    content,
    initialContentLoaded,
    setInitialContentLoaded
  )

  // 👉 Добавленный useEffect: вызов автоназначения style_id
  useEffect(() => {
    axios.post("http://localhost:8080/tags/auto-assign-style-ids")
      .then(() => {
        console.log("✅ style_id автоназначены")
      })
      .catch(err => {
        console.error("❌ Ошибка при автоназначении style_id:", err)
      })
  }, [])

  useEffect(() => {
    if (editor && initialContentLoaded && !hasSetContent.current) {
      const styledHtml = applyInlineStylesFromDB(content, templateStyles)
      if (styledHtml !== editor.getHTML()) {
        hasSetContent.current = true
        editor.commands.setContent(styledHtml, false)
        setTimeout(() => { hasSetContent.current = false }, 50)
      }
    }
  }, [initialContentLoaded, templateStyles])

  if (!editor) return null

  const formatButton = (label: React.ReactNode, action: () => void, title?: string) => (
    <button type="button" title={title} onMouseDown={(e) => { e.preventDefault(); action() }}>
      {label}
    </button>
  )

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="editor-container-with-sidebar">
        <div className="editor-container">
          <div className="editor-toolbar">
            <UndoRedoButton editor={editor} action="undo" />
            <UndoRedoButton editor={editor} action="redo" />
            <HeadingDropdownMenu editor={editor} levels={[1, 2, 3, 4, 5, 6]} />
            <MarkerListButton editor={editor} />
            <OrderedListButton editor={editor} />
            <SelectFontFamily editor={editor} documentId={documentId} setStyles={setTemplateStyles} />
            <SizeTextSelector
              editor={editor}
              lastFontSize={lastFontSize}
              setLastFontSize={setLastFontSize}
              documentId={documentId}
              setStyles={setTemplateStyles}
            />
            {formatButton(<img src="/document/Bold.svg" alt="Bold" />, () => editor.chain().focus().toggleBold().run())}
            {formatButton(<img src="/Italic.svg" alt="Italic" />, () => editor.chain().focus().toggleItalic().run())}
            {formatButton(<img src="/underline-icon.svg" alt="Underline" />, () => editor.chain().focus().toggleUnderline().run())}
            {formatButton(<img src="/document/paperclip.svg" alt="Insert link" />, () => {
              const url = prompt("Введите URL")
              if (url) editor.chain().focus().setLink({ href: url }).run()
            })}
            <div className="dropdown">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); setDropdownOpen(prev => !prev) }}>
                <img src="/align-left.svg" alt="Align" />
              </button>
              {isDropdownOpen && (
                <div className="dropdown-content horizontal">
                  <TextAlignButton editor={editor} align="left" onClick={() => setDropdownOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 18H17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </TextAlignButton>

                  <TextAlignButton editor={editor} align="center" onClick={() => setDropdownOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 6H18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 12H20" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 18H18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </TextAlignButton>

                  <TextAlignButton editor={editor} align="right" onClick={() => setDropdownOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 6H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 18H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </TextAlignButton>

                  <TextAlignButton editor={editor} align="justify" onClick={() => setDropdownOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 18H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </TextAlignButton>


                </div>
              )}
            </div>
            {formatButton("S", () => editor.chain().focus().toggleStrike().run())}
            {formatButton("</>", () => editor.chain().focus().toggleCode().run())}
            {formatButton("x²", () => editor.chain().focus().toggleSuperscript().run())}
            {formatButton("x₂", () => editor.chain().focus().toggleSubscript().run())}
          </div>
          <LineRuler editor={editor} />
          <div className="editor-workspace">
            <div className="page">
              <EditorContent editor={editor} className="editor-document editor-content" />
            </div>
          </div>
        </div>
        <VariablePanel onInsert={(value) => editor?.chain().focus().insertContent(value).run()} />
      </div>
    </EditorContext.Provider>
  )
}
