import { Box, Stack, TextField } from "@mui/material";
import { useLocalStorageState } from "ahooks";
import React from "react";

export const SEARCH_SETTINGS_KEY = "SEARCH_SETTINGS_KEY";

export interface SearchConfig {
  site?: string;
  limit: number;
}

export const defaultSearchConfig = {
  limit: 5,
};

export const SearchSetting: React.FC = () => {
  const [{ limit, site }, _setState] = useLocalStorageState<SearchConfig>(
    SEARCH_SETTINGS_KEY,
    {
      defaultValue: defaultSearchConfig,
    }
  );
  const setState = (state: Partial<SearchConfig>) => {
    _setState((s) => ({ ...s, ...state }));
  };
  return (
    <Box
      sx={{
        width: "80%",
        ml: 1,
        // margin: "0 auto",
      }}
    >
      <Stack spacing={2}>
        <TextField
          type="number"
          value={limit}
          onChange={(ev) => {
            const value = ev.target.value;
            setState({ limit: Number(value) });
          }}
          sx={{ mr: 2 }}
          label="关键词长度限制"
          variant="standard"
        />
        <TextField
          value={site}
          onChange={(ev) => {
            const value = ev.target.value;
            setState({ site: value });
          }}
          sx={{ mr: 2 }}
          label="检索网站"
          variant="standard"
        />
      </Stack>
    </Box>
  );
};
