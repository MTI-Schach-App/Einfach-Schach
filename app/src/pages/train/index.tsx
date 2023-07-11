import { Container, Box, CircularProgress, Grid, Typography } from '@mui/material';
import axios from 'axios';
import useSWR from 'swr';
import { Chapter } from '../../interfaces/training';
import { useRouter } from 'next/router';
import { useStore } from '../../utils/store';
import LongPressButton from '../../components/buttons/LongPressButton';
import ChapterCard from '../../components/cards/ChapterCard';
import BackButton from '../../components/buttons/BackButton';
import { useState } from 'react';
import GreenButton from '../../components/buttons/GenericButton';
import { getColorForChapterChooser, paginate } from '../../utils/helper';
import ChangePage from '../../components/buttons/ChangePageButton';
import { AppsOutageSharp } from '@mui/icons-material';
import logo from '../../../public/chaptPlaceholder.png';
import Image from 'next/image';


export default function TrainPage() {
  const router = useRouter();
  const loggedUser = useStore((state) => state.loggedInUser);
  const [page, setPage] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(0);

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

  if (selectedChapter != 0) {
    const chapt : Chapter = chapters[selectedChapter];
    return (
      <>
      <BackButton {...{
      onClick:() => {setSelectedChapter(0)},
      buttonText:'< Zurück'
      }}/>
      <Container component="main" maxWidth="md">
        
        <Box sx={{
            marginTop: '10rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <Typography
                variant="h3"
                sx={{ textAlign: 'center', marginTop: -15, marginBottom: 1 }}
              >
                {chapt.name}
          </Typography>
          <Typography sx={{marginTop:4, marginBottom:4}} variant="h5" component="h1" gutterBottom>
            {chapt.subtext}
          </Typography>
          <Image
                src={logo}
                alt="logo by ben "
                width="400px"
                height="400px"
                style={{ marginBottom: 50 }}
              />
                <GreenButton {...{buttonText:`Übungen fortsetzen`, onClick:() => {router.push(`/train/${chapt.id}`)}}}/>
            
        </Box>
      </Container></>
    )
  }

  const pages = paginate(chapters,5);

  if (page > pages.length-1 || page < 0){
    if (page > pages.length-1) setPage(page-1);
    if (page < 0) setPage(page+1);
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
      <BackButton {...{
      onClick:() => router.back(),
      buttonText:'< Zurück'
      }}/>
      <Container component="main" maxWidth="md">
        
        <Box sx={{
            marginTop: '10rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <Typography
                variant="h4"
                sx={{ textAlign: 'center', marginTop: -15, marginBottom: 1 }}
              >
                Übersicht
          </Typography>
            {pages[page].map((chapter: Chapter) => (
                <GreenButton {...{buttonText:`Kapitel ${chapter.id}`, onClick:() => {setSelectedChapter(chapter.id)}, color:(loggedUser.chapterProgression[chapter.id] && loggedUser.chapterProgression[chapter.id].completed) ? "#287233" : '#575757'}}/>
            ))
          }
        </Box>
      </Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 1,
          m: 1,
          borderRadius: 1,
          bottom:0,
        }}
      >
        <ChangePage {...{buttonText:'<', onClick:() => {setPage(page-1)}}}></ChangePage>
        <ChangePage {...{buttonText:'>', onClick:() => {setPage(page+1)}}}></ChangePage>
      </Box>
      
  </>
  );
};
