import { useContext } from 'react';
import { ThemeContext } from '../providers/AppThemeProvider';

// 主题操作
export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const switchToLight = () => {
    setTheme('light');
  };
  const switchToDark = () => {
    setTheme('dark');
  };
  // 切换主题
  const toggleTheme = () => {
    if (theme === 'dark') {
      switchToLight();
    } else {
      switchToDark();
    }
  };
  const isDark = theme === 'dark';
  return {
    theme,
    isDark,
    switchToDark,
    switchToLight,
    toggleTheme,
    switchTo: setTheme,
  };
};
