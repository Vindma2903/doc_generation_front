import React, { useState, useEffect } from "react"
import axios from "axios"

type Tag = {
  id: number
  name: string
  label: string
  description?: string
}

type Props = {
  onInsert: (value: string) => void
}

export const VariablePanel: React.FC<Props> = ({ onInsert }) => {
  const [tags, setTags] = useState<Tag[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    axios.get("http://localhost:8080/tags/all")
      .then((res) => {
        const data = res.data
        if (Array.isArray(data)) {
          setTags(data)
        } else {
          console.warn("⚠️ /tags/all вернул не массив:", data)
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
            onClick={() => onInsert(tag.name)}
            title={tag.label || tag.description || ""}
          >
            <span className="drag-icon">≡</span>
            {tag.name}
          </button>
        ))
      ) : (
        <div className="no-results">Ничего не найдено</div>
      )}

    </div>
  )
}
