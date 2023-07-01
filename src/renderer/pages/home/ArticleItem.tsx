import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  IconButton,
  Link,
  Rating,
  Tooltip,
  Typography
} from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useState } from "react";
import { ActionMenuButton } from "../../components/action/ActionMenuButton";
import { Text } from "../../components/text";
import { formatTimeDetail } from "../../utils/time";
import { ArticleItemProps } from "../../services/types";
import { useSnackbar } from "notistack";
import { File } from "@src/common/interfaces/file.interface";
import { UnConnectDialog } from "./UnConnectDialog";
import { chooseMedia } from "@src/renderer/utils";

const ArticleItem: React.FC<ArticleItemProps> = ({
  article,
  handleTagClick,
  refetch
}) => {
  const {
    id,
    title,
    img_src,
    href,
    time,
    tags = "",
    uid,
    content,
    rating_count,
    rating_score,
    files
  } = article;

  const { enqueueSnackbar } = useSnackbar();

  const [fileToRemove, setFileToRemove] = useState<File>(null);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {id}
          </Avatar>
        }
        title={
          <Link style={{ textDecoration: "none" }} target="_blank" href={href}>
            <Text limit={20}>{title}</Text>
          </Link>
        }
        subheader={formatTimeDetail(time)}
        action={
          <ActionMenuButton
            actions={[
              {
                text: "关联",
                onClick: async () => {
                  const files = await chooseMedia();
                  if (!files.length) {
                    return;
                  }
                  const pros = files.map(async (media) => {
                    try {
                      await window.myAPI.createAndConnectFile({
                        articleId: id,
                        fromPath: media
                      });
                    } catch (e) {
                      enqueueSnackbar(e?.message);
                    }
                  });
                  await Promise.allSettled(pros);
                  refetch();
                }
              }
            ].filter(Boolean)}
          />
        }
      />

      {img_src && <CardMedia component="img" src={img_src} />}

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title={rating_score || ""}>
          <IconButton>
            <Rating readOnly precision={0.1} value={rating_score} />
          </IconButton>
        </Tooltip>
        <Box sx={{ ml: 2 }}>评分人数: {rating_count}</Box>
      </CardActions>
      <CardContent>
        <div style={{ marginBottom: 8 }}>
          {tags && tags.length
            ? tags
                .split("|")
                .map((tag) => (
                  <Chip
                    onClick={() => handleTagClick(tag)}
                    style={{ margin: 4 }}
                    variant="outlined"
                    key={tag}
                    label={tag}
                  />
                ))
            : null}
        </div>

        <div style={{ marginBottom: 8 }}>
          {files?.map((file) => (
            <Chip
              onClick={async () => {
                // setFile(file);
                const error = await window.myAPI.openPath(file.filePath);
                if (error) {
                  enqueueSnackbar(error, {
                    variant: "error"
                  });
                }
              }}
              onDelete={() => {
                setFileToRemove(file);
              }}
              style={{ margin: 4 }}
              variant="outlined"
              key={file.id}
              label={file.name}
            />
          ))}
        </div>

        {uid &&
          [...new Set(uid.split("|"))].map((u) => {
            return (
              <div key={u}>
                <Text copy wrap={false}>
                  {`magnet:?xt=urn:btih:${u}`}
                </Text>
                {/* <Divider /> */}
              </div>
            );
          })}
      </CardContent>
      {fileToRemove && (
        <UnConnectDialog
          file={fileToRemove}
          article={article}
          refetch={refetch}
          open={!!fileToRemove}
          onClose={() => {
            setFileToRemove(null);
          }}
        />
      )}
    </Card>
  );
};
export default ArticleItem;
