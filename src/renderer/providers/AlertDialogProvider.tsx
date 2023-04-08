import React, { createContext, useState, useContext } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import { noop } from "lodash";

interface IAlertProps {
  title?: string;
  content?: React.ReactNode;
  okText?: string;
  cancleText?: string;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface IAlertContext {
  visible: boolean;
  props: IAlertProps;
  open: (props?: IAlertProps) => void;
  close: () => void;
}

const Context = createContext<IAlertContext>({
  visible: false,
  props: {}, // {title, content, okText, cancelText, onOk, onCancel...}
  open: noop,
  close: noop
});

export const useAlertDialog = () => {
  return useContext(Context);
};

const AlertDialogProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [props, setProps] = useState<IAlertProps>({});
  const [loading, setLoading] = useState(false);
  const {
    title = "提示",
    content = "",
    okText = "确认",
    cancleText = "取消",
    onOk = () => {
      //
    },
    onCancel = noop
  } = props;
  const open = (ps = {}) => {
    setProps(ps);
    setVisible(true);
  };
  const close = () => {
    setProps({});
    setVisible(false);
  };
  const handleOk = async () => {
    if (loading) {
      return;
    }
    const res = onOk();
    if (res && typeof res.then === "function") {
      setLoading(true);
      try {
        await res;
        setLoading(false);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setLoading(false);
      }
    }
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
    onCancel();
  };
  return (
    <Context.Provider value={{ open, close, visible, props }}>
      <Dialog open={visible} onClose={handleCancel}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{cancleText}</Button>
          <LoadingButton loading={loading} onClick={handleOk} autoFocus>
            {okText}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {children}
    </Context.Provider>
  );
};
export default AlertDialogProvider;
