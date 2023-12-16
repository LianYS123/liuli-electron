import { useMemoizedFn } from 'ahooks';
import React, { useState } from 'react';

const initialWallpaper = localStorage.getItem('wallpaper') || '';

export const WallpaperContext = React.createContext<{
  wallpaper?: string;
  setWallpaper: (wallpaper?: string) => void;
}>({
  wallpaper: initialWallpaper,
  setWallpaper: () => null,
});

export const WallpaperProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wallpaper, setWallpaperState] = useState<string>(initialWallpaper);

  const setWallpaper = useMemoizedFn((wallpaper?: string) => {
    localStorage.setItem('wallpaper', wallpaper || '');
    setWallpaperState(wallpaper || '');
  });

  return (
    <WallpaperContext.Provider
      value={{
        wallpaper,
        setWallpaper,
      }}
    >
      {children}
    </WallpaperContext.Provider>
  );
};
