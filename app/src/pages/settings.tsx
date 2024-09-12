import {
  Container,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useStore } from '../utils/store';
import { useRouter } from 'next/router';
import BackButton from '../components/buttons/BackButton';
import { fetchWrapper } from '../utils/fetch-wrapper';
import QRCode from 'react-qr-code';
import { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';

function Settings() {
  const { setLoggedInState, loggedInUser } = useStore();
  const [showQR, setShowQR] = useState(false);
  const [boardSound, setBoardSound] = useState(loggedInUser.boardSound || false);
  const [figureSound, setFigureSound] = useState(loggedInUser.figureSound || false);
  const [blindMode, setBlindMode] = useState(loggedInUser.blindMode || false);

  const printRef = useRef();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const click = data.get('click');
    const speed = data.get('speed').toString();
    const newUser = {
      ...loggedInUser,
      wantsToClick: click === 'true',
      animationSpeed: parseInt(speed),
      boardSound,
      figureSound,
      blindMode,
    };

    setLoggedInState(newUser);
    if (newUser.id != 999999) await fetchWrapper.post('api/users/update', newUser);
    router.push('/');
  };

  const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
      <div
        //@ts-ignore 
        ref={ref}>
        <QRCode value={loggedInUser.name} />
      </div>
    );
  });

  if (showQR)
    return (
      <>
        <BackButton onClick={() => router.back()} buttonText="< Zurück" />
        <Container component="main" maxWidth="xs">
          <Box sx={{ marginTop: '10rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ComponentToPrint ref={printRef} />
            <ReactToPrint
              trigger={() => (
                <Button fullWidth sx={{ marginTop: 5, height: 100, fontSize: 30 }} variant="contained">
                  Ausdrucken!
                </Button>
              )}
              content={() => printRef.current}
            />
          </Box>
        </Container>
      </>
    );

  return (
    <>
      <BackButton onClick={() => router.back()} buttonText="< Zurück" />

      <Button
        sx={{
          marginRight: 2,
          marginTop: 2,
          backgroundColor: 'blue',
          fontSize: 15,
          float: 'right',
        }}
        variant="contained"
        onClick={() => setShowQR(true)}
      >
        Meinen QR Code anzeigen
      </Button>

      <Container component="main" maxWidth="sm">
        <Box sx={{ marginTop: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Divider />
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ margin: 5 }}>

            <FormControl fullWidth sx={{ marginBottom: 5 }}>
              <FormLabel id="Zuggeschwindigkeit-simple-select-label">Zuggeschwindigkeit</FormLabel>
              <Select
                labelId="Zuggeschwindigkeit-simple-select-label"
                id="Zuggeschwindigkeit-simple-select"
                name="speed"
                defaultValue={loggedInUser.animationSpeed}
                label="Zuggeschwindigkeit"
              >
                <MenuItem value={500}>Schnell</MenuItem>
                <MenuItem value={2000}>Normal</MenuItem>
                <MenuItem value={4000}>Langsam</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: 5 }}>
              <FormControlLabel
                control={
                  <Switch
                    name='boardSound'
                    checked={boardSound}
                    onChange={(e) => setBoardSound(e.target.checked)}
                    color="primary"
                  />
                }
                label="Schachbrettgeräusche"
              />
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: 5 }}>
              <FormControlLabel
                control={
                  <Switch
                  name='figureSound'
                    checked={figureSound}
                    onChange={(e) => setFigureSound(e.target.checked)}
                    color="primary"
                  />
                }
                label="Schachfigurengeräusche"
              />
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: 5 }}>
              <FormControlLabel
                control={
                  <Switch
                  name='blindMode'
                    checked={blindMode}
                    onChange={(e) => setBlindMode(e.target.checked)}
                    color="primary"
                  />
                }
                label="Blinden Modus"
              />
            </FormControl>

            <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 5, height: 100, fontSize: 30, borderRadius: 15 }}>
              Speichern
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Settings;
