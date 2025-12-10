// components/BulkStatusEditor.jsx
import { useState, useEffect, useRef } from "react";
import "./BulkStatusEditor.css";

function BulkStatusEditor({ technologies, onUpdateStatuses, onClose }) {
  // Состояния
  const [selectedIds, setSelectedIds] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [actionConfirmed, setActionConfirmed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTechs, setFilteredTechs] = useState([]);

  // Рефы для доступности
  const mainHeadingRef = useRef(null);
  const searchInputRef = useRef(null);
  const applyButtonRef = useRef(null);
  const successMessageRef = useRef(null);

  // Инициализация и фильтрация
  useEffect(() => {
    mainHeadingRef.current?.focus();
    setFilteredTechs(technologies);
    if (!newStatus) setNewStatus("in-progress");
  }, [technologies]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTechs(technologies);
    } else {
      const filtered = technologies.filter(
        (tech) =>
          tech.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tech.description &&
            tech.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (tech.category &&
            tech.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredTechs(filtered);
    }
  }, [searchTerm, technologies]);

  // Обработчики выбора
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTechs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTechs.map((tech) => tech.id));
    }
  };

  const toggleTechnology = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((techId) => techId !== id) : [...prev, id]
    );
  };

  const selectByStatus = (status) => {
    const ids = filteredTechs
      .filter((tech) => tech.status === status)
      .map((tech) => tech.id);
    setSelectedIds(ids);
  };

  // Валидация
  const validateForm = () => {
    const newErrors = {};
    if (selectedIds.length === 0)
      newErrors.selected = "Выберите хотя бы одну технологию";
    if (!newStatus) newErrors.status = "Выберите новый статус";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Применение изменений
  const handleApplyChanges = async () => {
    if (!validateForm()) return;

    if (!actionConfirmed && selectedIds.length > 3) {
      const confirmed = window.confirm(
        `Вы собираетесь изменить статус ${
          selectedIds.length
        } технологий на "${getStatusText(newStatus)}". Продолжить?`
      );
      if (!confirmed) return;
      setActionConfirmed(true);
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updates = selectedIds.map((id) => ({
        id,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      }));

      onUpdateStatuses(updates);
      successMessageRef.current?.focus();

      setTimeout(() => {
        setSelectedIds([]);
        setIsSubmitting(false);
        setActionConfirmed(false);
      }, 3000);
    } catch (error) {
      console.error("Ошибка обновления:", error);
      setErrors({ submit: "Ошибка при сохранении изменений" });
      setIsSubmitting(false);
    }
  };

  // Обработчики клавиатуры
  const handleKeyDown = (e, action) => {
    switch (e.key) {
      case "Escape":
        if (onClose) onClose();
        break;
      case "Enter":
        if (action === "apply" && !isSubmitting) {
          handleApplyChanges();
        }
        break;
      case "/":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
        break;
    }
  };

  // Получение текста статуса
  const getStatusText = (status) => {
    const statusMap = {
      "not-started": "Не начато",
      "in-progress": "В процессе",
      completed: "Завершено",
    };
    return statusMap[status] || status;
  };

  // Получение иконки статуса
  const getStatusIcon = (status) => {
    const iconMap = {
      "not-started": "⭕",
      "in-progress": "⏳",
      completed: "✅",
    };
    return iconMap[status] || "📋";
  };

  // Получение цвета статуса
  const getStatusColor = (status) => {
    const colorMap = {
      "not-started": "#6b7280",
      "in-progress": "#f59e0b",
      completed: "#10b981",
    };
    return colorMap[status] || "#6b7280";
  };

  // Получение прогресса
  const getSelectionStats = () => {
    const total = filteredTechs.length;
    const selected = selectedIds.length;
    const byStatus = filteredTechs.reduce((acc, tech) => {
      acc[tech.status] = (acc[tech.status] || 0) + 1;
      return acc;
    }, {});

    return { total, selected, byStatus };
  };

  const stats = getSelectionStats();

  return (
    <div
      className="bulk-status-editor"
      role="dialog"
      aria-labelledby="bulk-edit-title"
      aria-describedby="bulk-edit-description"
      onKeyDown={(e) => handleKeyDown(e)}
    >
      {/* Область для скринридера */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isSubmitting && `Изменяем статусы ${selectedIds.length} технологий...`}
      </div>

      {/* Заголовок */}
      <div className="editor-header">
        <div className="header-content">
          <div className="title-section">
            <h2
              id="bulk-edit-title"
              ref={mainHeadingRef}
              tabIndex={-1}
              className="editor-title"
            >
              <span className="title-icon">🚀</span>
              Массовое редактирование статусов
            </h2>
            <p id="bulk-edit-description" className="description">
              Выберите технологии и установите для них новый статус
            </p>
          </div>

          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Всего</div>
            </div>
            <div className="stat-card primary">
              <div className="stat-value">{stats.selected}</div>
              <div className="stat-label">Выбрано</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {stats.total > 0
                  ? Math.round((stats.selected / stats.total) * 100)
                  : 0}
                %
              </div>
              <div className="stat-label">Прогресс</div>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            onClick={() => searchInputRef.current?.focus()}
            className="btn-search"
            aria-label="Поиск по технологиям"
          >
            🔍 Поиск
          </button>
        </div>
      </div>

      {/* Сообщение об успехе */}
      {isSubmitting && selectedIds.length > 0 && (
        <div
          ref={successMessageRef}
          className="success-message"
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
        >
          <div className="success-content">
            <div className="success-icon">🎉</div>
            <div className="success-text">
              <h4>Статусы обновлены!</h4>
              <p>Успешно изменено {selectedIds.length} технологий</p>
            </div>
          </div>
        </div>
      )}

      {/* Ошибки */}
      {errors.submit && (
        <div className="error-message" role="alert">
          <span className="error-icon">⚠️</span>
          <div className="error-content">
            <h4>Ошибка сохранения</h4>
            <p>{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Основной контент */}
      <div className="editor-content">
        {/* Панель управления */}
        <div className="control-panel">
          <div className="panel-section search-section">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                ref={searchInputRef}
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск технологий..."
                className="search-input"
                aria-label="Поиск технологий"
                disabled={isSubmitting}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="clear-search"
                  aria-label="Очистить поиск"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="search-hint">
              Найдено: {filteredTechs.length} из {technologies.length}
            </div>
          </div>

          <div className="panel-section selection-section">
            <div className="selection-controls">
              <button
                type="button"
                onClick={toggleSelectAll}
                className={`select-all-btn ${
                  selectedIds.length === filteredTechs.length ? "active" : ""
                }`}
                aria-label={
                  selectedIds.length === filteredTechs.length
                    ? "Снять все выделения"
                    : "Выбрать все"
                }
                disabled={filteredTechs.length === 0 || isSubmitting}
              >
                <span className="check-icon">
                  {selectedIds.length === filteredTechs.length ? "✓" : "☐"}
                </span>
                <span className="btn-text">
                  {selectedIds.length === filteredTechs.length
                    ? "Снять всё"
                    : "Выбрать всё"}
                </span>
              </button>

              <div className="status-quick-select">
                <span className="quick-select-label">Выбрать по статусу:</span>
                <div className="quick-select-buttons">
                  {["not-started", "in-progress", "completed"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => selectByStatus(status)}
                      className="quick-select-btn"
                      style={{
                        "--status-color": getStatusColor(status),
                      }}
                      disabled={isSubmitting}
                    >
                      <span className="status-icon">
                        {getStatusIcon(status)}
                      </span>
                      {getStatusText(status)}
                      <span className="status-count">
                        ({stats.byStatus[status] || 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {errors.selected && (
              <div className="field-error" role="alert">
                <span className="error-icon">⚠️</span>
                {errors.selected}
              </div>
            )}
          </div>

          <div className="panel-section status-section">
            <div className="status-header">
              <h3 className="section-title">
                <span className="section-icon">🎯</span>
                Новый статус
              </h3>
              <div className="status-preview">
                <span className="preview-label">Будет установлен:</span>
                {newStatus ? (
                  <span
                    className="preview-status"
                    style={{
                      backgroundColor: `${getStatusColor(newStatus)}20`,
                      color: getStatusColor(newStatus),
                      borderColor: getStatusColor(newStatus),
                    }}
                  >
                    {getStatusIcon(newStatus)} {getStatusText(newStatus)}
                  </span>
                ) : (
                  <span className="preview-empty">не выбран</span>
                )}
              </div>
            </div>

            <div className="status-controls">
              <div className="status-options">
                {["not-started", "in-progress", "completed"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setNewStatus(status)}
                    className={`status-option ${
                      newStatus === status ? "selected" : ""
                    }`}
                    style={{
                      "--status-color": getStatusColor(status),
                    }}
                    aria-label={`Установить статус "${getStatusText(status)}"`}
                    disabled={isSubmitting}
                  >
                    <span className="option-icon">{getStatusIcon(status)}</span>
                    <span className="option-text">{getStatusText(status)}</span>
                  </button>
                ))}
              </div>

              {errors.status && (
                <div className="field-error" role="alert">
                  <span className="error-icon">⚠️</span>
                  {errors.status}
                </div>
              )}
            </div>
          </div>

          <div className="panel-section action-section">
            <div className="action-info">
              <div className="action-summary">
                <span className="summary-icon">📊</span>
                <div className="summary-text">
                  <strong>{selectedIds.length} элементов</strong>
                  <span>будут обновлены</span>
                </div>
              </div>
              {selectedIds.length > 3 && !actionConfirmed && (
                <div className="action-warning">
                  ⚠️ Это массовая операция. Требуется подтверждение.
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button
                ref={applyButtonRef}
                type="button"
                onClick={handleApplyChanges}
                className="apply-btn"
                disabled={
                  isSubmitting || selectedIds.length === 0 || !newStatus
                }
                aria-busy={isSubmitting}
                onKeyDown={(e) => handleKeyDown(e, "apply")}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Применяем изменения...
                  </>
                ) : (
                  <>
                    <span className="apply-icon">🚀</span>
                    Применить изменения
                    <span className="apply-count">({selectedIds.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Список технологий */}
        <div className="technologies-grid-container">
          <div className="grid-header">
            <h3 className="grid-title">
              <span className="grid-icon">📋</span>
              Выбранные технологии
              <span className="grid-count">
                ({selectedIds.length}/{stats.total})
              </span>
            </h3>
            <div className="grid-actions">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="btn-clear-selection"
                disabled={selectedIds.length === 0 || isSubmitting}
              >
                🗑️ Очистить выбор
              </button>
            </div>
          </div>

          {filteredTechs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h4>Технологии не найдены</h4>
              <p>Попробуйте изменить поисковый запрос</p>
            </div>
          ) : (
            <div className="technologies-grid" role="list">
              {filteredTechs.map((tech) => {
                const isSelected = selectedIds.includes(tech.id);
                return (
                  <div
                    key={tech.id}
                    className={`technology-card ${
                      isSelected ? "selected" : ""
                    }`}
                    role="listitem"
                    aria-selected={isSelected}
                    onClick={() => !isSubmitting && toggleTechnology(tech.id)}
                  >
                    <div className="card-checkbox">
                      <div
                        className={`checkbox ${isSelected ? "checked" : ""}`}
                        aria-hidden="true"
                      >
                        {isSelected && <span className="check-mark">✓</span>}
                      </div>
                    </div>

                    <div className="card-content">
                      <div className="card-header">
                        <h3 className="tech-title">
                          <span className="tech-icon">⚙️</span>
                          {tech.title}
                        </h3>
                        <div className="tech-tags">
                          {tech.category && (
                            <span className="tech-tag category">
                              {tech.category}
                            </span>
                          )}
                          {tech.priority && (
                            <span
                              className={`tech-tag priority-${tech.priority}`}
                            >
                              {tech.priority === "high"
                                ? "🔥 Высокий"
                                : tech.priority === "medium"
                                ? "⚡ Средний"
                                : "📉 Низкий"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="card-body">
                        {tech.description && (
                          <p className="tech-description">{tech.description}</p>
                        )}

                        <div className="card-footer">
                          <div className="status-info">
                            <span
                              className="current-status"
                              style={{
                                backgroundColor: `${getStatusColor(
                                  tech.status
                                )}20`,
                                color: getStatusColor(tech.status),
                                borderColor: getStatusColor(tech.status),
                              }}
                            >
                              {getStatusIcon(tech.status)}{" "}
                              {getStatusText(tech.status)}
                            </span>

                            {isSelected && (
                              <span className="new-status-indicator">
                                → {getStatusIcon(newStatus)}{" "}
                                {getStatusText(newStatus)}
                              </span>
                            )}
                          </div>

                          <div className="tech-meta">
                            {tech.deadline && (
                              <span className="tech-deadline">
                                📅{" "}
                                {new Date(tech.deadline).toLocaleDateString(
                                  "ru-RU"
                                )}
                              </span>
                            )}
                            {tech.updatedAt && (
                              <span className="tech-updated">
                                📝{" "}
                                {new Date(tech.updatedAt).toLocaleDateString(
                                  "ru-RU"
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Подсказки */}
      <div className="editor-footer">
        <div className="hints-section">
          <div className="hint-item">
            <span className="hint-icon">💡</span>
            <span className="hint-text">
              Используйте Ctrl+F для быстрого поиска
            </span>
          </div>
          <div className="hint-item">
            <span className="hint-icon">⚡</span>
            <span className="hint-text">Нажмите на карточку для выбора</span>
          </div>
          <div className="hint-item">
            <span className="hint-icon">🎯</span>
            <span className="hint-text">
              Выбрано: {selectedIds.length} из {stats.total}
            </span>
          </div>
        </div>

        <div className="keyboard-hints">
          <kbd>Tab</kbd> Навигация
          <kbd>Enter</kbd> Применить
          <kbd>Esc</kbd> Закрыть
        </div>
      </div>
    </div>
  );
}

export default BulkStatusEditor;
