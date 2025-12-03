import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  const total = technologies.length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const inProgress = technologies.filter(t => t.status === 'in-progress').length;
  const notStarted = technologies.filter(t => t.status === 'not-started').length;
  
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

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
      <h2>Статистика изучения</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">📊</div>
          <span className="stat-number">{total}</span>
          <span className="stat-label">Всего технологий</span>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">✅</div>
          <span className="stat-number">{completed}</span>
          <span className="stat-label">Выполнено</span>
          <span className="stat-percent">{progressPercent}%</span>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon in-progress">⏳</div>
          <span className="stat-number">{inProgress}</span>
          <span className="stat-label">В процессе</span>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon not-started">⭕</div>
          <span className="stat-number">{notStarted}</span>
          <span className="stat-label">Не начато</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <span>Общий прогресс: <strong>{progressPercent}%</strong></span>
          <span>Наиболее частый статус: <strong>{statusLabels[mostPopularStatus]}</strong></span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="status-distribution">
        <h3>Распределение по статусам</h3>
        <div className="status-bars">
          <div 
            className="status-bar completed" 
            style={{ width: `${(completed/total)*100}%` }}
            data-count={completed}
          >
            <span>Выполнено</span>
          </div>
          <div 
            className="status-bar in-progress" 
            style={{ width: `${(inProgress/total)*100}%` }}
            data-count={inProgress}
          >
            <span>В процессе</span>
          </div>
          <div 
            className="status-bar not-started" 
            style={{ width: `${(notStarted/total)*100}%` }}
            data-count={notStarted}
          >
            <span>Не начато</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;