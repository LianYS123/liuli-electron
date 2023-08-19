import {
  Box,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField
} from "@mui/material";
import { storeAPI } from "@src/common/api/store";
import { CrawConfig } from "@src/main/store/types";
import { useDebounceFn, useMount } from "ahooks";
import React, { useRef, useState } from "react";
import { STORE_KEY_ENUM } from "@src/common/constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { articleAPI } from "@src/common/api/article";
import { useSnackbar } from "notistack";
import { articleCrawAPI } from "@src/common/api/articleCraw";
import { LoadingButton } from "@mui/lab";
import { formatTimeDetail } from "@src/renderer/utils/time";
import { formatDistanceStrict } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useAlertDialog } from "@src/renderer/providers/AlertDialogProvider";

export const DataSync: React.FC = () => {
  const [config, _setConfig] = useState<CrawConfig>({
    BASE_LINK: "",
    PROXY: "",
    SKIP_ADS: false,
    SKIP_EMPTY_UIDS: false
  });
  const { enqueueSnackbar } = useSnackbar();

  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const client = useQueryClient();
  function refetch() {
    client.refetchQueries(["/article/list"], { active: true });
  }
  const { mutateAsync: craw } = useMutation(articleAPI.fetchArticles);
  const { open } = useAlertDialog();

  const prePending = useRef(-1);

  const [refetchInterval, setRefetchInterval] = useState(1000);

  const {
    data: {
      errors,
      insertCount,
      pending,
      startTime,
      updateCount,
      endTime
    } = {},
    isIdle
  } = useQuery("ArticleCrawPending", () => articleCrawAPI.stat(), {
    refetchInterval,
    onSuccess: ({ pending = 0 }) => {
      if (!pending) {
        setRefetchInterval(1000 * 5);
      } else {
        setRefetchInterval(1000);
      }
      if (pending < prePending.current) {
        // refetch();
      }
      prePending.current = pending;
    }
  });

  const { data: totalPages } = useQuery(
    ["ArticleCrawGetEndPage"],
    () => articleCrawAPI.getEndPage(),
    {}
  );

  const { run: handleCraw } = useDebounceFn(craw, { wait: 100 });

  const { run: handleSave } = useDebounceFn(
    async () => {
      await storeAPI.set(STORE_KEY_ENUM.CRAW_LIULI, config);
    },
    { wait: 100 }
  );

  const setConfig = (_config: Partial<CrawConfig>) => {
    _setConfig({ ...config, ..._config });
    handleSave();
  };

  const init = async () => {
    const data = await storeAPI.get(STORE_KEY_ENUM.CRAW_LIULI);
    setConfig(data);
  };

  useMount(() => {
    init();
  });

  const getCost = () => {
    if (startTime && endTime) {
      const cost = formatDistanceStrict(endTime, startTime, {
        locale: zhCN
      });
      return cost;
    } else {
      return "";
    }
  };

  return (
    <Box sx={{ minWidth: 300, padding: 4 }}>
      <Stack spacing={2}>
        <TextField
          type="number"
          value={startPage}
          onChange={(ev) => {
            setStartPage(Number(ev.target.value));
          }}
          sx={{ mr: 2 }}
          label="Start Page"
          variant="standard"
        />
        <TextField
          type="number"
          value={endPage}
          onChange={(ev) => {
            setEndPage(Number(ev.target.value));
          }}
          sx={{ mr: 2 }}
          label="End Page"
          variant="standard"
        />

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
        <LoadingButton
          disabled={isIdle}
          variant="outlined"
          onClick={async () => {
            if (pending) {
              open({
                content: "确定要中断任务？",
                onOk: async () => {
                  await articleCrawAPI.clearAll();
                  enqueueSnackbar("操作成功");
                }
              });
            } else {
              await handleCraw({ startPage, endPage });
              enqueueSnackbar("操作成功");
            }
          }}
        >
          {pending ? "同步中，点击中断" : "同步"}
        </LoadingButton>
        <LoadingButton
          disabled={isIdle || !!pending}
          variant="outlined"
          onClick={async () => {
            await handleCraw({ startPage, endPage: totalPages });
            enqueueSnackbar("操作成功");
          }}
          // loading={!!pending}
        >
          <span>全部{totalPages ? `（共 ${totalPages} 页）` : ""}</span>
        </LoadingButton>

        <Box sx={{ mt: 2 }}>
          <Paper
            sx={{ padding: "8px", color: (t) => t.palette.text.secondary }}
          >
            <Stack spacing={1}>
              <Box>开始时间：{formatTimeDetail(startTime) || "--"}</Box>
              <Box>结束时间：{formatTimeDetail(endTime) || "--"}</Box>
              <Box>耗时：{getCost() || "--"}</Box>
              <Box>插入条数: {insertCount || 0}</Box>
              <Box>更新条数: {updateCount || 0}</Box>
              <Box>错误数: {errors || 0}</Box>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
};
