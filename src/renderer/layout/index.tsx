import { Box, Container } from "@mui/material";
import React from "react";
import AppHeader from "./AppHeader";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <Container>
      <AppHeader />
      {children}
    </Container>
  );
};
