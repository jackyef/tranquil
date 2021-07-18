import { Button } from 'flair-kit';
import React, { cloneElement, useEffect, useRef, useState } from 'react';
import Sound from 'react-sound';
import type { ReactSoundProps } from 'react-sound';
import { css, keyframes } from 'goober';
import { Spinner } from 'iconic-react';

interface Props {
  variant:
    | 'dark'
    | 'light'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'warning';
  icon: React.ReactElement;
  audioSrc: string;
  playStatus: ReactSoundProps['playStatus'];
  initialVolume?: number;
}

export const Track = ({
  icon,
  variant,
  audioSrc,
  playStatus,
  initialVolume = 50,
  ...props
}: Props) => {
  const [volume, setVolume] = useState(initialVolume);
  const [isLoading, setIsLoading] = useState(false);
  const prevVolume = useRef(initialVolume);
  const [state, setState] = useState<ReactSoundProps['playStatus']>('STOPPED');

  const toggle = () => {
    if (volume === 0) {
      setVolume(prevVolume.current || 30);
    } else {
      prevVolume.current = volume;
      setVolume(0);
    }
  };

  useEffect(() => {
    if (volume > 0) {
      setState(playStatus);
    } else {
      setState('STOPPED');
    }
  }, [playStatus, volume]);

  const buttonClass =
    volume === 0
      ? css`
          opacity: 0.4;
        `
      : '';
  const spinningAnimation = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `;

  return (
    <>
      <Button
        className={buttonClass}
        isCTA
        icon={
          isLoading ? (
            <Spinner
              className={css`
                animation: ${spinningAnimation} 2s linear infinite;
              `}
              width={40}
              height={40}
            />
          ) : (
            cloneElement(icon, { width: 40, height: 40 })
          )
        }
        variant={variant}
        onClick={toggle}
        {...props}
      />
      <Sound
        url={audioSrc}
        playStatus={state}
        loop
        volume={volume}
        // @ts-expect-error
        onBufferChange={(isBuffering) => {
          setIsLoading(isBuffering);
        }}
      />
    </>
  );
};
