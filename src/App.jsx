import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';

function App() {
  // Состояние для массива технологий
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

  // Состояние для активного фильтра
  const [activeFilter, setActiveFilter] = useState('all');

  // Функция для изменения статуса технологии
  const handleStatusChange = (id, newStatus) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => 
        tech.id === id ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // Быстрые действия
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
      alert(`🎯 Следующая технология: "${randomTech.title}"`);
    } else {
      alert('🎉 Все технологии уже начаты или выполнены!');
    }
  };

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
    if (activeFilter === 'all') return true;
    return tech.status === activeFilter;
  });

  // Получение уникальных категорий (для статистики)
  const categories = [...new Set(technologies.map(t => t.title.split(' ')[0]))];

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Трекер изучения технологий</h1>
        <p>Кликайте на карточки для изменения статуса изучения</p>
      </header>

      <main className="container">
        {/* Компонент статистики */}
        <ProgressHeader technologies={technologies} />

        {/* Быстрые действия */}
        <div className="quick-actions">
          <h3>⚡ Быстрые действия</h3>
          <div className="action-buttons">
            <button onClick={markAllAsCompleted} className="btn-success">
              ✅ Отметить все как выполненные
            </button>
            <button onClick={resetAllStatuses} className="btn-warning">
              🔄 Сбросить все статусы
            </button>
            <button onClick={pickRandomTech} className="btn-primary">
              🎲 Случайный выбор следующей
            </button>
          </div>
        </div>

        {/* Фильтры */}
        <div className="filters">
          <h3>🔍 Фильтровать по статусу:</h3>
          <div className="filter-buttons">
            <button 
              className={activeFilter === 'all' ? 'active' : ''}
              onClick={() => setActiveFilter('all')}
            >
              Все ({technologies.length})
            </button>
            <button 
              className={activeFilter === 'not-started' ? 'active' : ''}
              onClick={() => setActiveFilter('not-started')}
            >
              Не начатые ({technologies.filter(t => t.status === 'not-started').length})
            </button>
            <button 
              className={activeFilter === 'in-progress' ? 'active' : ''}
              onClick={() => setActiveFilter('in-progress')}
            >
              В процессе ({technologies.filter(t => t.status === 'in-progress').length})
            </button>
            <button 
              className={activeFilter === 'completed' ? 'active' : ''}
              onClick={() => setActiveFilter('completed')}
            >
              Выполненные ({technologies.filter(t => t.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Список технологий */}
        <section className="technologies-list">
          <h2>
            {activeFilter === 'all' ? 'Все технологии' : 
             activeFilter === 'not-started' ? 'Технологии не начатые' :
             activeFilter === 'in-progress' ? 'Технологии в процессе' :
             'Выполненные технологии'}
            <span className="tech-count"> ({filteredTechnologies.length})</span>
          </h2>
          
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
                <p>📭 Нет технологий с выбранным статусом</p>
                <button onClick={() => setActiveFilter('all')}>
                  Показать все технологии
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Информация о категориях */}
        <div className="categories-info">
          <h3>📂 Категории технологий:</h3>
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