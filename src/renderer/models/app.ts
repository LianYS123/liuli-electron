import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    wallpaper: localStorage.getItem("wallpaper") || "",
    theme: "light" // 默认暗色主题
  },
  reducers: {
    setWallpaper: (state, action) => {
      localStorage.setItem("wallpaper", action.payload);
      state.wallpaper = action.payload;
    },
    setTheme: (state, action) => {
      const { body } = document;
      const isDark = action.payload === "dark";
      localStorage.setItem("theme", action.payload);
      state.theme = action.payload;
      if (isDark) {
        body.setAttribute("theme-mode", "dark");
        body.classList.add("dark");
        body.classList.remove("light");
        document.documentElement.style.colorScheme = "dark";
      } else {
        body.removeAttribute("theme-mode");
        body.classList.remove("dark");
        body.classList.add("light");
        document.documentElement.style.colorScheme = "light";
      }
    }
  }
});

export default appSlice.reducer;
