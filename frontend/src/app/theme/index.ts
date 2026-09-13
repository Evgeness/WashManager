// Импортируем функцию создания темы из MUI
import { createTheme } from '@mui/material/styles';

// Создаём и экспортируем единую тему приложения.
// Все компоненты MUI автоматически подхватят эти настройки.
export const theme = createTheme({
  // ===== ЦВЕТОВАЯ ПАЛИТРА =====
  palette: {
    mode: 'dark',                       // Тёмная тема — MUI автоматически
                                        // подбирает контрастные цвета для текста/фонов

    primary:   { main: '#0b63f0' },     // Основной акцент (синий) — кнопки, активные вкладки
    secondary: { main: '#38bdf8' },     // Дополнительный акцент (голубой) — иконки, ссылки
    success:   { main: '#22c55e' },     // Зелёный — статус «свободно»
    warning:   { main: '#f59e0b' },     // Жёлтый — статус «в очереди»
    error:     { main: '#ff0606' },     // Красный — статус «занято»

    // Фоновые цвета
    background: {
      default: '#111d3bb3',             // Основной фон страницы
      paper:   '#132c55',               // Фон карточек, меню, диалогов
    },

    // Цвета текста
    text: {
      primary:   '#e7edf3',             // Основной текст (почти белый)
      secondary: '#766d9f',             // Второстепенный текст (приглушённый)
    },

    divider: '#0a1626',                 // Цвет разделителей (Divider)
  },

  // ===== ФОРМА КОМПОНЕНТОВ =====
  shape: { borderRadius: 10 },          // Базовое скругление углов для всех компонентов

  // ===== ТИПОГРАФИКА =====
  typography: {
    // Основной шрифт для всего приложения
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',

    // Стили для разных уровней заголовков (variant="h1", "h2", "h3")
    h1: { fontSize: '1.75rem', fontWeight: 600 },  // Самый крупный — заголовок страницы
    h2: { fontSize: '1.35rem', fontWeight: 600 },  // Средний — заголовок карточки
    h3: { fontSize: '1.1rem',  fontWeight: 600 },  // Мелкий — заголовок блока

    // Кнопки: убираем автоматический UPPERCASE и задаём вес шрифта
    button: { textTransform: 'none', fontWeight: 500 },
  },

  // ===== ПЕРЕОПРЕДЕЛЕНИЕ КОМПОНЕНТОВ MUI =====
  // Здесь можно задать стили по умолчанию для всех Button, Card, TextField и т.д.
  components: {
    // Кнопки
    MuiButton: {
      defaultProps: { disableElevation: true },       // Убираем тень у кнопок
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 20 }, // Скругление и боковые отступы
      },
    },

    // Карточки
    MuiCard: {
      defaultProps: { elevation: 0 },                 // Без тени
      styleOverrides: {
        root: {
          borderRadius: 14,                         // Более выраженное скругление
          border: '1px solid #0f6bec',              // Синяя тонкая обводка
        },
      },
    },

    // Текстовые поля
    MuiTextField: {
      defaultProps: { size: 'small', fullWidth: true }, // Маленькие поля на всю ширину
    },

    // Верхняя панель (шапка)
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' }, // Без тени, наследует цвет
      styleOverrides: {
        root: { borderBottom: '1px solid #0668f1' },    // Синяя линия снизу
      },
    },
  },
});