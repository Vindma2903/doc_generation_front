import React from "react"

type PdfScaleControlsProps = {
  scale: number
  onZoomIn: () => void
  onZoomOut: () => void
}

export const PdfScaleControls: React.FC<PdfScaleControlsProps> = ({ scale, onZoomIn, onZoomOut }) => {
  return (
    <div style={{ marginBottom: 10, userSelect: "none" }}>
      <button onClick={onZoomOut} style={{ marginRight: 10 }}>
        −
      </button>
      <span>{(scale * 100).toFixed(0)}%</span>
      <button onClick={onZoomIn} style={{ marginLeft: 10 }}>
        +
      </button>
    </div>
  )
}
