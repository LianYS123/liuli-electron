import React from 'react';
import { useMount } from 'react-use';
import { useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material';
import { RootState } from '../models';
import { useTheme } from '../hooks/useTheme';

const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useSelector(({ app }: RootState) => app);
  const { switchTo } = useTheme();

  // 初始化主题
  useMount(() => {
    const t = localStorage.getItem('theme');
    if (t) {
      switchTo(t);
    }
  });
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: theme as 'dark' | 'light', // Switching the dark mode on is a single property value change.
        },
      })}
    >
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
