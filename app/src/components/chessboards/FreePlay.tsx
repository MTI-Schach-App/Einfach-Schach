

import React, { useEffect, useRef, useState } from 'react';
import { Chessground as ChessgroundApi } from 'chessground';

import { Api } from 'chessground/api';
import { Config } from 'chessground/config';
import { toColor, toDests, toGermanColor } from '../../utils/helper';
import { Chess, PieceSymbol, Square } from 'chess.js';
import { useStore } from '../../utils/store';
import { fetchWrapper } from '../../utils/fetch-wrapper';

import "chessground/assets/chessground.base.css";

import "chessground/assets/chessground.cburnett.css";
import SuccessDialog from '../modals/SuccessModal';
import { Button, Fab, Typography, FormGroup, Switch, FormControlLabel } from '@mui/material';
import { defaultBoard } from '../../interfaces/constants';
import PromotionDialog from '../modals/PromotionModal';
import UndoIcon from '@mui/icons-material/Undo';
import aiGetBestMove from '../../pages/ai';
import DefeatDialog from '../modals/DefeatModal';
import { playMoveSound } from '../../utils/audio_player';
import { PieceHandler } from '../../utils/move_observer';

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
  const [lose, setLose] = useState(false);
  const [promo, setPromo] = useState(false);
  const [auswahl, setAuswahl] = useState("none")
  const [bauer, setBauer] = useState({from: "v4", to: "x4"})
  const [chess, setChess] = useState(new Chess());
  const [startState, setStartState] = useState(true);
  const [pieceHandler, setPieceHandler] = useState(new PieceHandler());
  const [boardSoundOn, setBoardSoundOn] = useState(true);
  const [figureSoundOn, setFigureSoundOn] = useState(true);

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
    chess.move({from: bauer.from, to: bauer.to, promotion: auswahl})

    setTimeout(() => {
      setCG(api, chess);
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
    setBauer({from: "v4", to: "x4"});
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

  const rollBack = () => {
    chess.undo();
    if(boardSoundOn) playMoveSound('undo');
    chess.undo();
    if(boardSoundOn) playMoveSound('undo');
    setCG(api, chess);
  };

  const userReset = () =>{
    if (user.id != 999999) {
      fetchWrapper.post('api/game/set_game', {
        id: user.id,
        fen: defaultBoard
      });
    }  
    const newUser = user;
    newUser.currentGame = defaultBoard;
    setUser(newUser);
  }

  const boardObserving = () =>{  
    if(startState) { 
      pieceHandler.setUp(document.querySelector('cg-board'));
      pieceHandler.eventHandling();
      setStartState(false);
    }
    pieceHandler.handleSound(figureSoundOn);
  }

  function aiPlay(cg: Api, chess: Chess, delay: number, firstMove: boolean) {
    return (orig, dest) => {
      
      
      const destFigure = chess.get(orig);
      
      if (dest[1] === '8' && destFigure.color === 'w' && destFigure.type === 'p') {
        setPromo(true);
        setBauer({from: orig, to: dest});
        setTimeout(() => {if(boardSoundOn) playMoveSound('promotion')}, delay+1000);
      }
      else {
        const move = chess.move({from: orig, to: dest});
        console.log('white: ' + orig + ' -> ' + dest);     
        if(typeof move.captured != 'undefined'){
          if(boardSoundOn) playMoveSound('capture');
        } 
        else if(move.san == 'O-O') {
          if(boardSoundOn) playMoveSound('rochade');
        }
        else {
          if(boardSoundOn) playMoveSound('normal');
        }

      if(chess.isCheck()){
        setTimeout(() => {if(boardSoundOn) playMoveSound('check')}, delay+200);
      }

      if (chess.isCheckmate()) {
        userReset();
        if(boardSoundOn) playMoveSound('won');        
        setWin(true);      
      }
      
      else {

        setTimeout(() => {
          const move = aiGetBestMove(chess, 2);
          //const moves = chess.moves({verbose:true});
          //const move = firstMove ? moves[0] : moves[Math.floor(Math.random() * moves.length)] ;
          //@ts-ignore
          chess.move(move.san);
          console.log('black: ' + move.from + ' -> ' + move.to);
          if(typeof move.captured != 'undefined'){
            if(boardSoundOn) playMoveSound('capture');
          } 
          else if(move.san == 'O-O') {
            if(boardSoundOn) playMoveSound('rochade');
          }
          else {
            if(boardSoundOn) playMoveSound('normal');
          }

          if (move.to[1] === '1' && move.piece === 'p') {
            setTimeout(() => setBauer({from: orig, to: dest}), delay+100);
            setTimeout(() => {if(boardSoundOn) playMoveSound('promotion')}, delay+100);
          }

          if(chess.isCheck()){
            setTimeout(() => {if(boardSoundOn) playMoveSound('check')}, delay+200);
          }

          if(chess.isGameOver()) {
            userReset();
            if(boardSoundOn) playMoveSound('lost');            
            setLose(true);     
          }
          else{
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
          } 
        }, delay+delay);        

        
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
      <DefeatDialog
        open={lose}
        setOpen={setLose}
        text={'Du bist vom Gegner ins Matt gestetzt worden!'}
      />
       

      <Fab
          color="primary"
          onClick={rollBack}
          aria-label="settings"
          sx={{ float: 'right', marginBottom:'3rem' }}
        >
          <UndoIcon fontSize="large"></UndoIcon>
        </Fab>

      <div style={{ height: width, width: width }}>
             onFocus={boardObserving} 
             onTouchStart={boardObserving}
             onMouseDown={boardObserving}
             style={{ height: '100%', width: '100%', display: 'table' }}
        />
        <FormGroup>
          <div>
            <FormControlLabel
            control={
                <Switch
                  color="primary"
                  checked={boardSoundOn}
                  onChange={()=>{
                    if(!boardSoundOn) setBoardSoundOn(true);
                    else setBoardSoundOn(false);
                  }}
                >
                </Switch>
            } label="Schachbrettgeräusche" aria-label="schachbrettgeräusche"/> 
            <FormControlLabel
              control={
                  <Switch
                    color="primary"
                    checked={figureSoundOn}
                    onChange={()=>{
                      if(!figureSoundOn) setFigureSoundOn(true);
                      else setFigureSoundOn(false);
                    }}
                  >
                  </Switch>
            } label="Schachfigurengeräusche" aria-label="schachfigurengeräusche"/> 
          
       </FormGroup>
      </div>
    </>
    
  );
}

export default ChessgroundFree;

//audio displayer -> promotion working?
