import React from "react";

interface ChatInputProps {
  message: string;
  onChange: (value: string) => void; // Изменение текста сообщения
  onSend: () => void; // Отправка сообщения
  selectedChatUserName?: string; // Имя выбранного пользователя
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  onChange,
  onSend,
  selectedChatUserName,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Предотвращаем новую строку
      onSend(); // Отправка сообщения
    }
  };

  if (!selectedChatUserName) return null; // Если чат не выбран, поле ввода не отображается

  return (
    <div className="nav-message-user-chat-input-container">
      <textarea
        value={message}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Введите сообщение для ${selectedChatUserName}`}
        className="nav-message-user-chat-input"
      />
      <button onClick={onSend} className="nav-message-user-chat-send-button">
        <img
          src="/public/Send-message.svg"
          alt="Отправить сообщение"
          className="nav-message-user-send-icon"
        />
      </button>
    </div>
  );
};

export default ChatInput;
