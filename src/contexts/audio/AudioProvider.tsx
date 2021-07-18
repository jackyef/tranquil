import { createContext, useCallback, useEffect, useRef, useState } from 'react';

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
  const dummyAudioElementRef = useRef<HTMLAudioElement>(null);
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

  const play = useCallback(() => {
    if (playStatus === 'STOPPED') {
      for (const audioSrc in tracksMap) {
        tracksMap[audioSrc].ctx.resume();
      }

      setPlayStatus('PLAYING');
    }
  }, [playStatus, tracksMap]);

  const pause = useCallback(() => {
    if (playStatus === 'PLAYING') {
      for (const audioSrc in tracksMap) {
        tracksMap[audioSrc].ctx.suspend();
      }
      setPlayStatus('STOPPED');
    }
  }, [playStatus, tracksMap]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Environmental sounds',
        artist: 'Tranquil',
        album: '',
        artwork: [
          {
            src: '/images/rain.jpeg',
            sizes: '951x634', // HeightxWidth
            type: 'image/jpeg',
          },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => play());
      navigator.mediaSession.setActionHandler('pause', () => pause());
    }
  }, [play, pause]);

  useEffect(() => {
    if (playStatus === 'PLAYING') {
      navigator.mediaSession.playbackState = 'playing';
      dummyAudioElementRef.current?.play();
    } else {
      navigator.mediaSession.playbackState = 'paused';
      dummyAudioElementRef.current?.pause();
    }
  }, [playStatus]);

  useEffect(() => {
    if (dummyAudioElementRef.current) {
      dummyAudioElementRef.current.volume = 0;
      dummyAudioElementRef.current.loop = true;
    }
  }, []);

  return (
    <AudioReactContext.Provider
      value={{
        playStatus,
        addTrack,
        removeTrack,
        adjustVolume,
        play,
        pause,
      }}
    >
      {/* This is needed because the media controls
       * will only be shown if there's an actual <audio>
       *  element playing in the page.
       * */}
      <audio
        ref={dummyAudioElementRef}
        src="/audio/15-seconds-of-silence.mp3"
      />
      {children}
    </AudioReactContext.Provider>
  );
};
