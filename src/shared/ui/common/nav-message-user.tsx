import React, { useState, useEffect } from "react";
import "@/shared/styles/nav-message-user.css";

interface NavMessageUserProps {
  onSelectChat: (id: string, userName: string, messages: Message[]) => void;
}

interface Chat {
  id: string;
  userName: string;
  messageText: string;
  lastMessageTime?: string;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  created_at: string | null;
}

const CHATS_API_URL = "http://127.0.0.1:8000/messages/leads/with-last-message";
const MESSAGES_API_URL = "http://127.0.0.1:8000/messages";

export const NavMessageUser: React.FC<NavMessageUserProps> = ({ onSelectChat }) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(CHATS_API_URL);
      if (!response.ok) throw new Error("Ошибка при загрузке чатов");
      const data = await response.json();
      const formattedChats = data.map((chat: any, index: number) => ({
        id: chat.session_id,
        userName:
          chat.lead && chat.lead.first_name && chat.lead.last_name
            ? `${chat.lead.first_name} ${chat.lead.last_name}`
            : `Новая заявка ${index + 1}`,
        messageText: chat.last_message || "Сообщений пока нет",
        lastMessageTime: chat.last_message_time || null,
      }));
      setChats(formattedChats);
    } catch (error) {
      setError("Ошибка загрузки чатов. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`${MESSAGES_API_URL}/${sessionId}`);
      if (!response.ok) throw new Error("Ошибка загрузки сообщений");
      const data = await response.json();
      return data.messages;
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error);
      return [];
    }
  };

  const handleSelectChat = async (id: string, userName: string) => {
    setSelectedChatId(id);
    const messages = await fetchMessages(id);
    onSelectChat(id, userName, messages);
  };

  return (
    <aside className="nav-msg-user-sidebar">
      <div className="nav-msg-user-sidebar-container">
        <h2 className="nav-msg-user-title">Чаты</h2>
        {loading ? (
          <p className="nav-msg-user-loading">🔄 Загрузка чатов...</p>
        ) : error ? (
          <p className="nav-msg-user-error">❌ {error}</p>
        ) : (
          <div className="nav-msg-user-incoming-messages">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`nav-msg-user-message-block ${
                  selectedChatId === chat.id ? "nav-msg-user-active" : ""
                }`}
                onClick={() => handleSelectChat(chat.id, chat.userName)}
              >
                <div className="nav-msg-user-user-icon">
                  {chat.userName.charAt(0).toUpperCase()}
                </div>
                <div className="nav-msg-user-message-content">
                  <p className="nav-msg-user-user-name">{chat.userName}</p>
                  <p className="nav-msg-user-message-text">{chat.messageText}</p>
                  {chat.lastMessageTime && (
                    <p className="nav-msg-user-message-time">
                      🕒 {new Date(chat.lastMessageTime).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
