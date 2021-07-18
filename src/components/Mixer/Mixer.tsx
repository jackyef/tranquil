import { FireIcon, PauseIcon, PlayIcon } from '@heroicons/react/solid';
import { Beach, Lightning, Mountain, Rain, Wind } from 'iconic-react';
import { Button, useTheme } from 'flair-kit';
import { css } from 'goober';
import { Track } from './Track';
import { useContext } from 'react';
import {
  AudioProvider,
  AudioReactContext,
} from '@/contexts/audio/AudioProvider';
import { RenderOnMount } from '../RenderOnMount';

const TRACKS = [
  {
    variant: 'warning',
    icon: <Lightning />,
    audioSrc: '/audio/thunder.wav',
    initialVolume: 0,
    label: 'rain and thunderstorm sound',
    emoji: '⛈️',
  },
  {
    variant: 'error',
    icon: <FireIcon />,
    audioSrc: '/audio/fire.wav',
    initialVolume: 0,
    label: 'fire crackling sound',
    emoji: '🔥',
  },
  {
    variant: 'dark',
    icon: <Rain />,
    audioSrc: '/audio/rain.wav',
    initialVolume: 30,
    label: 'rain sound',
    emoji: '🌧️',
  },
  {
    variant: 'light',
    icon: <Wind />,
    audioSrc: '/audio/wind.wav',
    initialVolume: 0,
    label: 'wind blowing sound',
    emoji: '🎐',
  },
  {
    variant: 'primary',
    icon: <Beach />,
    audioSrc: '/audio/waves.wav',
    initialVolume: 0,
    label: 'waves sound',
    emoji: '🌊',
  },
  {
    variant: 'success',
    icon: <Mountain />,
    audioSrc: '/audio/nature.wav',
    initialVolume: 20,
    label: 'nature sound',
    emoji: '🌳',
  },
] as const;

const MixerContent = () => {
  const { space } = useTheme();
  const { playStatus, play, pause } = useContext(AudioReactContext);
  const isStopped = playStatus === 'STOPPED';

  return (
    <div>
      <div
        className={css`
          margin: ${space['3xl']} 0;
        `}
      >
        <Button
          aria-label={isStopped ? 'Play' : 'Pause'}
          role="status"
          icon={
            isStopped ? (
              <PlayIcon width={100} height={100} />
            ) : (
              <PauseIcon width={100} height={100} />
            )
          }
          onClick={() => {
            if (isStopped) {
              play();
            } else {
              pause();
            }
          }}
          variant={isStopped ? 'success' : 'secondary'}
          size="md"
          isCTA
        />
      </div>

      <div
        className={css`
          display: flex;
          gap: ${space['2xl']};
          margin: ${space['3xl']} 0;
          justify-content: center;
          flex-wrap: wrap;
        `}
      >
        <RenderOnMount>
          {TRACKS.map((track) => (
            <Track key={track.audioSrc} {...track} playStatus={playStatus} />
          ))}
        </RenderOnMount>
      </div>
    </div>
  );
};

export const Mixer = () => {
  return (
    <AudioProvider>
      <MixerContent />
    </AudioProvider>
  );
};
