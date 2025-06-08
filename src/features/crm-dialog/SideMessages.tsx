import React from "react";
import { NavMessageUser } from "@/shared/ui/common/nav-message-user"; // Боковая навигация с сообщениями
import { NavCRM } from "@/shared/ui/common/dop-navigation-message-user"; // Дополнительная навигация

interface SideMessagesProps {
  onSelectChat: (id: string, userName: string) => void; // Выбор чата
}

export const SideMessages: React.FC<SideMessagesProps> = ({ onSelectChat }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
      {/* Боковая навигация */}
      <NavMessageUser onSelectChat={onSelectChat} />

      {/* Дополнительная навигация */}
      <NavCRM />
    </div>
  );
};

export default SideMessages;
