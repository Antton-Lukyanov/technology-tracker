import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
  { id: 1, title: 'React Components', description: 'Изучение базовых компонентов React и их жизненного цикла', status: 'not-started', notes: '', category: 'frontend' },
  { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX и его отличий от HTML', status: 'not-started', notes: '', category: 'frontend' },
  { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов через useState', status: 'in-progress', notes: '', category: 'frontend' },
  { id: 4, title: 'React Hooks', description: 'Использование хуков: useEffect, useContext, useRef', status: 'not-started', notes: '', category: 'frontend' },
  { id: 5, title: 'React Router', description: 'Маршрутизация в React приложениях', status: 'not-started', notes: '', category: 'frontend' },
  { id: 6, title: 'API Integration', description: 'Работа с внешними API через fetch/axios', status: 'not-started', notes: '', category: 'backend' },
  { id: 7, title: 'Component Libraries', description: 'Использование UI-библиотек (Material-UI, Ant Design)', status: 'completed', notes: '', category: 'frontend' },
  { id: 8, title: 'Testing', description: 'Тестирование компонентов с Jest и React Testing Library', status: 'in-progress', notes: '', category: 'testing' }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

  // Функция для обновления статуса технологии
  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // Функция для обновления заметок
  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // Функция для расчета общего прогресса
  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  // Функция для отметки всех как выполненные
  const markAllAsCompleted = () => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // Функция для сброса всех статусов
  const resetAllStatuses = () => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  // Функция для очистки всех заметок
  const clearAllNotes = () => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, notes: '' }))
    );
  };

  // Функция для случайного выбора технологии
  const pickRandomTech = () => {
    const notStarted = technologies.filter(t => t.status === 'not-started');
    if (notStarted.length > 0) {
      const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
      updateStatus(randomTech.id, 'in-progress');
      return randomTech;
    }
    return null;
  };

  // Функция для получения статистики по категориям
  const getCategoryStats = () => {
    const categories = {};
    technologies.forEach(tech => {
      const category = tech.category || 'other';
      if (!categories[category]) {
        categories[category] = { total: 0, completed: 0 };
      }
      categories[category].total++;
      if (tech.status === 'completed') {
        categories[category].completed++;
      }
    });
    return categories;
  };

  return {
    technologies,
    setTechnologies,
    updateStatus,
    updateNotes,
    markAllAsCompleted,
    resetAllStatuses,
    clearAllNotes,
    pickRandomTech,
    progress: calculateProgress(),
    categoryStats: getCategoryStats()
  };
}

export default useTechnologies;