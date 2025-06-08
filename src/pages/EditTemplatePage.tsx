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
  const [updatedContent, setUpdatedContent] = useState<string>("")

  const initialContent = `
    <ul>
      <li>Unordered list item</li>
      <li>Another unordered item</li>
    </ul>

    <ol>
      <li>Ordered list item</li>
      <li>Another ordered item</li>
    </ol>

    <ul data-type="taskList">
      <li data-type="taskItem" data-checked="true">Completed task</li>
      <li data-type="taskItem" data-checked="false">Pending task</li>
    </ul>
  `

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/templates/${id}`)
        setTemplate(response.data)
        setUpdatedContent(response.data.content || "")
      } catch (error) {
        console.error("Ошибка загрузки шаблона:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchTemplate()
  }, [id])

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/templates/${id}`, {
        ...template,
        content: updatedContent,
      })
      alert("Сохранено!")
    } catch (error) {
      console.error("Ошибка сохранения:", error)
      alert("Ошибка сохранения")
    }
  }

  if (loading) return <div>Загрузка шаблона...</div>
  if (!template) return <div>Шаблон не найден</div>

  return (
    <div className="edit-template-wrapper">
      <div className="edit-template-header">
        <button className="edit-template-back-button" onClick={() => navigate("/templates")}>
          <img src="/return-icon.svg" alt="Назад" className="back-icon" />
        </button>

        <h2 className="edit-template-title">{template.name}</h2>
      </div>

      <SimpleEditor
        content={updatedContent || initialContent}
        onChange={setUpdatedContent}
      />

      <button className="edit-template-save-button" onClick={handleSave}>
        Сохранить
      </button>
    </div>
  )
}

export default EditTemplatePage
