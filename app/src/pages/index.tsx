import { useStore } from '../utils/store';
import MainMenu from '../components/MainMenu';
import LoginMenu from '../components/Login';
import BackButton from '../components/BackButton';
import { useState } from 'react';
import { Box, Container, CssBaseline, Divider } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import {Button} from '@mui/material';

import logo from '../../public/logo.png';

function IndexPage() {
  const store = useStore();
  const [landing,setLanding] = useState('land')

  const handleClick = () => {
    setLanding('landed');
  };

  if (landing === 'land'){
    return(
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
        
      <Link href="/">
      <Image src={logo} alt="logo by ben " width="350px" height="300px" style={{marginBottom:50}} />
    </Link>
    <Divider/>
    <Button
    fullWidth
    sx={{ marginTop: 5, height: 100, fontSize: 30 }}
    variant="contained"
    onClick={handleClick}
  >
    Los gehts!
  </Button>
      </Box>
    </Container>
      
    )
  }
  if (store.loggedInUser.name === 'None') {
    return (
    <LoginMenu />
    );
  } else {
    return <MainMenu {...store} />;
  }
}

export default IndexPage;
