
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Collapse, Grid, IconButton, IconButtonProps, styled } from '@mui/material';
import LinearProgressWithLabel from './progress/LinearProgress';
import { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
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

export default function ChapterCard({chapter}) {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (
        <Card sx={{ maxWidth: 345 }}>
            <Link href={`/train/${chapter.id}`}>
            <CardActionArea>
                
                
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
                        <ExpandMore
                                sx={{ gridRow: '1', gridColumn: '4 / 5', marginTop:'-0.7rem' }}
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more {}"
                                ><InfoIcon/>
                        </ExpandMore>
                    </Box>
                    <Typography gutterBottom variant="h5" component="div">
                        {chapter.name}
                    </Typography>
                    <LinearProgressWithLabel value={0} />
                </CardContent>

            </CardActionArea>
            </Link>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>{chapter.subtext}</Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Übungen: {chapter.courses.length}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}
