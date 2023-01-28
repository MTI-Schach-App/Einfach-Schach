import { Button } from '@mui/material';
import { useRouter } from 'next/router';

export type ButtonProps = {
  /** Text that will appear within the button */
  buttonText: string;

  /** Color */
  color?: string;

  isRounded?: boolean;


  /** Function to run once delay has been exceeded */
  onClick: () => void;
};

export default function GreenButton ({
  onClick,
  buttonText,
  color="#287233",
  isRounded=true
}: ButtonProps){

  let border : number = 0;
  if (isRounded) {
    border = 5;
  }
  
  return (
    <Button
      fullWidth
      variant="contained"
      aria-label={buttonText}
      sx={{ marginTop: 5, height: 100, fontSize: 30, backgroundColor: color, borderRadius: border }}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
}