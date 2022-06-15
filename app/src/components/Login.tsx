import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { UserState } from '../interfaces/user';
import Link from 'next/link';
import CssBaseline from '@mui/material/CssBaseline';

import SignInFace from '../components/logins/SignInFace';
import { toast } from 'react-toastify';
import { useState } from 'react';

import Image from 'next/image';

import QRSignIn from '../components/logins/QRSignIn';
import SignIn from '../components/logins/SignIn';
import { Divider } from '@mui/material';

const signInTypes = {
  qr: <QRSignIn/>,
  face: <SignInFace />,
  legacy: <SignIn />
};

export default function LoginMenu() {
  const [loginType, setLoginType] = useState(
    <div>
      <Typography variant="h4" component="h3" gutterBottom>
          Wie möchtest du dich anmelden?
        </Typography>

        <Button
        fullWidth
        sx={{ marginTop: 5, height: 100, fontSize: 30 }}
        onClick={() => {
          setLoginType(signInTypes.qr);
        }}
        variant="contained"
      >
        QR Code
      </Button>
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
        <Divider />
        
        
        {loginType}
      </Box>
    </Container>
  );
}
