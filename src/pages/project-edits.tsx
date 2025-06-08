import React, { useState } from "react";
import { MainSidebar } from "@/shared/ui/common/project-sidebar"; // Боковое меню
import "@/shared/styles/globals.css"; // Глобальные стили
import "@/shared/styles/project-edits.css"; // Стили для страницы
import DynamicBreadcrumbs from "@/shared/ui/common/Breadcrumb"; // Хлебные крошки
import { useNavigate } from "react-router-dom"; // Хук навигации
import { Select, SelectItem, Textarea } from "@nextui-org/react"; // Компоненты Select и Textarea
import { animals } from "@/shared/ui/common/select"; // Данные для Select

const ProjectEdits = () => {
  const navigate = useNavigate(); // Хук для навигации
  const [messages, setMessages] = useState<Array<{ text: string; from: "user" | "bot" }>>([]); // Список сообщений
  const [newMessage, setNewMessage] = useState<string>(""); // Новое сообщение

  const breadcrumbs = [
    { label: "Главная", to: "/" },
    { label: "Проекты", to: "/projects" },
    { label: "Название проекта", to: "/project-edits" },
  ];

  // Возврат на предыдущую страницу
  const handleBackClick = () => navigate(-1);

  // Отправка нового сообщения
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => [...prevMessages, { text: newMessage, from: "user" }]);
      setNewMessage(""); // Очистка поля ввода

      // Эмуляция ответа от бота
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Спасибо за ваше сообщение!", from: "bot" },
        ]);
      }, 1000); // Задержка для имитации ответа
    }
  };

  return (
    <div className="home-container">
      {/* Боковое меню */}
      <MainSidebar />

      {/* Основной контент */}
      <main className="content">
        {/* Хлебные крошки */}
        <DynamicBreadcrumbs breadcrumbs={breadcrumbs} />

        <h1 className="content-title">Название проекта</h1>

        {/* Контейнер для разделения на секции */}
        <div className="content-container">
          {/* Левая секция */}
          <div className="left-section">
            <h2 className="select-label">Роль агента</h2>
            <Select className="max-w-xs" placeholder="Ответы по тексту">
              {animals.map((animal) => (
                <SelectItem key={animal.key}>{animal.label}</SelectItem>
              ))}
            </Select>

            <h2 className="textarea-label">Дополнительные инструкции</h2>
            <Textarea
              disableAnimation
              disableAutosize
              classNames={{
                base: "max-w-xs",
                input: "resize-y min-h-[40px]",
              }}
              placeholder="Пример: Представь, что ты менеджер компании “ООО Ромашка”..."
              variant="bordered"
            />

            <h2 className="textarea-label">Текст для неожиданных вопросов</h2>
            <Textarea
              disableAnimation
              disableAutosize
              classNames={{
                base: "max-w-xs",
                input: "resize-y min-h-[40px]",
              }}
              placeholder="Пример: Одну минуту я уточню"
              variant="bordered"
            />
            <button className="add-button">Обновить</button>
          </div>

          {/* Правая секция: Чат */}
          <div className="right-section">
            <div className="chat-container">
              {/* Шапка чата */}
              <div className="chat-header">
                <img
                  src="/public/chat-user.png"
                  alt="Иконка бота"
                  className="chat-header-icon"
                />
                <span className="chat-header-title">Бот для салона</span>
              </div>

              {/* Сообщения */}
              <div className="messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${
                      message.from === "user" ? "sent" : "received"
                    }`}
                  >
                    <div className="message-container">
                      {message.from === "bot" && (
                        <img
                          src="/public/bot-icon.png"
                          alt="Иконка бота"
                          className="bot-icon"
                        />
                      )}
                      <p className="message-text">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Поле ввода */}
              <div className="chat-input">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault(); // Предотвращаем переход на новую строку
                      handleSendMessage();
                    }
                  }}
                  placeholder="Напишите сообщение"
                  className="chat-input-textarea"
                />
                <button onClick={handleSendMessage} className="send-button">
                  <img src="/Send-message.svg" alt="Отправить сообщение" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectEdits;
