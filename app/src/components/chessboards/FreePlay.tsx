import React, { useEffect, useRef, useState } from 'react';
import { Chessground as ChessgroundApi } from 'chessground';

import { Api } from 'chessground/api';
import { Config } from 'chessground/config';
import { toColor, toDests } from '../../utils/helper';
import { Chess } from 'chess.js';
import { useStore } from '../../utils/store';
import { fetchWrapper } from '../../utils/fetch-wrapper';

import 'chessground/assets/chessground.base.css';

import 'chessground/assets/chessground.cburnett.css';

import SuccessDialog from '../modals/SuccessModal';
import {
  Button,
  Fab
} from '@mui/material';
import { defaultBoard } from '../../interfaces/constants';
import PromotionDialog from '../modals/PromotionModal';
import UndoIcon from '@mui/icons-material/Undo';
import aiGetBestMove from '../../utils/ai';
import DefeatDialog from '../modals/DefeatModal';
import { callHiddenWindow } from '../../utils/move_displayer';
import {
  playMoveSound,
  playSignalSound,
  playTypeSound
} from '../../utils/audio_player';
import HiddenFieldForScreenReader from '../modals/AudioForScreenReaderModal';
import { ChessPiece, MoveSquare } from '../../utils/chess_interaction_logic';
import { HistoryEdu } from '@mui/icons-material';

interface Props {
  width?: number;
  config?: Config;
}

