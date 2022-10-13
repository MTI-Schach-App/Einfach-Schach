import { useStore } from '../utils/store';
import MainMenu from '../components/MainMenu';
import LoginMenu from '../components/Login';
import { useState } from 'react';
import { Box, Container, CssBaseline, Divider } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@mui/material';

import logo from '../../public/logo.png';
import { useRouter } from 'next/router';

function IndexPage() {
  const store = useStore();
  const router = useRouter();
  const [landing, setLanding] = useState('land');

  const login = () => {
    setLanding('login');
  };

  const register = () => {
    router.push('/signup');
  };

  if (store.loggedInUser.name === 'None') {
    if (landing === 'land') {
      return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: '15rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Link href="/">
              <Image
                src={logo}
                alt="logo by ben "
                width="350px"
                height="300px"
                style={{ marginBottom: 50 }}
              />
            </Link>
            <Divider />
            <Button
              fullWidth
              sx={{ marginTop: 5, height: 100, fontSize: 30 }}
              variant="contained"
              onClick={login}
            >
              Anmelden
            </Button>
            <Button
              fullWidth
              sx={{ marginTop: 5, height: 100, fontSize: 30 }}
              variant="contained"
              onClick={register}
            >
              Registrieren
            </Button>
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
