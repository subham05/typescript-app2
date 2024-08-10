import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useRef, useState} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.1);

export const useAudioRecord = () => {
  const INITIAL_TIMER = '00:00';
  const [recordTime, setRecordTime] = useState<string>(INITIAL_TIMER);
  const [timeMS, setTotalTimeMS] = useState<number>(0);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const meterRef = useRef<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setCurrentPosition(0);
      };
    }, []),
  );
  const recorderStart = useCallback(() => {
    audioRecorderPlayer.startRecorder(undefined, undefined, true);
    audioRecorderPlayer.addRecordBackListener(e => {
      meterRef.current = [
        ...meterRef.current,
        Math.abs(e?.currentMetering || 160),
      ];

      setRecordTime(
        audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)),
      );
      setTotalTimeMS(Math.floor(e.currentPosition / 100));
    });
  }, []);

  const recordStop = async () => {
    const audioResult = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removePlayBackListener();
    let fixedArrayLength = 60;
    let fixedArray = new Array(fixedArrayLength).fill(160);
    if (meterRef.current.length < fixedArrayLength) {
      meterRef.current.map((item, index) => {
        fixedArray[index] = item;
      });
      meterRef.current = fixedArray;
    } else {
      let new_arr = meterRef.current.slice(0, fixedArrayLength);
      meterRef.current = new_arr;
    }
    const recordResults = {
      voicePath: audioResult,
      meteringData: meterRef.current,
      timeMS,
    };
    return recordResults;
  };

  const onStartPlay = async (uri?: string) => {
    await audioRecorderPlayer.startPlayer(uri);
    audioRecorderPlayer.addPlayBackListener(e => {
      if (e.currentPosition === e.duration) {
        onStopPlay();
      }
      setCurrentPosition(e.currentPosition);
    });
  };

  const onStopPlay = async () => {
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  const onSeekPlay = async (val: number) => {
    audioRecorderPlayer.seekToPlayer(val);
    onStartPlay();
  };

  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  const audioData = {
    recordTime,
    currentPosition,
  };

  return [
    audioData,
    recorderStart,
    recordStop,
    onStartPlay,
    onStopPlay,
    onSeekPlay,
    onPausePlay,
  ] as const;
};
