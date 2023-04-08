import { IconButton, SvgIcon, Tooltip } from '@mui/material';
import React from 'react';
import { useTheme } from '@src/renderer/hooks/useTheme';

// 主题切换按钮
export const ThemeSwitch = () => {
  const { toggleTheme, isDark } = useTheme();
  return (
    <Tooltip title="切换主题">
      <span className="cursor-pointer mr-2">
        {isDark ? (
          <IconButton onClick={() => toggleTheme()}>
            <SvgIcon
              sx={{
                width: '1.6em',
                height: '1.6em',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path
                  fill="currentColor"
                  d="M512 832c-179.2 0-320-140.8-320-320s140.8-320 320-320 320 140.8 320 320-140.8 320-320 320m0 64c211.2 0 384-172.8 384-384S723.2 128 512 128 128 300.8 128 512s172.8 384 384 384zm288-384c0-160-128-288-288-288v576c160 0 288-128 288-288zm-320 96H243.2c6.4 12.8 12.8 32 19.2 44.8H480V608zm0-192v-44.8H262.4c-6.4 12.8-12.8 32-19.2 44.8H480zm0-115.2V256h-96c-25.6 12.8-44.8 25.6-64 44.8h160zM224 537.6h256v-44.8H224v44.8zm256 185.6H320c19.2 19.2 38.4 32 64 44.8h96v-44.8z"
                />
              </svg>
            </SvgIcon>
          </IconButton>
        ) : (
          <IconButton onClick={() => toggleTheme()}>
            <SvgIcon
              sx={{
                width: '1.6em',
                height: '1.6em',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path
                  fill="currentColor"
                  d="M512 192c179.2 0 320 140.8 320 320S691.2 832 512 832 192 691.2 192 512s140.8-320 320-320m0-64c-211.2 0-384 172.8-384 384s172.8 384 384 384 384-172.8 384-384-172.8-384-384-384zm32 288h236.8c-6.4-12.8-12.8-32-19.2-44.8H544V416zm0 192v44.8h217.6c6.4-12.8 12.8-32 19.2-44.8H544zm0 115.2V768h96c25.6-12.8 44.8-25.6 64-44.8H544zm256-230.4H544v44.8h256V512v-19.2zm-256-192h160c-19.2-19.2-38.4-32-64-44.8h-96v44.8z"
                />
              </svg>
            </SvgIcon>
          </IconButton>
        )}
      </span>
    </Tooltip>
  );
};
