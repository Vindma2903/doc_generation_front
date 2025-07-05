import React, { useEffect, useState, useMemo } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import axios from "axios"
import { PdfScaleControls } from "./pdf-scale"

// Устанавливаем путь к воркеру pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.mjs"

type Props = {
  documentId: number
}

export const PDFPreview: React.FC<Props> = ({ documentId }) => {
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [scale, setScale] = useState(1.0)

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/documents/${documentId}/export-pdf`,
          { responseType: "arraybuffer" }
        )
        setPdfData(new Uint8Array(response.data))
      } catch (error) {
        console.error("❌ Ошибка при загрузке PDF:", error)
      }
    }
    fetchPDF()
  }, [documentId])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const fileProp = useMemo(() => (pdfData ? { data: pdfData } : null), [pdfData])

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3))
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.25))

  return (
    <div
      style={{
        overflowY: "auto",
        height: "100%",
        backgroundColor: "#f5f5f5",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Контролы масштабирования */}
      <PdfScaleControls scale={scale} onZoomIn={zoomIn} onZoomOut={zoomOut} />

      {fileProp ? (
        <Document
          file={fileProp}
          onLoadSuccess={onDocumentLoadSuccess}
          loading="Загрузка документа..."
        >
          {Array.from(new Array(numPages ?? 0), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      ) : (
        <div>Загрузка PDF...</div>
      )}
    </div>
  )
}
