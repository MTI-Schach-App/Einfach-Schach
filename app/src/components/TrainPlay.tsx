import { useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { fetchWrapper } from '../utils/fetch-wrapper';
import AlertDialog from './modals/AlertModal';
import SuccessDialog from './modals/SuccessModal';
import { useStore } from '../utils/store';
import { Typography } from '@mui/material';
import SuccessTrainingDialog from './modals/SuccessTrainingModal';

export default function TrainPlay({ boardWidth, course, ref }) {
  const startPos = course.start;
  const legalMoves = course.moves;
  const store = useStore((state) => state.loggedInUser);
  const setUser = useStore((state) => state.setLoggedInState);
  const [game, setGame] = useState(new Chess(startPos));

  const [moveFrom, setMoveFrom] = useState('');

  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const moveSquares = {};
  const [optionSquares, setOptionSquares] = useState({});
  const [currentLegal, setCurrentLegal] = useState(0);
  const [modal, setModal] = useState(false);
  const [win, setWin] = useState(false);

  function clearBoard() {}

  const winHandler = () => {
    game.clear();
    setWin(true);
  };

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true
    });
    if (moves.length === 0) {
      return;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)'
    };
    setOptionSquares(newSquares);
  }

  function updateUser() {
    fetchWrapper.post('api/game/set_game', { id: store.id, fen: game.fen() });
    const newUser = store;
    newUser.currentGame = game.fen();
    setUser(newUser);
  }

  function makeNextMove() {
    safeGameMutate((game) => {
      game.move({
        from: legalMoves[currentLegal + 1].slice(0, 2),
        to: legalMoves[currentLegal + 1].slice(2, 4),
        promotion: 'q' // always promote to a queen for example simplicity
      });
    });

    increaseLegal();
    updateUser();
  }

  function increaseLegal() {
    setCurrentLegal(currentLegal + 2);
  }

  function undoTurnAndNotify() {
    setMoveFrom('');
    setOptionSquares({});
    setTimeout(() => {
      game.undo();
    }, store.animationSpeed + 1000);
    setModal(true);
  }

  function onSquareClick(square) {
    console.log(course);
    setRightClickedSquares({});

    function resetFirstMove(square) {
      setMoveFrom(square);
      getMoveOptions(square);
    }

    if (!moveFrom) {
      resetFirstMove(square);
      return;
    }

    // attempt to make move
    const gameCopy = { ...game };
    const moddedMoveFrom: Square = moveFrom as Square;

    const move = gameCopy.move({
      from: moddedMoveFrom,
      to: square,
      promotion: 'q' // always promote to a queen for example simplicity
    });

    if (moddedMoveFrom.concat(square) != legalMoves[currentLegal]) {
      undoTurnAndNotify();
      return;
    }

    if (currentLegal + 2 >= legalMoves.length) {
      setWin(true);
      return;
    }

    // if invalid, setMoveFrom and getMoveOptions
    if (move === null) {
      resetFirstMove(square);
      return;
    }

    setGame(gameCopy);

    setTimeout(makeNextMove, store.animationSpeed + 1000);
    setMoveFrom('');
    setOptionSquares({});
  }

  function cleanTurn() {
    if (game.turn() == 'b') return 'schwarz';
    else return 'wei??';
  }

  function onSquareRightClick(square) {
    const colour = 'rgba(0, 0, 255, 0.4)';
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour }
    });
  }

  function onDrop(sourceSquare, targetSquare) {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // always promote to a queen for example simplicity
      });
    });

    if (sourceSquare.concat(targetSquare) != legalMoves[currentLegal]) {
      undoTurnAndNotify();
      return;
    }

    if (currentLegal + 2 >= legalMoves.length) {
      setWin(true);
      return;
    }

    if (move === null) return false; // illegal move
    setTimeout(makeNextMove, store.animationSpeed + 1000);
    return true;
  }

  if (store.wantsToClick) {
    return (
      <div>
        <AlertDialog
          open={modal}
          setOpen={setModal}
          text={'Probier es doch noch einmal'}
        />
        <SuccessTrainingDialog
          open={win}
          setOpen={winHandler}
          course={course}
          text={'Du hast alle richtigen Z??ge gefunden!'}
        />
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', marginTop: -5, marginBottom: 1 }}
        >
          Am Zug: {cleanTurn()}
        </Typography>
        <Chessboard
          id={course.id}
          animationDuration={store.animationSpeed}
          arePiecesDraggable={false}
          boardWidth={boardWidth}
          position={game.fen()}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
          }}
          customSquareStyles={{
            ...moveSquares,
            ...optionSquares,
            ...rightClickedSquares
          }}
          ref={ref}
        />
      </div>
    );
  } else {
    return (
      <div>
        <AlertDialog
          open={modal}
          setOpen={setModal}
          text={'Probier es doch noch einmal'}
        />
        <SuccessTrainingDialog
          open={win}
          setOpen={winHandler}
          course={course}
          text={'Du hast alle richtigen Z??ge gefunden!'}
        />
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', marginTop: -5, marginBottom: 1 }}
        >
          Am Zug: {cleanTurn()}
        </Typography>

        <Chessboard
          id={course.id}
          animationDuration={store.animationSpeed}
          boardWidth={boardWidth}
          position={game.fen()}
          onPieceDrop={onDrop}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
          }}
          ref={ref}
        />
      </div>
    );
  }
}
