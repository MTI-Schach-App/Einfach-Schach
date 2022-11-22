import { Button } from '@mui/material';
import { useRouter } from 'next/router';

export type ButtonProps = {
  /** Text that will appear within the button */
  buttonText: string;
  /** Function to run once delay has been exceeded */
  onClick: () => void;
};

export default function GreenButton ({
  onClick,
  buttonText,
}: ButtonProps){
  
  return (
    <Button
      fullWidth
      variant="contained"
      aria-label={buttonText}
      sx={{ marginTop: 5, height: 100, fontSize: 30 }}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
}