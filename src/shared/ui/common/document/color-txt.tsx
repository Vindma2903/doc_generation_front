import React, { useState } from "react"
import { Editor } from "@tiptap/react"

type Props = {
  editor: Editor
}

const predefinedColors = [
  "#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF",
  "#FF0000", "#FF6600", "#FFCC00", "#FFFF00", "#99CC00", "#339933",
  "#00FFFF", "#00CCFF", "#3366FF", "#0000FF", "#9900FF", "#CC00CC",
  "#FF99CC", "#FF6666", "#FF9966", "#FFCC99", "#FFFFCC", "#CCFFCC",
  "#CCFFFF", "#99CCFF", "#9999FF", "#CC99FF", "#FFCCFF", "#CCCCFF"
]

export const ColorTextPicker: React.FC<Props> = ({ editor }) => {
  const [showPicker, setShowPicker] = useState(false)

  const applyColor = (color: string) => {
    console.log("[ColorTextPicker] Применение цвета:", color)

    const result = editor.chain().focus().setColor(color).run()
    console.log("[ColorTextPicker] Результат выполнения команды:", result)

    setShowPicker(false)
  }


  return (
    <div className="color-text-picker" style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setShowPicker(prev => !prev)}
        title="Цвет текста"
      >
        <img src="/document/baseline.svg" alt="Text color" />
      </button>

      {showPicker && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            marginTop: "8px",
            background: "#fff",
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "4px",
            display: "grid",
            gridTemplateColumns: "repeat(6, 20px)",
            gap: "8px",
            zIndex: 100,
          }}
        >
          {predefinedColors.map((color) => (
            <div
              key={color}
              onClick={() => applyColor(color)}
              title={color}
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: color,
                cursor: "pointer",
                border: "1px solid #ccc",
                borderRadius: "2px",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
