import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useMeasure, useWindowScroll } from "react-use";
import { ButtonBase, Slide, useScrollTrigger } from "@mui/material";
import SearchBar from "@src/renderer/components/searchBar";
import { ThemeSwitch } from "./ThemeSwitch";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_MENUS } from "./config";
import { routers } from "@src/renderer/config";

export default function AppHeader() {
  const { y } = useWindowScroll();
  const trigger = useScrollTrigger();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [ref, { height }] = useMeasure<any>();
  return (
    <Box minHeight={height}>
      <Slide in={!trigger}>
        <AppBar
          ref={ref}
          color="inherit"
          sx={{ boxShadow: y > 10 ? 1 : 0, zIndex: 100 }}
          position="fixed"
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ width: 256 }}>
                <SearchBar
                  onRequestSearch={(keyword) =>
                    nav(routers.HOME, {
                      state: { keyword }
                    })
                  }
                />
              </Box>
            </Box>
            <Box>
              {APP_MENUS.map(({ to, text, icon }) => {
                return (
                  <ButtonBase
                    key={text}
                    onClick={() => nav(to)}
                    sx={{
                      px: 0.8,
                      py: 0.4,
                      mr: 2,
                      borderBottom: to === pathname ? "3px solid" : "none",
                      borderColor: "primary.main"
                    }}
                  >
                    {text}
                  </ButtonBase>
                );
              })}
            </Box>
            <Box>
              <ThemeSwitch />
            </Box>
          </Toolbar>
        </AppBar>
      </Slide>
    </Box>
  );
}
