import { MainSidebar } from "@/shared/ui/common/project-sidebar";
import { IntegrationCard } from "@/shared/ui/common/IntegrationCard";
import "@/shared/styles/integration-page.css";

export default function IntegrationPage() {
  return (
    <div className="integration-page">
      <MainSidebar />

      <main className="integration-content">
        <h1 className="header-title">Интеграции</h1>

        <div className="integrations-grid">
          <IntegrationCard
            logo="/vk-logo.png"
            title="VK"
            description="Подключите Телеграм для взаимодействия с вашими клиентами через наш сервис."
          />

          <IntegrationCard
            logo="/Avito_logo.png"
            title="Avito"
            description="Подключите Avito для взаимодействия с вашими клиентами через наш сервис."
          />

          <IntegrationCard
            logo="/bitrix24-logo.png"
            title="Bitrix24"
            description="Подключите Битрикс24 для взаимодействия с вашими клиентами через наш сервис."
          />

          <IntegrationCard
            logo="/telegram-logo.png"
            title="Telegram"
            description="Подключите Телеграм для взаимодействия с вашими клиентами через наш сервис."
          />
        </div>
      </main>
    </div>
  );
}