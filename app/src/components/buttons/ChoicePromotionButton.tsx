import { Button } from '@mui/material';
import { red } from '@mui/material/colors';

export type ButtonProps = {
  /** Text that will appear within the button */
  buttonText: string;

  /** Color */
  color?: string;

  /** Should have rounded borders */
  ausgewählt?: boolean;

  /** Function to run on click */
  onClick: () => void;
};

export default function ChoicePromo ({
  onClick,
  buttonText,
  color="#287233",
  ausgewählt=false,
}: ButtonProps){

  let borderWidth = 0
  let borderColor = ""
  if (ausgewählt) {
    borderWidth = 10
    borderColor = red[400]
  }
  
  return (
    <Button
      variant="contained"
      aria-label={buttonText}
      sx={{ height: 100, width: 100, backgroundColor: color, border: borderWidth, borderColor: borderColor  }}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
}