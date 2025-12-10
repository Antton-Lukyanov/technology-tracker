import { useState } from "react";
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
  Fade,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  FilterList as FilterIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  DoneAll as DoneAllIcon,
  Pending as PendingIcon,
  AddTask as AddTaskIcon,
} from "@mui/icons-material";
import BulkStatusEditor from "../components/BulkStatusEditor";
import useTechnologiesApi from "../hooks/useTechnologiesApi";
import "./BulkEditPage.css";

function BulkEditPage() {
  const navigate = useNavigate();
  const { technologies, loading, error, bulkUpdateStatuses } =
    useTechnologiesApi();

  const [updateMessage, setUpdateMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpdateStatuses = (updates) => {
    try {
      bulkUpdateStatuses(updates);

      const updatedCount = updates.length;
      setUpdateMessage(`✅ Успешно обновлено ${updatedCount} технологий`);
      setShowSuccess(true);

      setTimeout(() => {
        setUpdateMessage("");
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("Ошибка массового обновления:", err);
      setUpdateMessage("❌ Произошла ошибка при обновлении");
      setShowSuccess(false);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  const calculateStats = () => {
    if (!technologies || technologies.length === 0) return null;

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

    return { total, completed, inProgress, notStarted };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Container maxWidth="xl" className="bulk-edit-page loading">
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
                animation: "pulse 2s ease-in-out infinite",
              },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "#065f46",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            <GroupIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Загружаем технологии для массового редактирования...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" className="bulk-edit-page error">
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
          <Card className="error-card" sx={{ maxWidth: 500 }}>
            <CardContent>
              <WarningIcon sx={{ fontSize: 60, color: "#ef4444", mb: 2 }} />
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 700, color: "#dc2626" }}
              >
                Ошибка загрузки
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {error}
              </Typography>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/")}
                sx={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Вернуться на главную
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="bulk-edit-page">
      {/* Анимированный фон */}
      <div className="animated-background"></div>

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
            <Tooltip title="Вернуться на главную">
              <IconButton
                onClick={() => navigate("/")}
                sx={{
                  backgroundColor: "#f0fdf4",
                  color: "#10b981",
                  "&:hover": {
                    backgroundColor: "#d1fae5",
                    transform: "scale(1.1) rotate(-180deg)",
                  },
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "2px solid #d1fae5",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 50%, #34d399 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <SpeedIcon sx={{ fontSize: "2.5rem" }} />
                Массовое редактирование
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <GroupIcon fontSize="small" />
                Управляйте статусами нескольких технологий одновременно
              </Typography>
            </Box>
          </Box>

          {/* Быстрые действия */}
          {stats && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => window.location.reload()}
                sx={{
                  borderColor: "#d1fae5",
                  color: "#065f46",
                  "&:hover": {
                    borderColor: "#10b981",
                    backgroundColor: "#f0fdf4",
                  },
                }}
              >
                Обновить
              </Button>
              <Button
                variant="contained"
                startIcon={<DoneAllIcon />}
                onClick={() => navigate("/add-technology")}
                sx={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Добавить
              </Button>
            </Stack>
          )}
        </Box>
      </Box>

      {/* Сообщение об успехе */}
      <Fade in={showSuccess}>
        <Alert
          severity="success"
          className="success-alert"
          sx={{
            mb: 3,
            borderRadius: 3,
            border: "2px solid #d1fae5",
            backgroundColor: "rgba(209, 250, 229, 0.95)",
            backdropFilter: "blur(10px)",
            animation: "slideIn 0.5s ease-out",
            "& .MuiAlert-icon": {
              fontSize: "2rem",
            },
          }}
          onClose={() => setShowSuccess(false)}
        >
          <AlertTitle
            sx={{
              color: "#065f46",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TrendingUpIcon />
            Операция выполнена успешно!
          </AlertTitle>
          <Typography sx={{ color: "#047857", fontWeight: 500 }}>
            {updateMessage}
          </Typography>
        </Alert>
      </Fade>

      {/* Статистика */}
      {stats && (
        <Card className="stats-overview" sx={{ mb: 4 }}>
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
                mb: 3,
              }}
            >
              <FilterIcon />
              Обзор технологий
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper className="stat-item total" elevation={0}>
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        color: "#3b82f6",
                        mb: 1,
                      }}
                    >
                      {stats.total}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      Всего технологий
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper className="stat-item completed" elevation={0}>
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        color: "#10b981",
                        mb: 1,
                      }}
                    >
                      {stats.completed}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      Завершено
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper className="stat-item in-progress" elevation={0}>
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        color: "#f59e0b",
                        mb: 1,
                      }}
                    >
                      {stats.inProgress}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      В процессе
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper className="stat-item not-started" elevation={0}>
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        color: "#6b7280",
                        mb: 1,
                      }}
                    >
                      {stats.notStarted}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      Не начато
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Основной контент */}
      <Box className="page-content">
        {/* Информационная карточка */}
        <Card className="info-card" sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: "#10b981",
                      color: "white",
                      borderRadius: "50%",
                      width: 48,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <InfoIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#065f46" }}
                    >
                      Как работает массовое редактирование?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      1. Выберите технологии с помощью чекбоксов или кнопки
                      "Выбрать все"
                      <br />
                      2. Установите новый статус из выпадающего списка
                      <br />
                      3. Нажмите "Применить изменения" для сохранения
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Быстро"
                    size="small"
                    sx={{
                      backgroundColor: "#d1fae5",
                      color: "#065f46",
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<AddTaskIcon />}
                    label="Удобно"
                    size="small"
                    sx={{
                      backgroundColor: "#f0f9ff",
                      color: "#0369a1",
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<PendingIcon />}
                    label="Эффективно"
                    size="small"
                    sx={{
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                      fontWeight: 600,
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Компонент массового редактирования */}
        {technologies && technologies.length > 0 ? (
          <BulkStatusEditor
            technologies={technologies}
            onUpdateStatuses={handleUpdateStatuses}
            onClose={handleClose}
          />
        ) : (
          <Card className="empty-state-card">
            <CardContent
              sx={{
                textAlign: "center",
                py: 8,
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  backgroundColor: "#f0fdf4",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  border: "2px dashed #d1fae5",
                }}
              >
                <GroupIcon sx={{ fontSize: 48, color: "#9ca3af" }} />
              </Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 700, color: "#374151" }}
              >
                Нет технологий для редактирования
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ maxWidth: 500, margin: "0 auto 24px" }}
              >
                Добавьте технологии, чтобы использовать мощные возможности
                массового редактирования статусов.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<AddTaskIcon />}
                  onClick={() => navigate("/add-technology")}
                  sx={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Добавить технологии
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/")}
                  sx={{
                    borderColor: "#d1fae5",
                    color: "#065f46",
                    "&:hover": {
                      borderColor: "#10b981",
                    },
                  }}
                >
                  На главную
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Подсказки внизу */}
      <Fade in={!loading && !error && technologies && technologies.length > 0}>
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
              💡 Профессиональные советы
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper className="tip-item" sx={{ p: 2, height: "100%" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: "#10b981", mb: 1 }}
                  >
                    Группировка по статусу
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Обновляйте статусы группой технологий с одинаковым текущим
                    статусом для быстрой организации.
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper className="tip-item" sx={{ p: 2, height: "100%" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: "#3b82f6", mb: 1 }}
                  >
                    Регулярное обновление
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Используйте массовое редактирование для еженедельного
                    обновления прогресса всех технологий.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
}

export default BulkEditPage;
