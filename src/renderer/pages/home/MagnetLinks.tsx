import { Box, Grid, Link, Stack, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Icon from "@ant-design/icons";
import { clipboard, shell } from "electron";
import { ContentCopyOutlined } from "@mui/icons-material";
import { historyAPI } from "@src/common/api/history";

export const MagnetLinks: React.FC<{ uid: string; articleId: number }> = (
  props
) => {
  const { enqueueSnackbar } = useSnackbar();

  const getUids = () => {
    return props.uid ? [...new Set(props.uid.split("|"))].filter(Boolean) : [];
  };
  const uids = getUids();
  const [showUids, setShowUids] = useState<string[]>(uids.slice(0, 6));

  useEffect(() => {
    setShowUids(uids.slice(0, 6));
  }, [props.uid]);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid columns={3} columnGap={3} rowGap={1} container>
        {showUids.map((u, index) => {
          const link = `magnet:?xt=urn:btih:${u}`;
          return (
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Link
                key={u}
                onClick={() => {
                  historyAPI.addOpenDownload({
                    articleId: props.articleId,
                    source: link,
                  });
                  shell.openExternal(link);
                }}
                sx={{
                  cursor: "pointer",
                  mr: 1,
                  // display: "block",
                  // width: "100%",
                  // textOverflow: "ellipsis",
                  // overflow: "hidden",
                  // whiteSpace: "nowrap",
                }}
              >
                磁力地址{index + 1}
              </Link>

              <Tooltip title="复制">
                <Icon // style={{ color: theme.palette.primary.main }}
                  onClick={() => {
                    clipboard.write({
                      text: link,
                    });
                    enqueueSnackbar("复制成功");
                  }}
                >
                  <ContentCopyOutlined />
                </Icon>
              </Tooltip>
            </Grid>
          );
        })}
        {showUids.length < uids.length ? (
          <Box>
            <Link
              onClick={(ev) => {
                ev.preventDefault();
                setShowUids(uids);
              }}
              sx={{ cursor: "pointer" }}
            >
              更多...
            </Link>
          </Box>
        ) : null}
      </Grid>
    </Box>
  );
};
