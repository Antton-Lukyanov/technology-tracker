// pages/TechnologyList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Badge,
  LinearProgress,
  Alert,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import "./TechnologyList.css";

function TechnologyList() {
  const navigate = useNavigate();
  const [technologies, setTechnologies] = useState([]);
  const [filteredTech, setFilteredTech] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  // Инициализация данных
  useEffect(() => {
    loadTechnologies();
  }, []);

  const loadTechnologies = async () => {
    try {
      setLoading(true);
      // Загружаем технологии из localStorage
      const stored = localStorage.getItem("technologies");
      let techData = stored ? JSON.parse(stored) : [];

      // Если нет данных, загружаем демо данные
      if (techData.length === 0) {
        techData = getDemoTechnologies();
        localStorage.setItem("technologies", JSON.stringify(techData));
      }

      setTechnologies(techData);
      setFilteredTech(techData);
    } catch (error) {
      console.error("Ошибка загрузки технологий:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDemoTechnologies = () => {
    return [
      {
        id: "1",
        title: "React",
        description:
          "JavaScript библиотека для создания пользовательских интерфейсов",
        category: "frontend",
        difficulty: "intermediate",
        status: "in-progress",
        progress: 75,
        deadline: "2024-03-15",
        createdAt: "2024-01-15",
        resources: 5,
        notes: "Изучаю хуки и контекст",
      },
      {
        id: "2",
        title: "Node.js",
        description: "Среда выполнения JavaScript на стороне сервера",
        category: "backend",
        difficulty: "intermediate",
        status: "completed",
        progress: 100,
        deadline: "2024-02-28",
        createdAt: "2024-01-10",
        resources: 8,
        notes: "Освоил Express.js и работу с базами данных",
      },
      {
        id: "3",
        title: "TypeScript",
        description: "Статически типизированный JavaScript",
        category: "frontend",
        difficulty: "advanced",
        status: "in-progress",
        progress: 60,
        deadline: "2024-04-10",
        createdAt: "2024-02-01",
        resources: 6,
        notes: "Изучаю дженерики и декораторы",
      },
      {
        id: "4",
        title: "Docker",
        description: "Платформа для контейнеризации приложений",
        category: "devops",
        difficulty: "intermediate",
        status: "not-started",
        progress: 0,
        deadline: "2024-05-20",
        createdAt: "2024-01-20",
        resources: 4,
        notes: "Запланировано изучение на следующий месяц",
      },
      {
        id: "5",
        title: "PostgreSQL",
        description: "Реляционная система управления базами данных",
        category: "database",
        difficulty: "intermediate",
        status: "in-progress",
        progress: 40,
        deadline: "2024-03-30",
        createdAt: "2024-01-25",
        resources: 7,
        notes: "Изучаю индексы и оптимизацию запросов",
      },
    ];
  };

  // Фильтрация и поиск
  useEffect(() => {
    let result = technologies;

    // Поиск по тексту
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (tech) =>
          tech.title.toLowerCase().includes(term) ||
          tech.description.toLowerCase().includes(term) ||
          tech.category.toLowerCase().includes(term)
      );
    }

    // Фильтр по статусу
    if (statusFilter !== "all") {
      result = result.filter((tech) => tech.status === statusFilter);
    }

    // Фильтр по категории
    if (categoryFilter !== "all") {
      result = result.filter((tech) => tech.category === categoryFilter);
    }

    // Сортировка
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "progress":
          return b.progress - a.progress;
        case "deadline":
          return new Date(a.deadline) - new Date(b.deadline);
        default:
          return 0;
      }
    });

    setFilteredTech(result);
  }, [technologies, searchTerm, statusFilter, categoryFilter, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      case "not-started":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon fontSize="small" />;
      case "in-progress":
        return <ScheduleIcon fontSize="small" />;
      case "not-started":
        return <UncheckedIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      frontend: "#10b981",
      backend: "#3b82f6",
      database: "#8b5cf6",
      devops: "#f59e0b",
      mobile: "#ef4444",
      tools: "#6b7280",
    };
    return colors[category] || "#6b7280";
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "success";
      case "intermediate":
        return "warning";
      case "advanced":
        return "error";
      default:
        return "default";
    }
  };

  const handleViewDetails = (techId) => {
    navigate(`/technology/${techId}`);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(technologies, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "technologies.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleAddTechnology = () => {
    navigate("/add-technology");
  };

  const handleRefresh = () => {
    loadTechnologies();
  };

  const calculateStats = () => {
    const total = technologies.length;
    const completed = technologies.filter(
      (t) => t.status === "completed"
    ).length;
    const inProgress = technologies.filter(
      (t) => t.status === "in-progress"
    ).length;
    const notStarted = technologies.filter(
      (t) => t.status === "not-started"
    ).length;
    const totalProgress =
      total > 0
        ? Math.round(
            technologies.reduce((sum, t) => sum + t.progress, 0) / total
          )
        : 0;

    return { total, completed, inProgress, notStarted, totalProgress };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <LinearProgress sx={{ width: "50%" }} />
      </Box>
    );
  }

  return (
    <div className="technology-list-page">
      {/* Заголовок и статистика */}
      <Box className="page-header" sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              📚 Список технологий
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Управляйте вашим процессом обучения и отслеживайте прогресс
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{
                borderColor: "#d1fae5",
                color: "#065f46",
                "&:hover": {
                  borderColor: "#10b981",
                  backgroundColor: "#f0fdf4",
                },
              }}
            >
              Экспорт
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTechnology}
              sx={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                },
              }}
            >
              Добавить
            </Button>
          </Stack>
        </Box>

        {/* Статистика */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              className="stat-card"
              sx={{
                background: "linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <TrendingUpIcon sx={{ color: "#10b981", mr: 1 }} />
                  <Typography variant="h6" color="text.secondary">
                    Общий прогресс
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Всего
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 800, color: "#3b82f6" }}
                >
                  {stats.total}
                </Typography>
                <Chip
                  label="Технологии"
                  size="small"
                  sx={{ mt: 1, backgroundColor: "#dbeafe", color: "#1d4ed8" }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Изучено
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 800, color: "#10b981" }}
                >
                  {stats.completed}
                </Typography>
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Завершено"
                  size="small"
                  color="success"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  В процессе
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 800, color: "#f59e0b" }}
                >
                  {stats.inProgress}
                </Typography>
                <Chip
                  icon={<ScheduleIcon />}
                  label="Изучается"
                  size="small"
                  color="warning"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Панель управления */}
      <Card className="control-panel" sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Поиск технологий..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#10b981" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Статус"
                  startAdornment={
                    <FilterIcon sx={{ mr: 1, color: "#10b981" }} />
                  }
                >
                  <MenuItem value="all">Все статусы</MenuItem>
                  <MenuItem value="completed">Изучено</MenuItem>
                  <MenuItem value="in-progress">В процессе</MenuItem>
                  <MenuItem value="not-started">Не начато</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Категория</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Категория"
                >
                  <MenuItem value="all">Все категории</MenuItem>
                  <MenuItem value="frontend">Frontend</MenuItem>
                  <MenuItem value="backend">Backend</MenuItem>
                  <MenuItem value="database">Базы данных</MenuItem>
                  <MenuItem value="devops">DevOps</MenuItem>
                  <MenuItem value="mobile">Мобильная</MenuItem>
                  <MenuItem value="tools">Инструменты</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Сортировка</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Сортировка"
                  startAdornment={<SortIcon sx={{ mr: 1, color: "#10b981" }} />}
                >
                  <MenuItem value="title">По названию</MenuItem>
                  <MenuItem value="progress">По прогрессу</MenuItem>
                  <MenuItem value="deadline">По сроку</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Обновить список">
                  <IconButton
                    onClick={handleRefresh}
                    sx={{
                      backgroundColor: "#f0fdf4",
                      color: "#10b981",
                      "&:hover": { backgroundColor: "#d1fae5" },
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Typography
                  variant="body2"
                  sx={{ alignSelf: "center", color: "#6b7280" }}
                >
                  Найдено: {filteredTech.length}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Таблица технологий */}
      {filteredTech.length === 0 ? (
        <Alert
          severity="info"
          sx={{
            mb: 3,
            backgroundColor: "#f0fdf4",
            border: "1px solid #d1fae5",
            color: "#065f46",
          }}
        >
          Технологии не найдены. Попробуйте изменить параметры поиска.
        </Alert>
      ) : (
        <TableContainer
          component={Paper}
          className="tech-table-container"
          sx={{ borderRadius: 2 }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "#065f46" }}>
                  Технология
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#065f46" }}>
                  Категория
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#065f46" }}>
                  Сложность
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#065f46" }}>
                  Статус
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#065f46" }}>
                  Прогресс
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#065f46" }}>
                  Срок
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#065f46" }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTech.map((tech) => (
                <TableRow
                  key={tech.id}
                  className="tech-table-row"
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "#f0fdf4" },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#1f2937" }}
                      >
                        {tech.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {tech.description}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <Badge
                          badgeContent={tech.resources || 0}
                          color="primary"
                          sx={{
                            "& .MuiBadge-badge": { backgroundColor: "#10b981" },
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            📚 ресурсов
                          </Typography>
                        </Badge>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={tech.category}
                      size="small"
                      sx={{
                        backgroundColor: `${getCategoryColor(tech.category)}20`,
                        color: getCategoryColor(tech.category),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={
                        tech.difficulty === "beginner"
                          ? "Начинающий"
                          : tech.difficulty === "intermediate"
                          ? "Средний"
                          : "Продвинутый"
                      }
                      size="small"
                      color={getDifficultyColor(tech.difficulty)}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      icon={getStatusIcon(tech.status)}
                      label={
                        tech.status === "completed"
                          ? "Изучено"
                          : tech.status === "in-progress"
                          ? "В процессе"
                          : "Не начато"
                      }
                      color={getStatusColor(tech.status)}
                      variant="filled"
                      sx={{
                        fontWeight: 600,
                        "&.MuiChip-filledSuccess": {
                          backgroundColor: "#10b981",
                        },
                        "&.MuiChip-filledWarning": {
                          backgroundColor: "#f59e0b",
                        },
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#065f46" }}
                      >
                        {tech.progress}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={tech.progress}
                        sx={{
                          flex: 1,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "#e5e7eb",
                          "& .MuiLinearProgress-bar": {
                            background:
                              tech.progress === 100
                                ? "linear-gradient(90deg, #10b981, #059669)"
                                : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  </TableCell>

                  <TableCell>
                    {tech.deadline ? (
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#1f2937" }}
                        >
                          {new Date(tech.deadline).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(tech.deadline) > new Date()
                            ? "Осталось дней"
                            : "Просрочено"}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Не установлен
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Просмотреть детали">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(tech.id)}
                          sx={{
                            backgroundColor: "#f0fdf4",
                            color: "#10b981",
                            "&:hover": { backgroundColor: "#d1fae5" },
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Сводка */}
      {filteredTech.length > 0 && (
        <Card className="summary-card" sx={{ mt: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="body2" color="text.secondary">
                  Показано {filteredTech.length} из {technologies.length}{" "}
                  технологий
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}
                >
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={`Изучено: ${stats.completed}`}
                    size="small"
                    sx={{ backgroundColor: "#d1fae5", color: "#065f46" }}
                  />
                  <Chip
                    icon={<ScheduleIcon />}
                    label={`В процессе: ${stats.inProgress}`}
                    size="small"
                    sx={{ backgroundColor: "#fef3c7", color: "#92400e" }}
                  />
                  <Chip
                    icon={<UncheckedIcon />}
                    label={`Не начато: ${stats.notStarted}`}
                    size="small"
                    sx={{ backgroundColor: "#f3f4f6", color: "#374151" }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: "right" }}>
                <Button
                  variant="text"
                  startIcon={<AddIcon />}
                  onClick={handleAddTechnology}
                  sx={{ color: "#10b981", fontWeight: 600 }}
                >
                  Добавить новую технологию
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TechnologyList;
