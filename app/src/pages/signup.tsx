import * as React from 'react';
import { Checkbox, Divider, FormGroup } from '@mui/material';
import { useStore } from '../utils/store';
import { User } from '../interfaces/user';
import { fetchWrapper } from '../utils/fetch-wrapper';
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Container,
  Box,
  FormControlLabel,
  CssBaseline,
  Button,
  Typography
} from '@mui/material';

import { useRouter } from 'next/router';

export default function SignUp() {
  const {
    setLoggedInState,
    loggedInUser,
    currentScreenshot,
    setCurrentScreenshot
  } = useStore();

  let nameDisp = ""

  if (loggedInUser.name != "None") {
    nameDisp = loggedInUser.name
  }


  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user: User = {
      id: loggedInUser.id,
      name: data.get('name').toString(),
      displayName: data.get('name').toString(),
      level: Number(data.get('level')),
      ep:0,
      currentGame: '',
      dateUpdated: '0',
      dateCreated: '0',
      coursesFinishedTotal: 0,
      wantsToClick: true,
      animationSpeed: 2000,
      chapterProgression: {}
    };
    const resp = await fetchWrapper.post('api/users/register', {
      user: user,
      screenshot: currentScreenshot
    });
    setLoggedInState(resp);

    router.push('/');
  };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Divider />
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: '5rem' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              defaultValue={nameDisp}
              id="name"
              label="Dein Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <FormControl>
              <FormLabel id="level">Wie oft spielst du Schach?</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="0"
                name="level"
              >
                <FormControlLabel value="0" control={<Radio />} label="Nie" />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Selten"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="Häufig"
                />
              </RadioGroup>
            </FormControl>
            <FormControl 
            required={true}
            component="fieldset"
            variant="standard">
              <Typography gutterBottom sx={{fontSize:13, marginTop:'1rem'}} component="div">
              {'Mit der Registierung akzeptiere ich die '} <a target="_blank" href="/legal/privacy" rel="noopener noreferrer"> Datenschutzvereinbarung</a>
           
              </Typography>
               </FormControl>
           
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ marginTop: 0, height: 80, fontSize: 27 }}
            >
              Registieren!
            </Button>
          </Box>
        </Box>
      </Container>
  );
}
