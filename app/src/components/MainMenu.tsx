import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { UserState } from '../interfaces/user';
import Link from 'next/link';
import CssBaseline from '@mui/material/CssBaseline';
import SettingsIcon from '@mui/icons-material/Settings';
import { Fab } from '@mui/material';

import Image from 'next/image';
import pawn from '../../public/pawn.png';

export default function MainMenu(store: UserState) {
  const user = store.loggedInUser;
  return (
    <>
      <Link href="/settings">
        <Fab
          color="primary"
          aria-label="settings"
          sx={{ float: 'right', marginTop: '-4rem', marginRight: '1rem' }}
        >
          <SettingsIcon fontSize="large"></SettingsIcon>
        </Fab>
      </Link>
      <Container component="main" maxWidth="sm">
        <CssBaseline />

        <Box
          sx={{
            marginTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Hallo {user.displayName}
          </Typography>
          <Typography variant="h6" component="h1" gutterBottom>
            Übungen abgeschlossen: {user.coursesFinished.length}
          </Typography>
          <Link href="/game">
            <Button
              fullWidth
              sx={{ marginTop: 5, height: 100, fontSize: 30 }}
              variant="contained"
            >
              Partie spielen
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
        </Box>
      </Container>
    </>
  );
}
