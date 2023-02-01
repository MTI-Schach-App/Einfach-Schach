import { Button } from '@mui/material';

export type ButtonProps = {
  /** Text that will appear within the button */
  buttonText: string;

  /** Color */
  color?: string;

  /** Should have rounded borders */
  isRounded?: boolean;

  /** Function to run on click */
  onClick: () => void;
};

export default function GenericButton ({
  onClick,
  buttonText,
  color="#287233",
  isRounded=true
}: ButtonProps){

  let border : number = 0;
  if (isRounded) {
    border = 25;
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