import { useState } from 'react';
import Modal from '../Modal/Modal';
import './QuickActions.css';

function QuickActions({ 
  onMarkAllCompleted, 
  onResetAll, 
  onClearAllNotes,
  onPickRandomTech,
  technologies,
  categoryStats 
}) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [exportData, setExportData] = useState('');

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      technologies: technologies,
      summary: {
        total: technologies.length,
        completed: technologies.filter(t => t.status === 'completed').length,
        inProgress: technologies.filter(t => t.status === 'in-progress').length,
        notStarted: technologies.filter(t => t.status === 'not-started').length,
        categories: categoryStats
      }
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    setExportData(dataStr);
    setShowExportModal(true);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportData)
      .then(() => alert('Данные скопированы в буфер обмена!'))
      .catch(err => console.error('Ошибка копирования:', err));
  };

  const handleDownload = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRandomPick = () => {
    const randomTech = onPickRandomTech();
    if (randomTech) {
      alert(`Следующая технология для изучения: "${randomTech.title}"`);
    } else {
      alert('Все технологии уже начаты или выполнены!');
    }
  };

  return (
    <div className="quick-actions">
      <h3 className="section-title">Быстрые действия</h3>
      <div className="action-buttons">
        <button onClick={onMarkAllCompleted} className="btn btn-success">
          ✅ Отметить все как выполненные
        </button>
        <button onClick={onResetAll} className="btn btn-warning">
          🔄 Сбросить все статусы
        </button>
        <button onClick={handleRandomPick} className="btn btn-primary">
          🎲 Случайный выбор следующей
        </button>
        <button onClick={onClearAllNotes} className="btn btn-secondary">
          🗑️ Очистить все заметки
        </button>
        <button onClick={handleExport} className="btn btn-info">
          📤 Экспорт данных
        </button>
        <button onClick={() => setShowStatsModal(true)} className="btn btn-stats">
          📊 Статистика по категориям
        </button>
      </div>

      {/* Модальное окно экспорта */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
        size="large"
      >
        <div className="export-modal-content">
          <p>Данные успешно подготовлены для экспорта!</p>
          <div className="export-actions">
            <button onClick={handleCopyToClipboard} className="btn btn-secondary">
              📋 Копировать в буфер обмена
            </button>
            <button onClick={handleDownload} className="btn btn-success">
              💾 Скачать как JSON
            </button>
          </div>
          <div className="export-preview">
            <h4>Предпросмотр данных:</h4>
            <pre className="export-data">{exportData}</pre>
          </div>
          <button 
            onClick={() => setShowExportModal(false)}
            className="btn btn-close-modal"
          >
            Закрыть
          </button>
        </div>
      </Modal>

      {/* Модальное окно статистики */}
      <Modal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        title="Статистика по категориям"
        size="medium"
      >
        <div className="stats-modal-content">
          <div className="stats-grid">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
              return (
                <div key={category} className="stat-card">
                  <div className="stat-header">
                    <span className="stat-category">{category}</span>
                    <span className="stat-progress">{progress}%</span>
                  </div>
                  <div className="stat-bar">
                    <div 
                      className="stat-bar-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="stat-numbers">
                    <span>{stats.completed} / {stats.total} выполнено</span>
                  </div>
                </div>
              );
            })}
          </div>
          <button 
            onClick={() => setShowStatsModal(false)}
            className="btn btn-close-modal"
          >
            Закрыть
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default QuickActions;