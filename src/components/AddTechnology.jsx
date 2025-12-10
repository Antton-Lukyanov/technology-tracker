// AddTechnology.jsx
import React, { useState, useEffect, useRef } from "react";
import "./AddTechnology.css";

function AddTechnology({ onAddTechnology }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "frontend",
    priority: "medium",
    deadline: "",
    notes: "",
    difficulty: "medium",
    estimatedHours: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formRef = useRef(null);
  const titleInputRef = useRef(null);
  const successMessageRef = useRef(null);

  // Категории технологий
  const categories = [
    { value: "frontend", label: "🌐 Frontend", icon: "🌐" },
    { value: "backend", label: "⚙️ Backend", icon: "⚙️" },
    { value: "database", label: "🗄️ База данных", icon: "🗄️" },
    { value: "devops", label: "🚀 DevOps", icon: "🚀" },
    { value: "mobile", label: "📱 Мобильная", icon: "📱" },
    { value: "testing", label: "🧪 Тестирование", icon: "🧪" },
    { value: "tools", label: "🛠️ Инструменты", icon: "🛠️" },
    { value: "ai", label: "🧠 AI/ML", icon: "🧠" },
    { value: "cloud", label: "☁️ Облачные технологии", icon: "☁️" },
    { value: "other", label: "📦 Другое", icon: "📦" },
  ];

  // Приоритеты в зеленых тонах
  const priorities = [
    {
      value: "low",
      label: "Низкий",
      color: "#34d399",
      icon: "🟢",
      bgColor: "rgba(52, 211, 153, 0.1)",
    },
    {
      value: "medium",
      label: "Средний",
      color: "#10b981",
      icon: "🟡",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      value: "high",
      label: "Высокий",
      color: "#059669",
      icon: "🔴",
      bgColor: "rgba(5, 150, 105, 0.1)",
    },
  ];

  // Уровни сложности в зеленых тонах
  const difficulties = [
    { value: "beginner", label: "Начальный", color: "#34d399" },
    { value: "medium", label: "Средний", color: "#10b981" },
    { value: "advanced", label: "Продвинутый", color: "#059669" },
    { value: "expert", label: "Экспертный", color: "#047857" },
  ];

  // Предлагаемые технологии
  const suggestedTechs = [
    { title: "React", category: "frontend", icon: "⚛️" },
    { title: "TypeScript", category: "frontend", icon: "📘" },
    { title: "Node.js", category: "backend", icon: "🟢" },
    { title: "Docker", category: "devops", icon: "🐳" },
    { title: "PostgreSQL", category: "database", icon: "🐘" },
    { title: "AWS", category: "cloud", icon: "☁️" },
    { title: "Python", category: "backend", icon: "🐍" },
    { title: "Next.js", category: "frontend", icon: "▲" },
  ];

  useEffect(() => {
    if (showForm && titleInputRef.current) {
      setTimeout(() => titleInputRef.current.focus(), 100);
    }
  }, [showForm]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Введите название технологии";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Минимум 2 символа";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Добавьте описание технологии";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Минимум 10 символов";
    }

    if (formData.estimatedHours && parseInt(formData.estimatedHours) < 1) {
      newErrors.estimatedHours = "Минимум 1 час";
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        newErrors.deadline = "Не может быть в прошлом";
      }
      if (deadlineDate.getFullYear() > 2030) {
        newErrors.deadline = "Слишком далекая дата";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newTechnology = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        difficulty: formData.difficulty,
        status: "not-started",
        createdAt: new Date().toISOString(),
        deadline: formData.deadline || null,
        estimatedHours: formData.estimatedHours
          ? parseInt(formData.estimatedHours)
          : null,
        notes: formData.notes.trim() || "",
        resources: [],
        progress: 0,
        lastUpdated: new Date().toISOString(),
      };

      onAddTechnology(newTechnology);

      setSubmitSuccess(true);
      successMessageRef.current?.focus();

      setTimeout(() => {
        resetForm();
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Ошибка добавления:", error);
      setErrors({ submit: "Ошибка при добавлении технологии" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectSuggested = (tech) => {
    setFormData((prev) => ({
      ...prev,
      title: tech.title,
      category: tech.category,
    }));
    titleInputRef.current?.focus();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "frontend",
      priority: "medium",
      deadline: "",
      notes: "",
      difficulty: "medium",
      estimatedHours: "",
    });
    setErrors({});
    setShowForm(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && showForm) {
      handleCancel();
    }
  };

  const getCategoryIcon = (categoryValue) => {
    const category = categories.find((cat) => cat.value === categoryValue);
    return category ? category.icon : "📦";
  };

  // Получение цвета приоритета
  const getPriorityColor = (priorityValue) => {
    const priority = priorities.find((p) => p.value === priorityValue);
    return priority ? priority.color : "#10b981";
  };

  return (
    <div className="add-technology" onKeyDown={handleKeyDown}>
      {!showForm ? (
        <button
          className="add-tech-toggle-btn"
          onClick={() => setShowForm(true)}
          aria-label="Добавить новую технологию"
        >
          <span className="plus-icon">+</span>
          <span className="btn-text">Добавить технологию</span>
          <span className="btn-hint">Начать изучение</span>
        </button>
      ) : (
        <div className="add-tech-form-container" ref={formRef}>
          {/* Заголовок формы */}
          <div className="form-header">
            <div className="header-content">
              <div className="header-icon">🌱</div>
              <div className="header-text">
                <h2 className="form-title">Добавить новую технологию</h2>
                <p className="form-subtitle">
                  Заполните информацию о технологии для изучения
                </p>
              </div>
            </div>
            <button
              className="close-form-btn"
              onClick={handleCancel}
              aria-label="Закрыть форму"
              disabled={isSubmitting}
            >
              <span className="close-icon">×</span>
            </button>
          </div>

          {/* Сообщение об успехе */}
          {submitSuccess && (
            <div
              ref={successMessageRef}
              className="success-message"
              role="alert"
              aria-live="assertive"
              tabIndex={-1}
            >
              <div className="success-content">
                <span className="success-icon">✨</span>
                <div>
                  <h4>Технология добавлена!</h4>
                  <p>Теперь вы можете отслеживать прогресс изучения</p>
                </div>
              </div>
            </div>
          )}

          {/* Быстрые предложения */}
          <div className="suggestions-section">
            <h3 className="suggestions-title">
              <span className="suggestions-icon">⚡</span>
              Популярные технологии
            </h3>
            <p className="suggestions-description">
              Выберите из популярных или добавьте свою
            </p>
            <div className="suggestions-grid">
              {suggestedTechs.map((tech, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectSuggested(tech)}
                  className="suggestion-card"
                  disabled={isSubmitting}
                >
                  <span className="tech-icon">{tech.icon}</span>
                  <span className="tech-title">{tech.title}</span>
                  <span className="tech-category">
                    {getCategoryIcon(tech.category)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="add-tech-form">
            <div className="form-sections">
              {/* Основная информация */}
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">📝</span>
                  Основная информация
                </h3>

                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    <span className="label-text">Название технологии</span>
                    <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">⚙️</span>
                    <input
                      ref={titleInputRef}
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="React, Docker, TypeScript..."
                      className={`form-input ${errors.title ? "error" : ""}`}
                      aria-required="true"
                      aria-invalid={!!errors.title}
                      aria-describedby={
                        errors.title ? "title-error" : undefined
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.title && (
                    <div
                      id="title-error"
                      className="error-message"
                      role="alert"
                    >
                      <span className="error-icon">⚠️</span>
                      {errors.title}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    <span className="label-text">Описание</span>
                    <span className="required">*</span>
                  </label>
                  <div className="textarea-wrapper">
                    <span className="textarea-icon">📄</span>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Опишите технологию, её применение и цели изучения..."
                      rows="4"
                      className={`form-textarea ${
                        errors.description ? "error" : ""
                      }`}
                      aria-required="true"
                      aria-invalid={!!errors.description}
                      aria-describedby={
                        errors.description ? "description-error" : undefined
                      }
                      disabled={isSubmitting}
                    />
                    <div className="char-count">
                      {formData.description.length}/500
                    </div>
                  </div>
                  {errors.description && (
                    <div
                      id="description-error"
                      className="error-message"
                      role="alert"
                    >
                      <span className="error-icon">⚠️</span>
                      {errors.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Классификация */}
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">🏷️</span>
                  Классификация
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">
                      <span className="label-text">Категория</span>
                    </label>
                    <div className="select-wrapper">
                      <span className="select-icon">📂</span>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-select"
                        disabled={isSubmitting}
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <span className="select-arrow">▼</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-text">Сложность</span>
                    </label>
                    <div className="radio-group">
                      {difficulties.map((diff) => (
                        <label key={diff.value} className="radio-option">
                          <input
                            type="radio"
                            name="difficulty"
                            value={diff.value}
                            checked={formData.difficulty === diff.value}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                          <span
                            className="radio-custom"
                            style={{ "--difficulty-color": diff.color }}
                          >
                            <span className="radio-dot"></span>
                          </span>
                          <span className="radio-label">{diff.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-text">Приоритет изучения</span>
                  </label>
                  <div className="priority-buttons">
                    {priorities.map((pri) => (
                      <button
                        key={pri.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            priority: pri.value,
                          }))
                        }
                        className={`priority-btn ${
                          formData.priority === pri.value ? "selected" : ""
                        }`}
                        style={{
                          "--priority-color": pri.color,
                          "--priority-bg": pri.bgColor,
                        }}
                        disabled={isSubmitting}
                      >
                        <span className="priority-icon">{pri.icon}</span>
                        <span className="priority-label">{pri.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Планирование */}
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">📅</span>
                  Планирование
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="estimatedHours" className="form-label">
                      <span className="label-text">
                        Примерное время изучения (часов)
                      </span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">⏱️</span>
                      <input
                        type="number"
                        id="estimatedHours"
                        name="estimatedHours"
                        value={formData.estimatedHours}
                        onChange={handleChange}
                        placeholder="Например: 40"
                        min="1"
                        max="1000"
                        className={`form-input ${
                          errors.estimatedHours ? "error" : ""
                        }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.estimatedHours && (
                      <div className="error-message" role="alert">
                        <span className="error-icon">⚠️</span>
                        {errors.estimatedHours}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="deadline" className="form-label">
                      <span className="label-text">Дедлайн изучения</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">📅</span>
                      <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className={`form-input ${
                          errors.deadline ? "error" : ""
                        }`}
                        min={new Date().toISOString().split("T")[0]}
                        max="2030-12-31"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.deadline && (
                      <div className="error-message" role="alert">
                        <span className="error-icon">⚠️</span>
                        {errors.deadline}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes" className="form-label">
                    <span className="label-text">Дополнительные заметки</span>
                  </label>
                  <div className="textarea-wrapper">
                    <span className="textarea-icon">💭</span>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Ресурсы для изучения, ссылки, полезные советы..."
                      rows="3"
                      className="form-textarea"
                      disabled={isSubmitting}
                    />
                    <div className="char-count">
                      {formData.notes.length}/1000
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Действия формы */}
            <div className="form-actions">
              <div className="action-info">
                <div className="form-stats">
                  <span className="stats-item">
                    <span className="stats-icon">📊</span>
                    <span className="stats-text">
                      Заполнено:{" "}
                      {
                        Object.values(formData).filter((val) =>
                          val.toString().trim()
                        ).length
                      }
                      /{Object.keys(formData).length} полей
                    </span>
                  </span>
                </div>
                <div className="required-hint">
                  <span className="required">*</span> Обязательные поля
                </div>
              </div>

              <div className="action-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <span className="btn-icon">←</span>
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Добавление...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🌱</span>
                      Добавить технологию
                    </>
                  )}
                </button>
              </div>
            </div>

            
          </form>
        </div>
      )}
    </div>
  );
}

export default AddTechnology;
