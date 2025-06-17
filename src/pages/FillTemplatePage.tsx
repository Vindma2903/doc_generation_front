import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "@/shared/styles/document.css"
import "@/shared/styles/globals.css"

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
    } catch (err) {
      console.error("❌ Ошибка при сохранении:", err)
    }
  }

  const renderFilledTemplate = (template: string, values: Record<string, string>) => {
    let filled = template
    for (const [tag, value] of Object.entries(values)) {
      const regex = new RegExp(`{{${tag}}}`, "g")
      filled = filled.replace(regex, value || "")
    }
    return filled
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Левая панель */}
      <div style={{ width: "40%", padding: "24px", overflowY: "auto", borderRight: "1px solid #ddd" }}>
        <div className="edit-template-header">
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
      </div>

      {/* Правая панель */}
      <div style={{ width: "60%", padding: "24px", overflowY: "auto", backgroundColor: "#f9f9f9" }}>
        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 0 6px rgba(0,0,0,0.1)",
            width: "210mm",
            minHeight: "297mm",
            margin: "0 auto",
          }}
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </div>
    </div>
  )
}

export default FillTemplatePage
