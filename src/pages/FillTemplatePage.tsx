import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "@/shared/styles/document.css"
import "@/shared/styles/globals.css"
import { PDFPreview } from "@/shared/ui/common/edit-document/pdf-preview"

const extractTagsFromHTML = (html: string): string[] => {
  const regex = /{{(.*?)}}/g
  const matches = new Set<string>()
  let match
  while ((match = regex.exec(html)) !== null) {
    matches.add(match[1])
  }
  return Array.from(matches)
}

type TagMeta = {
  name: string
  label: string
  description?: string
  type: "text" | "select"
  style_id?: string
}

const FillTemplatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [templateName, setTemplateName] = useState("")
  const [templateContent, setTemplateContent] = useState("")
  const [renderedContent, setRenderedContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagValues, setTagValues] = useState<Record<string, string>>({})
  const [tagMetaMap, setTagMetaMap] = useState<Record<string, TagMeta>>({})
  const [loading, setLoading] = useState(true)
  const [pdfKey, setPdfKey] = useState(0) // ключ для PDF, обновляется ТОЛЬКО при сохранении

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/documents/${id}`)
        const { name, content, rendered_content } = response.data

        setTemplateName(name)
        setTemplateContent(content || "")
        setRenderedContent(rendered_content || "")

        const extracted = extractTagsFromHTML(content || "")
        setTags(extracted)

        const tagRes = await axios.get("http://localhost:8080/tags/all")
        const allTags: TagMeta[] = tagRes.data

        const metaMap: Record<string, TagMeta> = {}
        extracted.forEach(tag => {
          const found = allTags.find(t => t.name === tag)
          if (found) metaMap[tag] = found
        })
        setTagMetaMap(metaMap)

        const dataRes = await axios.get(`http://localhost:8080/documents/${id}/data`)
        const savedValues: Record<string, string> = dataRes.data
        setTagValues(savedValues)
      } catch (error) {
        console.error("Ошибка загрузки:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const renderFilledTemplate = (template: string, values: Record<string, string>) => {
    let filled = template
    for (const [tag, value] of Object.entries(values)) {
      const meta = tagMetaMap[tag]
      const replacement = meta?.style_id
        ? `<span data-style-id="${meta.style_id}">${value}</span>`
        : value
      const regex = new RegExp(`{{${tag}}}`, "g")
      filled = filled.replace(regex, replacement)
    }
    return filled
  }

  // При изменении полей обновляем только состояние и сервер — PDF не обновляем (не меняем pdfKey)
  const handleChange = async (tag: string, value: string) => {
    const updatedValues = { ...tagValues, [tag]: value }
    setTagValues(updatedValues)

    const rendered = renderFilledTemplate(templateContent, updatedValues)
    setRenderedContent(rendered)

    try {
      await axios.post(`http://localhost:8080/documents/${id}/data`, {
        field_name: tag,
        field_value: value,
      })

      await axios.post("http://localhost:8080/documents/update-content", {
        id: Number(id),
        content: rendered,
      })

      await axios.post(`http://localhost:8080/documents/${id}/revision`, {
        content: rendered,
      })

      // НЕ меняем pdfKey, чтобы не перерендеривать PDF при вводе
    } catch (err) {
      console.error("❌ Ошибка при сохранении:", err)
    }
  }

  // При сохранении обновляем pdfKey — PDF перерендерится
  const handleSaveDocument = async () => {
    try {
      for (const [tag, value] of Object.entries(tagValues)) {
        await axios.post(`http://localhost:8080/documents/${id}/data`, {
          field_name: tag,
          field_value: value,
        })
      }

      await axios.post("http://localhost:8080/documents/update-content", {
        id: Number(id),
        content: renderedContent,
      })

      await axios.post(`http://localhost:8080/documents/${id}/revision`, {
        content: renderedContent,
      })

      setPdfKey(prev => prev + 1) // обновляем PDF предпросмотр
      alert("✅ Документ успешно сохранён")
    } catch (err) {
      console.error("❌ Ошибка при сохранении документа:", err)
      alert("Ошибка при сохранении документа")
    }
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Левая панель: форма редактирования */}
      <div
        style={{
          width: "40%",
          padding: "24px",
          overflowY: "auto",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="edit-template-header" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="edit-template-back-button" onClick={() => navigate(-1)}>
            <img src="/return-icon.svg" alt="Назад" className="back-icon" />
          </button>
          <div style={{ fontSize: "20px", fontWeight: 600 }}>{templateName}</div>
        </div>

        <ul style={{ padding: 0, listStyle: "none", marginTop: "20px" }}>
          {tags.map((tag, index) => {
            const meta = tagMetaMap[tag]
            if (!meta) return null

            return (
              <li key={index} style={{ marginBottom: "20px" }}>
                <label style={{ fontWeight: "bold" }}>{meta.label}</label>
                <div style={{ marginTop: "6px" }}>
                  <input
                    type="text"
                    value={tagValues[tag] || ""}
                    onChange={(e) => handleChange(tag, e.target.value)}
                    placeholder="Введите значение"
                    style={{
                      padding: "6px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "14px",
                      width: "100%",
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>

        <button
          onClick={handleSaveDocument}
          style={{
            marginTop: "auto",
            padding: "6px 12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          💾 Сохранить документ
        </button>

        <button
          onClick={async () => {
            try {
              const response = await axios.get(
                `http://localhost:8080/documents/${id}/export-docx`,
                { responseType: "blob" }
              )

              const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              })

              const url = window.URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `${templateName || "document"}.docx`
              a.click()
              window.URL.revokeObjectURL(url)
            } catch (err) {
              console.error("❌ Ошибка при скачивании Word:", err)
              alert("Ошибка при экспорте Word-документа")
            }
          }}
          style={{
            marginTop: "8px",
            padding: "6px 12px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          📄 Скачать как Word
        </button>
      </div>

      {/* Правая панель: PDF предпросмотр */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <PDFPreview key={pdfKey} documentId={Number(id)} />
      </div>
    </div>
  )
}

export default FillTemplatePage
