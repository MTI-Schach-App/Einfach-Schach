import React, { useEffect, useRef, useState } from 'react';
import { useWindowSize, getMultipleRandomCourses } from '../../utils/helper';
import { Container, Box, CircularProgress, Button, Divider, Typography } from '@mui/material';
import TrainPlay from '../../components/chessboards/TrainPlay';
import axios from 'axios';
import useSWR from 'swr';
import { Chapter, Course } from '../../interfaces/training';
import { useRouter } from 'next/router';
import { useStore } from '../../utils/store';
import BackButton from '../../components/buttons/BackButton';

import Image from 'next/image';

import success from '../../../public/success.png';
import LongPressButton from '../../components/buttons/LongPressButton';

function buildBoards(chapter:Chapter,size, setSelectedCourse): Record<number,any> {
  let chapterChooser: Record<number,any> = {0:null};

  const courses = getMultipleRandomCourses(chapter.courses,10);
  
  courses.forEach((course, index) => {
    let prop = {
      width: size.width * 0.9,
      config:{
        draggable: {enabled:false},
        
      },
      course: course,
      setSelectedCourse: setSelectedCourse,
      index: index+1,
      chapter:chapter
    };
    if (size.height < size.width) {
      prop.width = size.height * 0.85;
      };
    
    chapterChooser[index+1] = <TrainPlay {...prop}/>;
  });

  return chapterChooser;
  
}

function TrainIdPage() {
  const router = useRouter();
  const loggedUser = useStore((state) => state.loggedInUser);
  const [selectedCourse,setSelectedCourse] = useState(1);

  const size = useWindowSize();

  const { id } = router.query;

  const { data: data } = useSWR(
    ['/api/training/all'],
    (url) => axios.get(url).then((res) => {
      
      return {
        data: res.data,
        chapter: res.data[parseInt(id as string)-1]
      }},
  ));

  if (process.browser && loggedUser.id === 0) {
    router.push('/');
  }

  if (!data) {
    return (
      <Container>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </div>
      </Container>
    );
  }
  const renderedBoards = buildBoards(data.chapter,size,setSelectedCourse);
  
  if (selectedCourse>=Object.keys(renderedBoards).length) {

    return (
      <>
        
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >  
          <Image
                src={success}
                alt="success ilust "
                width="612px"
                height="408px"
                style={{ marginBottom: 50 }}
              />
              <Divider/>
              <Typography gutterBottom variant="h5" component="div">
              Du hast das Kapitel erfolgreich abgeschlossen. Auf zum nächsten!
              </Typography>
         
          <Button
              fullWidth
              sx={{ marginTop: 5, height: 70, fontSize: 20 }}
              variant="contained"
              onClick={()=>(router.push('/train'))}
            >
              Weiter
            </Button>
          </Box>
        </Container>
      </>
    );
  }
  return (
    <>
    <BackButton {...{
      onClick:() => router.back(),
      buttonText:'< Zurück'
      }}/>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >  
        {renderedBoards[selectedCourse]}
          
        </Box>
      </Container>
    </>
  );
}


export default TrainIdPage;
