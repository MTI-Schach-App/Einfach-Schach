import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/router';

export default function SuccessTrainingDialog({ open, setOpen, text, setSelectedCourse, index }) {
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    router.push('/');
  };

  const handleNext = () => {
    setOpen(false);
    setSelectedCourse(parseInt(index)+1);
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Richtig!'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Zurück</Button>

          <Button onClick={handleNext} autoFocus>
            nächste Aufgabe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
