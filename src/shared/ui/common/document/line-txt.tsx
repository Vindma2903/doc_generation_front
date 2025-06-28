import React, { useEffect, useRef, useState } from "react"
import { Editor } from "@tiptap/react"
import "@/shared/styles/document.css"

type Props = {
  editor: Editor
}

export const LineRuler: React.FC<Props> = ({ editor }) => {
  const [indentEm, setIndentEm] = useState(0) // в em
  const [dragInfo, setDragInfo] = useState<{ x: number; valueEm: number } | null>(null)
  const rulerRef = useRef<HTMLDivElement>(null)

  const stepSizeEm = 0.25
  const stepSizePx = 10 // 0.25em = 10px
  const emToPx = (em: number) => (em + 2) / stepSizeEm * stepSizePx
  const pxToEm = (px: number) => px / stepSizePx * stepSizeEm - 2


  const totalSteps = Math.round((18 - -2) / stepSizeEm) // 80
  const minEm = -2
  const maxEm = 18

  useEffect(() => {
    const styleAttr = editor.getAttributes("paragraph")?.style || ""
    const match = styleAttr.split(";").find(s => s.includes("text-indent"))
    let valEm = 0

    if (match) {
      const raw = match.split(":")[1].trim()
      if (raw.endsWith("em")) {
        valEm = parseFloat(raw)
      } else if (raw.endsWith("px")) {
        valEm = parseFloat(raw) / 40 // 1em = 40px
      } else {
        valEm = parseFloat(raw)
      }
    }

    setIndentEm(!isNaN(valEm) ? valEm : 0)
  }, [editor.state.selection])

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const ruler = rulerRef.current
    const handle = e.currentTarget
    if (!ruler || !handle) return

    const rulerRect = ruler.getBoundingClientRect()
    const handleRect = handle.getBoundingClientRect()
    const mouseOffsetInHandle = e.clientX - handleRect.left

    const onMove = (moveEvent: MouseEvent) => {
      const offsetPx = moveEvent.clientX - rulerRect.left - mouseOffsetInHandle
      const rawEm = pxToEm(offsetPx)
      const snapped = Math.max(minEm, Math.min(
        Math.round(rawEm / stepSizeEm) * stepSizeEm,
        maxEm
      ))

      setIndentEm(snapped)

      setDragInfo({
        x: emToPx(snapped),
        valueEm: snapped,
      })

      const styleStr = `text-indent: ${snapped.toFixed(2)}em`
      editor
        .chain()
        .focus()
        .updateAttributes("paragraph", {
          style: styleStr,
        })
        .run()
    }


    const onUp = () => {
      setDragInfo(null)
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onUp)
  }

  return (
    <div className="line-ruler" ref={rulerRef}>
      <div
        className="ruler-handle"
        style={{ left: `${emToPx(indentEm)}px` }}
        onMouseDown={handleDrag}
        title={`Отступ: ${indentEm.toFixed(2)}em`}
      ></div>

      {dragInfo && (
        <div
          className="ruler-tooltip"
          style={{
            position: "absolute",
            top: "-28px",
            left: `${dragInfo.x}px`,
            transform: "translateX(-50%)",
            background: "#333",
            color: "#fff",
            padding: "2px 6px",
            fontSize: "12px",
            borderRadius: "4px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {`${dragInfo.valueEm.toFixed(2)}em`}
        </div>
      )}

      {[...Array(totalSteps + 1)].map((_, i) => {
        const value = -2 + i * stepSizeEm
        const isWhole = Number.isInteger(value)

        return (
          <div className="ruler-tick" key={i}>
            <div className="ruler-tick-line" />
            {isWhole && <div className="ruler-tick-label">{value}</div>}
          </div>
        )
      })}
    </div>
  )
}
