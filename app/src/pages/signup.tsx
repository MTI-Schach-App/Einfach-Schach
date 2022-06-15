import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Divider } from '@mui/material';
import { useStore } from '../utils/store';
import { User } from '../interfaces/user';
import { fetchWrapper } from '../utils/fetch-wrapper';
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio
} from '@mui/material';

import { useRouter } from 'next/router';

const theme = createTheme();
export default function SignUp() {
  const {
    setLoggedInState,
    loggedInUser,
    currentScreenshot,
    setCurrentScreenshot
  } = useStore();

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user: User = {
      id: loggedInUser.id,
      name: data.get('name').toString(),
      displayName: data.get('name').toString(),
      level: Number(data.get('level')),
      currentGame: '',
      currentCourse: '',
      dateUpdated: '0',
      dateCreated: '0',
      coursesFinished: [],
      wantsToClick: true
    };
    const resp = await fetchWrapper.post('api/users/register', {
      user: user,
      screenshot: currentScreenshot
    });
    setLoggedInState(resp);

    router.push('/');
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
            alignItems: 'center'
          }}
        >
          <Divider />
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              defaultValue={loggedInUser.name}
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
                defaultValue="female"
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Weiter!
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
