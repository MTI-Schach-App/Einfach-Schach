import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { fetchWrapper } from '../../utils/fetch-wrapper';
import AlertDialog from '../modals/AlertModal';
import { useStore } from '../../utils/store';
import { Typography } from '@mui/material';
import SuccessTrainingDialog from '../modals/SuccessTrainingModal';
import { Config } from 'chessground/config';
import { Chapter, Course } from '../../interfaces/training';
import { Api } from 'chessground/api';
import { toColor, toDests, toGermanColor } from '../../utils/helper';
import { Chessground as ChessgroundApi } from 'chessground';

import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.cburnett.css";
import PromotionDialog from '../modals/PromotionModal';
import ProgressBar from '../progress/ProgressBar';

interface TrainPlayProps {
  width?: number
  config?: Config
  course?: Course
  setSelectedCourse?: any 
  index?: number
  chapter?: Chapter
}

export default function TrainPlay({ width = 450, config, course, setSelectedCourse, index, chapter}: TrainPlayProps) {
  const legalMoves = course.moves;
  let currentLegal = 0;

  const [api, setApi] = useState<Api | null>(null);
  const [modal, setModal] = useState(false);
  const [win, setWin] = useState(false);
  const [promo, setPromo] = useState(false);
  const [auswahl, setAuswahl] = useState("none");
  const [bauer, setBauer] = useState({from: "v4", to: "x4"})
  const user = useStore((state) => state.loggedInUser);
  const setUser = useStore((state) => state.setLoggedInState);


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
    chess.load(course.start)
    api?.set({
      ...config,
      fen: course.start,
      movable: {
        color: toColor(chess),
        dests: toDests(chess),
        events: {
          after: trainPlay(api, chess, user.animationSpeed, false)
        }
      },  
      })
  }, [api, config]);
  
  console.log(course.moves)

  function trainPlay(cg: Api, chess: Chess, delay: number, firstMove: boolean) {

    return (orig, dest) => {      

      if (orig+dest === legalMoves[currentLegal]) {   

        const destFigure = chess.get(orig);

        if (dest[1] === '8' && destFigure.color === 'w' && destFigure.type === 'p') {
          setPromo(true);
          setBauer({from: orig, to: dest});
        }

        else if (currentLegal+1 >= legalMoves.length) {
          setWin(true);
          updateUserProgression();
          setCG(cg,chess,false);
          cg.destroy();
        }
        else {
          chess.move({from: orig, to: dest});
          const nextFrom = legalMoves[currentLegal+1].slice(0,2);
          const nextTo = legalMoves[currentLegal+1].slice(2,4);
          setTimeout(() => {
            //@ts-ignore
            chess.move({from:nextFrom, to:nextTo})
            //@ts-ignore
            cg.move(nextFrom, nextTo);
            setCG(cg,chess,true);
            increaseLegal();
          }, delay);
        }        
      }
      else {
        setModal(true);
        setCG(cg,chess,true);
      }      
    };
  }

  function updateUserProgression() {
    
    if (Object.keys(user.chapterProgression).includes(chapter.id.toString())) {
      user.chapterProgression[chapter.id].coursesFinished = 
      typeof user.chapterProgression[chapter.id] != 'undefined' && typeof user.chapterProgression[chapter.id].completed ?
      user.chapterProgression[chapter.id].coursesFinished+1 : 
      user.chapterProgression[chapter.id].coursesFinished;
    }
    else {
      user.chapterProgression[chapter.id] = {
        completed: false,
        coursesFinished: 1,
      }
    }
    if (user.chapterProgression[chapter.id].coursesFinished == chapter.courses.length) {
      user.chapterProgression[chapter.id].completed = true;
    }
    user.coursesFinishedTotal += 1;
    if (user.id != 999999) {
    fetchWrapper.post('/api/users/update', { ...user })
    }
    setUser(user);
  }

  function increaseLegal() {
    currentLegal = currentLegal+2;
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
      <AlertDialog
        open={modal}
        setOpen={setModal}
        text={'Probier es doch noch einmal'}
      />
      <PromotionDialog
        open={promo}
        setOpen={setPromo}
        text={'Dein Bauer hat das Ende des Spielfeldes erreicht! Du kannst jetzt Auswählen, durch welche Figur Du ihn ersetzen möchtest. Tippe die jeweilige Figur an und drücke anschließend auf “Bestätigen”.'}
        setAuswahl={setAuswahl}
      />
      <SuccessTrainingDialog
        open={win}
        setOpen={setWin}
        text={'Du hast alle richtigen Züge gefunden!'}
        setSelectedCourse={setSelectedCourse}
        index={index}
      />
      <Typography
            variant="h4"
            sx={{ textAlign: 'center', marginTop: -5, marginBottom: 1 }}
          >
            Am Zug: {toGermanColor(api?.state.turnColor)}
      </Typography>
      
      <div style={{ height: width, width: width }}>
        <ProgressBar
          column={
            (typeof user.chapterProgression[chapter.id] != 'undefined' && user.chapterProgression[chapter.id].completed ?
            10 : chapter.courses.length)}
          progress={
            (typeof user.chapterProgression[chapter.id] != 'undefined' && !user.chapterProgression[chapter.id].completed ?
            user.chapterProgression[chapter.id].coursesFinished : index-1)
          }
        />
        <div ref={ref} style={{ height: '100%', width: '100%', display: 'table' }} />
      </div>
    </>
    
  );
}
