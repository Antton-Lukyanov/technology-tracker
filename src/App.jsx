import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions/QuickActions';
import useTechnologies from './hooks/useTechnologies';

function App() {
  const {
    technologies,
    updateStatus,
    updateNotes,
    markAllAsCompleted,
    resetAllStatuses,
    clearAllNotes,
    pickRandomTech,
    progress,
    categoryStats
  } = useTechnologies();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const categories = [...new Set(technologies.map(t => t.category || 'other'))];

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>Трекер изучения технологий</h1>
          <p className="header-subtitle">Используйте переиспользуемые компоненты и кастомные хуки</p>
        </div>
      </header>

      <main className="container">
        <ProgressHeader technologies={technologies} progress={progress} />

        <QuickActions
          onMarkAllCompleted={markAllAsCompleted}
          onResetAll={resetAllStatuses}
          onClearAllNotes={clearAllNotes}
          onPickRandomTech={pickRandomTech}
          technologies={technologies}
          categoryStats={categoryStats}
        />

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
                  onStatusChange={updateStatus}
                  onNotesChange={updateNotes}
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
          <p>Данные автоматически сохраняются в localStorage с использованием кастомного хука useLocalStorage. Все заметки и статусы сохраняются после перезагрузки страницы.</p>
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Трекер технологий • Кастомные хуки и переиспользуемые компоненты • React State Management</p>
      </footer>
    </div>
  );
}

export default App;