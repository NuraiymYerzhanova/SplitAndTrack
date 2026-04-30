import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3', // A clean blue for the main brand color
    secondary: '#4CAF50', // Green for positive balances/settlements
    error: '#F44336', // Red for expenses/debts
    background: '#F5F5F5',
    surface: '#FFFFFF',
  },
};