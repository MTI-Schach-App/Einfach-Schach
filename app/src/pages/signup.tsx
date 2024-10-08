import * as React from 'react';
import {
  Checkbox,
  Divider,
  FormGroup,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
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

import CheckIcon from '@mui/icons-material/Check';

import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    width: '95vw',
    color: 'white',
    background: '#575757',
    paddingLeft: 40,
    fontSize: 20,
    margin: 25,
    borderRadius: 100,
    [theme.breakpoints.up('sm')]: {
      width: '50vw'
    },
    '&:hover': {
      backgroundColor: 'black',
      color: 'white',
  },
    '&.Mui-disabled': {
      border: 0
    },
    '&.Mui-selected': {
      background: '#3D703A !important'
    },
    '&:not(:first-of-type)': {
      borderRadius: 100
    },
    '&:first-of-type': {
      borderRadius: 100
    }
  }
}));

const chooseBack = (
  <div
    style={{
      position: 'absolute',
      width: '35px',
      height: '35px',
      left: '19px',
      top: '11px',
      borderRadius: 100,
      background: '#FAF4E7'
    }}
  ></div>
);

const chooseTick = (
  <div
    style={{
      position: 'absolute',
      width: '35px',
      height: '35px',
      left: '19px',
      top: '11px',
      borderRadius: 100,
      background: '#FAF4E7'
    }}
  >
    {' '}
    <CheckIcon sx={{ color: 'black', mt: 0.7 }} />
  </div>
);

import { useRouter } from 'next/router';
import { defaultUserSchema } from '../interfaces/constants';
import { ValidationTextField } from '../components/styled/basics';
import BackButton from '../components/buttons/BackButton';

