import React from 'react';

import { IconButton, InputBase, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar: React.FC<{
  onRequestSearch: (s: string) => void;
}> = ({ onRequestSearch }) => {
  const [value, setValue] = React.useState('');
  const handleRequestSearch = () => {
    if (!value) {
      return;
    }
    onRequestSearch(value);
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pl: 2,
      }}
    >
      <div>
        <InputBase
          placeholder="输入关键词搜索"
          onKeyDown={(ev) => {
            if (ev.key.toLowerCase() === 'enter') {
              handleRequestSearch();
            }
          }}
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
        />
      </div>
      <IconButton onClick={handleRequestSearch}>
        <Search />
      </IconButton>
      {/* <IconButton
        onClick={() => {
          setValue("");
        }}
      >
        <Clear />
      </IconButton> */}
    </Paper>
  );
};

export default SearchBar;
