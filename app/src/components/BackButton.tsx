import { Button } from '@mui/material';
import { useRouter } from 'next/router';
export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="contained"
      sx={{ marginTop: 1, marginLeft: 1, marginBottom: -4 }}
      onClick={() => router.back()}
    >
      Zurück
    </Button>
  );
}
