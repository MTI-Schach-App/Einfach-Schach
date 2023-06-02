import { Button } from '@mui/material';

export type ChangeButtonProps = {
  /** Text that will appear within the button */
  buttonText: string;

  /** Color */
  color?: string;

  /** Function to run on click */
  onClick: () => void;
};

export default function ChangePage({
  onClick,
  buttonText,
  color="#287233"
}: ChangeButtonProps) {
  return (
    <Button
      variant="contained"
      aria-label={'Zurück'}
      sx={{ marginTop: 1, marginLeft: 2, marginBottom: 2, backgroundColor: 'rgba(0, 0, 0, 0.01)', borderRadius: '50%', border: 2, borderColor:'#575757', height:90, width:90, color:'#575757', fontSize:30}}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
}