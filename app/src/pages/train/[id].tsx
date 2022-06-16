import React, { useEffect, useRef, useState } from 'react';
import { useWindowSize } from '../../utils/helper';
import { Container, Box, CircularProgress } from '@mui/material';
import TrainPlay from '../../components/TrainPlay';
import axios from 'axios';
import useSWR from 'swr';
import { Course } from '../../interfaces/training';
import { useRouter } from 'next/router';
import { useStore } from '../../utils/store';
import BackButton from '../../components/BackButton';

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const defaultCourse: Course = {
  id: 0,
  start: '123',
  end: '321',
  moves: [],
  subtext: 'default'
};
function TrainIdPage() {
  const router = useRouter();
  const loggedUser = useStore((state) => state.loggedInUser);

  const chessboardRef = useRef();

  const [course, setCourse] = useState(defaultCourse);
  const forceUpdate = useForceUpdate();

  const { data: courses } = useSWR(
    ['/api/training/all'],
    (url) => axios.get(url).then((res) => res.data),
    { refreshInterval: 60000 }
  );

  useEffect(() => {
    setCourse(defaultCourse);
  }, [router.query.id]);

  if (process.browser && loggedUser.id === 0) {
    router.push('/');
  }

  const { id } = router.query;
  if (courses && course.id.toString() != id) {
    console.log([id, course.id.toString()]);
    const courseSelect = courses.find((x) => x.id.toString() === id);
    setCourse(courseSelect);
    console.log(course);
  }

  const size = useWindowSize();
  if (course.id === 0 || course.id.toString() != id) {
    return (
      <Container>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </div>
      </Container>
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

export default TrainIdPage;
