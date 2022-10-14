import { createTheme, colors } from '@mui/material';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#287233'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: colors.red.A400
    }
  }
});

export default theme;
