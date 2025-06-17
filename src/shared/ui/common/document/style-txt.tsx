import { useEffect } from "react"
import { Editor } from "@tiptap/react"
import axios from "axios"
import { Node as ProseMirrorNode } from "prosemirror-model"

export type TemplateStyle = {
  selector: string
  styles: Record<string, string>
  scope: "global" | "inline"
}

export function useTemplateStyles(
  editor: Editor | null,
  documentId: number,
  setStyles: (styles: TemplateStyle[]) => void,
  styles: TemplateStyle[],
  content: string,
  initialContentLoaded: boolean,
  setInitialContentLoaded: (v: boolean) => void
) {
  // 1. Загрузка стилей с сервера
  useEffect(() => {
    axios
      .get(`http://localhost:8080/templates/${documentId}/styles`)
      .then(res => setStyles(res.data))
      .catch(err => console.error("❌ Ошибка загрузки стилей шаблона:", err))
  }, [documentId, setStyles])

  // 2. Применение глобальных CSS-стилей
  useEffect(() => {
    if (!styles) return

    const globalStyles = styles.filter(style => style.scope === "global")

    const existing = document.getElementById("template-style-injection")
    if (existing) existing.remove()

    if (!globalStyles.length) return

    const styleTag = document.createElement("style")
    styleTag.id = "template-style-injection"

    const cssRules = globalStyles.map(({ selector, styles }) => {
      const declarations = Object.entries(styles)
        .map(([k, v]) => `${k}: ${v};`)
        .join(" ")
      return `${selector} { ${declarations} }`
    }).join("\n")

    styleTag.innerHTML = cssRules
    document.head.appendChild(styleTag)
  }, [styles])

  // 3. Установка контента после загрузки стилей
  useEffect(() => {
    if (!editor || initialContentLoaded || !content || !styles || styles.length === 0) return

    editor.commands.setContent(content)
    setInitialContentLoaded(true)
    editor.storage.templateStyles = styles
  }, [editor, content, styles, initialContentLoaded, setInitialContentLoaded])

  // 4. Восстановление inline-стилей после загрузки
  useEffect(() => {
    if (!editor || !initialContentLoaded || styles.length === 0) return

    setTimeout(() => {
      editor.state.doc.descendants((node: ProseMirrorNode, pos) => {
        node.marks?.forEach(mark => {
          if (mark.type.name === "styleMark" && mark.attrs?.styleId) {
            const styleFromDB = styles.find(s =>
              s.scope === "inline" &&
              s.selector === `span[data-style-id="${mark.attrs.styleId}"]`
            )

            if (styleFromDB) {
              const styleStr = Object.entries(styleFromDB.styles)
                .map(([key, val]) => {
                  const kebabKey = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
                  return `${kebabKey}: ${val}`
                })
                .join("; ")

              editor
                .chain()
                .setTextSelection({ from: pos, to: pos + node.nodeSize })
                .setMark("styleMark", {
                  styleId: mark.attrs.styleId,
                  style: styleStr,
                })
                .run()
            }
          }
        })
      })
    }, 0)
  }, [editor, styles, initialContentLoaded])
}
