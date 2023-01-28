

import React, { useEffect, useRef, useState } from 'react';
import { Chessground as ChessgroundApi } from 'chessground';

import { Api } from 'chessground/api';
import { Config } from 'chessground/config';
import { toColor, toDests } from '../../utils/helper';
import { Chess } from 'chess.js';
import { useStore } from '../../utils/store';
import { fetchWrapper } from '../../utils/fetch-wrapper';

import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import SuccessDialog from '../modals/SuccessModal';
import { Typography } from '@mui/material';
import { defaultBoard } from '../../interfaces/constants';

interface Props {
  width?: number
  config?: Config
}

function ChessgroundFree({
  width = 450, config = {}
}: Props) {
  const [api, setApi] = useState<Api | null>(null);
  const user = useStore((state) => state.loggedInUser);
  const setUser = useStore((state) => state.setLoggedInState);
  const [win, setWin] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const chess = new Chess();
  config = { ... config, movable: {
    color: 'white',
    free: false,
    dests: toDests(chess)
  },
  highlight: {
    check: true
  }}
  useEffect(() => {
    if (ref && ref.current && !api) {
      const chessgroundApi = ChessgroundApi(ref.current, {
        animation: { enabled: true, duration: user.animationSpeed },
        ...config,
      });
      setApi(chessgroundApi);
    } else if (ref && ref.current && api) {
      api.set(config);
    }
  }, [ref]);

  useEffect(() => {
    chess.load(user.currentGame)
    api?.set({
      fen: user.currentGame, ...config,
        movable: {
          color: toColor(chess),
          dests: toDests(chess),
          events: {
            after: aiPlay(api, chess, user.animationSpeed, false)
          }
        }
      })
  }, [api, config]);

  function updateUser() {
    fetchWrapper.post('api/game/set_game', { id: user.id, fen: chess.fen() });
    const newUser = user;
    newUser.currentGame = chess.fen();
    setUser(newUser);
  }

  function aiPlay(cg: Api, chess: Chess, delay: number, firstMove: boolean) {
    return (orig, dest) => {
      chess.move({from: orig, to: dest});
      if (chess.isCheckmate()) {
        fetchWrapper.post('api/game/set_game', {
          id: user.id,
          fen: defaultBoard
        });
        const newUser = user;
        newUser.currentGame = defaultBoard;
        setUser(newUser);
        setWin(true);
        
      }
      else {
        setTimeout(() => {
          const moves = chess.moves({verbose:true});
          const move = firstMove ? moves[0] : moves[Math.floor(Math.random() * moves.length)] ;
          //@ts-ignore
          chess.move(move.san);
          //@ts-ignore
          cg.move(move.from, move.to);
          cg.set({
            turnColor: toColor(chess),
            movable: {
              color: toColor(chess),
              dests: toDests(chess)
            }
          });
          cg.playPremove();
          updateUser();
        }, delay);
      }
      
    };
  }
  
  return (
    <>
      <SuccessDialog
        open={win}
        setOpen={setWin}
        text={'Du hast den Gegner ins Matt gesetzt!'}
      />
      <Typography
            variant="h4"
            sx={{ textAlign: 'center', marginTop: -5, marginBottom: 1 }}
          >
            Am Zug: {api?.state.turnColor}
      </Typography>

      <div style={{ height: width, width: width }}>
        <div ref={ref} style={{ height: '100%', width: '100%', display: 'table' }} />
      </div>
    </>
    
  );
}

export default ChessgroundFree;