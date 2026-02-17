import { useState, useEffect } from "react";
import Card from "../components/Card";
import axios from "axios";
import ScrollToTop from "../components/ScrollButton"; // ← было ScrollButton, но импорт ScrollToTop — проверь имя компонента

const Electronics = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Базовый URL берём из переменной окружения (Vite)
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/electronics`);
        setComponents(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка загрузки компонентов:", err);
        setError(
          err.response?.status === 404
            ? "Компоненты не найдены (проверьте бэкенд)"
            : "Не удалось загрузить компоненты"
        );
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  if (loading) {
    return <p className="loading">Загрузка электронных компонентов...</p>;
  }

  if (error) {
    return <div className="container_error error-message">{error}</div>;
  }

  return (
    <section className="container">
      <header>
        <h1>Электронные компоненты</h1>
        <a href="/" className="backLink">
          ← На главную
        </a>
      </header>

      <main className="cards">
        {components.length === 0 ? (
          <p>Компоненты пока отсутствуют в базе данных</p>
        ) : (
          components.map((comp) => (
            <Card
              key={comp.id}
              to={`/electronics/${comp.id}`}
              image={comp.images || "/images/placeholder.png"}
              title={comp.name_detail}
              description={comp.description || "Нет описания"}
              buttonText="Подробнее"
            />
          ))
        )}
      </main>

      <ScrollToTop />
    </section>
  );
};

export default Electronics;