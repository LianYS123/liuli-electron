import React, { useState } from 'react';
import { useMount } from 'react-use';
import { createTheme, ThemeProvider } from '@mui/material';
import { ConfigProvider, theme as antdtheme } from 'antd';
import { ThemeType } from '../types/theme';
import { useMemoizedFn } from 'ahooks';

const initialTheme = (localStorage.getItem('theme') as ThemeType) || 'dark';

export const ThemeContext = React.createContext<{
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}>({
  theme: initialTheme,
  setTheme: () => null,
});

const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<ThemeType>(initialTheme);

  const setTheme = useMemoizedFn((theme: ThemeType) => {
    const { body } = document;
    const isDark = theme === 'dark';
    setThemeState(theme);
    localStorage.setItem('theme', theme);
    if (isDark) {
      body.setAttribute('theme-mode', 'dark');
      body.classList.add('dark');
      body.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      body.removeAttribute('theme-mode');
      body.classList.remove('dark');
      body.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    }
  });

  // 初始化主题
  useMount(() => {
    setTheme(initialTheme);
  });
  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === 'dark'
            ? antdtheme.darkAlgorithm
            : antdtheme.defaultAlgorithm,
      }}
    >
      <ThemeProvider
        theme={createTheme({
          palette: {
            mode: theme,
          },
        })}
      >
        <ThemeContext.Provider value={{ theme: theme || 'dark', setTheme }}>
          {children}
        </ThemeContext.Provider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default AppThemeProvider;
