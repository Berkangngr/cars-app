import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }
      }
    }
  }
});