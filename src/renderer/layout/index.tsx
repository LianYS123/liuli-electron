import {
  Box,
  Container,
  Drawer,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from "@mui/material";
import React, { useState } from "react";
import AppHeader from "./AppHeader";
import {
  ArrowBack,
  ArrowForward,
  DarkMode,
  LightMode,
  Refresh,
  Settings
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../models";
import { Setting } from "./Setting";
import { useTheme } from "../hooks/useTheme";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const nav = useNavigate();
  const [open, setOpen] = useState(true);
  const [configDrawerVisible, setConfigDrawerVisible] = useState(false);
  const { wallpaper } = useSelector((state: RootState) => state.app);
  const { isDark, toggleTheme } = useTheme();

  return (
    <Box
      sx={{
        height: "100%",
        backgroundImage: wallpaper ? `url('${wallpaper}')` : undefined,
        overflow: "auto",
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
      <Container
        sx={{
          height: "100%",
          overflow: "auto"
        }}
      >
        {/* <AppHeader /> */}
        {children}
        <SpeedDial
          open={open}
          onClick={() => {
            setOpen(!open);
          }}
          onOpen={() => setOpen(true)}
          sx={{ position: "fixed", bottom: 30, right: 30 }}
          icon={<SpeedDialIcon />}
          ariaLabel={""}
        >
          <SpeedDialAction
            onClick={(ev) => {
              toggleTheme();
              ev.stopPropagation();
            }}
            icon={isDark ? <LightMode /> : <DarkMode />}
            tooltipTitle={"切换主题"}
          />
          <SpeedDialAction
            onClick={(ev) => {
              setConfigDrawerVisible(true);
              ev.stopPropagation();
            }}
            icon={<Settings />}
            tooltipTitle={"配置"}
          />
          <SpeedDialAction
            onClick={(ev) => {
              ev.stopPropagation();
              location.reload();
            }}
            icon={<Refresh />}
            tooltipTitle={"刷新"}
          />
          <SpeedDialAction
            onClick={(ev) => {
              ev.stopPropagation();
              nav(1);
            }}
            icon={<ArrowForward />}
            tooltipTitle={"前进"}
          />
          <SpeedDialAction
            onClick={(ev) => {
              ev.stopPropagation();
              nav(-1);
            }}
            icon={<ArrowBack />}
            tooltipTitle={"后退"}
          />
        </SpeedDial>

        <Drawer
          sx={{ width: 300 }}
          anchor={"right"}
          open={configDrawerVisible}
          onClose={() => setConfigDrawerVisible(false)}
        >
          <Setting />
        </Drawer>
      </Container>
    </Box>
  );
};
