import { createContext, useCallback, useState } from 'react';

export type PlayStatus = 'PLAYING' | 'STOPPED';

interface AudioReactContextAPI {
  addTrack: (audioSrc: string, volume: number) => Promise<void>;
  removeTrack: (audioSrc: string) => void;
  adjustVolume: (audioSrc: string, volume: number) => void;
  play: () => void;
  pause: () => void;
  playStatus: PlayStatus;
}

export const AudioReactContext = createContext<AudioReactContextAPI>(
  {} as AudioReactContextAPI,
);

export const AudioProvider: React.FC = ({ children }) => {
  const [playStatus, setPlayStatus] = useState<PlayStatus>('STOPPED');
  const [tracksMap, setTracksMap] = useState<{
    [key: string]: {
      ctx: AudioContext;
      gainNode: GainNode;
    };
  }>({});

  const addTrack = useCallback(async (audioSrc: string, volume: number) => {
    const audioCtx = new window.AudioContext();
    const source = audioCtx.createBufferSource();

    const arrayBuffer = await fetch(audioSrc).then((res) => res.arrayBuffer());
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const gainNode = audioCtx.createGain();

    gainNode.gain.value = volume;

    source.buffer = audioBuffer;
    source.loop = true;

    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    source.start();

    setTracksMap((prev) => ({
      ...prev,
      [audioSrc]: {
        ctx: audioCtx,
        gainNode,
      },
    }));
  }, []);

  const removeTrack = useCallback(
    (audioSrc: string) => {
      if (tracksMap[audioSrc]) {
        tracksMap[audioSrc].ctx.close();

        setTracksMap((prev) => {
          delete prev[audioSrc];

          return prev;
        });
      }
    },
    [tracksMap],
  );

  const adjustVolume = useCallback(
    (audioSrc: string, volume: number) => {
      if (tracksMap[audioSrc]) {
        tracksMap[audioSrc].gainNode.gain.value = volume;
      }
    },
    [tracksMap],
  );

  return (
    <AudioReactContext.Provider
      value={{
        playStatus,
        addTrack,
        removeTrack,
        adjustVolume,
        play: () => {
          if (playStatus === 'STOPPED') {
            for (const audioSrc in tracksMap) {
              tracksMap[audioSrc].ctx.resume();
            }

            setPlayStatus('PLAYING');
          }
        },
        pause: () => {
          if (playStatus === 'PLAYING') {
            for (const audioSrc in tracksMap) {
              tracksMap[audioSrc].ctx.suspend();
            }
            setPlayStatus('STOPPED');
          }
        },
      }}
    >
      {children}
    </AudioReactContext.Provider>
  );
};
