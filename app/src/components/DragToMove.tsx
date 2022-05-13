import { useState } from 'react';
import {Chess} from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { fetchWrapper } from '../utils/fetch-wrapper';
import { useStore } from '../utils/store';

export default function DragToMove({ boardWidth, startPos }) {
  const [game, setGame] = useState(new Chess(startPos));
  
  const store = useStore((state) => state.loggedInUser);
  const setUser = useStore((state) => state.setLoggedInState);
  
  function safeGameMutate(modify) { 
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function updateUser(){
    fetchWrapper.post('api/game/set_game',{id:store.id,fen:game.fen()});
    const newUser = store;
    newUser.currentGame = game.fen();
    setUser(newUser);
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
    updateUser();
  }

  function onDrop(sourceSquare, targetSquare) {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to a queen for example simplicity
      });
    });
    if (move === null) return false; // illegal move
    setTimeout(makeRandomMove, 200);
    return true;
  }

  return(
    <div>
      <Chessboard
        id={7}
        animationDuration={200}
        boardWidth={boardWidth}
        position={game.fen()}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
        }}
      />
      
      
    </div>
  );
}
