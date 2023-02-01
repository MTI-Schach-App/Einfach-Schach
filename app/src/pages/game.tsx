import { Container, Box, Button } from '@mui/material';
import { useWindowSize } from '../utils/helper';
import { useStore } from '../utils/store';
import { useRouter } from 'next/router';
import BackButton from '../components/buttons/BackButton';
import { fetchWrapper } from '../utils/fetch-wrapper';
import ChessgroundFree from '../components/chessboards/FreePlay';
import { defaultBoard } from '../interfaces/constants';

function FreePlay() {
  const router = useRouter();

  const loggedUser = useStore((state) => state.loggedInUser);
  const setUser = useStore((state) => state.setLoggedInState);
  if (process.browser && loggedUser.id === 0) {
    router.push('/');
  }

  const size = useWindowSize();
  
  const cancelGame = () => {
    fetchWrapper.post('api/game/set_game', {
      id: loggedUser.id,
      fen: defaultBoard
    });
    const newUser = loggedUser;
    newUser.currentGame = defaultBoard;
    setUser(newUser);
    router.push('/');
  };
  

  let width = size.width * 0.9;
  if (size.height < size.width) {
    width = size.height * 0.85;
  }

  return (
    <>
      <BackButton {...{
      onClick:() => router.back(),
      buttonText:'< Zurück'
      }}/>
      <Button
        variant="contained"
        sx={{
          float: 'right',
          marginTop: 2,
          marginRight: 1,
          backgroundColor: 'red'
        }}
        onClick={cancelGame}
      >
        Aufgeben
      </Button>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <ChessgroundFree
          width={width}
          config={{
            draggable: {enabled:false},
            
          }}/>
        </Box>
      </Container>
    </>
  )
}

export default FreePlay;
