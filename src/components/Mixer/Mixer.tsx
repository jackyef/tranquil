import { FireIcon, PauseIcon, PlayIcon } from '@heroicons/react/solid';
import { Beach, Lightning, Mountain, Rain, Wind } from 'iconic-react';
import { Button, useTheme } from 'flair-kit';
import { css } from 'goober';
import { Track } from './Track';
import type { PlayStatus } from './Track';
import { useState } from 'react';

const TRACKS = [
  {
    variant: 'warning',
    icon: <Lightning width={40} height={40} />,
    audioSrc: '/audio/thunder.wav',
    initialVolume: 0,
    label: 'rain and thunderstorm sound',
  },
  {
    variant: 'error',
    icon: <FireIcon width={40} height={40} />,
    audioSrc: '/audio/fire.wav',
    initialVolume: 0,
    label: 'fire crackling sound',
  },
  {
    variant: 'dark',
    icon: <Rain width={40} height={40} />,
    audioSrc: '/audio/rain.wav',
    initialVolume: 30,
    label: 'rain sound',
  },
  {
    variant: 'light',
    icon: <Wind width={40} height={40} />,
    audioSrc: '/audio/wind.wav',
    initialVolume: 0,
    label: 'wind blowing sound',
  },
  {
    variant: 'primary',
    icon: <Beach width={40} height={40} />,
    audioSrc: '/audio/waves.wav',
    initialVolume: 0,
    label: 'waves sound',
  },
  {
    variant: 'success',
    icon: <Mountain width={40} height={40} />,
    audioSrc: '/audio/nature.wav',
    initialVolume: 20,
    label: 'nature sound',
  },
] as const;

export const Mixer = () => {
  const { space } = useTheme();
  const [playStatus, setPlayStatus] = useState<PlayStatus>('STOPPED');
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
              setPlayStatus('PLAYING');
            } else {
              setPlayStatus('STOPPED');
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
        {TRACKS.map((track) => (
          <Track key={track.audioSrc} {...track} playStatus={playStatus} />
        ))}
      </div>
    </div>
  );
};
