import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/router';
import GreenButton from "../buttons/GenericButton"

export default function PromotionDialog({ open, setOpen, text, setAuswahl }) {
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Bauernumwandlung'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
            <GreenButton {...{buttonText:"Dame", onClick:() => {setAuswahl("q")}}}/>
            <GreenButton {...{buttonText:"Turm", onClick:() => {setAuswahl("r")}}}/>
            <GreenButton {...{buttonText:"Springer", onClick:() => {setAuswahl("n")}}}/>
            <GreenButton {...{buttonText:"Läufer", onClick:() => {setAuswahl("b")}}}/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
