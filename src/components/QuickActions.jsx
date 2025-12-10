// components/QuickActions.jsx
import React from "react";
import "./QuickActions.css";

function QuickActions({
  technologies,
  onMarkAllCompleted,
  onResetAll,
  onRandomSelect,
}) {
  const notStartedCount = technologies.filter(
    (t) => t.status === "not-started"
  ).length;
  const inProgressCount = technologies.filter(
    (t) => t.status === "in-progress"
  ).length;
  const completedCount = technologies.filter(
    (t) => t.status === "completed"
  ).length;

  return (
    <div className="quick-actions">
      <h3>Быстрые действия</h3>
      <div className="action-buttons">
        <button
          className="action-btn complete-all"
          onClick={onMarkAllCompleted}
          disabled={completedCount === technologies.length}
        >
          Завершить все
          <span>Отметить все как изученные</span>
        </button>

        <button
          className="action-btn reset-all"
          onClick={onResetAll}
          disabled={completedCount === 0 && inProgressCount === 0}
        >
          Сбросить все
          <span>Вернуть все в "Не начато"</span>
        </button>

        <button
          className="action-btn random-select"
          onClick={onRandomSelect}
          disabled={notStartedCount === 0}
        >
          Случайный выбор
          <span>Начать случайную технологию</span>
        </button>
      </div>
    </div>
  );
}

export default QuickActions;
