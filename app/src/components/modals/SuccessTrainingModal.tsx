import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/router';
import { fetchWrapper } from '../../utils/fetch-wrapper';
import Link from 'next/link';

export default function SuccessTrainingDialog({open,setOpen,course,text}) {
  
  const router = useRouter();
  const nextCourse = `/train/${'1_'.concat((parseInt(course.id.split('_')[1])+1).toString())}`;

  const handleClose = () => {
    setOpen(false);
    router.push('/');
  };

  const handleNext = () => {
    setOpen(false);
    router.push(nextCourse)   
  };



  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Geschafft"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Zurück
          </Button>
          
          <Button onClick={handleNext} autoFocus>
            nächste Aufgabe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}