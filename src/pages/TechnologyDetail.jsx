// pages/TechnologyDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  LinearProgress,
  Divider,
  Paper,
  Stack,
  Avatar,
  Tooltip,
  Fab,
  Alert,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  School as SchoolIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Link as LinkIcon,
  Book as BookIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  Code as CodeIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import "./TechnologyDetail.css";

// Карта сложностей
const DIFFICULTY_MAP = {
  beginner: { label: "Начинающий", color: "#10b981", value: 1 },
  intermediate: { label: "Средний", color: "#f59e0b", value: 2 },
  advanced: { label: "Продвинутый", color: "#ef4444", value: 3 },
  expert: { label: "Экспертный", color: "#8b5cf6", value: 4 },
};

// Карта приоритетов
const PRIORITY_MAP = {
  low: { label: "Низкий", color: "#10b981", icon: "🟢" },
  medium: { label: "Средний", color: "#f59e0b", icon: "🟡" },
  high: { label: "Высокий", color: "#ef4444", icon: "🔴" },
};

// Карта категорий
const CATEGORY_MAP = {
  frontend: { label: "Frontend", icon: "🌐", color: "#3b82f6" },
  backend: { label: "Backend", icon: "⚙️", color: "#8b5cf6" },
  database: { label: "База данных", icon: "🗄️", color: "#10b981" },
  devops: { label: "DevOps", icon: "🚀", color: "#f59e0b" },
  mobile: { label: "Мобильная", icon: "📱", color: "#ef4444" },
  testing: { label: "Тестирование", icon: "🧪", color: "#ec4899" },
  tools: { label: "Инструменты", icon: "🛠️", color: "#6b7280" },
  ai: { label: "AI/ML", icon: "🧠", color: "#8b5cf6" },
  cloud: { label: "Облачные технологии", icon: "☁️", color: "#0ea5e9" },
  other: { label: "Другое", icon: "📦", color: "#94a3b8" },
};

// Ресурсы по технологиям
const TECHNOLOGY_RESOURCES = {
  React: [
    {
      type: "documentation",
      title: "Официальная документация React",
      url: "https://react.dev",
    },
    {
      type: "course",
      title: "React - Полный Курс",
      url: "https://example.com/react-course",
    },
    {
      type: "github",
      title: "React GitHub",
      url: "https://github.com/facebook/react",
    },
  ],
  TypeScript: [
    {
      type: "documentation",
      title: "Официальная документация TypeScript",
      url: "https://www.typescriptlang.org",
    },
    {
      type: "course",
      title: "TypeScript для начинающих",
      url: "https://example.com/ts-course",
    },
  ],
  "Node.js": [
    {
      type: "documentation",
      title: "Node.js документация",
      url: "https://nodejs.org",
    },
    {
      type: "github",
      title: "Node.js GitHub",
      url: "https://github.com/nodejs/node",
    },
  ],
  Docker: [
    {
      type: "documentation",
      title: "Docker документация",
      url: "https://docs.docker.com",
    },
    {
      type: "tutorial",
      title: "Docker за час",
      url: "https://example.com/docker-tutorial",
    },
  ],
  PostgreSQL: [
    {
      type: "documentation",
      title: "PostgreSQL документация",
      url: "https://www.postgresql.org/docs",
    },
    {
      type: "course",
      title: "PostgreSQL для разработчиков",
      url: "https://example.com/pg-course",
    },
  ],
  Git: [
    {
      type: "documentation",
      title: "Официальная документация Git",
      url: "https://git-scm.com/doc",
    },
    {
      type: "tutorial",
      title: "Git и GitHub для начинающих",
      url: "https://example.com/git-tutorial",
    },
    {
      type: "github",
      title: "Pro Git книга",
      url: "https://github.com/progit/progit2",
    },
  ],
};

// Теги по технологиям
const TECHNOLOGY_TAGS = {
  React: ["JavaScript", "UI", "Components", "Hooks", "SPA"],
  TypeScript: ["JavaScript", "Type System", "Scalability", "Tooling"],
  "Node.js": ["JavaScript", "Backend", "Runtime", "API"],
  Docker: ["Containerization", "DevOps", "Deployment", "CI/CD"],
  PostgreSQL: ["Database", "SQL", "Relations", "Performance"],
  Git: ["Version Control", "Collaboration", "GitHub", "GitLab"],
};

