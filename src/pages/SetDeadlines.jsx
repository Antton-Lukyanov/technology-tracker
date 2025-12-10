// pages/SetDeadlines.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Grid,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material";
import DeadlineForm from "../components/DeadlineForm";
import useTechnologiesApi from "../hooks/useTechnologiesApi";
import "./SetDeadlines.css";

function SetDeadlines() {
  const navigate = useNavigate();
  const { technologies, loading, error, updateStatus } = useTechnologiesApi();
  const [localTechnologies, setLocalTechnologies] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (technologies.length > 0) {
      setLocalTechnologies(technologies);
    }
  }, [technologies]);

  const handleSaveDeadlines = (deadlinesData) => {
    // Обновляем технологии с новыми дедлайнами
    const updatedTechs = localTechnologies.map((tech) => ({
      ...tech,
      deadline: deadlinesData[tech.id] || tech.deadline,
    }));

    setLocalTechnologies(updatedTechs);

    // Сохраняем в localStorage
    try {
      localStorage.setItem("technologies", JSON.stringify(updatedTechs));

      // Показываем сообщение об успехе
      const updatedCount = Object.keys(deadlinesData).length;
      setSuccessMessage(`✅ Установлено ${updatedCount} дедлайнов`);
      setShowSuccess(true);

      // Скрываем сообщение через 5 секунд
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      setSuccessMessage("❌ Ошибка сохранения дедлайнов");
      setShowSuccess(true);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const calculateStats = () => {
    const total = localTechnologies.length;
    const withDeadlines = localTechnologies.filter(
      (tech) => tech.deadline
    ).length;
    const withoutDeadlines = total - withDeadlines;

    // Проверка просроченных дедлайнов
    const now = new Date();
    const overdue = localTechnologies.filter((tech) => {
      if (!tech.deadline) return false;
      return new Date(tech.deadline) < now && tech.status !== "completed";
    }).length;

    // Ближайшие дедлайны (в течение недели)
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcoming = localTechnologies.filter((tech) => {
      if (!tech.deadline) return false;
      const deadline = new Date(tech.deadline);
      return (
        deadline > now && deadline <= weekFromNow && tech.status !== "completed"
      );
    }).length;

    return {
      total,
      withDeadlines,
      withoutDeadlines,
      overdue,
      upcoming,
      deadlinePercentage:
        total > 0 ? Math.round((withDeadlines / total) * 100) : 0,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Container maxWidth="xl" className="deadlines-page loading">
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
            Загружаем технологии для установки сроков...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" className="deadlines-page error">
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 3,
          }}
        >
          <Alert
            severity="error"
            sx={{
              maxWidth: 500,
              borderRadius: 3,
              backgroundColor: "#fef2f2",
              border: "2px solid #fee2e2",
            }}
          >
            <AlertTitle sx={{ color: "#dc2626", fontWeight: 700 }}>
              <WarningIcon sx={{ mr: 1 }} />
              Ошибка загрузки
            </AlertTitle>
            <Typography sx={{ color: "#7f1d1d" }}>{error}</Typography>
          </Alert>

          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
              },
            }}
          >
            Вернуться на главную
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="deadlines-page">
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
              onClick={() => navigate("/")}
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
                <CalendarIcon sx={{ fontSize: "2.5rem" }} />
                Установка сроков изучения
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Установите дедлайны для планирования вашего обучения
              </Typography>
            </Box>
          </Box>

          {/* Статистика */}
          <Card className="stats-card" sx={{ minWidth: 300 }}>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Технологий со сроками
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, color: "#065f46" }}
                  >
                    {stats.withDeadlines}/{stats.total}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <LinearProgress
                    variant="determinate"
                    value={stats.deadlinePercentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #10b981, #34d399)",
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {stats.deadlinePercentage}%
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Сообщение об успехе */}
      {showSuccess && successMessage && (
        <Alert
          severity="success"
          className="success-alert"
          sx={{
            mb: 3,
            borderRadius: 3,
            border: "2px solid #d1fae5",
            backgroundColor: "#f0fdf4",
            animation: "slideDown 0.5s ease-out",
          }}
          onClose={() => setShowSuccess(false)}
        >
          <AlertTitle sx={{ color: "#065f46", fontWeight: 700 }}>
            <EventAvailableIcon sx={{ mr: 1 }} />
            Успешно!
          </AlertTitle>
          <Typography sx={{ color: "#047857" }}>{successMessage}</Typography>
        </Alert>
      )}

      {/* Основной контент */}
      <Box className="page-content" sx={{ position: "relative" }}>
        {/* Информационная панель */}
        <Paper className="info-panel" sx={{ mb: 4, p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LightbulbIcon sx={{ color: "#f59e0b", fontSize: 40 }} />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#92400e" }}
                  >
                    Почему важно устанавливать сроки?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Дедлайны помогают структурировать обучение, повышают
                    мотивацию и позволяют отслеживать прогресс.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Tooltip title="Обновить список">
                  <IconButton
                    onClick={() => window.location.reload()}
                    sx={{
                      backgroundColor: "#f0fdf4",
                      color: "#10b981",
                      "&:hover": {
                        backgroundColor: "#d1fae5",
                      },
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/")}
                  sx={{
                    borderColor: "#d1fae5",
                    color: "#065f46",
                    "&:hover": {
                      borderColor: "#10b981",
                      backgroundColor: "#f0fdf4",
                    },
                  }}
                >
                  На главную
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Статистика по срокам */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent sx={{ textAlign: "center" }}>
                <EventAvailableIcon
                  sx={{ fontSize: 40, color: "#10b981", mb: 1 }}
                />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: "#065f46" }}
                >
                  {stats.withDeadlines}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Со сроками
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent sx={{ textAlign: "center" }}>
                <EventBusyIcon sx={{ fontSize: 40, color: "#6b7280", mb: 1 }} />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: "#374151" }}
                >
                  {stats.withoutDeadlines}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Без сроков
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card warning">
              <CardContent sx={{ textAlign: "center" }}>
                <WarningIcon sx={{ fontSize: 40, color: "#ef4444", mb: 1 }} />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: "#dc2626" }}
                >
                  {stats.overdue}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Просрочено
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card upcoming">
              <CardContent sx={{ textAlign: "center" }}>
                <ScheduleIcon sx={{ fontSize: 40, color: "#3b82f6", mb: 1 }} />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: "#1d4ed8" }}
                >
                  {stats.upcoming}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ближайшие
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Форма установки сроков */}
        {localTechnologies.length === 0 ? (
          <Card className="empty-card">
            <CardContent
              sx={{
                textAlign: "center",
                py: 8,
                background: "linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)",
                borderRadius: 3,
              }}
            >
              <CalendarIcon sx={{ fontSize: 60, color: "#9ca3af", mb: 3 }} />
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 700, color: "#374151" }}
              >
                Нет технологий для установки сроков
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Добавьте технологии, чтобы установить сроки их изучения.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/add-technology")}
                  sx={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                    },
                  }}
                >
                  Добавить технологию
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/")}
                  sx={{
                    borderColor: "#d1fae5",
                    color: "#065f46",
                  }}
                >
                  На главную
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <>
            <DeadlineForm
              technologies={localTechnologies}
              onSaveDeadlines={handleSaveDeadlines}
              onCancel={handleCancel}
            />

            {/* Подсказки */}
            <Card className="tips-card" sx={{ mt: 4 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: "#065f46",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  💡 Советы по установке сроков
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#10b981",
                          color: "white",
                          borderRadius: "50%",
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          mt: 0.5,
                        }}
                      >
                        1
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          Реалистичные сроки
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Учитывайте сложность технологии и вашу загруженность
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#3b82f6",
                          color: "white",
                          borderRadius: "50%",
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          mt: 0.5,
                        }}
                      >
                        2
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          Буфер времени
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Добавляйте 20-30% времени на непредвиденные
                          обстоятельства
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#8b5cf6",
                          color: "white",
                          borderRadius: "50%",
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          mt: 0.5,
                        }}
                      >
                        3
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          Регулярный пересмотр
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Периодически обновляйте сроки в соответствии с
                          прогрессом
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Container>
  );
}

export default SetDeadlines;
