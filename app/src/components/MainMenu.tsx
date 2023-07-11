import { UserState } from '../interfaces/user';
import Link from 'next/link';
import SettingsIcon from '@mui/icons-material/Settings';
import { Fab, Box, Container, Typography, Button, CssBaseline } from '@mui/material';
import { useRouter } from 'next/router';
import GreenButton from './buttons/GenericButton';
import BackButton from './buttons/BackButton';
import { defaultUserSchema } from '../interfaces/constants';
import { useStore } from '../utils/store';

export default function MainMenu(store: UserState) {
  const user = store.loggedInUser;
  const {
    setLoggedInState,
  } = useStore();
  
  const router = useRouter();
  const game = () => {
    router.push('/game');
  };
  const train = () => {
    router.push('/train');
  };
  const logout = () => {
    setLoggedInState({
      ...defaultUserSchema,
      id: 0,
      name: 'None',
      displayName: ''
    });
    router.push('/');
  };

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
    <BackButton {...{
      onClick:logout,
      buttonText:'Abmelden',
      color:'#B12929'
      }}/>
      <Link href="/settings">
        <Fab
          color="primary"
          aria-label="settings"
          sx={{ float: 'right', marginTop: '1rem', marginRight: '1rem' }}
        >
          <SettingsIcon fontSize="large"></SettingsIcon>
        </Fab>
      </Link>
      <Container component="main" maxWidth="sm">
        <CssBaseline />

        <Box
          sx={{
            marginTop: '10rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography variant="h3" component="h1" sx={{mb:5}} gutterBottom>
            Hallo {user.displayName}
          </Typography>
          <Typography variant="h6" component="h1" gutterBottom>
            Kapitel abgeschlossen: {chapterFinished}/15
          </Typography>
          <Typography variant="h6" component="h1" gutterBottom>
          Übungen abgeschlossen: {user.coursesFinishedTotal}
          </Typography>
          
          <GreenButton {...{buttonText:"PARTIE SPIELEN", onClick:game}}/>
          <GreenButton {...{buttonText:"ÜBUNGEN", onClick:train, color:'#575757'}}/>  

        </Box>
      </Container>
    </>
  );
}
