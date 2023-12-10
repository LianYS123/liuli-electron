import { Box, Button, Drawer, Stack, TextField } from "@mui/material";
import { Form } from "antd";
import React from "react";

export type OperateType = "add" | "edit";

export const OperateArticleDrawer: React.FC<{
  operateType: OperateType | null;
  open: boolean;
  onClose: () => void;
}> = ({ operateType, onClose, open }) => {
  const [form] = Form.useForm();
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      title={operateType === "add" ? "新增文章" : "编辑文章"}
    >
      <Box sx={{ minWidth: 360, maxWidth: 360, padding: 4 }}>
        <Stack justifyContent={"flex-end"} spacing={1} direction="row">
          <Button onClick={onClose} variant="outlined">
            取消
          </Button>
          <Button
            onClick={() => {
              form.submit();
            }}
            variant="contained"
          >
            保存
          </Button>
        </Stack>
        <Form
          onFinish={() => {
            //
          }}
          form={form}
          layout="vertical"
        >
          <Form.Item name="title" rules={[{ required: true }]} label="标题">
            <TextField fullWidth placeholder="请输入" variant="standard" />
          </Form.Item>
          <Form.Item label="描述">
            <TextField fullWidth placeholder="请输入" variant="standard" />
          </Form.Item>
          <Form.Item label="标签">
            <TextField fullWidth placeholder="请选择" variant="standard" />
          </Form.Item>
          <Form.Item label="分类">
            <TextField fullWidth placeholder="请选择" variant="standard" />
          </Form.Item>
        </Form>
      </Box>
    </Drawer>
  );
};
