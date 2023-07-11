import {
  Container,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from "@mui/material";
import React, { useRef, useState } from "react";
import AppHeader from "./AppHeader";
import { ArrowBack, ArrowForward, Refresh } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useClickAway } from "react-use";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const nav = useNavigate();
  const [open, setOpen] = useState(true);
  // const ref = useRef(null);
  // useClickAway(ref, () => setOpen(false));

  return (
    <Container>
      <AppHeader />
      {children}
      <SpeedDial
        // ref={ref}
        open={open}
        onClick={(ev) => {
          // if (ev.target === ev.currentTarget) {
          setOpen(!open);
          // }
        }}
        onOpen={() => setOpen(true)}
        // onClose={() => setOpen(false)}
        sx={{ position: "fixed", bottom: 30, right: 30 }}
        icon={<SpeedDialIcon />}
        ariaLabel={""}
      >
        <SpeedDialAction
          onClick={(ev) => {
            ev.stopPropagation();
            location.reload();
          }}
          icon={<Refresh />}
          tooltipTitle={"刷新"}
        />
        <SpeedDialAction
          onClick={(ev) => {
            ev.stopPropagation();
            nav(1);
          }}
          icon={<ArrowForward />}
          tooltipTitle={"前进"}
        />
        <SpeedDialAction
          onClick={(ev) => {
            ev.stopPropagation();
            nav(-1);
          }}
          icon={<ArrowBack />}
          tooltipTitle={"后退"}
        />
      </SpeedDial>
    </Container>
  );
};
