import React, { useEffect, useState } from "react"
import axios from "axios"
import { MainSidebar } from "@/shared/ui/common/main-sidebar"
import "@/shared/styles/globals.css"

type Tag = {
  id?: number
  name: string
  label: string
  description?: string
  created_at?: string
}

// ✅ Только редактируемые поля
type EditableTagField = "name" | "label" | "description"

export const TagPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios.get("http://localhost:8080/tags/all")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTags(res.data)
        } else {
          setError("Ошибка: сервер вернул неожиданный формат")
        }
      })
      .catch((err) => {
        setError("Ошибка загрузки тегов: " + err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // ✅ Только для безопасных полей
  const handleInputChange = (index: number, field: EditableTagField, value: string) => {
    const updated = [...tags]
    updated[index] = {
      ...updated[index],
      [field]: value,
    }
    setTags(updated)
  }

  const handleAddRow = () => {
    setTags([...tags, { name: "", label: "", description: "" }])
  }

  const handleSave = async (tag: Tag, index: number) => {
    try {
      let res

      if (tag.id) {
        // Обновление
        res = await axios.put(`http://localhost:8080/tags/${tag.id}`, tag)
      } else {
        // Создание
        res = await axios.post("http://localhost:8080/tags/create", tag)
      }

      const updated = [...tags]
      updated[index] = res.data
      setTags(updated)
    } catch (e) {
      alert("Ошибка при сохранении тега")
      console.error(e)
    }
  }

  return (
    <div className="home-container">
      <MainSidebar />
      <main className="content">
        <h1>Редактируемые теги</h1>

        {loading && <p>Загрузка...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={handleAddRow} style={{ marginBottom: "10px" }}>➕ Добавить тег</button>

        {!loading && !error && (
          <table style={tableStyle}>
            <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Название (name)</th>
              <th style={thStyle}>Метка (label)</th>
              <th style={thStyle}>Описание</th>
              <th style={thStyle}>Дата создания</th>
              <th style={thStyle}>Действия</th>
            </tr>
            </thead>
            <tbody>
            {tags.map((tag, index) => (
              <tr key={tag.id ?? `new-${index}`}>
                <td style={tdStyle}>{tag.id ?? "—"}</td>
                <td style={tdStyle}>
                  <input
                    value={tag.name}
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                    style={inputStyle}
                    placeholder="name"
                  />
                </td>
                <td style={tdStyle}>
                  <input
                    value={tag.label}
                    onChange={(e) => handleInputChange(index, "label", e.target.value)}
                    style={inputStyle}
                    placeholder="label"
                  />
                </td>
                <td style={tdStyle}>
                  <input
                    value={tag.description || ""}
                    onChange={(e) => handleInputChange(index, "description", e.target.value)}
                    style={inputStyle}
                    placeholder="описание"
                  />
                </td>
                <td style={tdStyle}>{tag.created_at?.slice(0, 10) || "—"}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleSave(tag, index)}>💾 Сохранить</button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}

// ✅ Стили
const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "16px",
  fontSize: "14px",
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px",
  backgroundColor: "#f5f5f5",
  borderBottom: "2px solid #ccc",
}

const tdStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #e0e0e0",
  verticalAlign: "top",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "4px",
  fontSize: "14px",
  boxSizing: "border-box",
}
