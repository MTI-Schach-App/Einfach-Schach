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
      <Typography variant="h6" component="h1" gutterBottom>
          Wie möchtest du dich anmelden?
        </Typography>
      <Button
        fullWidth
        sx={{ marginTop: 5, height: 100, fontSize: 30 }}
        onClick={() => {
          setLoginType(signInTypes.face);
        }}
        variant="contained"
      >
        Gesicht
      </Button>

      <Button
        fullWidth
        sx={{ marginTop: 5, height: 100, fontSize: 30 }}
        onClick={() => {
          setLoginType(signInTypes.legacy);
        }}
        variant="contained"
      >
        Name
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
        <Divider />
        
        
        {loginType}
      </Box>
    </Container>
  );
}
