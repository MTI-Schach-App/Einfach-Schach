import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { UserState } from '../interfaces/user';
import Link from 'next/link';
import CssBaseline from '@mui/material/CssBaseline';

export default function MainMenu(store: UserState) {
  const user = store.loggedInUser;
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: '5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Hi {user.displayName}, you're Level {user.level}
        </Typography>
        <Link href="/game">
          <Button
            fullWidth
            sx={{ marginTop: 5, height: 100, fontSize: 30 }}
            variant="contained"
          >
            Spielen
          </Button>
        </Link>

        <Link href="/train">
          <Button
            fullWidth
            sx={{ marginTop: 5, height: 100, fontSize: 30 }}
            variant="contained"
          >
            Übungen
          </Button>
        </Link>
        <Link href="/settings">
          <Button
            fullWidth
            sx={{ marginTop: 5, height: 100, fontSize: 30 }}
            variant="contained"
          >
            Einstellungen
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
