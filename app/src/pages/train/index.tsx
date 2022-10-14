import { Container, Box, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import useSWR from 'swr';
import { Chapter } from '../../interfaces/training';
import { useRouter } from 'next/router';
import { useStore } from '../../utils/store';
import BackButton from '../../components/BackButton';
import ChapterCard from '../../components/ChapterCard';


export default function TrainPage() {
  const router = useRouter();
  const loggedUser = useStore((state) => state.loggedInUser);

  const { data: chapters } = useSWR(
    ['api/training/all'],
    (url) => axios.get(url).then((res) => res.data),
    { refreshInterval: 60000 }
  );

  if (process.browser && loggedUser.id === 0) {
    router.push('/');
  }
  
  if (!chapters){
    return (
      <Container>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </div>
      </Container>
    );
  }
    
  return (
    <>
      <BackButton />
      <Container component="main" maxWidth="md">
        <Box sx={{ width: '100%', marginTop: '5rem' }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {chapters.map((chapter: Chapter) => (
                <Grid item xs={2} sm={4} md={4} key={chapter.id}>
                <ChapterCard {...{chapter: chapter, user: loggedUser}} />
              </Grid>
            ))
          }
          </Grid>
        </Box>
      </Container>
    </>
  );
};
