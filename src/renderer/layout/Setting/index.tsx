import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import { storeAPI } from "@src/common/api/store";
import { CrawConfig } from "@src/main/store/types";
import { useMount } from "ahooks";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { CrawOptions } from "./CrawOptions";
import { STORE_KEY_ENUM } from "@src/common/constants";

export const Setting: React.FC = () => {
  const [config, _setConfig] = useState<CrawConfig | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const setConfig = (_config: Partial<CrawConfig>) => {
    _setConfig({ ...config, ..._config });
  };

  const init = async () => {
    const data = await storeAPI.get(STORE_KEY_ENUM.CRAW_LIULI);
    setConfig(data);
  };

  useMount(() => {
    init();
  });

  return (
    <Box sx={{ minWidth: 300, padding: 4 }}>
      <CrawOptions />
      <Typography sx={{ mb: 1, mt: 6 }}>同步配置</Typography>
      <Stack spacing={2}>
        <TextField
          value={config?.BASE_LINK}
          onChange={(ev) => {
            const value = ev.target.value;
            setConfig({ BASE_LINK: value });
          }}
          sx={{ mr: 2 }}
          label="Base Link"
          variant="standard"
        />
        {/* <TextField
          value={config?.PROXY}
          onChange={(ev) => {
            const value = ev.target.value;
            setConfig({ PROXY: value });
          }}
          sx={{ mr: 2 }}
          label="Proxy"
          variant="standard"
        /> */}
        <Stack direction={"row"} spacing={1}>
          <FormControlLabel
            control={
              <Switch
                checked={config?.SKIP_ADS}
                onChange={(ev, checked) => setConfig({ SKIP_ADS: checked })}
              />
            }
            label="跳过广告"
          />

          <FormControlLabel
            control={
              <Switch
                checked={config?.SKIP_EMPTY_UIDS}
                onChange={(ev, checked) =>
                  setConfig({ SKIP_EMPTY_UIDS: checked })
                }
              />
            }
            label="跳过无资源文章"
          />
        </Stack>

        <Button
          variant="outlined"
          sx={{ mr: 1 }}
          onClick={async () => {
            await storeAPI.set(STORE_KEY_ENUM.CRAW_LIULI, config);
            enqueueSnackbar("保存成功", { variant: "success" });
          }}
        >
          保存
        </Button>
      </Stack>
    </Box>
  );
};
