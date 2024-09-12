import { Button } from '@mui/material';

export type BackButtonProps = {
  /** Text that will appear within the button */
  buttonText: string;

  /** Color */
  color?: string;

  /** Function to run on click */
  onClick: () => void;
};

export default function BackButton({
  onClick,
  buttonText,
  color="#575757"
}: BackButtonProps) {
  return (
    <Button
      variant="contained"
      aria-label={'Zurück'}
      sx={[{ marginTop: 2, marginLeft: 1, marginBottom: '1rem', width:'9rem', height:'3rem', fontSize:17, borderRadius: 5, backgroundColor: color }, {
        '&:hover': {
          backgroundColor: 'darkred',
        },
      }]}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
}