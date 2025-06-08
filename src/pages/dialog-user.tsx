import React, { useState } from "react";
import "@/shared/styles/globals.css"; // Подключаем стили
import "@/shared/styles/nav-message-user.css"; // Подключаем стили только для чата
import { NavMessageUser } from "@/shared/ui/common/nav-message-user"; // Компонент списка чатов
import { NavCRM } from "@/shared/ui/common/dop-navigation-message-user"; // Доп. навигация
import { useAuth } from "@/features/auth/AuthContext";

const API_MESSAGES_URL = "http://127.0.0.1:8000/messages"; // Базовый URL для сообщений

export const DialogUser: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<{ id: string; userName: string } | null>(null);
  const [message, setMessage] = useState<string>(""); // Поле для хранения текста сообщения
  const [chatMessages, setChatMessages] = useState<
    Array<{ from: string; text: string; time: string }>
  >([]);

  const currentUserId = "user-uuid"; // ✅ Здесь должен быть ID текущего пользователя
  const currentUserRole = "LEAD"; // ✅ Можно динамически менять на "MANAGER" или "BOT"

  // ✅ Функция выбора чата с загрузкой сообщений
 const handleSelectChat = async (id: string, userName: string) => {
  console.log("📌 Выбран session_id:", id);
  setSelectedChat({ id, userName });
  setChatMessages([]); // Очищаем старые сообщения перед загрузкой новых

  try {
    const response = await fetch(`${API_MESSAGES_URL}/by-session/${id}`);
    if (!response.ok) throw new Error(`Ошибка загрузки сообщений: ${response.status}`);

    const data = await response.json();
    console.log("📥 Сообщения загружены:", data);

    // Проверка, что messages существует и является массивом
    if (!data.messages || !Array.isArray(data.messages)) {
      console.error("❌ Ошибка: неверный формат данных сообщений", data);
      return;
    }

    const formattedMessages = data.messages.map((msg: any) => ({
      from: typeof msg.role === "string" ? msg.role.toLowerCase() : "unknown", // ✅ Проверяем, что msg.role строка
      text: msg.text || "Без текста", // ✅ Если текст отсутствует, подставляем заглушку
      time: msg.created_at
        ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Нет времени", // ✅ Обработка отсутствующего времени
    }));

    setChatMessages(formattedMessages);


  } catch (error) {
    console.error("❌ Ошибка загрузки сообщений:", error);
  }
};



  // ✅ Функция отправки сообщения
  const handleSendMessage = async () => {
  if (!selectedChat || !message.trim()) return;

  const roleToSend = "MANAGER";
  const senderId = roleToSend === "MANAGER"
    ? "10000000-0000-0000-0000-000000000000"
    : currentUserId;

  const newMessage = {
    session_id: selectedChat.id,
    text: message,
    sender: senderId,  // выбираем sender в зависимости от роли
    role: roleToSend,
  };

  try {
    const response = await fetch(API_MESSAGES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    });

    if (!response.ok) throw new Error("Ошибка при отправке сообщения");

    const data = await response.json();
    console.log("✅ Сообщение сохранено, ID:", data.session_id);

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [
      ...prev,
      { from: roleToSend.toLowerCase(), text: message, time: currentTime },
    ]);

    setMessage("");
  } catch (error) {
    console.error("❌ Ошибка отправки сообщения:", error);
  }
};


  // ✅ Обработка Enter для отправки
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Предотвращаем переход на новую строку
      handleSendMessage(); // Отправка сообщения
    }
  };

  return (
    <div className="nav-message-user-home-container" style={{ display: "flex", position: "relative" }}>
      {/* Боковое меню с сообщениями */}
      <NavMessageUser onSelectChat={handleSelectChat} />

      {/* Дополнительная навигация */}
      <NavCRM />

      {/* Контентная часть */}
      <main className="nav-message-user-content">
            {/* Область чата */}
           <div className="nav-msg-user-chat-messages">
      <div className="nav-msg-user-messages-container">
        {chatMessages.map((msg, index) => (
            <div key={index} className="nav-msg-user-chat-message-wrapper">
      <div className="nav-msg-user-message-avatar">
        <img
          src={msg.from === "lead" ? "/lead-icon.svg" : "/vika_photo.jpg"}
          alt="Аватар"
          className="nav-msg-user-avatar-icon"
        />
      </div>

      <div className="nav-msg-user-message-info">
        <p className="nav-msg-user-sender-name">
          {msg.from === "lead" ? "Новая заявка" : "Виктория Палагина"}
        </p>

        <div
          className={`nav-msg-user-chat-message ${
            msg.from === "lead"
              ? "nav-msg-user-sent"
              : msg.from === "manager"
              ? "nav-msg-user-manager"
              : "nav-msg-user-received"
          }`}
        >
          <div className="nav-msg-user-message-content">
            <p className="nav-msg-user-message-text">{msg.text}</p>
            <span className="nav-msg-user-message-time">{msg.time}</span>
          </div>
        </div>
      </div>
    </div>

        ))}
      </div>

      {selectedChat && (
        <div className="nav-message-user-chat-input-container">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Введите сообщение для ${selectedChat.userName}`}
            className="nav-message-user-chat-input"
          />
          <button onClick={handleSendMessage} className="nav-message-user-chat-send-button">
            <img
              src="/Send-message.svg"
              alt="Отправить сообщение"
              className="nav-message-user-send-icon"
            />
          </button>
        </div>
      )}
    </div>

      </main>
    </div>
  );
};

export default DialogUser;
