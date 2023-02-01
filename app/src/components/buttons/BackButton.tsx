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
  color="#287233"
}: BackButtonProps) {
  return (
    <Button
      variant="contained"
      aria-label={'Zurück'}
      sx={{ marginTop: 1, marginLeft: 2, marginBottom: -4, backgroundColor: color }}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
}