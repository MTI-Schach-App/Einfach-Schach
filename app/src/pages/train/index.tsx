import React, { useEffect, useRef, useState } from 'react';
import { useWindowSize } from '../../utils/helper';
import { Container, Box, CircularProgress } from '@mui/material';
import TrainPlay from '../../components/TrainPlay';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import axios from 'axios';
import useSWR from 'swr';
import { Course } from '../../interfaces/training';
import { useRouter } from 'next/router';
import { useStore } from '../../utils/store';
import BackButton from '../../components/BackButton';

const defaultCourse: Course = {
  id: 0,
  start: '123',
  end: '321',
  moves: [],
  subtext: 'default'
};
function TrainPage() {
  const router = useRouter();
  const loggedUser = useStore((state) => state.loggedInUser);
  const [course, setCourse] = useState(defaultCourse);

  const chessboardRef = useRef();

  const { data: courses } = useSWR(
    ['api/training/all'],
    (url) => axios.get(url).then((res) => res.data),
    { refreshInterval: 60000 }
  );

  const changeState = (event) => {
    const selection = event.target.innerText.toString().split(' ')[1];
    const courseSelect = courses.find(
      (x) => x.id.toString() === '1_'.concat(selection.toString())
    );
    setCourse(courseSelect);
  };

  if (process.browser && loggedUser.id === 0) {
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

  if (course.id === 0) {
    return (
      <>
        <BackButton />
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
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
                  <ListItemText
                    primary={`Übung ${course.id.toString().split('_')[1]}`}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Container>
      </>
    );
  }

  let prop = {
    boardWidth: size.width * 0.9,
    course: course,
    ref: chessboardRef
  };
  if (size.height < size.width) {
    prop = {
      boardWidth: size.height * 0.85,
      course: course,
      ref: chessboardRef
    };
  }

  return (
    <>
      <BackButton />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <TrainPlay {...prop} />
        </Box>
      </Container>
    </>
  );
}

export default TrainPage;
