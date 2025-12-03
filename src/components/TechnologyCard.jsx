import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, onStatusChange }) {
  // Обработчик клика по карточке
  const handleCardClick = () => {
    const nextStatus = {
      'not-started': 'in-progress',
      'in-progress': 'completed',
      'completed': 'not-started'
    }[status];
    
    onStatusChange(id, nextStatus);
  };

  // Иконки для разных статусов
  const statusIcons = {
    'not-started': '⭕',
    'in-progress': '🔄',
    'completed': '✅'
  };

  // Тексты статусов на русском
  const statusTexts = {
    'not-started': 'Не начато',
    'in-progress': 'В процессе',
    'completed': 'Выполнено'
  };

  return (
    <div 
      className={`technology-card status-${status}`}
      onClick={handleCardClick}
      title="Кликните для изменения статуса"
    >
      <div className="card-header">
        <h3>{title}</h3>
        <span className="status-icon">{statusIcons[status]}</span>
      </div>
      <p className="card-description">{description}</p>
      <div className="card-footer">
        <span className={`status-badge status-${status}`}>
          {statusTexts[status]}
        </span>
        <span className="click-hint">Кликните для изменения →</span>
      </div>
    </div>
  );
}

export default TechnologyCard;