function ChessgroundFree({ width = 450, config = {} }: Props) {
  const [api, setApi] = useState<Api | null>(null);
  const user = useStore((state) => state.loggedInUser);
  const setUser = useStore((state) => state.setLoggedInState);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);
  const [promo, setPromo] = useState(false);
  const [auswahl, setAuswahl] = useState('none');
  const [bauer, setBauer] = useState({ from: 'v4', to: 'x4' });
  const [chess, setChess] = useState(new Chess());

  const [history, setHistory] = useState(false);
  const [actionState, setActionState] = useState(false);
  const [readyToRender, setReadyToRender] = useState(true);
  const [movesPos, setMovesPos] = useState<string[]>([]);
  const [startState, setStartState] = useState(true);
  const [focus, setFocus] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const logic_container = useRef<HTMLDivElement>(null);

  config = {
    ...config,
    movable: {
      color: 'white',
      free: false,
      dests: toDests(chess)
    },
    highlight: {
      check: true
    }
  };

  useEffect(() => {
    if (ref && ref.current && !api) {
      const chessgroundApi = ChessgroundApi(ref.current, {
        animation: { enabled: true, duration: user.animationSpeed },
        ...config
      });
      setApi(chessgroundApi);
    } else if (ref && ref.current && api) {
      api.set({ fen: user.currentGame, ...config });
      chess.load(user.currentGame);
    }
  }, [ref, logic_container]);

  useEffect(() => {
    api?.set({
      fen: user.currentGame,
      ...config,
      movable: {
        color: toColor(chess),
        dests: toDests(chess),
        events: {
          after: aiPlay(api, chess, user.animationSpeed, false)
        }
      }
    });
  }, [api, config]);

  function updateUser() {
    if (user.id != 999999) {
      fetchWrapper.post('api/game/set_game', { id: user.id, fen: chess.fen() });
    }
    const newUser = user;
    newUser.currentGame = chess.fen();
    setUser(newUser);
  }

  if (auswahl != 'none') {
    chess.move({ from: bauer.from, to: bauer.to, promotion: auswahl });
    setTimeout(() => {
      callHiddenWindow({ type: 'promotion', color: 'b', piece: bauer.to });
    }, 2100);

    setTimeout(() => {
      setCG(api, chess);
      const moves = chess.moves({ verbose: true });
      const move = moves[Math.floor(Math.random() * moves.length)];
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
    setBauer({ from: 'v4', to: 'x4' });
    setAuswahl('none');
  }

  function setCG(cg: Api, chess: Chess, highlight: boolean = true) {
    cg.set({
      fen: chess.fen(),
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
    setChess(chess);
    setTimeout(() => {
      setReadyToRender(false), setActionState(false);
    }, user.animationSpeed);

    if (user.boardSound) playMoveSound('undo');
    if (user.blindMode) callHiddenWindow({ type: 'undo' });

    setCG(api, chess);
    updateUser();
    setTimeout(() => {
      setReadyToRender(true), setActionState(false);
      if (user.boardSound) playSignalSound('normal');
    }, user.animationSpeed + 800);
  };

  const TYPES = {
    p: 'Bauer',
    b: 'Läufer',
    r: 'Turm',
    n: 'Springer',
    q: 'Königin',
    k: 'König'
  };
  const COLOR = {
    w: 'Weiß',
    b: 'Schwarz'
  };

  const getHistory = () => {
    const historyList = chess.history({ verbose: true });
    let text = '';
    if (historyList.length > 0) {
      if (historyList.length > 10) {
        for (
          let i = historyList.length - 10 - 1;
          i < historyList.length - 1;
          i++
        ) {
          text +=
            typeof historyList[i]['captured'] != 'undefined'
              ? `${COLOR[historyList[i]['color']]}: ${
                  TYPES[historyList[i]['piece']]
                } von ${historyList[i]['from']} auf ${historyList[i]['to']},  ${
                  TYPES[historyList[i]['captured']]
                } geschlagen<br>`
              : `${COLOR[historyList[i]['color']]}: ${
                  TYPES[historyList[i]['piece']]
                } von ${historyList[i]['from']} auf ${
                  historyList[i]['to']
                } <br>`;
        }
      } else {
        historyList.forEach((elem) => {
          text +=
            typeof elem['captured'] != 'undefined'
              ? `${COLOR[elem['color']]}: ${TYPES[elem['piece']]} von ${
                  elem['from']
                } auf ${elem['to']},  ${TYPES[elem['captured']]} geschlagen<br>`
              : `${COLOR[elem['color']]}: ${TYPES[elem['piece']]} von ${
                  elem['from']
                } auf ${elem['to']} <br>`;
        });
      }
    } else {
      text = 'Keine Zughistorie vorhanden.';
    }
    document.getElementById('audio_info').innerHTML = text;
    document.getElementById('history').innerHTML = text;
  };

  const userReset = () => {
    if (user.id != 999999) {
      fetchWrapper.post('api/game/set_game', {
        id: user.id,
        fen: defaultBoard
      });
    }
    const newUser = user;
    newUser.currentGame = defaultBoard;
    setUser(newUser);
  };

  const startActionState = (type: string, cgKey: any, color: string) => {
    if (user.figureSound) playTypeSound(type);
    if (color === 'w') {
      api.selectSquare(cgKey);
      getMovesPos(cgKey);
      setActionState(true);
      setReadyToRender(false);
      if (user.figureSound && user.boardSound) {
        setTimeout(() => playSignalSound('action'), 1000);
      } else if (user.boardSound && !user.figureSound) {
        playSignalSound('action');
      }
      document.getElementById('logic_container').focus();
    }
    setFocus(false);
  };
  const stopActionState = (cgKey: any, selected: boolean) => {
    if (!selected) {
      setTimeout(() => api.selectSquare(cgKey), 100);
      setReadyToRender(false);
      if (user.boardSound)
        setTimeout(() => playSignalSound('normal'), user.animationSpeed);
    } else {
      setReadyToRender(true);
      setTimeout(() => api.cancelMove(), 100);
      if (user.boardSound) playSignalSound('normal');
    }
    setActionState(false);
    document.getElementById('logic_container').focus();
    setFocus(false);
  };
  const getMovesPos = (position: string) => {
    let moves = [];
    moves.push([position, false]);

    chess.moves({ verbose: true }).map((move) => {
      if (position === move.from) {
        if (typeof move.captured != 'undefined') moves.push([move.to, true]);
        else moves.push([move.to, false]);
      }
    });
    setMovesPos(moves);
  };

  function aiPlay(cg: Api, chess: Chess, delay: number, firstMove: boolean) {
    console.log(user.blindMode);
    return (orig, dest) => {
      const destFigure = chess.get(orig);

      if (
        dest[1] === '8' &&
        destFigure.color === 'w' &&
        destFigure.type === 'p'
      ) {
        setPromo(true);
        setBauer({ from: orig, to: dest });
        setTimeout(() => {
          if (user.boardSound) playMoveSound('promotion');
        }, delay + 1000);
      } else {
        const move = chess.move({ from: orig, to: dest });
        //console.log('white: ' + orig + ' -> ' + dest);
        if (typeof move.captured != 'undefined') {
          if (user.boardSound) playMoveSound('capture');
          if (user.blindMode) {
            callHiddenWindow({
              type: 'normal',
              piece: move.piece,
              destination: move.to
            });
            setTimeout(
              () =>
                callHiddenWindow({
                  type: 'capture',
                  piece: move.captured,
                  color: 'b'
                }),
              100
            );
          }
        } else if (move.san == 'O-O') {
          if (user.boardSound) playMoveSound('rochade');
          if (user.blindMode) callHiddenWindow({ type: 'rochade', color: 'w' });
        } else {
          if (user.boardSound) playMoveSound('normal');
          if (user.blindMode)
            callHiddenWindow({
              type: 'normal',
              piece: move.piece,
              destination: move.to
            });
        }

        if (chess.isCheck()) {
          setTimeout(() => {
            if (user.boardSound) playMoveSound('check');
            if (user.blindMode) callHiddenWindow({ type: 'check', color: 'b' });
          }, delay + 200);
        }

        if (chess.isCheckmate()) {
          userReset();
          if (user.boardSound) playMoveSound('won');
          if (user.blindMode) callHiddenWindow({ type: 'won' });
          setWin(true);
        } else {
          setTimeout(() => {
            const move = aiGetBestMove(chess, 2);
            //const moves = chess.moves({verbose:true});
            //const move = firstMove ? moves[0] : moves[Math.floor(Math.random() * moves.length)] ;
            //@ts-ignore
            chess.move(move.san);
            //console.log('black: ' + move.from + ' -> ' + move.to);
            if (typeof move.captured != 'undefined') {
              if (user.boardSound) playMoveSound('capture');
              if (user.blindMode) {
                callHiddenWindow({
                  type: 'normal',
                  piece: move.piece,
                  destination: move.to
                });
                setTimeout(
                  () =>
                    callHiddenWindow({
                      type: 'capture',
                      piece: move.captured,
                      color: 'w'
                    }),
                  100
                );
              }
            } else if (move.san == 'O-O') {
              if (user.boardSound) playMoveSound('rochade');
              if (user.blindMode)
                callHiddenWindow({ type: 'rochade', color: 'b' });
            } else {
              if (user.boardSound) playMoveSound('normal');
              if (user.blindMode)
                callHiddenWindow({
                  type: 'normal',
                  piece: move.piece,
                  destination: move.to
                });
            }

            if (move.to[1] === '1' && move.piece === 'p') {
              setTimeout(() => setBauer({ from: orig, to: dest }), delay + 100);
              setTimeout(() => {
                if (user.boardSound) playMoveSound('promotion');
              }, delay + 100);
              if (user.blindMode)
                setTimeout(() => {
                  callHiddenWindow({
                    type: 'promotion',
                    color: 'w',
                    piece: auswahl
                  });
                }, delay + 100);
            }

            if (chess.isCheck()) {
              setTimeout(() => {
                if (user.boardSound) playMoveSound('check');
                if (user.blindMode)
                  callHiddenWindow({ type: 'check', color: 'w' });
              }, delay + 200);
            }

            if (chess.isGameOver()) {
              userReset();
              if (user.boardSound) playMoveSound('lost');
              if (user.blindMode) callHiddenWindow({ type: 'lose' });
              setLose(true);
            } else {
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
            setTimeout(() => {
              setReadyToRender(true);
            }, delay + 800);
            if (user.blindMode)
              setTimeout(() => {
                callHiddenWindow({ type: 'turn', color: chess.turn() });
                setTimeout(
                  () => document.getElementById('logic_container').focus(),
                  100
                );
              }, delay);
          }, delay + 800);
        }
      }
      setChess(chess);
      setTimeout(() => {
        setReadyToRender(true);
      }, delay + 800);
      if (user.blindMode)
        setTimeout(() => {
          callHiddenWindow({ type: 'turn', color: chess.turn() });
          setTimeout(
            () => document.getElementById('logic_container').focus(),
            100
          );
        }, delay);
    };
  }

  const OptionalButtons = (
    <>
      <HiddenFieldForScreenReader
        id_name={'audio_info'}
        visibility={user.blindMode}
      />
      <Button
        color="primary"
        onClick={function () {
          if (history) return setHistory(false);
          else {
            return setHistory(true), getHistory();
          }
        }}
        aria-label="zughistorie"
        sx={{ float: 'right', marginTop: '1rem', display: 'block' }}
      >
        <div
          style={{
            zIndex: '5',
            backgroundColor: 'white',
            padding: '5px',
            borderRadius: '10px',
            display: history ? 'block' : 'none'
          }}
        >
          <p id="history" style={{ textAlign: 'left', fontWeight: 'bold' }}></p>
        </div>
        <HistoryEdu fontSize="large"></HistoryEdu>
      </Button>
    </>
  );
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
        text={
          'Dein Bauer hat das Ende des Spielfeldes erreicht! Du kannst jetzt Auswählen, durch welche Figur Du ihn ersetzen möchtest. Tippe die jeweilige Figur an und drücke anschließend auf “Bestätigen”.'
        }
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
        sx={{ float: 'right', marginBottom: '3rem', marginTop: '-4rem' }}
      >
        <UndoIcon fontSize="large"></UndoIcon>
      </Fab>

      <div style={{ height: width, width: width, marginBottom: '-100%' }}>
        <div
          ref={ref}
          style={{ height: '100%', width: '100%', display: 'table' }}
        />

        <div
          ref={logic_container}
          role="application"
          aria-roledescription="schachbrett"
          tabIndex={0}
          id="logic_container"
          style={{
            display: 'table',
            height: '99.5%',
            width: '99.5%',
            position: 'relative',
            top: '-100%',
            zIndex: '2',
            marginBottom: '-100%',
            opacity: 0.4
          }}
          onFocus={() => {
            if (startState) {
              if (user.boardSound) {
                playSignalSound('board');
              }
              if (user.blindMode) callHiddenWindow({ type: 'start' });
              setStartState(false);
            }
          }}
          onTouchStart={() => {
            if (!focus) return setFocus(true);
          }}
          onKeyPress={() => {
            if (!focus) return setFocus(true);
          }}
        >
          {!actionState && readyToRender
            ? chess.board().map((row) => (
                <tr>
                  {row.map((col) => {
                    if (col != null) {
                      return (
                        <ChessPiece
                          action={() =>
                            startActionState(col.type, col.square, col.color)
                          }
                          color={col.color}
                          focus={focus}
                          type={col.type}
                          cgKey={col.square}
                          blind={user.blindMode}
                        ></ChessPiece>
                      );
                    } else {
                      return <td style={{ backgroundColor: 'white' }}></td>;
                    }
                  })}
                </tr>
              ))
            : chess.board().map((row, i) => (
                <tr>
                  {row.map((col, j) => {
                    if (col != null) {
                      let num = movesPos.findIndex(
                        (elem) => elem[0] === col?.square
                      );
                      if (num == 0) {
                        return (
                          <MoveSquare
                            action={() => stopActionState(col?.square, true)}
                            capture={false}
                            normal={false}
                            selected={true}
                            cgKey={col?.square}
                            blind={user.blindMode}
                          ></MoveSquare>
                        );
                      } else if (num > 0) {
                        return (
                          <MoveSquare
                            action={() => stopActionState(col?.square, false)}
                            capture={true}
                            normal={false}
                            selected={false}
                            cgKey={col?.square}
                            blind={user.blindMode}
                          ></MoveSquare>
                        );
                      } else {
                        return <td style={{ backgroundColor: 'none' }}></td>;
                      }
                    } else {
                      let r = 8 - i; //numbers
                      let c = String.fromCharCode(97 + j); //letters
                      let num = movesPos.findIndex((elem) => elem[0] === c + r);
                      if (num > 0) {
                        return (
                          <MoveSquare
                            action={() => stopActionState(c + r, false)}
                            capture={false}
                            normal={true}
                            selected={false}
                            cgKey={c + r}
                            blind={user.blindMode}
                          ></MoveSquare>
                        );
                      } else {
                        return <td style={{ backgroundColor: 'none' }}></td>;
                      }
                    }
                  })}
                </tr>
              ))}
        </div>
        {user.blindMode ? OptionalButtons : <></>}
      </div>
    </>
  );
}

export default ChessgroundFree;
