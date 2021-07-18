import { Button, MappedColorVariant } from 'flair-kit';
import React, { cloneElement, useEffect, useRef, useState } from 'react';
import Sound from 'react-sound';
import type { ReactSoundProps } from 'react-sound';
import { css, keyframes } from 'goober';
import { Spinner } from 'iconic-react';

interface Props {
  label: string;
  variant: MappedColorVariant;
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
  label,
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
    <div
      className={css`
        display: flex;

        & > button {
          margin-right: 2rem;
        }
      `}
    >
      <Button
        aria-label={volume > 0 ? `Mute ${label}` : `Unmute ${label}`}
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

      <input
        aria-label="Volume"
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
      />
    </div>
  );
};
