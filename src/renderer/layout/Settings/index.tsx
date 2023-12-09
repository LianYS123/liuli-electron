import { AppBar, Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { WallpaperSetting } from './WallpaperSetting';
import { SearchSetting } from './SearchSetting';

export enum SettingActionEnum {
  Wallpaper,
  Search,
}

const actions: { key: SettingActionEnum; label: string }[] = [
  {
    key: SettingActionEnum.Wallpaper,
    label: '主题设置',
  },
  {
    key: SettingActionEnum.Search,
    label: '搜索设置',
  },
];

export const Settings: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const [currentAction, setCurrentAction] = useState<SettingActionEnum>(
    SettingActionEnum.Wallpaper,
  );

  const renderContent = () => {
    switch (currentAction) {
      case SettingActionEnum.Wallpaper:
        return <WallpaperSetting enabled={enabled} />;

      case SettingActionEnum.Search:
        return <SearchSetting />;

      default:
        return <>敬请期待</>;
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 450,
        minWidth: 450,
        padding: 2,
      }}
    >
      <AppBar
        color="default"
        sx={{
          position: 'sticky',
        }}
      >
        <Tabs
          value={currentAction}
          onChange={(ev, action) => {
            setCurrentAction(action);
          }}
        >
          {actions.map(({ key, label }) => {
            return <Tab key={key} value={key} label={label} />;
          })}
        </Tabs>
      </AppBar>
      <Box sx={{ height: 30 }} />
      {renderContent()}
    </Box>
  );
};
