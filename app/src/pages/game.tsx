import ClickToMove from '../components/ClickToMove';
import { Container, Box, CircularProgress, Button } from '@mui/material';
import { useWindowSize } from '../utils/helper';
import { useStore } from '../utils/store';
import axios from 'axios';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import BackButton from '../components/BackButton';
import { fetchWrapper } from '../utils/fetch-wrapper';
import DragToMove from '../components/DragToMove';

const defaultBoard = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1';
function GamePage() {
  const router = useRouter();

  const loggedUser = useStore((state) => state.loggedInUser);
  const setUser = useStore((state) => state.setLoggedInState);
  if (process.browser && loggedUser.id === 0) {
    router.push('/');
  }
  const size = useWindowSize();

  const { data: users } = useSWR(
    [`api/users/get_by_id?id=${loggedUser.id.toString()}`],
    (url) => axios.get(url).then((res) => res.data),
    { refreshInterval: 6000 }
  );
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

  if (!users) {
    return (
      <Container>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </div>
      </Container>
    );
  }

  let position = defaultBoard;
  if (loggedUser.currentGame != '') {
    position = loggedUser.currentGame;
  }

  let width = size.width * 0.9;
  if (size.height < size.width) {
    width = size.height * 0.85;
  }
  let board = <></>;
  if (loggedUser.wantsToClick) {
    board = <ClickToMove {...{ boardWidth: width, startPos: position }} />;
  } else {
    board = <DragToMove {...{ boardWidth: width, startPos: position }} />;
  }

  return (
    <>
      <BackButton />
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
          {board}
        </Box>
      </Container>
    </>
  );
}

export default GamePage;
