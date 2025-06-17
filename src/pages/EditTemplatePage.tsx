import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { SimpleEditor } from "@/shared/ui/common/SimpleEditor"
import "@/shared/styles/document.css"
import { useAuth } from "@/features/auth/AuthContext"

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
        <button
          className="edit-template-back-button"
          onClick={() => navigate(-1)}
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

        <button
          className="edit-template-fill-button"
          onClick={() => setShowModal(true)}
          style={{
            marginLeft: "12px",
            padding: "8px 16px",
            backgroundColor: "#615EF0",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Создать документ
        </button>
      </div>

      <SimpleEditor
        key={template.name + template.content}
        content={updatedContent}
        onChange={setUpdatedContent}
        documentId={Number(id)}
        documentName={editedName}
      />

      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Создание документа</h3>
            <input
              type="text"
              placeholder="Введите название документа"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              style={inputStyle}
            />

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowModal(false)}>Отмена</button>
              <button
                style={{ backgroundColor: "#615EF0", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "4px" }}
                onClick={handleCreateDocument}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditTemplatePage

// ===== Стили модального окна =====
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
  width: "320px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  boxSizing: "border-box"
}
