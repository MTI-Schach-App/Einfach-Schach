import React, { useState } from 'react';
import { useWindowSize } from '../utils/helper';
import { Container, Box, CircularProgress } from '@mui/material';
import ClickToMove from '../components/ClickToMove';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import axios from 'axios';
import useSWR from 'swr';
import { Course } from '../interfaces/training';
import { useRouter } from 'next/router';
import { useStore } from '../utils/store';
import BackButton from '../components/BackButton';

function TrainPage() {
  const router = useRouter();
  const loggedUser = useStore((state) => state.loggedInUser);
  const [course,setCourse] = useState('');
    
  const { data: courses } = useSWR(
    ['api/training/all'],
    (url) => axios.get(url).then((res) => res.data),
    { refreshInterval: 6000 }
  );

  const changeState = (event) => {  
    const selection = event.target.innerText.toString().split(' ')[1];
    const courseSelect = courses.find(x => x.id.toString() === selection.toString());
    setCourse(courseSelect.fen); 
    }; 

  if (process.browser && loggedUser.id === 0){
    router.push('/');
  }

  const size = useWindowSize();
  if (!courses)
    return (
      <Container>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
          </div>
      </Container>
  );

  

  if (course === ''){
    return (
      <>
      <BackButton/>
      <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Kapitel 1 - Grundlagen
            </ListSubheader>
          }
        >
          {courses.map((course: Course) => (
                            <ListItemButton key={course.id} onClick={changeState}>
                            <ListItemText primary={`Übung ${course.id}`} secondary={course.subtext} />
                          </ListItemButton>
                        ))}
          
        </List>

        </Box>
        </Container>
      </>
      
      );
    }


    let prop = {boardWidth:size.width*0.9,startPos:course};
    if (size.height < size.width){
      prop = {boardWidth:size.height*0.85,startPos:course};
    }
    
    return(
    <>
    <BackButton/>
    <Container component="main" maxWidth="xs">
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
    <ClickToMove {...prop}/>
    </Box>
    </Container>
    </>
    );

}

export default TrainPage;