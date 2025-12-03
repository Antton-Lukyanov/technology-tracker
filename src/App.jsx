import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';

function App() {
  const [technologies, setTechnologies] = useState([
    { id: 1, title: 'React Components', description: 'Изучение базовых компонентов React и их жизненного цикла', status: 'not-started' },
    { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX и его отличий от HTML', status: 'not-started' },
    { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов через useState', status: 'in-progress' },
    { id: 4, title: 'React Hooks', description: 'Использование хуков: useEffect, useContext, useRef', status: 'not-started' },
    { id: 5, title: 'React Router', description: 'Маршрутизация в React приложениях', status: 'not-started' },
    { id: 6, title: 'API Integration', description: 'Работа с внешними API через fetch/axios', status: 'not-started' },
    { id: 7, title: 'Component Libraries', description: 'Использование UI-библиотек (Material-UI, Ant Design)', status: 'completed' },
    { id: 8, title: 'Testing', description: 'Тестирование компонентов с Jest и React Testing Library', status: 'in-progress' }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  const handleStatusChange = (id, newStatus) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => 
        tech.id === id ? { ...tech, status: newStatus } : tech
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

  const filteredTechnologies = technologies.filter(tech => {
    if (activeFilter === 'all') return true;
    return tech.status === activeFilter;
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
              Отметить все как выполненные
            </button>
            <button onClick={resetAllStatuses} className="btn btn-warning">
              Сбросить все статусы
            </button>
            <button onClick={pickRandomTech} className="btn btn-primary">
              Случайный выбор следующей
            </button>
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
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>Нет технологий с выбранным статусом</p>
                <button className="btn btn-secondary" onClick={() => setActiveFilter('all')}>
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
      </main>

      <footer className="footer">
        <p>© 2025 Трекер технологий • Кликайте на карточки для изменения статуса • React State Management</p>
      </footer>
    </div>
  );
}

export default App;