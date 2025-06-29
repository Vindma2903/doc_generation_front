import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { SimpleEditor } from "@/shared/ui/common/SimpleEditor"
import "@/shared/styles/document.css"
import { useAuth } from "@/features/auth/AuthContext"
import { Button } from "@/shared/ui/common/global/btn"
import "@/shared/styles/globals.css";

const EditTemplatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [template, setTemplate] = useState<{ name: string; content: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [editedName, setEditedName] = useState("")
  const [updatedContent, setUpdatedContent] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [newDocName, setNewDocName] = useState("")


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

  const handleCreateDocument = async () => {
    if (!newDocName.trim() || !id || !user) return

    try {
      const res = await axios.post("http://localhost:8080/documents/create", {
        user_id: user.id,
        template_id: Number(id),
        name: newDocName.trim(),
      })

      const newDocId = res.data.document_id
      navigate(`/documents/fill/${newDocId}`)
    } catch (error) {
      console.error("Ошибка при создании документа:", error)
      alert("Не удалось создать документ")
    }
  }

  if (loading) return <div>Загрузка шаблона...</div>
  if (!template) return <div>Шаблон не найден</div>

  return (
    <div className="edit-template-wrapper">
      <div className="edit-template-header">
        <div className="header-left">
          <button className="edit-template-back-button" onClick={() => navigate(-1)}>
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

        <Button
          onClick={() => setShowModal(true)}
          className="bg-primary small"
        >
          Создать документ
        </Button>
      </div>


      <SimpleEditor
        key={template.name + template.content}
        content={updatedContent}
        onChange={setUpdatedContent}
        documentId={Number(id)}
        documentName={editedName}
      />

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Создание документа</h3>
            <input
              type="text"
              placeholder="Введите название документа"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              className="modal-input"
            />

            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="modal-button-cancel">
                Отмена
              </button>
              <Button onClick={handleCreateDocument} className="modal-button-submit">
                Создать
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditTemplatePage

