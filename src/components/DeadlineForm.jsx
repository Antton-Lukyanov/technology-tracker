// components/DeadlineForm.jsx
import { useState, useEffect, useRef } from "react";
import "./DeadlineForm.css";

function DeadlineForm({ technologies, onSaveDeadlines, onCancel }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);

  // Для управления фокусом и доступностью
  const firstInputRef = useRef(null);
  const successMessageRef = useRef(null);

  // Инициализация формы
  useEffect(() => {
    const initialData = {};
    technologies.forEach((tech) => {
      if (tech.deadline) {
        initialData[tech.id] = tech.deadline;
      }
    });
    setFormData(initialData);

    // Фокус на первом поле для навигации с клавиатуры
    if (firstInputRef.current) {
      setTimeout(() => firstInputRef.current.focus(), 100);
    }
  }, [technologies]);

  // Валидация в реальном времени
  const validateField = (techId, value) => {
    const newErrors = { ...errors };

    if (value) {
      const deadlineDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Проверки
      if (deadlineDate < today) {
        newErrors[techId] = "Дедлайн не может быть в прошлом";
      } else if (deadlineDate.getFullYear() > 2030) {
        newErrors[techId] = "Слишком далекая дата (максимум 2030 год)";
      } else {
        delete newErrors[techId];
      }
    } else {
      delete newErrors[techId];
    }

    setErrors(newErrors);
  };

  const handleDateChange = (techId, value) => {
    const newFormData = { ...formData, [techId]: value };
    setFormData(newFormData);
    validateField(techId, value);
    setSelectedTech(techId);
  };

  const handleClearDate = (techId) => {
    const newFormData = { ...formData };
    delete newFormData[techId];
    setFormData(newFormData);

    const newErrors = { ...errors };
    delete newErrors[techId];
    setErrors(newErrors);
  };

  const handleClearAll = () => {
    setFormData({});
    setErrors({});
  };

  const handleAutoSetDeadlines = () => {
    const newFormData = { ...formData };
    const today = new Date();

    technologies.forEach((tech, index) => {
      const deadlineDate = new Date(today);
      // Добавляем дни в зависимости от сложности или порядка
      deadlineDate.setDate(today.getDate() + (index + 1) * 7); // +1, +2, +3 недели и т.д.
      newFormData[tech.id] = deadlineDate.toISOString().split("T")[0];
    });

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка всех полей перед отправкой
    const validationErrors = {};
    Object.entries(formData).forEach(([techId, date]) => {
      validateField(techId, date);
      if (errors[techId]) {
        validationErrors[techId] = errors[techId];
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      // Фокус на первом поле с ошибкой
      const firstErrorId = Object.keys(validationErrors)[0];
      document.getElementById(`deadline-${firstErrorId}`)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      // Имитация API запроса
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Вызываем callback родителя
      onSaveDeadlines(formData);

      setSubmitSuccess(true);
      successMessageRef.current?.focus();

      // Автоматическое скрытие сообщения об успехе
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработчик клавиатуры для доступности
  const handleKeyDown = (e, techId) => {
    // Enter на кнопке очистки
    if (e.key === "Enter" && e.target.type === "button") {
      handleClearDate(techId);
    }

    // Escape закрывает форму
    if (e.key === "Escape" && onCancel) {
      onCancel();
    }
  };

  // Подсчет статистики
  const getStats = () => {
    const total = technologies.length;
    const withDeadlines = Object.keys(formData).length;
    const withoutDeadlines = total - withDeadlines;

    return { total, withDeadlines, withoutDeadlines };
  };

  const stats = getStats();

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      className="deadline-form-container"
      role="form"
      aria-label="Форма установки сроков изучения"
    >
      {/* Область для объявлений скринридера */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isSubmitting && "Сохраняем дедлайны..."}
        {submitSuccess && "Дедлайны успешно сохранены!"}
      </div>

      {/* Сообщение об успехе */}
      {submitSuccess && (
        <div
          ref={successMessageRef}
          className="success-message"
          role="alert"
          tabIndex={-1}
          aria-live="assertive"
        >
          <div className="success-content">
            <span className="success-icon">✅</span>
            <div>
              <h4>Успешно сохранено!</h4>
              <p>Дедлайны установлены для {stats.withDeadlines} технологий</p>
            </div>
          </div>
        </div>
      )}

      <div className="deadline-form-header">
        <div className="form-title-section">
          <h2 className="form-title">
            <span className="form-title-icon">📅</span>
            Установите сроки изучения
          </h2>
          <p className="form-subtitle">
            Планируйте свой прогресс обучения, устанавливая реалистичные сроки
            для каждой технологии
          </p>
        </div>

        <div className="form-stats">
          <div className="stats-cards">
            <div className="stat-card total">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Всего</div>
            </div>
            <div className="stat-card set">
              <div className="stat-number">{stats.withDeadlines}</div>
              <div className="stat-label">Установлено</div>
            </div>
            <div className="stat-card remaining">
              <div className="stat-number">{stats.withoutDeadlines}</div>
              <div className="stat-label">Осталось</div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="deadline-form" noValidate>
        {/* Панель быстрых действий */}
        <div className="quick-actions">
          <button
            type="button"
            onClick={handleAutoSetDeadlines}
            className="btn-quick-action"
            title="Автоматически установить дедлайны с интервалом в 1 неделю"
          >
            <span className="action-icon">⚡</span>
            Авто-сроки
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="btn-quick-action"
            disabled={Object.keys(formData).length === 0}
            title="Очистить все установленные сроки"
          >
            <span className="action-icon">🗑️</span>
            Очистить все
          </button>
        </div>

        <div className="technologies-list">
          <div className="list-header">
            <div className="header-col tech-info-header">Технология</div>
            <div className="header-col date-header">Дедлайн</div>
            <div className="header-col actions-header">Действия</div>
          </div>

          <div className="list-body">
            {technologies.map((tech, index) => {
              const hasDeadline = formData[tech.id];
              const isError = errors[tech.id];
              const isSelected = selectedTech === tech.id;

              return (
                <div
                  key={tech.id}
                  className={`technology-item ${isSelected ? "selected" : ""} ${
                    isError ? "error" : ""
                  }`}
                  onClick={() => setSelectedTech(tech.id)}
                >
                  <div className="tech-info">
                    <div className="tech-main">
                      <span className="tech-number">#{index + 1}</span>
                      <div className="tech-title-section">
                        <h3 className="tech-title">{tech.title}</h3>
                        {tech.category && (
                          <span className="tech-category">{tech.category}</span>
                        )}
                      </div>
                    </div>
                    <div className="tech-meta">
                      <span className={`tech-status ${tech.status}`}>
                        <span className="status-dot"></span>
                        {tech.status === "completed"
                          ? "Изучено"
                          : tech.status === "in-progress"
                          ? "В процессе"
                          : "Не начато"}
                      </span>
                      {tech.priority && (
                        <span
                          className={`tech-priority priority-${tech.priority}`}
                        >
                          {tech.priority === "high"
                            ? "Высокий"
                            : tech.priority === "medium"
                            ? "Средний"
                            : "Низкий"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="date-field">
                    <div className="input-wrapper">
                      <input
                        id={`deadline-${tech.id}`}
                        type="date"
                        value={formData[tech.id] || ""}
                        onChange={(e) =>
                          handleDateChange(tech.id, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, tech.id)}
                        className={`date-input ${
                          errors[tech.id] ? "error" : ""
                        }`}
                        aria-required="false"
                        aria-invalid={!!errors[tech.id]}
                        aria-describedby={
                          errors[tech.id] ? `error-${tech.id}` : undefined
                        }
                        ref={index === 0 ? firstInputRef : null}
                        min={new Date().toISOString().split("T")[0]}
                        max="2030-12-31"
                        placeholder="Выберите дату"
                      />
                      <span className="calendar-icon">📅</span>
                    </div>

                    {formData[tech.id] && !errors[tech.id] && (
                      <div className="date-preview">
                        <span className="date-icon">📌</span>
                        <span className="date-formatted">
                          {formatDate(formData[tech.id])}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="tech-actions">
                    {hasDeadline ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleClearDate(tech.id)}
                          className="btn-action clear"
                          aria-label={`Очистить дедлайн для ${tech.title}`}
                          title="Очистить срок"
                        >
                          <span className="action-icon">✕</span>
                        </button>
                        {!errors[tech.id] && (
                          <button
                            type="button"
                            className="btn-action preview"
                            onClick={() =>
                              alert(
                                `Дедлайн для "${tech.title}": ${formatDate(
                                  formData[tech.id]
                                )}`
                              )
                            }
                            title="Посмотреть дату"
                          >
                            <span className="action-icon">👁️</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="no-deadline">Не установлен</span>
                    )}
                  </div>

                  {errors[tech.id] && (
                    <div className="error-row">
                      <div
                        id={`error-${tech.id}`}
                        className="error-message"
                        role="alert"
                        aria-live="polite"
                      >
                        <span className="error-icon">⚠️</span>
                        {errors[tech.id]}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-footer">
          <div className="footer-actions">
            <button
              type="submit"
              className="btn-primary save-btn"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Сохранение...
                </>
              ) : (
                <>
                  <span className="btn-icon">💾</span>
                  Сохранить все дедлайны
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary cancel-btn"
              disabled={isSubmitting}
            >
              <span className="btn-icon">←</span>
              Отмена
            </button>
          </div>

          <div className="footer-hints">
            <div className="hint-item">
              <span className="hint-icon">💡</span>
              <span className="hint-text">
                Нажмите на строку с технологией для быстрого выбора
              </span>
            </div>
            <div className="hint-item">
              <span className="hint-icon">📊</span>
              <span className="hint-text">
                Установлено {stats.withDeadlines} из {stats.total} сроков
                {stats.withDeadlines === stats.total && " 🎉"}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default DeadlineForm;
