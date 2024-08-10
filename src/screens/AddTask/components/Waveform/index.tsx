/* eslint-disable @typescript-eslint/no-unused-vars */
import Slider from '@react-native-community/slider';
import {colors} from 'common/theme/colors';
import {useAudioRecord} from 'common/utils/useAudioRecord';
import {IconButton} from 'components/IconButtons';
import {Stack} from 'components/Stack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {Styles} from './index.styles';
import {WaveFormProps} from './interface';
const styles = Styles();
const userImage =
  'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY';

const Waveform: React.FC<WaveFormProps> = ({
  bufferData,
  timeMS,
  isAudioPlay,
  waveFormUri,
  hideIcon,
  setAudioPlay,
  id,
  selectedNote = undefined,
  reducedLength,
}) => {
  const [
    audioData,
    recorderStart,
    recordStop,
    onStartPlay,
    onStopPlay,
    onSeekPlay,
    onPausePlay,
  ] = useAudioRecord();
  const {recordTime, currentPosition} = audioData;
  const [isPlay, setIsPlay] = useState(false);
  // const [modifiedArray, setModifiedArray] = useState<number[]>([]);
  // const modifiedArray = useRef<number[]>([]);
  const lineHeight = (item: number) => {
    if (item > 150) {
      return 3;
    } else if (item > 80 && item < 150) {
      return 4;
    } else if (item > 50 && item < 80) {
      return 5;
    } else if (item > 20 && item < 50) {
      return 15;
    } else if (item > 10 && item < 20) {
      return 25;
    } else if (item <= 10) {
      return 35;
    } else {
      return 1;
    }
  };

  let arrayTimeLength: number;
  let modifiedArray: number[] = [];
  if (reducedLength) {
    arrayTimeLength = reducedLength * 100;
    for (let i = 0; i < bufferData?.length; i += 2) {
      let mean = (bufferData[i] + bufferData[i + 1]) / 2;
      modifiedArray?.push(mean);
    }
  } else {
    arrayTimeLength = bufferData.length * 100;
  }

  if (!reducedLength) {
    arrayTimeLength = bufferData.length * 100;
  } else {
    arrayTimeLength = reducedLength * 100;
  }

  const currentIndex = useMemo(() => {
    let factor = timeMS / arrayTimeLength;
    return currentPosition / factor / 100;
  }, [timeMS, arrayTimeLength, currentPosition]);

  useEffect(() => {
    let currentPos = currentPosition;
    if (
      Math.trunc(currentPos) >= timeMS ||
      (waveFormUri && Math.round(currentPos / 100) >= timeMS / 100)
    ) {
      setIsPlay(false);
      setAudioPlay?.(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition, timeMS]);
  useEffect(() => {
    if (selectedNote) {
      if (id === selectedNote) {
        onStopPlay();
        setIsPlay(true);
        onStartPlay(waveFormUri!);
      }
    } else if (selectedNote === null) {
      setIsPlay(false);
      onStopPlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNote]);

  return (
    <Stack horizontal verticalAlign="center">
      {!hideIcon && (
        <Stack>
          {!isPlay ? (
            <IconButton
              name="play_circle_outline"
              color={colors.primary}
              size={38}
              onPress={() => {
                setIsPlay(true);
                waveFormUri ? onStartPlay(waveFormUri) : onStartPlay();
              }}
            />
          ) : (
            <>
              <IconButton
                name="pause_circle_outline"
                color={colors.primary}
                size={38}
                onPress={() => {
                  setIsPlay(false);
                  onStopPlay();
                }}
              />
            </>
          )}
        </Stack>
      )}
      <View style={styles.waveformView}>
        <Slider
          style={[{width: bufferData.length * 4 + 30}, styles.slider]}
          value={Math.floor(currentIndex) || 0}
          minimumValue={0}
          maximumValue={bufferData.length}
          maximumTrackTintColor="transparent"
          minimumTrackTintColor="transparent"
          thumbTintColor={colors.primary_002}
          onSlidingComplete={val => {
            setIsPlay(true);
            setAudioPlay?.(null);
            onSeekPlay(val * 100);
          }}
          onSlidingStart={() => {
            setIsPlay(false);
            setAudioPlay?.(id!);
            onPausePlay();
          }}
        />
        {!reducedLength
          ? bufferData?.map((item, index) => (
              <>
                <View
                  style={[
                    {
                      height: lineHeight(item),
                      borderColor:
                        currentIndex >= index
                          ? colors.primary_002
                          : colors.grey_015,
                    },
                    styles.audioWaveforms,
                  ]}
                />
              </>
            ))
          : modifiedArray?.map((item, index) => (
              <>
                <View
                  style={[
                    {
                      height: lineHeight(item),
                      borderColor:
                        currentIndex >= index
                          ? colors.primary_002
                          : colors.grey_015,
                    },
                    styles.audioWaveforms,
                  ]}
                />
              </>
            ))}
      </View>
    </Stack>
  );
};

export default Waveform;
