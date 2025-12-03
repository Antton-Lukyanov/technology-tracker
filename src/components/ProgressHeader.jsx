import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  const total = technologies.length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const inProgress = technologies.filter(t => t.status === 'in-progress').length;
  const notStarted = technologies.filter(t => t.status === 'not-started').length;
  
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Находим самый популярный статус
  const statusCounts = { completed, 'in-progress': inProgress, 'not-started': notStarted };
  const mostPopularStatus = Object.keys(statusCounts).reduce((a, b) => 
    statusCounts[a] > statusCounts[b] ? a : b
  );
  
  const statusLabels = {
    'completed': 'Выполнено',
    'in-progress': 'В процессе', 
    'not-started': 'Не начато'
  };

  return (
    <div className="progress-header">
      <h2>📊 Статистика изучения в реальном времени</h2>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <span className="stat-number">{total}</span>
          <span className="stat-label">Всего технологий</span>
        </div>
        
        <div className="stat-card completed">
          <span className="stat-number">{completed}</span>
          <span className="stat-label">Выполнено</span>
          <span className="stat-percent">{progressPercent}%</span>
        </div>
        
        <div className="stat-card in-progress">
          <span className="stat-number">{inProgress}</span>
          <span className="stat-label">В процессе</span>
        </div>
        
        <div className="stat-card not-started">
          <span className="stat-number">{notStarted}</span>
          <span className="stat-label">Не начато</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <span>Прогресс: {progressPercent}%</span>
          <span>Самая частая категория: {statusLabels[mostPopularStatus]}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="status-distribution">
        <h4>Распределение по статусам:</h4>
        <div className="status-bars">
          <div className="status-bar completed" style={{ width: `${(completed/total)*100}%` }}>
            <span>Выполнено ({completed})</span>
          </div>
          <div className="status-bar in-progress" style={{ width: `${(inProgress/total)*100}%` }}>
            <span>В процессе ({inProgress})</span>
          </div>
          <div className="status-bar not-started" style={{ width: `${(notStarted/total)*100}%` }}>
            <span>Не начато ({notStarted})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;