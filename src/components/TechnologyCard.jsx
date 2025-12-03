import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, onStatusChange }) {
  const handleCardClick = () => {
    const nextStatus = {
      'not-started': 'in-progress',
      'in-progress': 'completed',
      'completed': 'not-started'
    }[status];
    
    onStatusChange(id, nextStatus);
  };

  const statusConfig = {
    'not-started': {
      icon: '⭕',
      label: 'Не начато',
      color: '#e74c3c',
      bgColor: 'rgba(231, 76, 60, 0.1)'
    },
    'in-progress': {
      icon: '🔄',
      label: 'В процессе',
      color: '#f39c12',
      bgColor: 'rgba(243, 156, 18, 0.1)'
    },
    'completed': {
      icon: '✅',
      label: 'Выполнено',
      color: '#2ecc71',
      bgColor: 'rgba(46, 204, 113, 0.1)'
    }
  };

  const config = statusConfig[status];

  return (
    <div 
      className={`technology-card status-${status}`}
      onClick={handleCardClick}
      title="Кликните для изменения статуса"
    >
      <div className="card-content">
        <div className="card-header">
          <div className="status-indicator" style={{ backgroundColor: config.bgColor, color: config.color }}>
            <span className="status-icon">{config.icon}</span>
            <span className="status-label">{config.label}</span>
          </div>
          <div className="card-actions">
            <button className="change-status-btn">Изменить статус</button>
          </div>
        </div>
        
        <h3 className="card-title">{title}</h3>
        
        <p className="card-description">{description}</p>
        
        <div className="card-footer">
          <div className="progress-hint">
            <span className="hint-text">Кликните для переключения статуса</span>
            <div className="status-flow">
              <span className="flow-arrow">→</span>
              <span className="flow-text">Не начато → В процессе → Выполнено</span>
            </div>
          </div>
          <div className="card-id">#{id}</div>
        </div>
      </div>
      
      <div className="status-border" style={{ backgroundColor: config.color }}></div>
    </div>
  );
}

export default TechnologyCard;