import SignInFace from '../components/logins/SignInFace';
import { useState } from 'react';
import QRSignIn from '../components/logins/QRSignIn';
import SignIn from '../components/logins/SignIn';
import { 
  Divider,
  Container,
  Typography,
  Box,
  Button,
  CssBaseline
 } from '@mui/material';
import GreenButton from './buttons/GenericButton';
import BackButton from './buttons/BackButton';
import { useRouter } from 'next/router';

const signInTypes = {
  qr: <QRSignIn />,
  face: <SignInFace />,
  legacy: <SignIn />
};


export default function LoginMenu() {
  const [loginType, setLoginType] = useState('init'|| <Button></Button>);
  const router = useRouter();
  
  const qr = () => {
    setLoginType(signInTypes.qr);
  }
  const face = () => {
    setLoginType(signInTypes.face);
  }
  const legacy = () => {
    setLoginType(signInTypes.legacy);
  }

  if (loginType === 'init'){
    return(
    
      <Container component="main" maxWidth="sm">
      <CssBaseline />
      <BackButton {...{
      onClick:() => {router.push('/game')},
      buttonText:'< Zurück',
      }}/>
      <Box
        sx={{
          marginTop: '5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Divider />
        

        <div>
      <Typography variant="h4" component="h3" gutterBottom>
        Wie möchtest du dich anmelden?
      </Typography>

      <GreenButton {...{buttonText:"QR CODE", onClick:qr}}/>
      <GreenButton {...{buttonText:"NAME", onClick:legacy}}/>
        </div>
      </Box>
    </Container>
    )
  }

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
