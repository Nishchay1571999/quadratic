import { Box, Stack, Typography, useTheme } from '@mui/material';
import { ReactNode, useEffect } from 'react';

export function DashboardHeader({
  title,
  actions,
  titleStart,
  titleEnd,
}: {
  title: string;
  actions?: ReactNode;
  titleStart?: ReactNode;
  titleEnd?: ReactNode;
}) {
  const theme = useTheme();

  useEffect(() => {
    document.title = `${title} - Quadratic`;
  }, [title]);

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: theme.palette.background.default,
        backdropFilter: 'blur(2px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: '1',

        [theme.breakpoints.up('md')]: {
          position: 'sticky',
          top: '0',
          flexDirection: 'row',
          alignItems: 'center',
        },
      }}
    >
      <Stack direction="row" alignItems={'center'} gap={theme.spacing()}>
        {titleStart}
        <Typography variant="h6" sx={{ py: theme.spacing(2) }} color="text.primary">
          {title}
        </Typography>
        {titleEnd}
      </Stack>
      {actions && (
        <Stack
          direction="row"
          gap={theme.spacing()}
          sx={{
            [theme.breakpoints.down('md')]: {
              display: 'none',
              paddingBottom: theme.spacing(1),
            },
          }}
        >
          {actions}
        </Stack>
      )}
    </Box>
  );
}
