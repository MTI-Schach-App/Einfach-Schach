import {
  Container,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { useStore } from '../utils/store';
import { useRouter } from 'next/router';
import BackButton from '../components/BackButton';
import { fetchWrapper } from '../utils/fetch-wrapper';
import QRCode from 'react-qr-code';
import { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

function Settings() {
  const { setLoggedInState, loggedInUser } = useStore();
  const [showQR, setShowQR] = useState(false);

  const printRef = useRef();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const click = data.get('click');
    const speed = data.get('speed').toString();
    const newUser = loggedInUser;

    loggedInUser.wantsToClick = click === 'true';
    newUser.animationSpeed = parseInt(speed);
    await fetchWrapper.post('api/users/update', newUser);
    setLoggedInState(newUser);
    router.push('/');
  };
  if (showQR)
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <QRCode
            value={loggedInUser.name}
            ref={(el) => (printRef.current = el)}
          />
          <ReactToPrint
            trigger={() => (
              <Button
                fullWidth
                sx={{ marginTop: 5, height: 100, fontSize: 30 }}
                variant="contained"
              >
                Ausdrucken!
              </Button>
            )}
            content={() => printRef.current}
          />
        </Box>
      </Container>
    );
  return (
    <>
      <BackButton />

      <Button
        sx={{
          marginRight: 2,
          marginTop: 2,
          backgroundColor: 'blue',
          fontSize: 15,
          float: 'right'
        }}
        variant="contained"
        onClick={() => setShowQR(true)}
      >
        meinen QR Code anzeigen
      </Button>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 15,
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
            sx={{ margin: 5 }}
          >
            <FormControl fullWidth sx={{ marginBottom: 5 }}>
              <FormLabel id="click">
                Möchtest du die Figuren Klicken oder Ziehen?
              </FormLabel>
              <Select
                labelId="click"
                id="click"
                defaultValue={loggedInUser.wantsToClick.toString()}
                name="click"
                label="Möchtest du die Figuren Klicken oder Ziehen?"
              >
                <MenuItem value={'true'}>Klicken</MenuItem>
                <MenuItem value={'false'}>Ziehen</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel id="Zuggeschwindigkeit-simple-select-label">
                Zuggeschwindigkeit
              </FormLabel>
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Speichern
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Settings;
