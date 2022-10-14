import React, { useEffect, useRef, useState } from 'react';
import { useWindowSize, getMultipleRandomCourses } from '../../utils/helper';
import { Container, Box, CircularProgress, Button, Divider, Typography } from '@mui/material';
import TrainPlay from '../../components/TrainPlay';
import axios from 'axios';
import useSWR from 'swr';
import { Chapter, Course } from '../../interfaces/training';
import { useRouter } from 'next/router';
import { useStore } from '../../utils/store';
import BackButton from '../../components/BackButton';

import Image from 'next/image';

import success from '../../../public/success.png';

function buildBoards(chapter:Chapter,size, setSelectedCourse): Record<number,any> {
  let chapterChooser: Record<number,any> = {0:null};

  const courses = getMultipleRandomCourses(chapter.courses,10);
  
  courses.forEach((course, index) => {
    let prop = {
      boardWidth: size.width * 0.9,
      course: course,
      setSelectedCourse: setSelectedCourse,
      index: index+1,
      chapter:chapter
    };
    if (size.height < size.width) {
      prop.boardWidth = size.height * 0.85;
      };
    
    chapterChooser[index+1] = <TrainPlay {...prop}/>;
  });

  return chapterChooser;
  
}

function TrainIdPage() {
  const router = useRouter();
  const loggedUser = useStore((state) => state.loggedInUser);
  const [selectedCourse,setSelectedCourse] = useState(1);
  
  const { data: chapters } = useSWR(
    ['/api/training/all'],
    (url) => axios.get(url).then((res) => res.data),
    { refreshInterval: 60000 }
  );


  if (process.browser && loggedUser.id === 0) {
    router.push('/');
  }

  const { id } = router.query;

  const size = useWindowSize();

  if (!chapters) {
    return (
      <Container>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </div>
      </Container>
    );
  }

  const chapter = buildBoards(chapters[parseInt(id as string)-1],size,setSelectedCourse)

  if (selectedCourse>=Object.keys(chapter).length) {

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
    <BackButton/>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >  
        {chapter[selectedCourse]}
          
        </Box>
      </Container>
    </>
  );
}

export default TrainIdPage;
