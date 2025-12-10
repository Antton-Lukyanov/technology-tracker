import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  Paper,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  AccessTime as TimeIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import "./Statistics.css";

function Statistics() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("pie");

  const loadTechnologies = () => {
    try {
      setLoading(true);
      const saved = localStorage.getItem("technologies");
      if (saved) {
        const techData = JSON.parse(saved);
        setTechnologies(techData);
      } else {
        // Демо данные для отображения
        setTechnologies(getDemoTechnologies());
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDemoTechnologies = () => {
    return [
      {
        id: "1",
        title: "React",
        status: "in-progress",
        progress: 75,
        category: "frontend",
        deadline: "2024-03-15",
      },
      {
        id: "2",
        title: "Node.js",
        status: "completed",
        progress: 100,
        category: "backend",
        deadline: "2024-02-28",
      },
      {
        id: "3",
        title: "TypeScript",
        status: "in-progress",
        progress: 60,
        category: "frontend",
        deadline: "2024-04-10",
      },
      {
        id: "4",
        title: "Docker",
        status: "not-started",
        progress: 0,
        category: "devops",
        deadline: "2024-05-20",
      },
      {
        id: "5",
        title: "PostgreSQL",
        status: "in-progress",
        progress: 40,
        category: "database",
        deadline: "2024-03-30",
      },
    ];
  };

  useEffect(() => {
    loadTechnologies();

    const handleStorageChange = (e) => {
      if (e.key === "technologies") {
        loadTechnologies();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Расчет статистики
  const calculateStats = () => {
    const total = technologies.length;
    const completed = technologies.filter(
      (tech) => tech.status === "completed"
    ).length;
    const inProgress = technologies.filter(
      (tech) => tech.status === "in-progress"
    ).length;
    const notStarted = technologies.filter(
      (tech) => tech.status === "not-started"
    ).length;

    const totalProgress =
      total > 0
        ? Math.round(
            technologies.reduce((sum, t) => sum + (t.progress || 0), 0) / total
          )
        : 0;

    // Расчет по категориям
    const categories = {};
    technologies.forEach((tech) => {
      const category = tech.category || "other";
      if (!categories[category]) {
        categories[category] = { count: 0, progress: 0 };
      }
      categories[category].count++;
      categories[category].progress += tech.progress || 0;
    });

    return {
      total,
      completed,
      inProgress,
      notStarted,
      totalProgress,
      categories,
    };
  };

  const stats = calculateStats();

  const calculatePercentage = (count) => {
    return stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
  };

  // Данные для круговой диаграммы
  const getStatusData = () => {
    return [
      { name: "Завершено", value: stats.completed, color: "#10b981" },
      { name: "В процессе", value: stats.inProgress, color: "#f59e0b" },
      { name: "Не начато", value: stats.notStarted, color: "#6b7280" },
    ];
  };

  // Данные для столбчатой диаграммы
  const getCategoryData = () => {
    return Object.entries(stats.categories).map(([category, data]) => ({
      name:
        category === "frontend"
          ? "Frontend"
          : category === "backend"
          ? "Backend"
          : category === "database"
          ? "Базы данных"
          : category === "devops"
          ? "DevOps"
          : "Другое",
      Технологий: data.count,
      "Ср. прогресс": Math.round(data.progress / data.count) || 0,
    }));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        statistics: stats,
        technologies: technologies,
      },
      null,
      2
    );

    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `statistics_${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
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

  if (loading) {
    return (
      <Container maxWidth="xl" className="statistics-page loading">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 3,
          }}
        >
          <LinearProgress
            sx={{
              width: "100%",
              maxWidth: 400,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#f0fdf4",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg, #10b981, #34d399)",
              },
            }}
          />
          <Typography variant="h6" sx={{ color: "#065f46", fontWeight: 600 }}>
            Загружаем статистику...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="statistics-page">
      {/* Декоративные элементы */}
      <div className="page-decoration"></div>

      {/* Заголовок */}
      <Box className="page-header" sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              component={Link}
              to="/technologies"
              sx={{
                backgroundColor: "#f0fdf4",
                color: "#10b981",
                "&:hover": {
                  backgroundColor: "#d1fae5",
                  transform: "rotate(-180deg)",
                },
                transition: "all 0.3s ease",
                border: "2px solid #d1fae5",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <TrendingUpIcon sx={{ fontSize: "2.5rem" }} />
                Статистика прогресса
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Анализ вашего обучения в реальном времени
              </Typography>
            </Box>
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
              startIcon={<RefreshIcon />}
              onClick={loadTechnologies}
              sx={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                },
              }}
            >
              Обновить
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Основная статистика */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card highlight">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <SchoolIcon sx={{ color: "#10b981", mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Всего технологий
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, color: "#10b981" }}
                  >
                    {stats.total}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                В процессе обучения
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CheckCircleIcon
                  sx={{ color: "#10b981", mr: 2, fontSize: 40 }}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Завершено
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, color: "#10b981" }}
                  >
                    {stats.completed}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {calculatePercentage(stats.completed)}% от общего числа
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ScheduleIcon sx={{ color: "#f59e0b", mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    В процессе
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, color: "#f59e0b" }}
                  >
                    {stats.inProgress}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {calculatePercentage(stats.inProgress)}% от общего числа
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <UncheckedIcon sx={{ color: "#6b7280", mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Не начато
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, color: "#6b7280" }}
                  >
                    {stats.notStarted}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {calculatePercentage(stats.notStarted)}% от общего числа
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Графики */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={6}>
          <Card className="chart-card">
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
                  sx={{
                    fontWeight: 700,
                    color: "#065f46",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PieChartIcon /> Распределение по статусам
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Круговая диаграмма">
                    <IconButton
                      size="small"
                      onClick={() => setChartType("pie")}
                      sx={{
                        backgroundColor:
                          chartType === "pie" ? "#10b981" : "#f0fdf4",
                        color: chartType === "pie" ? "white" : "#10b981",
                      }}
                    >
                      <PieChartIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Столбчатая диаграмма">
                    <IconButton
                      size="small"
                      onClick={() => setChartType("bar")}
                      sx={{
                        backgroundColor:
                          chartType === "bar" ? "#10b981" : "#f0fdf4",
                        color: chartType === "bar" ? "white" : "#10b981",
                      }}
                    >
                      <BarChartIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "pie" ? (
                    <PieChart>
                      <Pie
                        data={getStatusData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {getStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value) => [
                          `${value} технологий`,
                          "Количество",
                        ]}
                      />
                    </PieChart>
                  ) : (
                    <BarChart data={getStatusData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip
                        formatter={(value) => [
                          `${value} технологий`,
                          "Количество",
                        ]}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {getStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </Box>

              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                sx={{ mt: 2 }}
              >
                {getStatusData().map((status, index) => (
                  <Chip
                    key={index}
                    icon={getStatusIcon(
                      status.name === "Завершено"
                        ? "completed"
                        : status.name === "В процессе"
                        ? "in-progress"
                        : "not-started"
                    )}
                    label={`${status.name}: ${status.value}`}
                    size="small"
                    sx={{
                      backgroundColor: `${status.color}20`,
                      color: status.color,
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card className="chart-card">
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#065f46",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BarChartIcon /> Прогресс по категориям
              </Typography>

              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCategoryData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value, name) => {
                        if (name === "Технологий")
                          return [`${value} технологий`, "Количество"];
                        if (name === "Ср. прогресс")
                          return [`${value}%`, "Средний прогресс"];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="Технологий"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Ср. прогресс"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Прогресс бар */}
      <Card className="progress-card" sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#065f46", mb: 3 }}
          >
            📊 Общий прогресс изучения
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Общий прогресс
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#10b981" }}
              >
                {stats.totalProgress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={stats.totalProgress}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: "#f0fdf4",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #10b981, #34d399)",
                  borderRadius: 6,
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box
            className="chart-bar"
            sx={{
              height: 40,
              borderRadius: 8,
              overflow: "hidden",
              display: "flex",
            }}
          >
            {stats.completed > 0 && (
              <Tooltip
                title={`Завершено: ${stats.completed} (${calculatePercentage(
                  stats.completed
                )}%)`}
              >
                <Box
                  className="chart-segment completed"
                  sx={{
                    width: `${calculatePercentage(stats.completed)}%`,
                    backgroundColor: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      filter: "brightness(1.1)",
                    },
                  }}
                >
                  {calculatePercentage(stats.completed) > 10 && "Завершено"}
                </Box>
              </Tooltip>
            )}

            {stats.inProgress > 0 && (
              <Tooltip
                title={`В процессе: ${stats.inProgress} (${calculatePercentage(
                  stats.inProgress
                )}%)`}
              >
                <Box
                  className="chart-segment in-progress"
                  sx={{
                    width: `${calculatePercentage(stats.inProgress)}%`,
                    backgroundColor: "#f59e0b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      filter: "brightness(1.1)",
                    },
                  }}
                >
                  {calculatePercentage(stats.inProgress) > 10 && "В процессе"}
                </Box>
              </Tooltip>
            )}

            {stats.notStarted > 0 && (
              <Tooltip
                title={`Не начато: ${stats.notStarted} (${calculatePercentage(
                  stats.notStarted
                )}%)`}
              >
                <Box
                  className="chart-segment not-started"
                  sx={{
                    width: `${calculatePercentage(stats.notStarted)}%`,
                    backgroundColor: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      filter: "brightness(1.1)",
                    },
                  }}
                >
                  {calculatePercentage(stats.notStarted) > 10 && "Не начато"}
                </Box>
              </Tooltip>
            )}
          </Box>

          <Box
            className="chart-legend"
            sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 3 }}
          >
            {[
              { label: "Завершено", count: stats.completed, color: "#10b981" },
              {
                label: "В процессе",
                count: stats.inProgress,
                color: "#f59e0b",
              },
              { label: "Не начато", count: stats.notStarted, color: "#6b7280" },
            ]
              .filter((item) => item.count > 0)
              .map((item, index) => (
                <Box
                  key={index}
                  className="legend-item"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: item.color,
                      borderRadius: 4,
                    }}
                  />
                  <Typography variant="body2">
                    {item.label} ({item.count})
                  </Typography>
                </Box>
              ))}
          </Box>
        </CardContent>
      </Card>

      {/* Детализация по технологиям */}
      <Card className="details-card">
        <CardContent>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#065f46",
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            📋 Детализация по технологиям
          </Typography>

          {technologies.length > 0 ? (
            <Box className="tech-stats-list">
              <Stack spacing={2}>
                {technologies.map((tech) => (
                  <Paper
                    key={tech.id}
                    className="tech-stat-item"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #e5e7eb",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#d1fae5",
                        backgroundColor: "#f8fafc",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        {getStatusIcon(tech.status)}
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                          >
                            {tech.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {tech.category || "Без категории"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 3 }}
                      >
                        <Chip
                          label={
                            tech.status === "completed"
                              ? "Завершено"
                              : tech.status === "in-progress"
                              ? "В процессе"
                              : "Не начато"
                          }
                          size="small"
                          sx={{
                            backgroundColor:
                              tech.status === "completed"
                                ? "#d1fae5"
                                : tech.status === "in-progress"
                                ? "#fef3c7"
                                : "#f3f4f6",
                            color:
                              tech.status === "completed"
                                ? "#065f46"
                                : tech.status === "in-progress"
                                ? "#92400e"
                                : "#374151",
                            fontWeight: 600,
                          }}
                        />

                        <Box sx={{ width: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={tech.progress || 0}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: "#e5e7eb",
                              "& .MuiLinearProgress-bar": {
                                background:
                                  tech.progress === 100
                                    ? "linear-gradient(90deg, #10b981, #059669)"
                                    : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                                borderRadius: 3,
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            align="right"
                          >
                            {tech.progress || 0}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {tech.deadline && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <CalendarIcon
                          fontSize="small"
                          sx={{ color: "#6b7280" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Дедлайн:{" "}
                          {new Date(tech.deadline).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Stack>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Нет данных для отображения. Добавьте технологии для отслеживания
                прогресса.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default Statistics;
