import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";
import ThemeToggleButton from "./ThemeToggle";

function Navigation() {
  const location = useLocation();
  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0 });

  // Навигационные элементы с иконками
  const navItems = [
    { path: "/", label: "Главная", icon: "🏠" },
    { path: "/technologies", label: "Технологии", icon: "💻" },
    { path: "/deadlines", label: "Сроки", icon: "📅" },
    { path: "/bulk-edit", label: "Массовое редактирование", icon: "⚡" },
    { path: "/statistics", label: "Статистика", icon: "📊" },
    { path: "/settings", label: "Настройки", icon: "⚙️" },
    { path: "/add-technology", label: "Добавить", icon: "➕" },
  ];

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setShowLeftScroll(scrollLeft > 10);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Обновление позиции индикатора активной ссылки
  useEffect(() => {
    const updateActiveIndicator = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const activeLink = container.querySelector(".nav-link.active");
      if (activeLink) {
        const containerRect = container.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        setActiveIndicator({
          left: linkRect.left - containerRect.left + container.scrollLeft,
          width: linkRect.width,
        });
      }
    };

    updateActiveIndicator();
    window.addEventListener("resize", updateActiveIndicator);

    return () => {
      window.removeEventListener("resize", updateActiveIndicator);
    };
  }, [location]);

  useEffect(() => {
    checkScrollButtons();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollButtons);
      }
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, []);

  return (
    <nav className="main-navigation">
      {/* Декоративные элементы */}
      <div className="nav-decoration">
        <div className="nav-bg-pattern"></div>
        <div className="nav-accent-line"></div>
      </div>

      <div className="nav-container">
        {/* Логотип и бренд */}
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <div className="brand-icon">🌱</div>
            <div className="brand-text">
              <h2>Трекер технологий</h2>
              <p className="brand-subtitle">Прогресс обучения</p>
            </div>
          </Link>
        </div>

        {/* Центральная навигация */}
        <div className="nav-center">
          <div
            className={`scroll-indicator left ${
              showLeftScroll ? "visible" : ""
            }`}
          >
            <button
              className="scroll-btn"
              onClick={scrollLeft}
              aria-label="Прокрутить навигацию влево"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>

          <div
            className="nav-scroll-container"
            ref={scrollContainerRef}
            role="navigation"
            aria-label="Основная навигация"
          >
            <div
              className="active-indicator"
              style={{
                left: `${activeIndicator.left}px`,
                width: `${activeIndicator.width}px`,
              }}
            ></div>

            <div className="nav-menu">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                  aria-current={
                    location.pathname === item.path ? "page" : undefined
                  }
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {location.pathname === item.path && (
                    <div className="nav-ping"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div
            className={`scroll-indicator right ${
              showRightScroll ? "visible" : ""
            }`}
          >
            <button
              className="scroll-btn"
              onClick={scrollRight}
              aria-label="Прокрутить навигацию вправо"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Правая часть (тема и пользователь) */}
        <div className="nav-right">
          <ThemeToggleButton size="medium" />

          {/* Индикатор прогресса (опционально) */}
          <div className="nav-progress">
            <div className="progress-circle">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray="75, 100"
                  d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="progress-text">75%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Мобильная навигация (скрыта на десктопе) */}
      <div className="mobile-nav">
        <div className="mobile-nav-menu">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
