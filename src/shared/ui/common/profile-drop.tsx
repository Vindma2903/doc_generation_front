import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ProfileDropdownProps {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ firstName, lastName, email }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.post(
          "http://localhost:8080/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Удаляем токен и перенаправляем на логин
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Ошибка при выходе:", err);
      alert("Ошибка при выходе из аккаунта");
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        right: "0",
        transform: "translateX(264px) translateY(-68px)",
        width: "250px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "16px",
        zIndex: 10,
      }}
    >
      {/* Информация о пользователе */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <img
          src="/user_photo.png"
          alt="User Avatar"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            marginRight: "12px",
          }}
        />
        <div>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            {firstName} {lastName}
          </div>
          <div style={{ fontSize: "14px", color: "#8e8e8e" }}>{email}</div>
        </div>
      </div>

      <hr style={{ borderColor: "#f0f0f0", margin: "12px 0" }} />

      {/* Настройки профиля */}
      <a
        href="/account-user"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 0",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <img
          src="/setting-icon.svg"
          alt="Настройки"
          style={{ width: "20px", height: "20px", marginRight: "12px" }}
        />
        <span style={{ fontSize: "14px", color: "#2e2e2e" }}>Настройки профиля</span>
      </a>

      <hr style={{ borderColor: "#f0f0f0", margin: "12px 0" }} />

      {/* Выход */}
      <div
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 0",
          cursor: "pointer",
        }}
      >
        <img
          src="/exit.svg"
          alt="Выход"
          style={{ width: "20px", height: "20px", marginRight: "12px" }}
        />
        <span style={{ fontSize: "14px", color: "#2e2e2e" }}>Выход</span>
      </div>
    </div>
  );
};

export default ProfileDropdown;
