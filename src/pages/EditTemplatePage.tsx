import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { SimpleEditor } from "@/shared/ui/common/SimpleEditor"
import "@/shared/styles/document.css"

const EditTemplatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [template, setTemplate] = useState<{ name: string; content: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [editedName, setEditedName] = useState("")
  const [updatedContent, setUpdatedContent] = useState("")

  // Загрузка шаблона при монтировании
  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return

      try {
        const response = await axios.get(`http://localhost:8080/templates/${id}`)
        const { name, content } = response.data
        setTemplate({ name, content })
        setEditedName(name)
        setUpdatedContent(content || "")
      } catch (error) {
        console.error("Ошибка загрузки шаблона:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [id])

  const handleSave = async () => {
    if (!template) return

    try {
      await axios.put(`http://localhost:8080/templates/${id}`, {
        ...template,
        content: updatedContent,
      })
      alert("Содержимое сохранено!")
    } catch (error) {
      console.error("Ошибка сохранения:", error)
      alert("Ошибка при сохранении содержимого")
    }
  }

  const handleNameBlur = async () => {
    if (!id || !editedName.trim()) return

    try {
      await axios.post("http://localhost:8080/templates/rename", {
        id: Number(id),
        name: editedName.trim(),
      })

      setTemplate((prev) => (prev ? { ...prev, name: editedName.trim() } : null))
    } catch (error) {
      console.error("Ошибка при переименовании:", error)
      alert("Не удалось переименовать шаблон")
    }
  }

  if (loading) return <div>Загрузка шаблона...</div>
  if (!template) return <div>Шаблон не найден</div>

  return (
    <div className="edit-template-wrapper">
      <div className="edit-template-header">
        <button
          className="edit-template-back-button"
          onClick={() => navigate("/templates")}
        >
          <img src="/return-icon.svg" alt="Назад" className="back-icon" />
        </button>

        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onBlur={handleNameBlur}
          className="edit-template-rename-input"
        />
      </div>

      {/* Используем key, чтобы SimpleEditor не перерендеривался без причины */}
      <SimpleEditor
        key={template.name + template.content}
        content={updatedContent}
        onChange={setUpdatedContent}
        documentId={Number(id)}
        documentName={editedName}
      />

      <button className="edit-template-save-button" onClick={handleSave}>
        Сохранить содержимое
      </button>
    </div>
  )
}

export default EditTemplatePage
