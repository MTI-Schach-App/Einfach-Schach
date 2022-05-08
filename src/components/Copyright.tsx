import { Typography } from '@mui/material';
import Link from 'next/link';
export default function Copyright(props:any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link href="https://h2.de">
         Gang
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }