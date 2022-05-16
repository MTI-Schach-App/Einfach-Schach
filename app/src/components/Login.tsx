import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { UserState } from '../interfaces/user';
import Link from 'next/link';
import CssBaseline from '@mui/material/CssBaseline';

import SignInFace from '../components/SignInFace';
import { toast } from 'react-toastify';
import { useState } from 'react';

import logo from '../../public/logo.png';
import Image from 'next/image';

import SignIn from '../components/SignIn';
import { Divider } from '@mui/material';

const signInTypes = {
  face: <SignInFace />,
  legacy: <SignIn />
};

export default function LoginMenu() {
  const [loginType, setLoginType] = useState(
    <div>
      <Button
        fullWidth
        sx={{ marginTop: 5, height: 100, fontSize: 30 }}
        onClick={() => {
          setLoginType(signInTypes.face);
        }}
        variant="contained"
      >
        with face
      </Button>

      <Button
        fullWidth
        sx={{ marginTop: 5, height: 100, fontSize: 30 }}
        onClick={() => {
          setLoginType(signInTypes.legacy);
        }}
        variant="contained"
      >
        with name
      </Button>
    </div>
  );

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
        <Link href="/">
          <Image src={logo} alt="logo by ben " width="350px" height="300px" />
        </Link>
        <Divider />
        {loginType}
      </Box>
    </Container>
  );
}
