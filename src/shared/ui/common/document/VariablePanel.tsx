import React, { useState, useEffect } from "react"
import axios from "axios"

type Tag = {
  id: number
  name: string
  label: string
  description?: string
  type?: string // ← добавлено поле type (если оно необязательное)
}

type Props = {
  onInsert: (value: string) => void
}

export const VariablePanel: React.FC<Props> = ({ onInsert }) => {
  const [tags, setTags] = useState<Tag[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [newFieldType, setNewFieldType] = useState("text")
  const [newFieldName, setNewFieldName] = useState("")
  const [newFieldTag, setNewFieldTag] = useState("")

  useEffect(() => {
    axios.get("http://localhost:8080/tags/all")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTags(res.data)
        } else {
          console.warn("⚠️ /tags/all вернул не массив:", res.data)
        }
      })
      .catch((err) => {
        console.error("❌ Ошибка загрузки тегов:", err)
      })
  }, [])

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddField = () => setShowModal(true)

  const handleModalSubmit = async () => {
    const label = newFieldName.trim()
    const rawTag = newFieldTag.trim()

    if (!label || !rawTag) {
      alert("Заполните и название, и тег для заполнения")
      return
    }

    const cleanTagName = rawTag.replace(/{{\s*|\s*}}/g, "") // убираем {{ }}

    try {
      const response = await axios.post("http://localhost:8080/tags/create", {
        name: cleanTagName, // 👈 БЕЗ скобок в БД
        label,
        description: newFieldType === "text" ? "Свободный текст" : "Варианты ответов",
        type: newFieldType
      })

      const createdTag = response.data
      setTags(prev => [...prev, createdTag])

      // 👇 вставляем с {{}} на фронте
      onInsert(`{{${createdTag.name}}}`)

      setShowModal(false)
      setNewFieldType("text")
      setNewFieldName("")
      setNewFieldTag("")
    } catch (err) {
      console.error("❌ Ошибка при создании тега:", err)
      alert("Ошибка при создании тега")
    }
  }


  const getReadableType = (type?: string) => {
    switch (type) {
      case "text":
        return "Текст"
      case "select":
        return "Выбор"
      default:
        return "Неизвестно"
    }
  }

  return (
    <div className="variable-panel">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Поиск переменной..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="variable-search-input"
        />
        <img src="/document/search.svg" alt="Поиск" className="search-icon" />
      </div>

      {filteredTags.length > 0 ? (
        filteredTags.map((tag) => (
          <button
            key={tag.id}
            className="variable-button"
            onClick={() => onInsert(`{{${tag.name}}}`)}
            title={tag.label || tag.description || ""}
          >
            <span className="drag-icon">≡</span>
            {`{{${tag.name}}}`}
            <span style={{ marginLeft: "8px", fontSize: "12px", color: "#888" }}>
              [{getReadableType(tag.type)}]
            </span>
          </button>
        ))
      ) : (
        <div className="no-results">Ничего не найдено</div>
      )}

      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <button
          className="add-variable-button"
          onClick={handleAddField}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: "#615EF0",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          ➕ Добавить поле
        </button>
      </div>

      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Добавить новое поле</h3>

            <label>
              Тип поля:
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                style={selectStyle}
              >
                <option value="text">Свободный текст</option>
                <option value="select">Варианты ответов</option>
              </select>
            </label>

            <label style={{ marginTop: "10px" }}>
              Название:
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="Введите название"
                style={inputStyle}
              />
            </label>

            <label style={{ marginTop: "10px" }}>
              Тег для заполнения:
              <input
                type="text"
                value={newFieldTag}
                onChange={(e) => setNewFieldTag(e.target.value)}
                placeholder="Например {{фио_сотрудника}}"
                style={inputStyle}
              />
            </label>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)}>Отмена</button>
              <button onClick={handleModalSubmit} style={{ backgroundColor: "#615EF0", color: "#fff" }}>
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== Стили =====
const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
}

const modalBox: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "300px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px",
  marginTop: "4px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  boxSizing: "border-box"
}

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px",
  marginTop: "4px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #ccc"
}
