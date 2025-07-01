// src/shared/ui/common/document/align-txt.tsx

import React, { useState } from "react"
import { Editor } from "@tiptap/react"

type Align = "left" | "center" | "right" | "justify"

const alignIcons: Record<Align, React.ReactNode> = {
  left: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 6H15" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 18H17" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  center: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 6H18" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12H20" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 18H18" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  right: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 6H21" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 18H21" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  justify: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 6H21" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 18H21" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
}

export const AlignTextDropdown: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [open, setOpen] = useState(false)

  const alignments: Align[] = ["left", "center", "right", "justify"]

  const handleAlign = (align: Align) => {
    const activeNode = editor.view.state.selection.$from.node().type.name
    console.log(`[AlignTextDropdown] Выравнивание: "${align}" | Активная нода: "${activeNode}"`)

    const success = editor.chain().focus().setTextAlign(align).run()

    if (!success) {
      console.warn(`[AlignTextDropdown] ❌ Не удалось применить выравнивание "${align}"`)
    } else {
      console.log(`[AlignTextDropdown] ✅ Успешно применено "${align}"`)
    }

    setOpen(false)
  }

  return (
    <div className="align-dropdown">
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault()
          setOpen(prev => !prev)
        }}
        title="Выравнивание текста"
      >
        <img src="/align-left.svg" alt="Align" />
      </button>

      {open && (
        <div className="dropdown-content horizontal">
          {alignments.map((align) => (
            <button
              key={align}
              onClick={() => handleAlign(align)}
              className={`align-button ${editor.isActive({ textAlign: align }) ? "active" : ""}`}
              title={`Выравнивание: ${align}`}
            >
              {alignIcons[align]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

