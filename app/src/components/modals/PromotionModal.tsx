import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import ChoicePromo from '../buttons/ChoicePromotionButton';


export default function PromotionDialog({ open, setOpen, text, setAuswahl }) {
  const [selected, setSelected] = useState("none");

  const handleClose = () => {
    setAuswahl(selected);
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
            <ChoicePromo {...{buttonText:"Dame", onClick:() => {setSelected("q")}, ausgewählt: (selected === "q")}}/>
            <ChoicePromo {...{buttonText:"Turm", onClick:() => {setSelected("r")}, ausgewählt: (selected === "r")}}/>
            <ChoicePromo {...{buttonText:"Springer", onClick:() => {setSelected("n")}, ausgewählt: (selected === "n")}}/>
            <ChoicePromo {...{buttonText:"Läufer", onClick:() => {setSelected("b")}, ausgewählt: (selected === "b")}}/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus disabled={(selected === "none")}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
