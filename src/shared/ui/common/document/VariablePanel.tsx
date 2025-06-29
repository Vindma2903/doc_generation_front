import React, { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/shared/ui/common/global/btn"
import "@/shared/styles/globals.css"

type Tag = {
  id: number
  name: string
  label: string
  description?: string
  type?: string
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

    const cleanTagName = rawTag.replace(/{{\s*|\s*}}/g, "")

    try {
      const response = await axios.post("http://localhost:8080/tags/create", {
        name: cleanTagName,
        label,
        description: newFieldType === "text" ? "Свободный текст" : "Варианты ответов",
        type: newFieldType
      })

      const createdTag = response.data
      setTags(prev => [...prev, createdTag])
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
            <span className="variable-type-label">
              [{getReadableType(tag.type)}]
            </span>
          </button>
        ))
      ) : (
        <div className="no-results">Ничего не найдено</div>
      )}

      <div className="variable-panel-footer">
        <Button onClick={handleAddField} className="bg-primary small flex items-center gap-2">
          <img src="/plus.svg" alt="+" className="w-4 h-4 filter invert" />
          Добавить поле
        </Button>
      </div>



      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Добавить новое поле</h3>

            <label>
              Тип поля:
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                className="modal-select"
              >
                <option value="text">Свободный текст</option>
                <option value="select">Варианты ответов</option>
              </select>
            </label>

            <label>
              Название:
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="Введите название"
                className="modal-input"
              />
            </label>

            <label>
              Тег для заполнения:
              <input
                type="text"
                value={newFieldTag}
                onChange={(e) => setNewFieldTag(e.target.value)}
                placeholder="Например {{фио_сотрудника}}"
                className="modal-input"
              />
            </label>

            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="modal-button-cancel">
                Отмена
              </button>
              <Button onClick={handleModalSubmit} className="modal-button-submit">
                Добавить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
