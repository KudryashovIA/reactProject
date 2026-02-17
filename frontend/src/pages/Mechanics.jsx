import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import ModalDetailMechanic from '../components/ModalDetailMechanic';

const Mechanics = () => {
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [loading, setLoading] = useState(true);    // исправлена опечатка loging → loading
  const [error, setError] = useState(null);

  // Базовый URL из env (Render / Vite)
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/mechanics`);
        setParts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки механических деталей:', err);
        
        let errorMessage = 'Не удалось загрузить данные';
        if (err.response) {
          if (err.response.status === 404) {
            errorMessage = 'Механические детали не найдены';
          } else if (err.response.status >= 500) {
            errorMessage = 'Ошибка сервера, попробуйте позже';
          }
        } else if (err.request) {
          errorMessage = 'Нет ответа от сервера (проверьте бэкенд)';
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchMechanics();
  }, []);

  const openModal = (part) => setSelectedPart(part);
  const closeModal = () => setSelectedPart(null);

  if (loading) {
    return <p className="loading">Загрузка механических деталей...</p>;
  }

  if (error) {
    return <div className="container_error error-message">{error}</div>;
  }

  return (
    <div className="container">
      <header>
        <h1>Механические детали</h1>
        <a href="/" className="backLink">← На главную</a>
      </header>

      <main className="cards">
        {parts.length === 0 ? (
          <p className="empty">Механические детали ещё не добавлены</p>
        ) : (
          parts.map((part) => (
            <Card
              key={part.id}
              image={part.photo || '/images/placeholder.png'}
              title={part.name_detail}
              buttonText="Подробнее"
              onClick={() => openModal(part)}
            />
          ))
        )}
      </main>

      {selectedPart && (
        <ModalDetailMechanic 
          part={selectedPart} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default Mechanics;