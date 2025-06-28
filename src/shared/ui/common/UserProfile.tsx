import React, { useEffect, useState } from "react";
import { User } from "@heroui/react";
import ProfileDropdown from "@/shared/ui/common/profile-drop";
import axios from "axios";

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.warn("Токен отсутствует в localStorage");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8080/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(res.data);
      } catch (err) {
        console.error("Ошибка при получении пользователя:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleArrowClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="user-profile relative">
      {/* Информация о пользователе */}
      <User
        avatarProps={{
          src: "/user_photo.png",
          className: "user-avatar",
        }}
        name={
          userData
            ? `${userData.first_name} ${userData.last_name}`
            : "Загрузка..."
        }
        description={userData?.email || ""}
        className="user-info"
        css={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          borderTop: "1px solid #f6f6f6",
          ".nextui-user-avatar": {
            width: "32px",
            height: "32px",
            marginRight: "0.75rem",
          },
          ".nextui-user-info": {
            flexGrow: 1,
          },
          ".nextui-user-name": {
            fontSize: "1rem",
            fontWeight: "600",
            color: "#2e2e2e",
          },
          ".nextui-user-description": {
            fontSize: "0.875rem",
            color: "#8e8e8e",
          },
        }}
      />

      {/* Кнопка-стрелка */}
      <img
        src="/arrow.svg"
        alt="Иконка"
        className={`user-arrow ${isDropdownOpen ? "flipped" : ""}`}
        onClick={handleArrowClick}
        style={{ cursor: "pointer" }}
      />

      {/* Выпадающее меню */}
      {isDropdownOpen && userData && (
        <ProfileDropdown
          firstName={userData.first_name}
          lastName={userData.last_name}
          email={userData.email}
        />
      )}
    </div>
  );
};

export default UserProfile;
