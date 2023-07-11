import { useStore } from '../utils/store';
import MainMenu from '../components/MainMenu';
import LoginMenu from '../components/Login';
import { useState } from 'react';
import { Box, Container, CssBaseline, Divider, Typography } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

import logo from '../../public/logo.png';
import { useRouter } from 'next/router';
import GreenButton from '../components/buttons/GenericButton';

function IndexPage() {
  const store = useStore();
  const router = useRouter();
  const [landing, setLanding] = useState('land');

  const login = () => {
    setLanding('login');
  };

  const register = () => {
    setLanding('land');
    router.push('/signup');
  };

  const guest = () => {
  store.setLoggedInState({
  id: 999999,
  name: "Gast",
  displayName: "Gast",
  level: 0,
  ep:0,
  currentGame: '',
  dateUpdated: '0',
  dateCreated: '0',
  coursesFinishedTotal: 0,
  wantsToClick: false,
  animationSpeed: 2000,
  chapterProgression: {}
});
  };

  console.log(store.loggedInUser.name)
  if (store.loggedInUser.name === 'None') {
    if (landing === 'land') {
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
          > <Typography variant="h3" component="h1" sx={{mb:5, fontFamily:'Anton'}} gutterBottom>
          Einfach Schach
        </Typography>
            <Link href="/">
              <Image
                src={logo}
                alt="logo by ben "
                width="150px"
                height="135px"
                style={{ marginBottom: 50 }}
              />
            </Link>
            <Divider sx={{mb:3}} />
            <GreenButton {...{buttonText: 'Anmelden', onClick:login}}/>
            <GreenButton {...{buttonText: 'Neues Konto', onClick:register, color: '#575757'}}/>
            <GreenButton {...{buttonText: 'Als Gast spielen', onClick:guest}}/>
          </Box>
        </Container>
      );
    }
    if (landing === 'login') {
      return <LoginMenu/>;
    }
  } else {
    return <MainMenu {...store} />;
  }
}

export default IndexPage;
