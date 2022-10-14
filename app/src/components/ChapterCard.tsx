import { Box, Button, Typography, Card, CardContent, CardActionArea, Collapse, Grid, IconButton, IconButtonProps, styled } from '@mui/material';
import LinearProgressWithLabel from './progress/LinearProgress';
import { useState } from 'react';
import CheckMark from '@mui/icons-material/Check';
import Link from 'next/link';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }
  
  const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

export default function ChapterCard({chapter, user}) {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    let progression = 0;
    let progressionRaw = 0;
    let completed = false;
    if (Object.keys(user.chapterProgression).includes(chapter.id.toString())) {
        progressionRaw = user.chapterProgression[chapter.id].coursesFinished;
        progression = user.chapterProgression[chapter.id].coursesFinished*10;
        completed = user.chapterProgression[chapter.id].completed;
      }

    if (progression > 100) {progression = 100};
    
    let finished = <></>;
    let bgColor = 'white';
    if (completed) {
        finished = <CheckMark sx={{ gridRow: '1', gridColumn: '7 / 8', fontSize:30, marginTop:'-0.25rem' }}/>;
        bgColor = 'lightgreen';

    }

    return (
        <Card sx={{ maxWidth: 345, backgroundColor: bgColor }}>
            
            <CardActionArea
             onClick={handleExpandClick}>
                <CardContent>
                    <Box
                        sx={{
                            display: 'grid',
                            gridAutoColumns: '1fr',
                            gap: 1,
                        }}
                        >
                        <Typography sx={{ fontSize: 14, gridRow: '1', gridColumn: 'span 2' }} color="text.secondary" gutterBottom>
                            Kapitel {chapter.id}
                        </Typography>
                        {finished}
                        
                    </Box>
                    <Typography gutterBottom variant="h5" component="div">
                        {chapter.name}
                    </Typography>
                    <LinearProgressWithLabel value={progression} />
                </CardContent>

            </CardActionArea>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>{chapter.subtext}</Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Übungen verfügbar: {chapter.courses.length}
                        
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Übungen abgeschlossen: {progressionRaw}
                        
                    </Typography>
                   
                    <Link href={`/train/${chapter.id}`}>
                        <Button
                            variant="contained"
                            aria-label={'Üben'}
                            fullWidth
                            sx= {{float:'right', marginBottom:'0.5rem'}}
                            >
                            {'Üben'}
                        </Button>
                    </Link>
                </CardContent>
            </Collapse>
        </Card>
    );
}
