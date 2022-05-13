import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';
import logo from '../../public/logo.png';
import { Divider } from '@mui/material';
import { useStore } from '../utils/store';
import { User } from '../interfaces/user';
import {fetchWrapper} from '../utils/fetch-wrapper';
import { useRouter } from 'next/router';
import Webcam from "react-webcam";
import { useState } from 'react';
const videoConstraints = {
    facingMode: "user"
  };

const theme = createTheme();

export default function SignIn() {

  const { setLoggedInState, currentScreenshot, setCurrentScreenshot } = useStore();
  const router = useRouter();
  const verify = async ()=> {
    console.log(currentScreenshot);
        const data = await fetchWrapper.post('api/users/verify',{img:currentScreenshot});
        if (data.success != true){
          console.log(data.error);
          if (data.error === "No face detect"){

          router.push('/'); 
          setCurrentScreenshot('')
          }
          else{

            router.push('/signup'); 
          }
      } 
      else{
        const usersRepo:User[] = await fetchWrapper.get('api/users/all');
        const name = data.username.toString();
        setLoggedInState(usersRepo.filter((user) => user.name === name)[0]);
      }
  }
    if (currentScreenshot){
        verify()
    }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Link href='/'><Image
            src={logo}
            alt="logo by ben "
            width="350px"
            height="300px"
          />
          </Link>
          <Divider/>
          
              <Webcam
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        >
          {({ getScreenshot }) => (
            <Button
            onClick={() => {
              const imageSrc = getScreenshot()
              setCurrentScreenshot(imageSrc)
            }}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, height:100, fontSize:30 }}
          >
            Los gehts!
          </Button>
          )}
        </Webcam>
            
            
        </Box>
      </Container>
    </ThemeProvider>
  );
}
