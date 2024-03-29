import { Button } from '@mui/material';
import { red } from '@mui/material/colors';
import Image from 'next/image';

export type ButtonProps = {
  logo: any;

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
  logo,
}: ButtonProps){

  let borderWidth = 0
  let borderColor = ""
  if (ausgewählt) {
    borderWidth = 10
    borderColor = "#287233"[800]
  }
  
  return (
    <Button
      variant="contained"
      aria-label={buttonText}
      sx={{ margin: 1, height: 100, width: 100, backgroundColor: color, border: borderWidth, borderColor: borderColor  }}
      onClick={onClick}
    >
                <Image
                src={logo}
                alt="logo by ben "
                width="350px"
                height="300px"
                style={{ marginBottom: 50, backgroundColor:'FAF4E7' }}
              />
    </Button>
  );
}