import React, { useState, useEffect } from "react";
import "@/shared/styles/TaskDetailsModal.css";

interface Comment {
  text: string;
  author: string;
  timestamp: string;
}

interface Deal {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  client: {
    name: string;
    phone: string;
    email: string;
    inn: string;
  };
  details: {
    provider: string;
    manager: string;
    orderDate: string;
    shipmentDate: string;
    delivery: {
      address: string;
      method: string;
    };
  };
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  comments?: Comment[];
}

const deliveryMethods = ['Курьер', 'Самовывоз'];
const responsiblePersons = ['Ромашкин Рома', 'Палагина Виктория'];
const fuseTypes = ['Предохранитель ППН 37 400А', 'Другие типы'];

const TaskDetailsModal: React.FC<{
  deal: Deal;
  onClose: () => void;
  onSave: (updatedDeal: Deal) => void;
}> = ({ deal, onClose, onSave }) => {
  const [editedDeal, setEditedDeal] = useState<Deal>({
  ...deal,
  title: deal.title ? `Заказ на ${deal.title}` : "Без названия", // ✅ Теперь корректно передаётся title
  client: {
    name: deal.client?.name || deal.name || "", // ✅ ФИО клиента или менеджер
    phone: deal.client?.phone || "",
    email: deal.client?.email || "",
    inn: deal.client?.inn || "-",
  },
  details: {
    provider: deal.details?.provider || "",
    manager: deal.details?.manager || deal.name || "Не указан", // ✅ Менеджер из `deal.name`
    orderDate: deal.details?.orderDate || "",
    shipmentDate: deal.details?.shipmentDate || "",
    delivery: {
      address: deal.details?.delivery?.address || "г. Москва, ул. Пушкина, д.10, кв.5",
      method: deal.details?.delivery?.method || "Курьер",
    },
  },
  products: deal.products || [
    {
      id: "1",
      name: "Предохранитель ППН 37 400А",
      quantity: 1,
      price: deal.amount || 0, // ✅ Берём цену из `amount`
    },
  ],
  comments: deal.comments || [],
});


  const [newComment, setNewComment] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector(".deal-modal-container")?.classList.add("active");
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    newQuantity = Math.max(1, newQuantity);
    setEditedDeal(prev => {
      const newProducts = [...prev.products];
      newProducts[index].quantity = newQuantity;
      return { ...prev, products: newProducts };
    });
  };

  const handleFieldChange = (path: string, value: string | number) => {
    setEditedDeal(prev => {
      const keys = path.split('.');
      const newState = { ...prev };
      let current: any = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        text: newComment.trim(),
        author: "Палагина Виктория",
        timestamp: new Date().toLocaleString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
      };

      setEditedDeal(prev => ({
        ...prev,
        comments: [...(prev.comments || []), comment],
      }));

      setNewComment("");
      onSave({ ...editedDeal, comments: [...(editedDeal.comments || []), comment] });
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="deal-modal-overlay">
      <div className={`deal-modal-container ${isClosing ? 'closing' : ''}`}>
        <div className="deal-modal-header">
          <div className="header-main">
            <div className="deal-title-group">
              <h1 className="deal-title">{editedDeal.title}</h1>
              <div className="creation-time">
                <img src="/clock-Icon.png" alt="Иконка часов" className="clock-icon" />
                <span>
                  {new Date(editedDeal.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="status-badges">
                <span className="status paid">Оплачено</span>
                <span className="status assembling">Собирается</span>
              </div>
            </div>
          </div>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="deal-modal-content">
          <div className="main-section">
            <div className="section">
              <h2>Детали сделки</h2>
              <div className="product-details">
                {editedDeal.products.map((product, index) => (
                  <div key={product.id} className="product-item">
                    <img src="/package.svg" alt="Иконка товара" className="package-icon" />
                    <div className="product-info">
                      {editingField === `product.${index}.name` ? (
                        <select
                          value={product.name}
                          onChange={(e) => {
                            handleFieldChange(`products.${index}.name`, e.target.value);
                            setEditingField(null);
                          }}
                          className="select-field product-select"
                          autoFocus
                          onBlur={() => setEditingField(null)}
                        >
                          {fuseTypes.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className="editable-text"
                          onClick={() => setEditingField(`product.${index}.name`)}
                        >
                          {product.name}
                        </span>
                      )}
                      <div className="price-control-wrapper">
                        <span className="product-price">{product.price} руб</span>
                        <div className="quantity-control">
                          <button
                            onClick={() => handleQuantityChange(index, product.quantity - 1)}
                            className="quantity-btn"
                          >
                            -
                          </button>
                          <span className="quantity-value">{product.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(index, product.quantity + 1)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="total-sum">
                  <span>Итого:</span>
                  <span className="total-price">
                    {editedDeal.products.reduce((sum, p) => sum + p.price * p.quantity, 0)} руб
                  </span>
                </div>
              </div>
            </div>

            <div className="section">
              <h2>Информация о доставке</h2>
              <div className="delivery-info">
                <div className="delivery-field">
                  <label>Адрес доставки:</label>
                  {editingField === 'delivery.address' ? (
                    <input
                      type="text"
                      value={editedDeal.details.delivery.address}
                      onChange={(e) => handleFieldChange('details.delivery.address', e.target.value)}
                      className="edit-field address-input"
                      autoFocus
                      onBlur={() => setEditingField(null)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingField(null)}
                    />
                  ) : (
                    <span
                      className="editable-text"
                      onClick={() => setEditingField('delivery.address')}
                    >
                      {editedDeal.details.delivery.address}
                    </span>
                  )}
                </div>
                <div className="delivery-field">
                  <label>Способ доставки:</label>
                  {editingField === 'delivery.method' ? (
                    <select
                      value={editedDeal.details.delivery.method}
                      onChange={(e) => {
                        handleFieldChange('details.delivery.method', e.target.value);
                        setEditingField(null);
                      }}
                      className="select-field"
                      autoFocus
                      onBlur={() => setEditingField(null)}
                    >
                      {deliveryMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className="editable-text"
                      onClick={() => setEditingField('delivery.method')}
                    >
                      {editedDeal.details.delivery.method}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="section">
              <h2>Комментарий к заказу</h2>
              <div className="comment-section">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="comment-field"
                  placeholder="Добавить комментарий ..."
                />
                <div className="comment-button-container">
                  <button
                    className="add-comment-btn"
                    onClick={handleAddComment}
                  >
                    Добавить комментарий
                  </button>
                </div>
                <div className="comments-list">
                  {editedDeal.comments?.map((comment, index) => (
                    <div key={index} className="comment-item">
                      <div className="comment-text">{comment.text}</div>
                      <div className="comment-meta">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-timestamp">{comment.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="side-section">
            <div className="responsible-info">
              <div className="info-row">
                <span>Постановщик:</span>
                <select
                  value="Палагина Виктория"
                  className="select-field"
                  disabled
                >
                  <option>Палагина Виктория</option>
                </select>
              </div>
              <div className="info-row">
                <span>Ответственный:</span>
                {editingField === 'details.manager' ? (
                  <select
                    value={editedDeal.details.manager}
                    onChange={(e) => {
                      handleFieldChange('details.manager', e.target.value);
                      setEditingField(null);
                    }}
                    className="select-field"
                    autoFocus
                    onBlur={() => setEditingField(null)}
                  >
                    {responsiblePersons.map(person => (
                      <option key={person} value={person}>{person}</option>
                    ))}
                  </select>
                ) : (
                  <span
                    className="editable-text"
                    onClick={() => setEditingField('details.manager')}
                  >
                    {editedDeal.details.manager}
                  </span>
                )}
              </div>
            </div>

            <div className="dates-info">
              <div className="info-row">
                <span>Дата заказа:</span>
                {editingField === 'details.orderDate' ? (
                  <input
                    type="date"
                    value={editedDeal.details.orderDate}
                    onChange={(e) => handleFieldChange('details.orderDate', e.target.value)}
                    className="edit-field"
                    autoFocus
                    onBlur={() => setEditingField(null)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingField(null)}
                  />
                ) : (
                  <span
                    className="editable-text"
                    onClick={() => setEditingField('details.orderDate')}
                  >
                    {formatDate(editedDeal.details.orderDate)}
                  </span>
                )}
              </div>
              <div className="info-row">
                <span>Дата отправки:</span>
                {editingField === 'details.shipmentDate' ? (
                  <input
                    type="date"
                    value={editedDeal.details.shipmentDate}
                    onChange={(e) => handleFieldChange('details.shipmentDate', e.target.value)}
                    className="edit-field"
                    autoFocus
                    onBlur={() => setEditingField(null)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingField(null)}
                  />
                ) : (
                  <span
                    className="editable-text"
                    onClick={() => setEditingField('details.shipmentDate')}
                  >
                    {formatDate(editedDeal.details.shipmentDate)}
                  </span>
                )}
              </div>
            </div>

            <div className="section">
              <h2>Информация о клиенте</h2>
              <div className="client-info">
                <div className="info-row">
                  <span>ФИО:</span>
                  {editingField === 'client.name' ? (
                    <input
                      type="text"
                      value={editedDeal.client.name}
                      onChange={(e) => handleFieldChange('client.name', e.target.value)}
                      className="edit-field"
                      autoFocus
                      onBlur={() => setEditingField(null)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingField(null)}
                    />
                  ) : (
                    <span
                      className="editable-text"
                      onClick={() => setEditingField('client.name')}
                    >
                      {editedDeal.client.name}
                    </span>
                  )}
                </div>
                <div className="info-row">
                  <span>Телефон:</span>
                  {editingField === 'client.phone' ? (
                    <input
                      type="tel"
                      value={editedDeal.client.phone}
                      onChange={(e) => handleFieldChange('client.phone', e.target.value)}
                      className="edit-field"
                      autoFocus
                      onBlur={() => setEditingField(null)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingField(null)}
                    />
                  ) : (
                    <span
                      className="editable-text"
                      onClick={() => setEditingField('client.phone')}
                    >
                      {editedDeal.client.phone}
                    </span>
                  )}
                </div>
                <div className="info-row">
                  <span>Email:</span>
                  {editingField === 'client.email' ? (
                    <input
                      type="email"
                      value={editedDeal.client.email}
                      onChange={(e) => handleFieldChange('client.email', e.target.value)}
                      className="edit-field"
                      autoFocus
                      onBlur={() => setEditingField(null)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingField(null)}
                    />
                  ) : (
                    <span
                      className="editable-text"
                      onClick={() => setEditingField('client.email')}
                    >
                      {editedDeal.client.email}
                    </span>
                  )}
                </div>
                <div className="info-row">
                  <span>ИНН:</span>
                  {editingField === 'client.inn' ? (
                    <input
                      type="text"
                      value={editedDeal.client.inn}
                      onChange={(e) => handleFieldChange('client.inn', e.target.value)}
                      className="edit-field"
                      autoFocus
                      onBlur={() => setEditingField(null)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingField(null)}
                    />
                  ) : (
                    <span
                      className="editable-text"
                      onClick={() => setEditingField('client.inn')}
                    >
                      {editedDeal.client.inn}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;