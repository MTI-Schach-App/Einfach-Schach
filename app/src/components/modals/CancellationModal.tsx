import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Dialog, DialogContent } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

export default function CancellationDialog({ open, setOpen, text, cancelGame}){
    const handleClose = () => {
        setOpen(false);
    }

    return(
       <div>
            <Dialog
                open={open}
                aria-labelledby="cancellation-dialog-title"
                aria-describedby="cancellation-dialog-description"
            >
                <DialogTitle id="cancellation-dialog-title">{'Abbrechen der Partie'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="cancellation-dialog-description">
                        {text}
                        <div style={{ textAlign: 'center' }}></div>
                    </DialogContentText>  
                </DialogContent>
                <DialogActions>
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                        <Button onClick={cancelGame} autoFocus>
                            Ja, Abbrechen
                        </Button>
                        <Button onClick={handleClose} autoFocus>
                            Nein, Fortfahren
                        </Button>
                    </div>                    
                </DialogActions>                
            </Dialog>
        </div>
    );
}