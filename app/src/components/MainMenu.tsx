import { UserState } from '../interfaces/user';
import Link from 'next/link';
import SettingsIcon from '@mui/icons-material/Settings';
import { Fab, Box, Container, Typography, Button, CssBaseline } from '@mui/material';

export default function MainMenu(store: UserState) {
  const user = store.loggedInUser;
  let chapterFinished = 0;
  if (user){
    for (const chapter of Object.keys(user.chapterProgression)){
      if (user.chapterProgression[chapter].completed){
        chapterFinished += 1;
      }
    };
  }
  
  return (
    <>
      <Link href="/settings">
        <Fab
          color="primary"
          aria-label="settings"
          sx={{ float: 'right', marginTop: '-14rem', marginRight: '1rem' }}
        >
          <SettingsIcon fontSize="large"></SettingsIcon>
        </Fab>
      </Link>
      <Container component="main" maxWidth="sm">
        <CssBaseline />

        <Box
          sx={{
            marginTop: '15rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Hallo {user.displayName}
          </Typography>
          <Typography variant="h6" component="h1" gutterBottom>
            Kapitel abgeschlossen: {chapterFinished}/15
          </Typography>
          <Typography variant="h6" component="h1" gutterBottom>
          Übungen abgeschlossen: {user.coursesFinishedTotal}
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