// Предварительные знания
const PREREQUISITES_MAP = {
  React: ["JavaScript", "HTML", "CSS", "ES6+"],
  TypeScript: ["JavaScript", "Basic Programming"],
  "Node.js": ["JavaScript", "Basic Backend Concepts"],
  Docker: ["Linux Basics", "Networking", "CLI"],
  PostgreSQL: ["SQL", "Database Concepts"],
  Git: ["Basic Command Line"],
};

function TechnologyDetail() {
  const { techId } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [originalTechnologies, setOriginalTechnologies] = useState([]);

  useEffect(() => {
    loadTechnology();
  }, [techId]);

  const loadTechnology = async () => {
    try {
      setLoading(true);
      // Загружаем технологии из localStorage
      const stored = localStorage.getItem("technologies");
      const technologies = stored ? JSON.parse(stored) : [];
      setOriginalTechnologies(technologies);

      // Ищем технологию по ID
      const foundTech = technologies.find(
        (t) =>
          String(t.id) === String(techId) ||
          t.id === parseInt(techId) ||
          t.title === techId
      );

      if (foundTech) {
        // Обрабатываем реальную технологию
        const processedTech = processTechnologyData(foundTech);
        setTechnology(processedTech);
        setNotes(processedTech.notes || "");

        // Загружаем соответствующие ресурсы
        loadResources(processedTech.title);
      } else {
        // Если технология не найдена, показываем заглушку
        navigate("/technologies");
      }
    } catch (error) {
      console.error("Ошибка загрузки технологии:", error);
    } finally {
      setLoading(false);
    }
  };

  const processTechnologyData = (tech) => {
    // Рассчитываем прогресс на основе статуса
    const getProgressByStatus = (status) => {
      switch (status) {
        case "completed":
          return 100;
        case "in-progress":
          return 50;
        case "not-started":
          return 0;
        default:
          return 0;
      }
    };

    // Получаем полное описание
    const getFullDescription = (tech) => {
      if (tech.fullDescription) return tech.fullDescription;

      // Генерируем описания для популярных технологий
      const descriptions = {
        React:
          "React — это JavaScript-библиотека для создания пользовательских интерфейсов. Разработана Facebook, позволяет создавать SPA (одностраничные приложения) с компонентным подходом.",
        TypeScript:
          "TypeScript — это строго типизированный язык программирования, основанный на JavaScript. Добавляет статическую типизацию, что улучшает масштабируемость и поддерживаемость кода.",
        "Node.js":
          "Node.js — это среда выполнения JavaScript на стороне сервера, построенная на движке V8. Позволяет создавать масштабируемые сетевые приложения.",
        Docker:
          "Docker — это платформа для контейнеризации приложений. Позволяет упаковывать приложения и их зависимости в контейнеры для упрощения развертывания.",
        PostgreSQL:
          "PostgreSQL — это продвинутая объектно-реляционная система управления базами данных с открытым исходным кодом.",
        Git: "Git — это распределенная система контроля версий, созданная Линусом Торвальдсом. Используется для отслеживания изменений в исходном коде.",
      };

      return descriptions[tech.title] || `${tech.title} — ${tech.description}`;
    };

    return {
      ...tech,
      progress: tech.progress || getProgressByStatus(tech.status),
      fullDescription: getFullDescription(tech),
      difficulty: tech.difficulty || "intermediate",
      learningHours: tech.estimatedHours || 40,
      version: tech.version || "Latest",
      popularity: tech.popularity || "medium",
      tags: tech.tags ||
        TECHNOLOGY_TAGS[tech.title] || [tech.category || "Технология"],
      prerequisites: tech.prerequisites ||
        PREREQUISITES_MAP[tech.title] || ["Базовые знания программирования"],
      resources: tech.resources || 3,
      createdAt: tech.createdAt || new Date().toISOString(),
      updatedAt: tech.updatedAt || new Date().toISOString(),
      deadline: tech.deadline || null,
      category: tech.category || "other",
    };
  };

  const loadResources = (techTitle) => {
    // Получаем ресурсы для конкретной технологии
    const techResources = TECHNOLOGY_RESOURCES[techTitle] || [
      {
        id: 1,
        type: "documentation",
        title: "Официальная документация",
        url: `https://example.com/docs/${techTitle.toLowerCase()}`,
      },
      {
        id: 2,
        type: "tutorial",
        title: `Изучение ${techTitle}`,
        url: `https://example.com/learn/${techTitle.toLowerCase()}`,
      },
      {
        id: 3,
        type: "github",
        title: "GitHub репозиторий",
        url: `https://github.com/search?q=${techTitle}`,
      },
    ];

    setResources(techResources);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "in-progress":
        return "#f59e0b";
      case "not-started":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon sx={{ color: "#10b981" }} />;
      case "in-progress":
        return <ScheduleIcon sx={{ color: "#f59e0b" }} />;
      case "not-started":
        return <UncheckedIcon sx={{ color: "#6b7280" }} />;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty) => {
    return DIFFICULTY_MAP[difficulty]?.color || "#6b7280";
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case "documentation":
        return <ArticleIcon />;
      case "tutorial":
        return <VideoIcon />;
      case "article":
        return <BookIcon />;
      case "github":
        return <CodeIcon />;
      case "course":
        return <SchoolIcon />;
      default:
        return <LinkIcon />;
    }
  };

  const getCategoryInfo = (category) => {
    return CATEGORY_MAP[category] || CATEGORY_MAP["other"];
  };

  const handleStatusChange = (newStatus) => {
    // Обновляем статус технологии
    const updatedTech = { ...technology, status: newStatus };
    setTechnology(updatedTech);

    // Обновляем в localStorage
    const stored = localStorage.getItem("technologies");
    if (stored) {
      const technologies = JSON.parse(stored);
      const updatedTechs = technologies.map((t) =>
        t.id === technology.id ? { ...t, status: newStatus } : t
      );
      localStorage.setItem("technologies", JSON.stringify(updatedTechs));
    }
  };

  const handleSaveNotes = () => {
    // Сохраняем заметки
    const updatedTech = { ...technology, notes };
    setTechnology(updatedTech);

    // Обновляем в localStorage
    const stored = localStorage.getItem("technologies");
    if (stored) {
      const technologies = JSON.parse(stored);
      const updatedTechs = technologies.map((t) =>
        t.id === technology.id ? { ...t, notes } : t
      );
      localStorage.setItem("technologies", JSON.stringify(updatedTechs));
    }
  };

  const handleDelete = () => {
    if (window.confirm("Вы уверены, что хотите удалить эту технологию?")) {
      const stored = localStorage.getItem("technologies");
      if (stored) {
        const technologies = JSON.parse(stored);
        const updatedTechs = technologies.filter((t) => t.id !== technology.id);
        localStorage.setItem("technologies", JSON.stringify(updatedTechs));
        navigate("/technologies");
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: technology.title,
        text: `Изучаю ${technology.title} - ${technology.description}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Ссылка скопирована в буфер обмена!");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-technology/${technology.id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <LinearProgress sx={{ width: "50%" }} />
        <Typography color="text.secondary">Загрузка технологии...</Typography>
      </Box>
    );
  }

  if (!technology) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Технология не найдена
        </Typography>
        <Typography color="text.secondary" paragraph>
          Возможно, эта технология была удалена или перемещена.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/technologies")}
          sx={{
            mt: 2,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          }}
        >
          Вернуться к списку
        </Button>
      </Box>
    );
  }

  const categoryInfo = getCategoryInfo(technology.category);
  const difficultyInfo =
    DIFFICULTY_MAP[technology.difficulty] || DIFFICULTY_MAP.intermediate;

  return (
    <div className="technology-detail-page">
      {/* Заголовок и действия */}
      <Box className="detail-header" sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/technologies")}
              sx={{
                backgroundColor: "#f0fdf4",
                color: "#10b981",
                "&:hover": { backgroundColor: "#d1fae5" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Avatar
                  sx={{
                    backgroundColor: `${categoryInfo.color}20`,
                    color: categoryInfo.color,
                    width: 40,
                    height: 40,
                    fontSize: "1.2rem",
                  }}
                >
                  {categoryInfo.icon}
                </Avatar>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {technology.title}
                </Typography>
              </Box>
              <Typography variant="subtitle1" color="text.secondary">
                {technology.description}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Редактировать">
              <IconButton
                onClick={handleEdit}
                sx={{
                  backgroundColor: "#eff6ff",
                  color: "#3b82f6",
                  "&:hover": { backgroundColor: "#dbeafe" },
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Поделиться">
              <IconButton
                onClick={handleShare}
                sx={{
                  backgroundColor: "#f0fdf4",
                  color: "#10b981",
                  "&:hover": { backgroundColor: "#d1fae5" },
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Удалить">
              <IconButton
                onClick={handleDelete}
                sx={{
                  backgroundColor: "#fef2f2",
                  color: "#ef4444",
                  "&:hover": { backgroundColor: "#fee2e2" },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Статус и прогресс */}
        <Card className="status-card" sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: `${getStatusColor(technology.status)}20`,
                      color: getStatusColor(technology.status),
                      width: 56,
                      height: 56,
                    }}
                  >
                    {getStatusIcon(technology.status)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.secondary">
                      Статус
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: getStatusColor(technology.status),
                      }}
                    >
                      {technology.status === "completed"
                        ? "Изучено"
                        : technology.status === "in-progress"
                        ? "В процессе"
                        : "Не начато"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Прогресс
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, color: "#065f46" }}
                    >
                      {technology.progress}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={technology.progress}
                      sx={{
                        flex: 1,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#e5e7eb",
                        "& .MuiLinearProgress-bar": {
                          background:
                            technology.progress === 100
                              ? "linear-gradient(90deg, #10b981, #059669)"
                              : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant={
                      technology.status === "not-started"
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => handleStatusChange("not-started")}
                    startIcon={<UncheckedIcon />}
                    sx={{
                      flex: 1,
                      backgroundColor:
                        technology.status === "not-started"
                          ? "#6b7280"
                          : "transparent",
                      color:
                        technology.status === "not-started"
                          ? "white"
                          : "#6b7280",
                      borderColor: "#6b7280",
                    }}
                  >
                    Не начато
                  </Button>
                  <Button
                    variant={
                      technology.status === "in-progress"
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => handleStatusChange("in-progress")}
                    startIcon={<ScheduleIcon />}
                    sx={{
                      flex: 1,
                      backgroundColor:
                        technology.status === "in-progress"
                          ? "#f59e0b"
                          : "transparent",
                      color:
                        technology.status === "in-progress"
                          ? "white"
                          : "#f59e0b",
                      borderColor: "#f59e0b",
                    }}
                  >
                    В процессе
                  </Button>
                  <Button
                    variant={
                      technology.status === "completed"
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => handleStatusChange("completed")}
                    startIcon={<CheckCircleIcon />}
                    sx={{
                      flex: 1,
                      backgroundColor:
                        technology.status === "completed"
                          ? "#10b981"
                          : "transparent",
                      color:
                        technology.status === "completed" ? "white" : "#10b981",
                      borderColor: "#10b981",
                    }}
                  >
                    Изучено
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Основной контент */}
      <Grid container spacing={3}>
        {/* Левая колонка - информация */}
        <Grid item xs={12} lg={8}>
          {/* Табы */}
          <Paper className="tabs-container" sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} sx={{ p: 2 }}>
              <Button
                variant={activeTab === "overview" ? "contained" : "text"}
                onClick={() => setActiveTab("overview")}
                sx={{
                  backgroundColor:
                    activeTab === "overview" ? "#10b981" : "transparent",
                  color: activeTab === "overview" ? "white" : "#6b7280",
                  fontWeight: 600,
                }}
              >
                Обзор
              </Button>
              <Button
                variant={activeTab === "resources" ? "contained" : "text"}
                onClick={() => setActiveTab("resources")}
                sx={{
                  backgroundColor:
                    activeTab === "resources" ? "#10b981" : "transparent",
                  color: activeTab === "resources" ? "white" : "#6b7280",
                  fontWeight: 600,
                }}
              >
                Ресурсы ({resources.length})
              </Button>
              <Button
                variant={activeTab === "notes" ? "contained" : "text"}
                onClick={() => setActiveTab("notes")}
                sx={{
                  backgroundColor:
                    activeTab === "notes" ? "#10b981" : "transparent",
                  color: activeTab === "notes" ? "white" : "#6b7280",
                  fontWeight: 600,
                }}
              >
                Заметки
              </Button>
            </Stack>
          </Paper>

          {/* Контент табов */}
          {activeTab === "overview" && (
            <Card className="overview-card">
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 700, color: "#065f46" }}
                >
                  Описание
                </Typography>
                <Typography paragraph sx={{ lineHeight: 1.8 }}>
                  {technology.fullDescription}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 700, color: "#065f46" }}
                >
                  Детали
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <CategoryIcon sx={{ color: categoryInfo.color }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Категория
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {categoryInfo.label}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <SchoolIcon sx={{ color: difficultyInfo.color }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Сложность
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: difficultyInfo.color,
                          }}
                        >
                          {difficultyInfo.label}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <CalendarIcon sx={{ color: "#3b82f6" }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Дедлайн
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {technology.deadline
                            ? new Date(technology.deadline).toLocaleDateString(
                                "ru-RU",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            : "Не установлен"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <TimeIcon sx={{ color: "#8b5cf6" }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Часов на изучение
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {technology.learningHours} часов
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {technology.priority && (
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor:
                              PRIORITY_MAP[technology.priority]?.color ||
                              "#6b7280",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "0.8rem",
                          }}
                        >
                          {PRIORITY_MAP[technology.priority]?.icon || "?"}
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Приоритет
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {PRIORITY_MAP[technology.priority]?.label ||
                              "Не указан"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 700, color: "#065f46" }}
                >
                  Теги
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {technology.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      sx={{
                        backgroundColor: "#f0fdf4",
                        color: "#065f46",
                        border: "1px solid #d1fae5",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}

          {activeTab === "resources" && (
            <Card className="resources-card">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#065f46" }}
                  >
                    Ресурсы для изучения
                  </Typography>
                  <Tooltip title="Добавить ресурс">
                    <Fab size="small" color="primary" aria-label="add resource">
                      <AddIcon />
                    </Fab>
                  </Tooltip>
                </Box>

                <List>
                  {resources.map((resource, index) => (
                    <ListItemButton
                      key={index}
                      component="a"
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        border: "1px solid #e5e7eb",
                        "&:hover": {
                          backgroundColor: "#f0fdf4",
                          borderColor: "#d1fae5",
                          transform: "translateX(4px)",
                          transition: "all 0.2s ease",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            backgroundColor: "#f0fdf4",
                            color: "#10b981",
                          }}
                        >
                          {getResourceIcon(resource.type)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={resource.title}
                        secondary={resource.url}
                        primaryTypographyProps={{ fontWeight: 600 }}
                        secondaryTypographyProps={{
                          sx: {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        }}
                      />
                      <Tooltip title="Открыть">
                        <DownloadIcon sx={{ color: "#6b7280" }} />
                      </Tooltip>
                    </ListItemButton>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {activeTab === "notes" && (
            <Card className="notes-card">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#065f46" }}
                  >
                    Мои заметки
                  </Typography>
                  <Chip
                    label={`${notes.length} символов`}
                    size="small"
                    sx={{ backgroundColor: "#f0fdf4", color: "#065f46" }}
                  />
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Добавьте ваши заметки по изучению этой технологии. Вы можете записывать важные моменты, полезные команды, проблемы и их решения..."
                  sx={{ mb: 2 }}
                />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setNotes(technology.notes || "")}
                    sx={{ borderColor: "#d1fae5", color: "#065f46" }}
                  >
                    Отменить
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveNotes}
                    sx={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                      },
                    }}
                  >
                    Сохранить заметки
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Правая колонка - метаданные */}
        <Grid item xs={12} lg={4}>
          <Card className="meta-card" sx={{ mb: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 700, color: "#065f46" }}
              >
                📊 Статистика
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Добавлено</Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {new Date(technology.createdAt).toLocaleDateString(
                      "ru-RU",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Обновлено</Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {new Date(technology.updatedAt).toLocaleDateString(
                      "ru-RU",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Ресурсов</Typography>
                  <Typography sx={{ fontWeight: 600, color: "#10b981" }}>
                    {resources.length}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Версия</Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {technology.version}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Популярность</Typography>
                  <Chip
                    label={
                      technology.popularity === "high"
                        ? "Высокая"
                        : technology.popularity === "medium"
                        ? "Средняя"
                        : "Низкая"
                    }
                    size="small"
                    sx={{
                      backgroundColor:
                        technology.popularity === "high"
                          ? "#fef2f2"
                          : technology.popularity === "medium"
                          ? "#fef3c7"
                          : "#f0fdf4",
                      color:
                        technology.popularity === "high"
                          ? "#dc2626"
                          : technology.popularity === "medium"
                          ? "#92400e"
                          : "#065f46",
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card className="prerequisites-card">
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 700, color: "#065f46" }}
              >
                📚 Предварительные знания
              </Typography>

              <List dense>
                {technology.prerequisites.map((prereq, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleIcon
                        sx={{ color: "#10b981", fontSize: 20 }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={prereq} />
                  </ListItem>
                ))}
              </List>

              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #d1fae5",
                  color: "#065f46",
                }}
              >
                Убедитесь, что у вас есть необходимые знания перед началом
                изучения.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FAB для быстрых действий */}
      <Fab
        className="action-fab"
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
            transform: "scale(1.1)",
          },
        }}
        onClick={() => navigate("/add-technology")}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}

export default TechnologyDetail;
