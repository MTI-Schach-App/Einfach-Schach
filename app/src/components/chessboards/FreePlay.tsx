

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
import { Button, Fab, Typography, FormGroup, Switch, FormControlLabel, Stack, List } from '@mui/material';
import { defaultBoard } from '../../interfaces/constants';
import PromotionDialog from '../modals/PromotionModal';
import UndoIcon from '@mui/icons-material/Undo';
import aiGetBestMove from '../../pages/ai';
import DefeatDialog from '../modals/DefeatModal';
import { callHiddenWindow } from '../../utils/move_displayer';
import { playMoveSound, playSignalSound, playTypeSound } from '../../utils/audio_player';
import HiddenFieldForScreenReader from '../modals/AudioForScreenReaderModal';
import { ChessPiece, MoveSquare } from '../../utils/chess_interaction_logic';
import { HistoryEdu } from '@mui/icons-material';

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

  const [boardSound, setBoardSound] = useState(true);
  const [figureSound, setFigureSound] = useState(true);
  const [visibility, setVisibility] = useState(false);
  const [variant1, setVariant1] = useState(true);
  const [history, setHistory] = useState(false);

  const [actionState, setActionState] = useState(false);
  const [readyToRender, setReadyToRender] = useState(true);
  const [movesPos, setMovesPos] = useState<string[]>([]);
  const [startState, setStartState] = useState(true);
  const [focus, setFocus] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const logic_container = useRef<HTMLDivElement>(null);

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
  }, [ref, logic_container]);

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
    setTimeout(() => {callHiddenWindow({type: 'promotion', color: 'b', piece: bauer.to})}, 2100);

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
    if(boardSound) playMoveSound('undo');
    setChess(chess);  
    setTimeout(()=>{setReadyToRender(false), setActionState(false)}, user.animationSpeed);

    chess.undo();
    if(boardSound) playMoveSound('undo');
    setChess(chess);    
    setTimeout(()=>{setReadyToRender(false), setActionState(false)}, user.animationSpeed);

    callHiddenWindow({type:'undo'});

    setCG(api, chess);
    updateUser();
    setTimeout(()=>{
      setReadyToRender(true), setActionState(false);
      if(boardSound) playSignalSound('normal')}, user.animationSpeed+800);
  };
  const TYPES = {
    'p' : 'Bauer',
    'b' : 'Läufer',
    'r' : 'Turm',
    'n' : 'Springer',
    'q' : 'Königin',
    'k' : 'König'
}
const COLOR = {
    'w' : 'Weiß',
    'b' : 'Schwarz'
}
const getHistory = () =>{
    const historyList = chess.history({ verbose: true });
    let text = '';
    if(historyList.length > 0){
      if(historyList.length > 10){
        for(let i = historyList.length-10-1; i < historyList.length-1; i++){
          text += typeof historyList[i]['captured'] != 'undefined' ? 
          `${COLOR[historyList[i]['color']]}: ${TYPES[historyList[i]['piece']]} von ${historyList[i]['from']} auf ${historyList[i]['to']},  ${TYPES[historyList[i]['captured']]} geschlagen<br>` : 
          `${COLOR[historyList[i]['color']]}: ${TYPES[historyList[i]['piece']]} von ${historyList[i]['from']} auf ${historyList[i]['to']} <br>`; 
        }
      }
      else{
        historyList.forEach((elem) => {
            text += typeof elem['captured'] != 'undefined' ? 
            `${COLOR[elem['color']]}: ${TYPES[elem['piece']]} von ${elem['from']} auf ${elem['to']},  ${TYPES[elem['captured']]} geschlagen<br>`: 
            `${COLOR[elem['color']]}: ${TYPES[elem['piece']]} von ${elem['from']} auf ${elem['to']} <br>`; 
          })
      }
    }
    else{
      text = 'Keine Zughistorie vorhanden.'
    }
    document.getElementById('audio_info').innerHTML = text;
    document.getElementById('history').innerHTML = text;
}

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
 

  const startActionState = (type: string, cgKey: any, color: string) => {    
    if(figureSound) playTypeSound(type);
    if(color === 'w'){
      api.selectSquare(cgKey);
      getMovesPos(cgKey);
      setActionState(true);  
      setReadyToRender(false);   
      if(figureSound && boardSound){
        setTimeout(()=>playSignalSound('action'), 1000);        
      }
      else if(boardSound && !figureSound){
        playSignalSound('action')
      }
      document.getElementById('logic_container').focus();  
    }  
    setFocus(false);
  }
  const stopActionState = (cgKey : any, selected : boolean) => {
    if(!selected) {
      setTimeout(()=>api.selectSquare(cgKey), 100);
      setReadyToRender(false);
      if(boardSound) setTimeout(()=>playSignalSound('normal'), user.animationSpeed);
    }
    else{      
      setReadyToRender(true);
      setTimeout(()=>api.cancelMove(), 100);
      if(boardSound) playSignalSound('normal');
    } 
    setActionState(false);
    document.getElementById('logic_container').focus();
    setFocus(false);
  }
  const getMovesPos = (position : string) =>{
    let moves = [];
    moves.push([position, false])

    chess.moves({verbose:true}).map((move) => {
      if(position === move.from) {
        if(typeof move.captured != 'undefined') moves.push([move.to, true]);
        else moves.push([move.to, false]);
      }
    })
    setMovesPos(moves);
  }

  function aiPlay(cg: Api, chess: Chess, delay: number, firstMove: boolean) {
    return (orig, dest) => {
      
      
      const destFigure = chess.get(orig);
      
      if (dest[1] === '8' && destFigure.color === 'w' && destFigure.type === 'p') {
        setPromo(true);
        setBauer({from: orig, to: dest});
        setTimeout(() => {if(boardSound) playMoveSound('promotion')}, delay+1000);
      }
      else {
        const move = chess.move({from: orig, to: dest});
        console.log('white: ' + orig + ' -> ' + dest);         
        if(typeof move.captured != 'undefined'){
          if(boardSound) playMoveSound('capture');
          callHiddenWindow({type:'normal', piece: move.piece, destination: move.to});
          setTimeout(()=>callHiddenWindow({type:'capture', piece: move.captured, color: 'b'}), 100);
        } 
        else if(move.san == 'O-O') {
          if(boardSound) playMoveSound('rochade');
          callHiddenWindow({type:'rochade', color: 'w'});
        }
        else {
          if(boardSound) playMoveSound('normal');
          callHiddenWindow({type:'normal', piece: move.piece, destination: move.to});
        }

      if(chess.isCheck()){
        setTimeout(() => {
          if(boardSound) playMoveSound('check')
          callHiddenWindow({type: 'check', color: 'b'})
        }, delay+200);
      }

      if (chess.isCheckmate()) {
        userReset();
        if(boardSound) playMoveSound('won');     
        callHiddenWindow({type: 'won'})   
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
            if(boardSound) playMoveSound('capture');
            callHiddenWindow({type:'normal', piece: move.piece, destination: move.to});
            setTimeout(()=>callHiddenWindow({type:'capture', piece: move.captured, color: 'w'}), 100);
          } 
          else if(move.san == 'O-O') {
            if(boardSound) playMoveSound('rochade');
            callHiddenWindow({type:'rochade', color: 'b'});
          }
          else {
            if(boardSound) playMoveSound('normal');
            callHiddenWindow({type:'normal', piece: move.piece, destination: move.to});
          }

          if (move.to[1] === '1' && move.piece === 'p') {
            setTimeout(() => setBauer({from: orig, to: dest}), delay+100);
            setTimeout(() => {if(boardSound) playMoveSound('promotion')}, delay+100);
            setTimeout(() => {callHiddenWindow({type:'promotion', color: 'w', piece: auswahl});}, delay+100);
          }

          if(chess.isCheck()){
            setTimeout(() => {
              if(boardSound) playMoveSound('check')
              callHiddenWindow({type: 'check', color: 'w'})
            }, delay+200);
          }

          if(chess.isGameOver()) {
            userReset();
            if(boardSound) playMoveSound('lost');   
            callHiddenWindow({type: 'lose'})            
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
          setChess(chess);
          setTimeout(()=>{setReadyToRender(true)}, delay+800);
          setTimeout(()=>{
            callHiddenWindow({type: 'turn', color: chess.turn()});
            setTimeout(()=>document.getElementById('logic_container').focus(), 100);
          }, delay);
        }, delay+800);        

        
      }

      }
      setChess(chess)
      setTimeout(()=>{setReadyToRender(true)}, delay+800);
      setTimeout(()=>{
        callHiddenWindow({type: 'turn', color: chess.turn()});
        setTimeout(()=>document.getElementById('logic_container').focus(), 100);
      }, delay);
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
        aria-label="zug zurück setzen"
        sx={{ float: 'right', marginBottom:'3rem' }}
        >
        <UndoIcon fontSize="large"></UndoIcon>
      </Fab>

      <div style={{ height: width, width: width, marginBottom: '-100%' }}>
        <div ref={ref} style={{ height: '100%', width: '100%', display: 'table' }}/>
        
        <div ref={logic_container} role='application' aria-roledescription='schachbrett' tabIndex={0} 
              id='logic_container'
              style={variant1 ? {
                display: 'table',
                height: '99.5%',
                width: '99.5%',
                position:'relative', top:'-100%',
                zIndex: '2', marginBottom: '-100%',
                opacity: 0.4, backgroundColor: 'blue',
              } : {
                height: '99.5%',
                width: '99.5%',
                overflowX: 'hidden',
                scrollbarColor: 'transparent transparent', 
                position:'relative', top:'-100%',
                zIndex: '2', marginBottom: '-100%',
                opacity: 0.4, backgroundColor: 'blue',
              }}
              onFocus={()=>{
                if(startState){
                  if(boardSound) {
                    playSignalSound('board')
                  }
                  callHiddenWindow({type: 'start'});     
                  setStartState(false);
                }
              }}  
              onTouchStart={
                ()=>{
                  if(!focus) return setFocus(true);
                }
              }
              onKeyPress={
                ()=>{
                  if(!focus) return setFocus(true);
                }
              }
          >
            {variant1 ? 
              (!actionState && readyToRender ? (
                chess.board().map((row) => (
                  <tr>
                      {
                        row.map((col) =>{ 
                          if(col != null){
                            return( 
                              <ChessPiece       
                                  variant={1}                           
                                  action={()=>startActionState(col.type, col.square, col.color)}
                                  color={col.color}
                                  focus={focus}
                                  type={col.type}
                                  cgKey={col.square}
                              ></ChessPiece>                                  
                            );    
                          } 
                          else {
                            return (
                              <td style={{backgroundColor: 'blue'}}></td>
                            )                          
                          }                                                 
                        })                        
                      }
                  </tr>
                  ))
                ) : (  
                  chess.board().map((row, i) => (
                    <tr>
                      {row.map((col, j) =>{
                        if(col != null){
                          let num = movesPos.findIndex((elem) => elem[0] === col?.square);
                          if(num == 0){                          
                            return(
                              <MoveSquare
                                variant={1} 
                                action={()=>stopActionState(col?.square, true)}
                                capture={false}
                                normal={false}     
                                selected={true}                     
                                cgKey={col?.square}
                              ></MoveSquare>
                            )
                          }
                          else if(num > 0){
                            return (
                              <MoveSquare
                                variant={1} 
                                action={()=>stopActionState(col?.square, false)}
                                capture={true}
                                normal={false}     
                                selected={false}                     
                                cgKey={col?.square}
                              ></MoveSquare>
                            )  
                          }
                          else{
                            return (
                              <td style={{backgroundColor: 'blue'}}></td>
                            )  
                          }
                        }
                        else {
                          let r = 8 - i                          //numbers
                          let c = String.fromCharCode(97 + j)    //letters
                          let num = movesPos.findIndex((elem) => elem[0] === c+r);
                          if(num > 0){
                            return(
                              <MoveSquare
                                variant={1} 
                                action={()=>stopActionState(c+r, false)}
                                capture={false}
                                normal={true}   
                                selected={false}                       
                                cgKey={c+r}
                              ></MoveSquare>
                            )
                          }
                          else{
                            return (
                              <td style={{backgroundColor: 'blue'}}></td>
                            )  
                          }
                        }
                      })}
                    </tr>
                  ))
                )
              ):
              (!actionState && readyToRender ? (
                  <List role=''
                    sx={{
                      scrollbarColor: 'transparent transparent', 
                      msOverflowStyle: 'display: none',
                      display: 'flex',
                      flexDirection: 'row',
                      padding: 0,
                      overflowX: 'scroll',
                      margin: '25% 0 25% 0' }}
                    >
                    {chess.board().map((row) => (
                      row.map((col) => {           
                        if(col != null){                                         
                          return(
                            <ChessPiece 
                              size={width/2}
                              variant={2}                            
                              action={()=>{startActionState(col.type, col.square, col.color)}}
                              color={col.color}
                              focus={focus}
                              type={col.type}
                              cgKey={col.square}
                            ></ChessPiece>                                                                                       
                          )
                        }                   
                      })
                    ))}
                  </List>             
                ) : (
                  <List role='' 
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: 0,
                      margin: '0 25% 0 25%' }}
                  >
                    {
                      movesPos.map((elem, i) =>{
                        if(i === 0) {
                          return(
                            <MoveSquare
                              variant={2} 
                              size={width/2}
                              action={()=>stopActionState(elem[0], true)}
                              capture={false}
                              normal={false} 
                              selected={true}                         
                              cgKey={elem[0]}
                            ></MoveSquare>
                          )
                        }
                        else{
                          if(elem[1]){
                            return(
                              <MoveSquare
                                variant={2} 
                                size={width/2}
                                action={()=>stopActionState(elem[0], false)}
                                capture={true}
                                normal={false} 
                                selected={false}                         
                                cgKey={elem[0]}
                              ></MoveSquare>
                            )
                          }
                          else{
                            return(
                              <MoveSquare
                                variant={2} 
                                size={width/2}
                                action={()=>stopActionState(elem[0], false)}
                                capture={false}
                                normal={true} 
                                selected={false}                         
                                cgKey={elem[0]}
                              ></MoveSquare>
                            )
                          }                            
                        }                          
                      })
                    }
                  </List>                  
                )                                       
              )
            }              
        </div>
          <HiddenFieldForScreenReader 
            id_name={'audio_info'}
            visibility={visibility}
          />
          <FormGroup sx={{marginTop: '1rem'}}>
            <Typography><b>Geräusche:</b></Typography>
            <div>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={boardSound}
                    onChange={()=>{
                      if(!boardSound) setBoardSound(true);
                      else setBoardSound(false);
                    }}
                  >
                  </Switch>
              } label="Schachbrettgeräusche" aria-label="schachbrettgeräusche"/> 
              <FormControlLabel
                control={
                    <Switch
                      color="primary"
                      checked={figureSound}
                      onChange={()=>{
                        if(!figureSound) setFigureSound(true);
                        else setFigureSound(false);
                      }}
                    >
                    </Switch>
              } label="Schachfigurengeräusche" aria-label="schachfigurengeräusche"/>
              </div> 

              <Typography><b>Sichtbarkeit des Versteckten Feldes:</b></Typography>
              <FormControlLabel 
                control={
                  <Switch
                    color="primary"
                    onChange={()=>{
                      if(!visibility) setVisibility(true);
                      else setVisibility(false);
                    }}
                    checked={visibility}
                  >
                  </Switch>
              } label="Verstecktes Feld" aria-label="sichtbarkeit des versteckten feldes"/>
                
              <Typography><b>Interaktionslogik:</b></Typography>
              <Stack direction="row" component="label" alignItems="center" justifyContent="left">
                  <Typography aria-label="interaktionslogik variante 2">
                    Variante 2
                  </Typography>
                  <Switch
                      color="primary"
                      onChange={()=>{
                        if(variant1) setVariant1(false);
                        else setVariant1(true);
                      }}
                      checked={variant1}
                    >
                    </Switch>
                  <Typography aria-label="interaktionslogik variante 1">
                    Variante 1
                  </Typography>
              </Stack>      
          </FormGroup>

          <Button
            color="primary"
            onClick={function(){
              if(history) return setHistory(false);
              else{
                return(
                  setHistory(true),
                  getHistory()
                )
              }
            }}
            aria-label="zughistorie"
            sx={{ float: 'right', marginTop: '-3rem', display: 'block'}}
          >          
            <div style={{zIndex: '5', 
                     backgroundColor: 'white', 
                     padding: '5px', 
                     borderRadius: '10px',
                     display: (history ? 'block' : 'none')}}>
              <p id='history' style={{textAlign: 'left', fontWeight: 'bold'}}></p>
            </div>
            <HistoryEdu fontSize="large"></HistoryEdu>            
          </Button>
        </div>
    </>
  );
}

export default ChessgroundFree;
