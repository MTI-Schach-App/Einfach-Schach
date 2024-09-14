import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { fetchWrapper } from '../../utils/fetch-wrapper';
import AlertDialog from '../modals/AlertModal';
import { useStore } from '../../utils/store';
import { Button, Typography } from '@mui/material';
import SuccessTrainingDialog from '../modals/SuccessTrainingModal';
import { Config } from 'chessground/config';
import { Chapter, Course } from '../../interfaces/training';
import { Api } from 'chessground/api';
import { toColor, toDests, toGermanColor } from '../../utils/helper';
import { Chessground as ChessgroundApi } from 'chessground';

import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.cburnett.css';
import PromotionDialog from '../modals/PromotionModal';
import ProgressBar from '../progress/ProgressBar';

interface TrainPlayProps {
  width?: number;
  config?: Config;
  course?: Course;
  setSelectedCourse?: any;
  index?: number;
  chapter?: Chapter;
}

export default function TrainPlay({ width = 450, config, course, setSelectedCourse, index, chapter }: TrainPlayProps) {
  const legalMoves = course.moves;

  const [api, setApi] = useState<Api | null>(null);
  const [modal, setModal] = useState(false);
  const [win, setWin] = useState(false);
  const [promo, setPromo] = useState(false);
  const [variation, setVariation] = useState(-1);
  const [auswahl, setAuswahl] = useState('none');
  const [chess, setChess] = useState(new Chess());
  const [currentLegal, setCurrentLegal] = useState(0);
  const user = useStore((state) => state.loggedInUser);
  const setUser = useStore((state) => state.setLoggedInState);

  const ref = useRef<HTMLDivElement>(null);
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
      api.set(config);
    }
  }, [ref]);

  useEffect(() => {
    if (chess.history().length === 0) chess.load(course.start);
    api?.set({
      ...config,
      fen: chess.history().length === 0 ? course.start : chess.fen(),
      movable: {
        color: toColor(chess),
        dests: toDests(chess),
        events: {
          after: trainPlay(api, chess, user.animationSpeed, false)
        }
      }
    });
  }, [api, config]);

  function trainPlay(cg: Api, chess: Chess, delay: number, firstMove: boolean) {
    return (orig, dest) => {
      let cou = 0;
      let found = false;
      if (variation === -1) {
        for (const vare of legalMoves) {
          if (vare[0] === orig + dest) {
            setVariation(cou);
            found = true;
            break;
          }
          cou += 1;
        }
        if (!found) {
          setModal(true);
          setCG(cg, chess, true);
        }
      }

      if (found || variation != -1) {
        if (orig + dest === legalMoves[variation === -1 ? cou : variation][currentLegal]) {
          const destFigure = chess.get(orig);
          if (dest[1] === '8' && destFigure.color === 'w' && destFigure.type === 'p') {
            setPromo(true);
          } else if (currentLegal + 1 >= legalMoves[variation === -1 ? cou : variation].length) {
            setWin(true);
            updateUserProgression();
            setCG(cg, chess, false);
            cg.destroy();
          } else {
            chess.move({ from: orig, to: dest });
            const nextFrom = legalMoves[variation === -1 ? cou : variation][currentLegal + 1].slice(0, 2);
            const nextTo = legalMoves[variation === -1 ? cou : variation][currentLegal + 1].slice(2, 4);
            chess.move({ from: nextFrom, to: nextTo });
            setTimeout(() => {
              //@ts-ignore
              cg.move(nextFrom, nextTo);
              setCG(cg, chess, true);
              increaseLegal();
            }, delay);
          }
        } else {
          setModal(true);
          setCG(cg, chess, true);
        }
      }
    };
  }

  function updateUserProgression() {
    if (Object.keys(user.chapterProgression).includes(chapter.id.toString())) {
      user.chapterProgression[chapter.id].coursesFinished =
        typeof user.chapterProgression[chapter.id] != 'undefined' && typeof user.chapterProgression[chapter.id].completed
          ? user.chapterProgression[chapter.id].coursesFinished + 1
          : user.chapterProgression[chapter.id].coursesFinished;
    } else {
      user.chapterProgression[chapter.id] = {
        completed: false,
        coursesFinished: 1
      };
    }
    if (user.chapterProgression[chapter.id].coursesFinished == chapter.courses.length) {
      user.chapterProgression[chapter.id].completed = true;
    }
    user.coursesFinishedTotal += 1;
    if (user.id != 999999) {
      fetchWrapper.post('/api/users/update', { ...user });
    }
    setUser(user);
    setChess(new Chess());
    setCurrentLegal(0);
    setVariation(-1);
  }

  function increaseLegal() {
    setCurrentLegal(currentLegal + 2) ;
  }

  function skipCourse() {
    setChess(new Chess());
    setCurrentLegal(0);
    setSelectedCourse(index+1);
    setCG(api, chess, false);
    setVariation(-1);
  }

  function setCG(cg: Api, chess: Chess, highlight: boolean = true) {
    cg.set({
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

  return (
    <>
      <AlertDialog open={modal} setOpen={setModal} text={'Probier es doch noch einmal'} />
      <PromotionDialog
        open={promo}
        setOpen={setPromo}
        text={
          'Dein Bauer hat das Ende des Spielfeldes erreicht! Du kannst jetzt Auswählen, durch welche Figur Du ihn ersetzen möchtest. Tippe die jeweilige Figur an und drücke anschließend auf “Bestätigen”.'
        }
        setAuswahl={setAuswahl}
      />
      <SuccessTrainingDialog
        open={win}
        setOpen={setWin}
        text={'Du hast alle richtigen Züge gefunden!'}
        setSelectedCourse={setSelectedCourse}
        index={index}
      />
      
      <Typography variant="h4" sx={{ textAlign: 'center', marginTop: -5, marginBottom: 1 }}>
  Am Zug: {toGermanColor(api?.state.turnColor)}
</Typography>

<Button
  variant="contained"
  sx={{
    position: 'absolute', 
    right: 0, 
    top: '2rem',
    marginRight: '1rem',
    backgroundColor: '#B12929',
    width: '9rem',
    height: '3rem',
    fontSize: 17,
    borderRadius: 5,
  }}
  onClick={skipCourse}
>
  Überspringen
</Button>


      <div style={{ height: width, width: width }}>
        <ProgressBar
          column={
            typeof user.chapterProgression[chapter.id] != 'undefined' && user.chapterProgression[chapter.id].completed
              ? 10
              : chapter.courses.length
          }
          progress={
            typeof user.chapterProgression[chapter.id] != 'undefined' && !user.chapterProgression[chapter.id].completed
              ? user.chapterProgression[chapter.id].coursesFinished
              : index - 1
          }
        />
        <div ref={ref} style={{ height: '100%', width: '100%', display: 'table' }} />
      </div>
      
    </>
  );
}
