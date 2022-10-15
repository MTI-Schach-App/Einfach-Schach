import { useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { fetchWrapper } from '../utils/fetch-wrapper';
import SuccessDialog from './modals/SuccessModal';
import { useStore } from '../utils/store';

export default function FreePlay({ boardWidth, startPos }) {
  const store = useStore((state) => state.loggedInUser);
  const setUser = useStore((state) => state.setLoggedInState);
  const chessboardRef = useRef();
  const [game, setGame] = useState(new Chess(startPos));

  const [moveFrom, setMoveFrom] = useState('');

  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const moveSquares = {};
  const [optionSquares, setOptionSquares] = useState({});

  const [win, setWin] = useState(false);

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

  function makeRandomMove() {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) {
      setWin(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
    updateUser();
  }

  function onSquareClick(square) {
    setRightClickedSquares({});

    function resetFirstMove(square) {
      setMoveFrom(square);
      getMoveOptions(square);
    }

    // from square
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
    setGame(gameCopy);

    // if invalid, setMoveFrom and getMoveOptions
    if (move === null) {
      resetFirstMove(square);
      return;
    }

    setTimeout(makeRandomMove, store.animationSpeed + 1000);
    setMoveFrom('');
    setOptionSquares({});
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
    if (move === null) return false; // illegal move
    setTimeout(makeRandomMove, store.animationSpeed + 1000);
    return true;
  }

  if (store.wantsToClick) {
    return (
      <div>
        <SuccessDialog
          open={win}
          setOpen={setWin}
          text={'Du hast den Gegner ins Matt gesetzt!'}
        />

        <Chessboard
          id={7}
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
          ref={chessboardRef}
        />
      </div>
    );
  } else {
    return (
      <div>
        <SuccessDialog
          open={win}
          setOpen={setWin}
          text={'Du hast den Gegner ins Matt gesetzt!'}
        />

        <Chessboard
          id={7}
          animationDuration={store.animationSpeed}
          boardWidth={boardWidth}
          position={game.fen()}
          onPieceDrop={onDrop}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
          }}
        />
      </div>
    );
  }
}
