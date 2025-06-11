import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { MainSidebar } from "@/shared/ui/common/main-sidebar"
import "@/shared/styles/home.css"
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

type FieldType = "text" | "file"

const FillTemplatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [templateName, setTemplateName] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagValues, setTagValues] = useState<Record<string, string>>({})
  const [fieldTypes, setFieldTypes] = useState<Record<string, FieldType>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/templates/${id}`)
        const { name, content } = response.data
        setTemplateName(name)
        const extractedTags = extractTagsFromHTML(content || "")
        setTags(extractedTags)
        setTagValues(Object.fromEntries(extractedTags.map(tag => [tag, ""])))
        setFieldTypes(Object.fromEntries(extractedTags.map(tag => [tag, "text"])))
      } catch (error) {
        console.error("Ошибка при загрузке шаблона:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [id])

  const handleChange = (tag: string, value: string) => {
    setTagValues(prev => ({ ...prev, [tag]: value }))
  }

  const handleTypeChange = (tag: string, type: FieldType) => {
    setFieldTypes(prev => ({ ...prev, [tag]: type }))
    // Очистить значение, если нужно сбросить ввод при смене типа
    setTagValues(prev => ({ ...prev, [tag]: "" }))
  }

  const handleGenerate = () => {
    console.log("📄 Заполненные значения:", tagValues)
    console.log("📌 Типы полей:", fieldTypes)
    alert("Документ сформирован (только логика в консоли)")
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <div className="home-container">
      <MainSidebar />
      <main className="content">
        <h1>Настройка и заполнение шаблона: {templateName}</h1>

        {tags.length > 0 ? (
          <>
            <ul style={{ padding: 0, listStyle: "none" }}>
              {tags.map((tag, index) => (
                <li key={index} style={{ marginBottom: "20px" }}>
                  <label style={{ fontWeight: "bold" }}>{tag}</label>
                  <div style={{ margin: "6px 0" }}>
                    <select
                      value={fieldTypes[tag]}
                      onChange={(e) => handleTypeChange(tag, e.target.value as FieldType)}
                      style={{
                        padding: "6px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        marginBottom: "8px",
                        fontSize: "14px"
                      }}
                    >
                      <option value="text">Свободный текст</option>
                      <option value="file">Загрузка файла</option>
                    </select>
                  </div>

                  {fieldTypes[tag] === "text" ? (
                    <input
                      type="text"
                      value={tagValues[tag] || ""}
                      onChange={(e) => handleChange(tag, e.target.value)}
                      placeholder={`Введите значение для ${tag}`}
                      style={{
                        padding: "6px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "14px",
                        width: "300px"
                      }}
                    />
                  ) : (
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setTagValues(prev => ({ ...prev, [tag]: file.name }))
                        }
                      }}
                    />
                  )}
                </li>
              ))}
            </ul>

            <button
              onClick={handleGenerate}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#615EF0",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              📄 Сформировать документ
            </button>
          </>
        ) : (
          <p>Нет переменных для настройки</p>
        )}
      </main>
    </div>
  )
}

export default FillTemplatePage
