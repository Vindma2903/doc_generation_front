import axios from "axios";

const API_BASE_URL = "http://localhost:8000/kanban"; // Укажи правильный URL

export const fetchDeals = async () => {
  try {
    console.log("🔍 Отправляем GET-запрос на:", `${API_BASE_URL}/orders`);
    const response = await axios.get(`${API_BASE_URL}/orders`);
    console.log("✅ Успешно получили сделки:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Ошибка при получении сделок:", error);
    return [];
  }
};

export const createDeal = async (dealData: any) => {
  try {
    let token = localStorage.getItem("access_token");

    if (!token) {
      console.warn("⚠️ Токен отсутствует! Повторная проверка авторизации...");
      await checkAuth();
      token = localStorage.getItem("access_token");
    }

    if (!token) {
      throw new Error("🚨 Ошибка: нет токена авторизации!");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Формируем объект согласно схеме OrderCreateSchema:
    const newDealData = {
      name: dealData.name, // Название сделки
      description: dealData.description || null,
      date_of_creation: new Date().toISOString(), // ISO-формат
      date_of_send: new Date().toISOString(),
      address: dealData.address || null,
      delivery_method: dealData.delivery_method || "COURIER",
      price: dealData.amount, // Используем amount (число)
      client_name: dealData.client_name,
      client_phone: dealData.client_phone,
      column_id: dealData.column_id, // Используем column_id (нижний регистр)
    };

    console.log("📤 Отправляем данные сделки:", JSON.stringify(newDealData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/orders`, newDealData, { headers });

    console.log("✅ Сделка успешно создана (ответ сервера):", JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    console.error("❌ Ошибка при создании сделки:", error);
    console.log("📌 Ответ сервера (полный):", JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
};

