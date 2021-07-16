import { FireIcon, PauseIcon, PlayIcon } from '@heroicons/react/solid';
import { BigRoundButton } from '@/components/BigRoundButton';
import { Beach, Lightning, Mountain, Rain, Wind } from 'iconic-react';
import { useTheme } from 'flair-kit';
import { css } from 'goober';
import { Track } from './Track';
import { useState } from 'react';
import type { ReactSoundProps } from 'react-sound';

const TRACKS = [
  {
    variant: 'warning',
    icon: <Lightning width={40} height={40} />,
    audioSrc: '/audio/thunder.wav',
    initialVolume: 0,
  },
  {
    variant: 'error',
    icon: <FireIcon width={40} height={40} />,
    audioSrc: '/audio/fire.wav',
    initialVolume: 0,
  },
  {
    variant: 'dark',
    icon: <Rain width={40} height={40} />,
    audioSrc: '/audio/rain.wav',
    initialVolume: 30,
  },
  {
    variant: 'light',
    icon: <Wind width={40} height={40} />,
    audioSrc: '/audio/wind.wav',
    initialVolume: 0,
  },
  {
    variant: 'primary',
    icon: <Beach width={40} height={40} />,
    audioSrc: '/audio/waves.wav',
    initialVolume: 0,
  },
  {
    variant: 'success',
    icon: <Mountain width={40} height={40} />,
    audioSrc: '/audio/nature.wav',
    initialVolume: 20,
  },
] as const;

export const Mixer = () => {
  const { space } = useTheme();
  const [playStatus, setPlayStatus] =
    useState<ReactSoundProps['playStatus']>('STOPPED');

  return (
    <div>
      <div
        className={css`
          margin: ${space['3xl']} 0;
        `}
      >
        <BigRoundButton
          icon={playStatus === 'STOPPED' ? <PlayIcon /> : <PauseIcon />}
          onClick={() => {
            if (playStatus === 'STOPPED') {
              setPlayStatus('PLAYING');
            } else {
              setPlayStatus('STOPPED');
            }
          }}
          variant="foreground"
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
