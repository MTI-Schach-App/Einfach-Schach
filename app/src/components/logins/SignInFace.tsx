import Webcam from 'react-webcam';
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { useStore } from '../../utils/store';
import { User } from '../../interfaces/user';
import { fetchWrapper } from '../../utils/fetch-wrapper';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { useState } from 'react';

import { toast } from 'react-toastify';

const faceStates = {
  load: '1/4 Starte Kamera',
  detect: '2/4 Halte dein Gesicht in die Kamera',
  verify: '3/4 Vergleiche Gesicht...',
  failed: 'Anmelden fehlgeschlagen. Versuche erneut',
  success: '4/4 Anmeldung erfolgreich...starte Spiel'
};

export default function SignInFace() {
  // COMPONENT NEEDS A REFACTOR
  const notify = (error: string) => toast.error(error);
  const [verifying, setVerifying] = useState(false);
  const [loginState, setLoginState] = useState(faceStates.load);
  const {
    setLoggedInState,
    currentScreenshot,
    setCurrentScreenshot,
    loggedInUser
  } = useStore();
  const router = useRouter();
  const verify = async (screen: string) => {
    console.log(screen);
    const data = await fetchWrapper.post('api/users/verify', { img: screen });
    if (data.success != true) {
      console.log(data.error);
      if (data.error === 'No face detect') {
        router.push('/');
        setCurrentScreenshot('');
        notify('Kein Gesicht gefunden.');
        setLoginState(faceStates.detect);
        setTimeout(
          function () {
            setVerifying(false);
          }.bind(this),
          4000
        );
      } else {
        router.push('/signup');
      }
    } else {
      setLoginState(faceStates.success);
      const usersRepo: User[] = await fetchWrapper.get('api/users/all');
      const name = data.username.toString();
      setLoggedInState(usersRepo.filter((user) => user.name === name)[0]);
    }
  };
  if (!(typeof window === 'undefined')) {
    const { webcamRef, isLoading, detected } = useFaceDetection({
      faceDetectionOptions: {
        model: 'short',
        minDetectionConfidence: 0.9
      },
      faceDetection: new FaceDetection.FaceDetection({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
      }),
      camera: ({ mediaSrc, onFrame, width, height }: CameraOptions) =>
        new Camera(mediaSrc, {
          onFrame,
          width,
          height
        })
    });
    if (!isLoading && loginState === faceStates.load)
      setLoginState(faceStates.detect);

    if (detected && !verifying) {
      setLoginState(faceStates.verify);
      //@ts-ignore
      const imageSrc = webcamRef.current?.getScreenshot();
      setVerifying(true);
      setCurrentScreenshot(imageSrc);
      verify(imageSrc);
    }

    return (
      <>
        <p style={{ width: '100%', fontSize: 30 }}>{loginState}</p>
        {
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{
              height: '100%',
              width: '100%',
              left: '-10000px',
              position: 'absolute'
            }}
          />
        }
      </>
    );
  } else {
    return (
      <div>
        <p>{`BROWSER NOT SUPPORTED`}</p>
      </div>
    );
  }
}
