import { RootState } from '../models';
import { appSlice } from '../models/app';
import { useDispatch, useSelector } from 'react-redux';

// 主题操作
export const useTheme = () => {
  const { theme } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const switchTo = (mode: string) => {
    // eslint-disable-next-line no-console
    console.log(`switch to ${mode}`);
    dispatch(appSlice.actions.setTheme(mode));
  };
  const switchToLight = () => {
    switchTo('light');
  };
  const switchToDark = () => {
    switchTo('dark');
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
  return { theme, isDark, switchToDark, switchToLight, toggleTheme, switchTo };
};
