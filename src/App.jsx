import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';

function App() {
  const technologies = [
    { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed' },
    { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'in-progress' },
    { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started' },
    { id: 4, title: 'React Hooks', description: 'Использование useState, useEffect', status: 'in-progress' },
    { id: 5, title: 'React Router', description: 'Маршрутизация в приложениях', status: 'not-started' }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Трекер изучения технологий</h1>
        <p>Отслеживайте свой прогресс в изучении современных технологий</p>
      </header>

      <main className="container">
        <ProgressHeader technologies={technologies} />
        
        <section className="technologies-list">
          <h2>Технологии для изучения</h2>
          {technologies.map(tech => (
            <TechnologyCard
              key={tech.id}
              title={tech.title}
              description={tech.description}
              status={tech.status}
            />
          ))}
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 Трекер технологий • Создано с React и Vite</p>
      </footer>
    </div>
  );
}

export default App;