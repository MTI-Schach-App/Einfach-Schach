import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

export type LongPressButtonProps = {
  /** Text that will appear within the button */
  buttonText: string;
  /** Function to run once delay has been exceeded */
  onExecute: () => void;
  /** How long should be button be held before firing onExecute */
  delayMs: number;
  /** How frequently should the count be updated */
  refreshMs: number;
};

const LongPressButton = ({
  delayMs,
  onExecute,
  buttonText,
  refreshMs = 100,
}: LongPressButtonProps) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timer>();
  const [buttonClass, setButtonClass] = useState('btn-primary');
  const router = useRouter();

  const onInterval = useCallback(() => {
    setCurrentCount((c) => c + refreshMs);
  }, [setCurrentCount, refreshMs]);

  useEffect(() => {
    if (mouseDown) intervalRef.current = setInterval(onInterval, refreshMs);

    if (!mouseDown && intervalRef.current) {
      clearInterval(intervalRef.current);
      setCurrentCount(0);
      setButtonClass(`btn-primary`);
    }
  }, [onInterval, delayMs, mouseDown, refreshMs]);

  useEffect(() => {
    if (currentCount > 0) setButtonClass(`btn-error`);
    if (currentCount > delayMs) {
      onExecute();
      setCurrentCount(0);
    }
  }, [currentCount, delayMs, onExecute]);

  return (
<button
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
      onMouseLeave={() => setMouseDown(false)}
      onTouchStart={() => setMouseDown(true)}
      onTouchEnd={() => setMouseDown(false)}
      style={{visibility: 'hidden' }}
    >
    <Button
        variant="contained"
        aria-label={buttonText}
        sx={{ marginTop: 1, marginLeft: 2, marginBottom: -4, visibility:'visible' }}
      >
      {buttonText}
    </Button>
    </button>
  );
};

export default LongPressButton;