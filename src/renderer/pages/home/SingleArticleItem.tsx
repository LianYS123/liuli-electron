import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Box,
  CardActions,
  CardHeader,
  Chip,
  Link,
  Rating,
  Tooltip
} from "@mui/material";
import { red } from "@mui/material/colors";
import { ArticleItemProps } from "../../services/types";
import { formatTimeDetail } from "../../utils/time";
import { Text } from "../../components/text";

const SingleArticleItem: React.FC<ArticleItemProps> = (props) => {
  const { article, handleTagClick } = props;
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
    rating_score
  } = article;

  const tagArr = tags ? tags.split("|") : [];

  const upSM = true;

  // 副标题
  const subheaderEl = (
    <Box display="flex">
      {/* 创建时间 */}
      <Typography
        variant="subtitle1"
        color={(theme) => theme.palette.text.secondary}
        mr={1}
        fontSize={14}
        component="span"
      >
        <Box mr={1} component="span">
          {formatTimeDetail(time)}
        </Box>
      </Typography>
    </Box>
  );

  // 卡片头部信息
  const headerEl = (
    <CardHeader
      title={
        <Link style={{ textDecoration: "none" }} target="_blank" href={href}>
          {title}
        </Link>
      } // 文章标题
      avatar={
        // 头像
        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
          {id}
        </Avatar>
      }
      subheader={subheaderEl}
    />
  );

  // 摘要(简介)
  const summaryEl = (
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {content}
      </Typography>
    </CardContent>
  );

  // 标签
  const tagsEl = (
    <CardContent className="space-x-1">
      {tagArr.map((tag) => (
        <Chip
          // size="small"
          className="cursor-pointer"
          onClick={(ev) => {
            // ev.preventDefault();
            ev.stopPropagation();
            handleTagClick(tag);
          }}
          key={tag}
          label={tag}
        />
      ))}
    </CardContent>
  );

  // 封面图
  const coverEl = img_src ? (
    <CardMedia
      sx={{ width: { xs: "auto", sm: 256 } }}
      component="img"
      image={img_src}
    />
  ) : null;

  const rateEl = (
    <CardActions disableSpacing>
      <Tooltip title={rating_score || ""}>
        <Rating readOnly precision={0.1} value={rating_score} />
      </Tooltip>
      <Box sx={{ ml: 2 }}>评分人数: {rating_count}</Box>
    </CardActions>
  );
  const uidEl = (
    <CardContent>
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
  );

  // 手机上渲染
  const renderXs = () => {
    return (
      <>
        {headerEl}
        {coverEl}
        {summaryEl}
        {tagsEl}
        {rateEl}
        {uidEl}
      </>
    );
  };

  // 电脑上渲染
  const renderMd = () => {
    return (
      <Box display="flex" maxHeight={480}>
        <Box flex="auto">
          {headerEl}
          {summaryEl}
          {tagsEl}
          {rateEl}
          {uidEl}
        </Box>
        {coverEl}
      </Box>
    );
  };

  return <Card>{upSM ? renderMd() : renderXs()}</Card>;
};
export default SingleArticleItem;
