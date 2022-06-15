import { Button } from '@mui/material';
import { useRouter } from 'next/router';

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="contained"
      aria-label={'Zurück'}
      sx={{ marginTop: 1, marginLeft: 2, marginBottom: -4 }}
      onClick={() => router.back()}
    >
      Zurück
    </Button>
  );
}
