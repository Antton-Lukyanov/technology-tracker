import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  const total = technologies.length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-header">
      <h2>📊 Прогресс изучения</h2>
      <div className="stats">
        <div className="stat">
          <span className="number">{total}</span>
          <span className="label">Всего технологий</span>
        </div>
        <div className="stat">
          <span className="number">{completed}</span>
          <span className="label">Изучено</span>
        </div>
        <div className="stat">
          <span className="number">{progressPercent}%</span>
          <span className="label">Прогресс</span>
        </div>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressHeader;