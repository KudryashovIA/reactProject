import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ScrollToTop from "../components/ScrollButton"; // ← предполагаю, что компонент называется ScrollToTop
import ModalDetailElectronic from "../components/ModalDetailElectronic";

const ElectronicsDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Базовый URL для API — из env-переменной Render / Vite
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/electronics/${id}`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка загрузки деталей компонента:", err);
        
        let errorMsg = "Не удалось загрузить данные";
        if (err.response) {
          if (err.response.status === 404) {
            errorMsg = err.response.data?.error || "Компонент не найден";
          } else if (err.response.status >= 500) {
            errorMsg = "Ошибка на сервере, попробуйте позже";
          }
        } else if (err.request) {
          errorMsg = "Нет ответа от сервера (проверьте подключение к бэкенду)";
        }
        
        setError(errorMsg);
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const openModal = (device) => setSelectedDevice(device);
  const closeModal = () => setSelectedDevice(null);

  if (loading) {
    return <p className="loading">Загрузка деталей компонента...</p>;
  }

  if (error) {
    return <div className="container_error error-message">{error}</div>;
  }

  if (!data || !data.component) {
    return <div className="container_error">Компонент не найден</div>;
  }

  const { component, devices } = data;

  return (
    <div className="container">
      <header>
        <a href="/electronics" className="backLink">
          ← Назад к компонентам
        </a>
      </header>

      <h1>{component.name_detail}</h1>
      <p className="description">{component.description || "Нет описания"}</p>

      <h2>Устройства на базе этого компонента ({devices.length})</h2>

      <div className="device-cards">
        {devices.length === 0 ? (
          <p className="empty">
            Пока нет устройств на базе этого компонента
          </p>
        ) : (
          devices.map((dev) => (
            <div className="device-card" key={dev.id}>
              <div className="photo">
                <img
                  src={dev.images || "/images/placeholder.png"}
                  alt={dev.name_device}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/placeholder.png";
                  }}
                />
              </div>
              <div className="device-card__content">
                <h3>{dev.name_device}</h3>
                <p className="description">{dev.parameters || "Нет параметров"}</p>
                <button
                  className="device-card__button"
                  onClick={() => openModal(dev)}
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ScrollToTop />

      {selectedDevice && (
        <ModalDetailElectronic
          device={selectedDevice}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default ElectronicsDetail;