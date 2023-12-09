import { FileCopyOutlined } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useSnackbar } from 'notistack';
import copy from 'copy-to-clipboard';
import React from 'react';

interface ITextProps {
  limit?: number;
  children: React.ReactNode;
  ellipsis?: boolean;
  copy?: boolean;
  wrap?: boolean;
}

// 提供限制文字长度、显示省略号、复制等功能
export const Text: React.FC<ITextProps> = ({
  limit,
  children,
  ellipsis = true,
  copy: canCopy = false,
  wrap = true,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const copyIcon = (
    <FileCopyOutlined
      style={{
        fontSize: '.9em',
        cursor: 'pointer',
        color: blue[500],
      }}
      onClick={_ => {
        if (typeof children === 'string') {
          copy(children);
          enqueueSnackbar('复制成功');
        }
      }}
    />
  );
  if (
    typeof children === 'string' &&
    limit &&
    limit < (children as string).length
  ) {
    const substr = (children as string).substring(0, limit);
    const contentStr = ellipsis ? (
      <span title={children}>{substr}...</span>
    ) : (
      substr
    );
    return (
      <span style={{ whiteSpace: wrap ? 'normal' : 'nowrap' }}>
        {canCopy ? (
          <>
            {contentStr} {copyIcon}
          </>
        ) : (
          contentStr
        )}
      </span>
    );
  }
  if (ellipsis) {
    return (
      <section style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          style={{
            width: '100%',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
          variant="body2"
        >
          {children}
        </Typography>
        {canCopy && <div>{copyIcon}</div>}
      </section>
    );
  }
  return <>{children}</>;
};
