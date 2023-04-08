import { IconButton, ListItemText, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useState } from 'react';

interface IActionMenuProps {
  actions: { text: string; onClick: () => void }[];
}

export const ActionMenuButton: React.FC<IActionMenuProps> = ({
  actions = [],
}) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  return (
    <>
      <IconButton
        onClick={(ev) => {
          ev.stopPropagation();
          setAnchorEl(ev.currentTarget);
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
      >
        {actions.map((action) => {
          const { text, onClick } = action;
          return (
            <MenuItem
              key={action.text}
              onClick={(ev) => {
                ev.stopPropagation();
                setAnchorEl(null);
                onClick();
              }}
            >
              <ListItemText>{text}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
