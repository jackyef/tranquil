import { Button, MappedColorVariant } from 'flair-kit';
import React, {
  cloneElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { css, keyframes } from 'goober';
import { Spinner } from 'iconic-react';
import { AudioReactContext, PlayStatus } from '@/contexts/audio/AudioProvider';

interface Props {
  label: string;
  variant: MappedColorVariant;
  icon: React.ReactElement;
  audioSrc: string;
  playStatus: PlayStatus;
  initialVolume?: number;
}

interface UseSoundParams {
  src: string;
  volume: number;
  playStatus: PlayStatus;
  onBufferChange: (isBuffering: boolean) => void;
}

const useSound = ({
  src,
  playStatus,
  volume,
  onBufferChange,
}: UseSoundParams) => {
  const { addTrack, removeTrack, adjustVolume } = useContext(AudioReactContext);
  const trackAddedRef = useRef('');

  // Adding track to the AudioContext
  useEffect(() => {
    const execute = async () => {
      onBufferChange(true);
      await addTrack(src, volume / 100);

      trackAddedRef.current = src;
      onBufferChange(false);
    };

    // Only re-add track if it's not already added
    if (playStatus === 'PLAYING' && trackAddedRef.current !== src) {
      execute();
    }

    return () => {
      // Only remove track if `src` changed
      if (trackAddedRef.current !== src) {
        removeTrack(src);
        trackAddedRef.current = '';
      }
    };

    // eslint-disable-next-line
  }, [src, addTrack, playStatus]);

  // Volume syncing
  useEffect(() => {
    adjustVolume(src, volume / 100);
  }, [src, volume, adjustVolume]);

  return null;
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
  const [volume, setVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        Number(localStorage.getItem(`${audioSrc}:volume`)) || initialVolume
      );
    }
    return initialVolume;
  });
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

    localStorage.setItem(`${audioSrc}:volume`, String(volume));
  }, [playStatus, volume, audioSrc]);

  useSound({
    onBufferChange: (isBuffering) => {
      setIsLoading(isBuffering);
    },
    src: audioSrc,
    volume,
    playStatus: state,
  });

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

      <input
        aria-label="Volume"
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={(e) => {
          const newVolume = Number(e.target.value);

          setVolume(newVolume);
        }}
      />
    </div>
  );
};