export default function SignUp() {
  const { setLoggedInState, loggedInUser, currentScreenshot } = useStore();

  const [next, setNext] = React.useState(true);
  const [displayError, setDisplayError] = React.useState('');
  const [activeSection, setActiveSection] = React.useState('name');
  const [level, setLevel] = React.useState('-1');
  const [blind, setBlind] = React.useState('0');
  const newUser = defaultUserSchema;

  let nameDisp = '';

  if (loggedInUser.name != 'None') {
    nameDisp = loggedInUser.name;
  }

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const resp = await fetchWrapper.post('api/users/register', {
      user: newUser,
      screenshot: currentScreenshot
    });
    console.log(resp);
    setLoggedInState(resp);

    router.push('/');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.currentTarget.value != '') setNext(false);
    else setNext(true);
  };

  const handleDiffInputChange = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    level: string
  ) => {
    setLevel(level);
    setNext(false);
  };

  const handleBlindInputChange = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    blind: string
  ) => {
    setBlind(blind);
    setNext(false);
  };

  const handleNameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const usersRepo: User[] = await fetchWrapper.get('api/users/all');

    if (
      usersRepo
        .flatMap((user) => user.displayName)
        .includes(data.get('name').toString())
    ) {
      setNext(true);
      return setDisplayError(
        'Dieser Name wird bereits verwendet. Probiere einen anderen Namen.'
      );
    }

    newUser.name = data.get('name').toString();
    newUser.displayName = data.get('name').toString();
    newUser.id = loggedInUser.id;

    setNext(true);
    setActiveSection('diff');
  };

  const handleDiffSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    newUser.level = Number(data.get('level'));

    setActiveSection('blind');
  };

  const handleBlindSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (Number(blind) === 1) {
      newUser.blindMode =  true;
      newUser.boardSound = true;
      newUser.figureSound = true;
    }

    setActiveSection('dsgvo');
  };

  const diffChooser = {
    name: (
      <>
        <Box
          component="form"
          noValidate
          onSubmit={handleNameSubmit}
          sx={{ mt: '1rem' }}
        >
          <ValidationTextField
            margin="normal"
            fullWidth
            defaultValue={nameDisp}
            id="name"
            label="Dein Name"
            name="name"
            autoComplete="name"
            autoFocus
            onChange={handleInputChange}
            sx={{ mb: 5 }}
          />
          <Typography
            variant="subtitle1"
            sx={{ textAlign: 'center' }}
            gutterBottom
          >
            Jeder Name kann nur einmalig vergeben werden. Falls dein Name schon
            von jemand anderem verwendet wird, versuche Zahlen hinzuzufügen.
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ textAlign: 'center', color: 'red' }}
            gutterBottom
          >
            {displayError}
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={next}
            sx={{ marginTop: 5, height: 80, fontSize: 23, borderRadius: 50 }}
          >
            Weiter
          </Button>
        </Box>
      </>
    ),

    diff: (
      <>
        <Box
          component="form"
          noValidate
          onSubmit={handleDiffSubmit}
          sx={{ mt: '1rem', alignItems: 'center' }}
        >
          <Typography variant="h3" sx={{ textAlign: 'center' }} gutterBottom>
            Schwierigkeitsgrad
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center' }} gutterBottom>
            Wie gut kannst Du Schach spielen?
          </Typography>
          <FormControl sx={{ justify: 'center', alignItems: 'center' }}>
            <StyledToggleButtonGroup
              fullWidth
              orientation="vertical"
              value={level}
              exclusive
              onChange={handleDiffInputChange}
              sx={{ display: 'block !important' }}
            >
              <ToggleButton fullWidth value="0" aria-label="Anfängerin">
                {level === '0' ? chooseTick : chooseBack} Anfänger*in
              </ToggleButton>
              <ToggleButton fullWidth value="1" aria-label="Fortgeschritten">
                {level === '1' ? chooseTick : chooseBack} Fortgeschritten
              </ToggleButton>
              <ToggleButton fullWidth value="2" aria-label="Professionell">
                {level === '2' ? chooseTick : chooseBack} Professionell
              </ToggleButton>
            </StyledToggleButtonGroup>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={next}
            sx={{ marginTop: 5, height: 80, fontSize: 23, borderRadius: 50 }}
          >
            Weiter
          </Button>
        </Box>
      </>
    ),
    blind: (
      <>
        <Box
          component="form"
          noValidate
          onSubmit={handleBlindSubmit}
          sx={{ mt: '1rem', alignItems: 'center' }}
        >
          <Typography variant="h3" sx={{ textAlign: 'center' }} gutterBottom>
            Visuelle Hilfe
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center' }} gutterBottom>
            Bist du blind oder sehbeeinträchtigt?
          </Typography>
          <FormControl sx={{ justify: 'center', alignItems: 'center' }}>
            <StyledToggleButtonGroup
              fullWidth
              orientation="vertical"
              value={blind}
              exclusive
              onChange={handleBlindInputChange}
              sx={{ display: 'block !important' }}
            >
              <ToggleButton fullWidth value="0" aria-label="Nein">
                {blind === '0' ? chooseTick : chooseBack} Nein
              </ToggleButton>
              <ToggleButton fullWidth value="1" aria-label="Ja">
                {blind === '1' ? chooseTick : chooseBack} Ja
              </ToggleButton>
            </StyledToggleButtonGroup>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={next}
            sx={{ marginTop: 5, height: 80, fontSize: 23, borderRadius: 50 }}
          >
            Weiter
          </Button>
        </Box>
      </>
    ),
    dsgvo: (
      <>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: '1rem' }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ textAlign: 'center', mb: 5 }}
            gutterBottom
          >
            Datenschutzerklärung
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', mb: 3 }}
            gutterBottom
          >
            Wenn du dein Konto erstellst, akzeptierst Du automatisch die
            Datenschutzerklärung.
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', mb: 3 }}
            gutterBottom
          >
            Wenn Du möchtest kannst Du dir die Datenschutzerklärung noch einmal
            genau durchlesen.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              window.open('/legal/privacy');
            }}
            sx={{
              marginTop: 2,
              height: 35,
              fontSize: 12,
              borderRadius: 50,
              marginLeft: '6rem',
              background: '#575757 !important'
            }}
          >
            Datenschutzerklärung
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={next}
            sx={{ marginTop: 5, height: 80, fontSize: 23, borderRadius: 50 }}
          >
            Konto erstellen
          </Button>
        </Box>
      </>
    )
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <BackButton
        {...{
          onClick: () => {
            router.push('/');
          },
          buttonText: '< Zurück'
        }}
      />
      <Box
        sx={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Divider />
        {diffChooser[activeSection]}
      </Box>
    </Container>
  );
}
