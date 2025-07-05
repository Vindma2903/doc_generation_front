import React from "react"
import { Editor } from "@tiptap/react"
import axios from "axios"

type TemplateStyle = {
  selector: string
  styles: Record<string, string>
  scope: "global" | "inline"
}

type SizeTextSelectorProps = {
  editor: Editor
  lastFontSize: string
  setLastFontSize: (val: string) => void
  documentId: number
  setStyles: React.Dispatch<React.SetStateAction<TemplateStyle[]>>
}

export const SizeTextSelector: React.FC<SizeTextSelectorProps> = ({
                                                                    editor,
                                                                    lastFontSize,
                                                                    setLastFontSize,
                                                                    documentId,
                                                                    setStyles,
                                                                  }) => {
  const fontSizes = [
    "10px", "12px", "14px", "16px", "18px", "20px",
    "24px", "28px", "32px", "36px", "48px", "72px"
  ]

  const currentFontSize = (() => {
    const styleAttr = editor.getAttributes("styleMark")?.style
    const style = typeof styleAttr === "string" ? styleAttr : ""
    const found = style
      .split(";")
      .map(s => s.trim())
      .find(s => s.startsWith("font-size"))
    return found?.split(":")[1]?.trim() || lastFontSize
  })()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value
    setLastFontSize(size)

    const styleObj = { "font-size": size }

    const selectedMark = editor.getAttributes("styleMark")
    const currentStyleStr = selectedMark?.style ?? ""

    if (currentStyleStr.includes(`font-size: ${size}`)) return

    let styleId = selectedMark?.styleId || crypto.randomUUID()
    let selector = `span[data-style-id="${styleId}"]`

    const fontSizePt = parseInt(size.replace("px", ""), 10)  // ✅ просто число без * 0.75

    try {
      const response = await axios.post("http://localhost:8080/templates/styles", {
        template_id: documentId,
        selector,
        styles: styleObj,
        scope: "inline",
        font_size_pt: fontSizePt, // 👈 остаётся!
      })

      if (response.data?.selector) {
        selector = response.data.selector
        const match = selector.match(/span\[data-style-id="(.+?)"\]/)
        if (match?.[1]) {
          styleId = match[1]
        }
      }

      const newStyle: TemplateStyle = {
        selector,
        styles: styleObj,
        scope: "inline",
      }

      setStyles(prev => {
        const safePrev = prev ?? []
        const filtered = safePrev.filter(s => s.selector !== selector)
        const updated = [...filtered, newStyle]
        editor.storage.templateStyles = updated
        return updated
      })
    } catch (err) {
      console.error("❌ Ошибка сохранения/получения инлайн-стиля:", err)
      return
    }

    const styleStr = Object.entries(styleObj)
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ")

    editor.chain().focus().setMark("styleMark", {
      styleId,
      style: styleStr,
    }).run()
  }


  return (
    <select value={currentFontSize} onChange={handleChange}>
      {fontSizes.map(size => (
        <option key={size} value={size}>
          {size.replace("px", "")}
        </option>
      ))}
    </select>
  )
}
