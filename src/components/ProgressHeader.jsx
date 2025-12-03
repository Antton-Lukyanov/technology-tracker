import './ProgressHeader.css';
import ProgressBar from './ProgressBar/ProgressBar';

function ProgressHeader({ technologies, progress }) {
  const total = technologies.length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const inProgress = technologies.filter(t => t.status === 'in-progress').length;
  const notStarted = technologies.filter(t => t.status === 'not-started').length;
  
  // Используем переданный progress или рассчитываем сами
  const progressPercent = progress !== undefined ? progress : (total > 0 ? Math.round((completed / total) * 100) : 0);

  const statusCounts = { 
    completed, 
    'in-progress': inProgress, 
    'not-started': notStarted 
  };
  
  const mostPopularStatus = Object.keys(statusCounts).reduce((a, b) => 
    statusCounts[a] > statusCounts[b] ? a : b
  );
  
  const statusLabels = {
    'completed': 'Выполнено',
    'in-progress': 'В процессе', 
    'not-started': 'Не начато'
  };

  // Рассчитываем процент для каждой категории
  const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressPercent = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const notStartedPercent = total > 0 ? Math.round((notStarted / total) * 100) : 0;

  return (
    <div className="progress-header">
      <h2>Статистика изучения</h2>
      
      {/* Общий прогресс-бар */}
      <div className="overall-progress">
        <ProgressBar
          progress={progressPercent}
          label="Общий прогресс изучения"
          color="#3498db"
          height={20}
          showPercentage={true}
          animated={true}
        />
      </div>
      
      {/* Статистические карточки */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <span className="stat-number">{total}</span>
          <span className="stat-label">Всего технологий</span>
        </div>
        
        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <span className="stat-number">{completed}</span>
          <span className="stat-label">Выполнено</span>
          <span className="stat-percent">{completedPercent}%</span>
        </div>
        
        <div className="stat-card in-progress">
          <div className="stat-icon">⏳</div>
          <span className="stat-number">{inProgress}</span>
          <span className="stat-label">В процессе</span>
          <span className="stat-percent">{inProgressPercent}%</span>
        </div>
        
        <div className="stat-card not-started">
          <div className="stat-icon">⭕</div>
          <span className="stat-number">{notStarted}</span>
          <span className="stat-label">Не начато</span>
          <span className="stat-percent">{notStartedPercent}%</span>
        </div>
      </div>

      {/* Дополнительная информация о статусах */}
      <div className="progress-section">
        <div className="progress-info">
          <span>
            Наиболее частый статус: 
            <strong> {statusLabels[mostPopularStatus]} ({statusCounts[mostPopularStatus]})</strong>
          </span>
          <span>
            Соотношение: 
            <strong> {completed} : {inProgress} : {notStarted}</strong>
          </span>
        </div>
      </div>

      {/* Визуализация распределения по статусам */}
      <div className="status-distribution">
        <h3>Распределение по статусам</h3>
        <div className="status-bars">
          {completed > 0 && (
            <div 
              className="status-bar completed" 
              style={{ 
                width: `${completedPercent}%`,
                display: completedPercent > 0 ? 'flex' : 'none'
              }}
              title={`Выполнено: ${completed} (${completedPercent}%)`}
            >
              <span>{completedPercent > 15 ? 'Выполнено' : ''}</span>
            </div>
          )}
          
          {inProgress > 0 && (
            <div 
              className="status-bar in-progress" 
              style={{ 
                width: `${inProgressPercent}%`,
                display: inProgressPercent > 0 ? 'flex' : 'none'
              }}
              title={`В процессе: ${inProgress} (${inProgressPercent}%)`}
            >
              <span>{inProgressPercent > 15 ? 'В процессе' : ''}</span>
            </div>
          )}
          
          {notStarted > 0 && (
            <div 
              className="status-bar not-started" 
              style={{ 
                width: `${notStartedPercent}%`,
                display: notStartedPercent > 0 ? 'flex' : 'none'
              }}
              title={`Не начато: ${notStarted} (${notStartedPercent}%)`}
            >
              <span>{notStartedPercent > 15 ? 'Не начато' : ''}</span>
            </div>
          )}
        </div>
        
        {/* Легенда под графиком */}
        <div className="status-legend">
          <div className="legend-item">
            <span className="legend-color completed"></span>
            <span className="legend-text">Выполнено ({completed})</span>
          </div>
          <div className="legend-item">
            <span className="legend-color in-progress"></span>
            <span className="legend-text">В процессе ({inProgress})</span>
          </div>
          <div className="legend-item">
            <span className="legend-color not-started"></span>
            <span className="legend-text">Не начато ({notStarted})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;