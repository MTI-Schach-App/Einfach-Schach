

import React, { useEffect, useRef, useState } from 'react';
import { Chessground as ChessgroundApi } from 'chessground';

import { Api } from 'chessground/api';
import { Config } from 'chessground/config';
import { toColor, toDests, toGermanColor } from '../../utils/helper';
import { Chess, PieceSymbol, Square } from 'chess.js';
import { useStore } from '../../utils/store';
import { fetchWrapper } from '../../utils/fetch-wrapper';

import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import SuccessDialog from '../modals/SuccessModal';
import { Typography } from '@mui/material';
import { defaultBoard } from '../../interfaces/constants';
import PromotionDialog from '../modals/PromotionModal';

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
  const [promo, setPromo] = useState(false);
  const [auswahl, setAuswahl] = useState("none")
  const [bauer, setBauer] = useState("z6")
  const [chess, setChess] = useState(new Chess());

  const ref = useRef<HTMLDivElement>(null);
  
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
      api.set({fen: user.currentGame, ...config});
      chess.load(user.currentGame)
    }
  }, [ref]);

  useEffect(() => {
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
  }, [api,config]);


  function updateUser() {
    if (user.id != 999999) {
    fetchWrapper.post('api/game/set_game', { id: user.id, fen: chess.fen() });}
    const newUser = user;
    newUser.currentGame = chess.fen();
    setUser(newUser);
  }


  if (auswahl != 'none') {
    chess.put({type:auswahl as PieceSymbol, color:"w"},bauer as Square);
    
    setCG(api, chess);
    setTimeout(() => {
      const moves = chess.moves({verbose:true});
      const move = moves[Math.floor(Math.random() * moves.length)] ;
      //@ts-ignore
      chess.move(move.san);
      //@ts-ignore
      api.move(move.from, move.to);
      api.set({
        turnColor: toColor(chess),
        movable: {
          color: toColor(chess),
          dests: toDests(chess)
        }
      });
      api.playPremove();
      updateUser();
    }, 1000);
    setBauer('z6')
    setAuswahl('none');
  }

  function setCG(cg: Api, chess: Chess, highlight: boolean = true) {
    cg.set({
      fen:chess.fen(),  
      turnColor: toColor(chess),
      movable: {
        color: toColor(chess),
        dests: toDests(chess)
      },
      highlight: {
        lastMove: highlight,
        check: true
      }
    });
  }

  function aiPlay(cg: Api, chess: Chess, delay: number, firstMove: boolean) {
    return (orig, dest) => {
      chess.move({from: orig, to: dest});

      if (chess.isCheckmate()) {
        if (user.id != 999999) {
          fetchWrapper.post('api/game/set_game', {
            id: user.id,
            fen: defaultBoard
          });
        }  

        const newUser = user;
        newUser.currentGame = defaultBoard;
        setUser(newUser);
        setWin(true);
      
      }
      else {

          const ziellinie = chess.board()[5] //Final auf 0 ändern
          let promo = false;

          ziellinie.forEach(figur => {
              if (figur && figur.type === "p" && figur.color === "w"){
                promo = true;
                chess.remove(figur.square);
                setPromo(true);
                setBauer(figur.square)
              }
            }
          )
          console.log(promo,chess.board()[5])

          if (!promo) {
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
      <PromotionDialog
        open={promo}
        setOpen={setPromo}
        text={'Dein Bauer hat das Ende des Spielfeldes erreicht! Du kannst jetzt Auswählen, durch welche Figur Du ihn ersetzen möchtest. Tippe die jeweilige Figur an und drücke anschließend auf “Bestätigen”.'}
        setAuswahl={setAuswahl}
      />
      <Typography
            variant="h4"
            sx={{ textAlign: 'center', marginTop: -5, marginBottom: 1 }}
          >
            Am Zug: {toGermanColor(api?.state.turnColor)}
      </Typography>

      <div style={{ height: width, width: width }}>
        <div ref={ref} style={{ height: '100%', width: '100%', display: 'table' }} />
      </div>
    </>
    
  );
}

export default ChessgroundFree;