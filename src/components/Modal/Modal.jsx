import './Modal.css';

// Простой переиспользуемый компонент модального окна
function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  // Если модалка закрыта - не показываем ничего
  if (!isOpen) {
    return null;
  }

  // Функция для закрытия модалки при клике на фон
  const handleBackgroundClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Функция для закрытия модалки при нажатии Escape
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  // Добавляем обработчик нажатия клавиш
  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const sizeClasses = {
    small: 'modal-small',
    medium: 'modal-medium',
    large: 'modal-large',
    full: 'modal-full'
  };

  return (
    <div 
      className="modal-background" 
      onClick={handleBackgroundClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className={`modal-window ${sizeClasses[size]}`}>
        {/* Шапка модалки с заголовком и кнопкой закрытия */}
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Закрыть модальное окно"
          >
            ×
          </button>
        </div>

        {/* Основное содержимое модалки */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;