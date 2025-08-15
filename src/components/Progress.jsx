import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 50,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#3F5C44',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 50,
    backgroundColor: '#A0FFBA',
  },
}));


export default function ProgressBar(val) {
  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      <BorderLinearProgress variant="determinate" value={val.value} />
    </Stack>
  );
}