import { Button } from '@mui/material';

export type ButtonProps = {
  /** Text that will appear within the button */
  buttonText: string;

  /** color 1 of gradient */
  color1?: string;
  /** color 2 of gradient */
  color2?: string;

   /** num 1 of percentage */
   num1?: number;
   /** num 2 for percentage */
   num2?: number;

  /** linear Gradient */
  gradient?: string;

  /** Should have rounded borders */
  isRounded?: boolean;

  /** Function to run on click */
  onClick: () => void;
};

function setGradient(color1:string, num1:number, color2:string, num2:number){
    let percent1 = (num1 * 100) / num2;
    percent1 = Math.floor(percent1);
    return `linear-gradient(90deg, ${color1} 0%, ${color1} ${percent1}%, ${color2} ${percent1}%, ${color2} 100%)`;
}

export default function ProgressButton ({
  onClick,
  buttonText,
  color1='#287233',
  color2='#575757',
  num1=0,
  num2=100,
  gradient=setGradient(color1, num1, color2, num2),
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
      aria-label={buttonText+`, fortschritt: ${num1} von ${num2}`}
      sx={{ marginTop: 5, height: 100, fontSize: 30, background: gradient, borderRadius: border, 
        "&:hover":{background: setGradient('#1e5426', num1, '#383838', num2)}}}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
}