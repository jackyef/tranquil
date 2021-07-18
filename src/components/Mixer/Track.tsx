import { Button, MappedColorVariant } from 'flair-kit';
import React, { cloneElement, useEffect, useRef, useState } from 'react';
import { css, keyframes } from 'goober';
import { Spinner } from 'iconic-react';

export type PlayStatus = 'PLAYING' | 'STOPPED';
interface Props {
  label: string;
  variant: MappedColorVariant;
  icon: React.ReactElement;
  audioSrc: string;
  playStatus: PlayStatus;
  initialVolume?: number;
}

interface SoundProps {
  src: string;
  playStatus: PlayStatus;
  volume: number;
  loop: boolean;
  onBufferChange: (isBuffering: boolean) => void;
}

const Sound = ({
  src,
  playStatus,
  volume,
  loop,
  onBufferChange,
}: SoundProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Syncing play status
  useEffect(() => {
    if (audioRef.current) {
      if (playStatus === 'STOPPED') {
        // pause the audio
        audioRef.current.pause();
      } else if (playStatus === 'PLAYING') {
        // start playing the audio
        audioRef.current.play();
      }
    }
  }, [playStatus]);

  // Syncing volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Emit buffering state change
  // Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
  useEffect(() => {
    const handleBuffering = () => {
      onBufferChange(true);
    };
    const handleNotBuffering = () => {
      onBufferChange(false);
    };

    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.addEventListener('waiting', handleBuffering);
      audioElement.addEventListener('canplay', handleNotBuffering);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('waiting', handleBuffering);
        audioElement.removeEventListener('canplay', handleNotBuffering);
      }
    };
  }, [onBufferChange]);

  return <audio ref={audioRef} src={src} loop={loop} />;
};

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
  const [state, setState] = useState<PlayStatus>('STOPPED');

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
        src={audioSrc}
        playStatus={state}
        loop
        volume={volume}
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
