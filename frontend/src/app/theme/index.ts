import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',                                  // тёмная тема
    primary: { main: '#0b63f0' },               
    secondary: { main: '#38bdf8' },               
    success: { main: '#22c55e' },                  // зелёный — «свободно»
    warning: { main: '#f59e0b' },                  // жёлтый — «в очереди»
    error: { main: '#ff0606' },                    // красный — «занято»
    background: {
      default: '#111d3bb3',                          // фон приложения 
      paper: '#132c55',                            // фон карточек 
    },
    text: {
      primary: '#e7edf3',                          //основной текст
      secondary: '#766d9f',                        // второстепенный
    },
    divider: '#0a1626',                            // цвет разделителей
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '1.75rem', fontWeight: 600 },
    h2: { fontSize: '1.35rem', fontWeight: 600 },
    h3: { fontSize: '1.1rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8, paddingInline: 20 } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { borderRadius: 14, border: '1px solid #0f6bec' },  //рамка
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', fullWidth: true },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: { borderBottom: '1px solid #0668f1' },
      },
    },
  },
});