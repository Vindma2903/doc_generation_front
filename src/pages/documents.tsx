import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { MainSidebar } from "@/shared/ui/common/main-sidebar"
import { useAuth } from "@/features/auth/AuthContext"
import "@/shared/styles/home.css"
import "@/shared/styles/globals.css"

type Document = {
  id: number
  name: string
  user_id: number
  template_id: number
  content: string
  rendered_content: string | null
  created_at: string
}

export const DocumentsPage: React.FC = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<Document[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchDocs = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/documents/user/${user.id}`)
        setDocuments(res.data)
      } catch (err) {
        console.error("Ошибка загрузки документов:", err)
      } finally {
        setFetching(false)
      }
    }

    fetchDocs()
  }, [user])

  if (loading || fetching) return <div>Загрузка...</div>

  if (!user) {
    navigate("/login")
    return null
  }

  return (
    <div className="home-container">
      {/* Боковое меню */}
      <MainSidebar />

      {/* Контент */}
      <main className="content">
        <h1 style={{ marginBottom: "20px" }}>Мои документы</h1>
        {documents.length === 0 ? (
          <p>Документов пока нет.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Название</th>
              <th style={thStyle}>Дата создания</th>
              <th style={thStyle}>Шаблон</th>
              <th style={thStyle}>Действия</th>
            </tr>
            </thead>
            <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{doc.id}</td>
                <td style={tdStyle}>{doc.name}</td>
                <td style={tdStyle}>{new Date(doc.created_at).toLocaleString()}</td>
                <td style={tdStyle}>{doc.template_id}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => navigate(`/documents/fill/${doc.id}`)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#615EF0",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Открыть
                  </button>
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

// Стили таблицы
const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px",
  borderBottom: "2px solid #ccc"
}

const tdStyle: React.CSSProperties = {
  padding: "8px"
}
