import React from "react"
import { Editor } from "@tiptap/react"
import axios from "axios"

type TemplateStyle = {
  selector: string
  styles: Record<string, string>
  scope: "global" | "inline"
}

type SelectFontFamilyProps = {
  editor: Editor
  documentId: number
  setStyles: React.Dispatch<React.SetStateAction<TemplateStyle[]>>
}

export const SelectFontFamily: React.FC<SelectFontFamilyProps> = ({
                                                                    editor,
                                                                    documentId,
                                                                    setStyles,
                                                                  }) => {
  const currentFontFamily = editor.getAttributes("textStyle")?.fontFamily || "Roboto"

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fontFamily = e.target.value
    editor.chain().focus().setFontFamily(fontFamily).run()

    axios.post("http://localhost:8080/templates/styles", {
      template_id: documentId,
      selector: "p",
      styles: { fontFamily },
      scope: "global",
    })
      .then(() => {
        setStyles(prev => {
          const filtered = prev.filter(s => !(s.selector === "p" && s.scope === "global"))
          return [...filtered, { selector: "p", styles: { fontFamily }, scope: "global" }]
        })
      })
      .catch(err => console.error("❌ Ошибка сохранения шрифта:", err))
  }

  return (
    <select value={currentFontFamily} onChange={handleChange}>
      <option value="Roboto">Roboto</option>
      <option value="Times New Roman Custom">Times New Roman</option>
    </select>
  )
}
