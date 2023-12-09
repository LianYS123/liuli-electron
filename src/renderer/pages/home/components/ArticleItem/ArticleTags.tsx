import { Box, Chip } from '@mui/material';
import React from 'react';

export const ArticleTags: React.FC<{
  tags?: string;
  handleTagClick?: (tag: string) => void;
}> = ({ tags, handleTagClick }) => {
  return (
    <Box>
      {tags && tags.length
        ? tags
            .split('|')
            .map(tag => (
              <Chip
                onClick={() => handleTagClick?.(tag)}
                style={{ margin: 4 }}
                variant="outlined"
                key={tag}
                label={tag}
              />
            ))
        : null}
    </Box>
  );
};
