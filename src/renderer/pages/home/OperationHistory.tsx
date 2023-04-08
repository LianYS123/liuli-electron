import { Drawer } from "@mui/material";
import React, { useState } from "react";

export const OperationHistory: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      ></Drawer>
    </>
  );
};
