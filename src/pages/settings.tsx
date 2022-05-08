import { Container,Box, Button, Divider, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useStore } from '../utils/store';
import {useRouter} from 'next/router';
import BackButton from '../components/BackButton';
import { fetchWrapper } from '../utils/fetch-wrapper';

function Settings() {
  const { setLoggedInState, loggedInUser} = useStore();
  
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const click = data.get('click');
    const newUser = loggedInUser;

    loggedInUser.wantsToClick = (click === 'true');
    await fetchWrapper.post('api/users/update',newUser);
    setLoggedInState(newUser);
    router.push('/');
  };
  
  return (
    <>
    <BackButton/>
    <Container component="main" maxWidth="xs">
      
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
      <Divider/>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <FormControl>
          <FormLabel id="click">Möchtest du die Figuren Klicken oder Ziehen?</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={loggedInUser.wantsToClick.toString()}
            name="click"
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Klicken" />
            <FormControlLabel value="false" control={<Radio />} label="Ziehen" />
          </RadioGroup>
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