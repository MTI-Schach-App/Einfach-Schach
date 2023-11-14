import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Dialog, DialogContent } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

export default function ConfirmationDialog({ open, setOpen, text, title, confirmFcn}){
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
                <DialogTitle id="cancellation-dialog-title">{title}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="cancellation-dialog-description">
                        {text}
                        <div style={{ textAlign: 'center' }}></div>
                    </DialogContentText>  
                </DialogContent>
                <DialogActions>
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                        <Button onClick={confirmFcn} autoFocus sx={{backgroundColor: '#B12929', color: 'white', "&:hover":{backgroundColor: '#8f1e1e'}}}>
                            Ja, Fortfahren
                        </Button>
                        <Button onClick={handleClose} autoFocus>
                            Nein, Zurück
                        </Button>
                    </div>                    
                </DialogActions>                
            </Dialog>
        </div>
    );
}