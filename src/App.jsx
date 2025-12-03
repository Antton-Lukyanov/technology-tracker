import { useState, useEffect } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';

function App() {
  // Начальные данные с добавленным полем notes
  const initialTechnologies = [
    { id: 1, title: 'React Components', description: 'Изучение базовых компонентов React и их жизненного цикла', status: 'not-started', notes: '' },
    { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX и его отличий от HTML', status: 'not-started', notes: '' },
    { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов через useState', status: 'in-progress', notes: '' },
    { id: 4, title: 'React Hooks', description: 'Использование хуков: useEffect, useContext, useRef', status: 'not-started', notes: '' },
    { id: 5, title: 'React Router', description: 'Маршрутизация в React приложениях', status: 'not-started', notes: '' },
    { id: 6, title: 'API Integration', description: 'Работа с внешними API через fetch/axios', status: 'not-started', notes: '' },
    { id: 7, title: 'Component Libraries', description: 'Использование UI-библиотек (Material-UI, Ant Design)', status: 'completed', notes: '' },
    { id: 8, title: 'Testing', description: 'Тестирование компонентов с Jest и React Testing Library', status: 'in-progress', notes: '' }
  ];

  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Эффект для загрузки данных из localStorage при первом рендере
  useEffect(() => {
    const savedData = localStorage.getItem('techTrackerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTechnologies(parsedData);
        console.log('Данные загружены из localStorage');
      } catch (error) {
        console.error('Ошибка при загрузке данных из localStorage:', error);
      }
    }
  }, []);

  // Эффект для сохранения данных в localStorage при изменении technologies
  useEffect(() => {
    localStorage.setItem('techTrackerData', JSON.stringify(technologies));
    console.log('Данные сохранены в localStorage');
  }, [technologies]);

  const handleStatusChange = (id, newStatus) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => 
        tech.id === id ? { ...tech, status: newStatus } : tech
      )
    );
  };

  const updateTechnologyNotes = (techId, newNotes) => {
    setTechnologies(prevTech =>
      prevTech.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  const markAllAsCompleted = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  const resetAllStatuses = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  const pickRandomTech = () => {
    const notStarted = technologies.filter(t => t.status === 'not-started');
    if (notStarted.length > 0) {
      const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
      handleStatusChange(randomTech.id, 'in-progress');
      alert(`Следующая технология: "${randomTech.title}"`);
    } else {
      alert('Все технологии уже начаты или выполнены!');
    }
  };

  const clearAllNotes = () => {
    setTechnologies(prevTech =>
      prevTech.map(tech => ({ ...tech, notes: '' }))
    );
  };

  // Фильтрация по статусу и поисковому запросу
  const filteredTechnologies = technologies.filter(tech => {
    // Фильтр по статусу
    const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
    
    // Фильтр по поисковому запросу
    const searchMatch = searchQuery === '' || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  const categories = [...new Set(technologies.map(t => t.title.split(' ')[0]))];

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>Трекер изучения технологий</h1>
          <p className="header-subtitle">Кликайте на карточки для изменения статуса изучения</p>
        </div>
      </header>

      <main className="container">
        <ProgressHeader technologies={technologies} />

        <div className="quick-actions">
          <h3 className="section-title">Быстрые действия</h3>
          <div className="action-buttons">
            <button onClick={markAllAsCompleted} className="btn btn-success">
              ✅ Отметить все как выполненные
            </button>
            <button onClick={resetAllStatuses} className="btn btn-warning">
              🔄 Сбросить все статусы
            </button>
            <button onClick={pickRandomTech} className="btn btn-primary">
              🎲 Случайный выбор следующей
            </button>
            <button onClick={clearAllNotes} className="btn btn-secondary">
              🗑️ Очистить все заметки
            </button>
          </div>
        </div>

        <div className="search-box">
          <h3 className="section-title">Поиск технологий</h3>
          <div className="search-container">
            <input
              type="text"
              placeholder="Поиск по названию, описанию или заметкам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="search-info">
              <span className="search-count">Найдено: {filteredTechnologies.length}</span>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="search-clear"
                >
                  Очистить поиск
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="filters">
          <h3 className="section-title">Фильтровать по статусу</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Все ({technologies.length})
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'not-started' ? 'active' : ''}`}
              onClick={() => setActiveFilter('not-started')}
            >
              Не начатые ({technologies.filter(t => t.status === 'not-started').length})
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'in-progress' ? 'active' : ''}`}
              onClick={() => setActiveFilter('in-progress')}
            >
              В процессе ({technologies.filter(t => t.status === 'in-progress').length})
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              Выполненные ({technologies.filter(t => t.status === 'completed').length})
            </button>
          </div>
        </div>

        <section className="technologies-list">
          <div className="section-header">
            <h2 className="section-title">
              {activeFilter === 'all' ? 'Все технологии' : 
               activeFilter === 'not-started' ? 'Технологии не начатые' :
               activeFilter === 'in-progress' ? 'Технологии в процессе' :
               'Выполненные технологии'}
              {searchQuery && ` (по запросу: "${searchQuery}")`}
            </h2>
            <span className="tech-count">({filteredTechnologies.length})</span>
          </div>
          
          <div className="tech-grid">
            {filteredTechnologies.length > 0 ? (
              filteredTechnologies.map(tech => (
                <TechnologyCard
                  key={tech.id}
                  id={tech.id}
                  title={tech.title}
                  description={tech.description}
                  status={tech.status}
                  notes={tech.notes}
                  onStatusChange={handleStatusChange}
                  onNotesChange={updateTechnologyNotes}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>Нет технологий с выбранными критериями</p>
                <button className="btn btn-secondary" onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}>
                  Показать все технологии
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="categories-info">
          <h3 className="section-title">Категории технологий</h3>
          <div className="categories-list">
            {categories.map(cat => (
              <span key={cat} className="category-tag">{cat}</span>
            ))}
          </div>
        </div>

        <div className="storage-info">
          <h3 className="section-title">Информация о хранилище</h3>
          <p>Данные автоматически сохраняются в localStorage. Все заметки и статусы сохраняются после перезагрузки страницы.</p>
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Трекер технологий • Данные сохраняются в localStorage • React State Management • UseEffect</p>
      </footer>
    </div>
  );
}

export default App;