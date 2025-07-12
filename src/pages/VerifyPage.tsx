import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login"); // если токен отсутствует — редирект
      return;
    }

    axios.post("http://localhost:8080/verify", { token })
      .then(() => {
        navigate("/login"); // успешно подтвердили — на логин
      })
      .catch(() => {
        navigate("/login"); // даже при ошибке — туда же
      });
  }, [searchParams, navigate]);

  return null; // не рендерим ничего
};
