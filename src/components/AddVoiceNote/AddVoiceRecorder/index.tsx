import {lottieSources} from 'assets/lottie';
import {colors} from 'common/theme/colors';
import {useAudioRecord} from 'common/utils/useAudioRecord';
import {TextView} from 'components';
import {Stack, StackItem} from 'components/Stack';
import LottieView from 'lottie-react-native';
import React, {useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {VoiceInterfaceProps} from 'screens/AddTask/components/VoiceRecorder/interface';
import {Styles} from './index.styles';
import Recorder from '../../../assets/lottie/Recorder.svg';
import {useState} from 'react';
import Loader from 'components/Loader';

const styles = Styles();

const AddVoiceRecorder: React.FC<VoiceInterfaceProps> = ({
  onDone,
  onSave,
  isLoading,
  titleError,
  startStopRecording,
  isStartRecording,
}) => {
  const [audioData, recorderStart, recordStop] = useAudioRecord();
  const [onStop, setOnStop] = useState<string>('');
  const {recordTime} = {...audioData};
  var timeId: number = 0;
  const _recordingDone = () => {
    recordStop().then(item => {
      onDone?.(item.voicePath, item.meteringData, item.timeMS);
    });
  };
  useEffect(() => {
    return () => {
      _recordingDone();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (onStop === 'Stopped') {
      _recordingDone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onStop]);

  const onStartStopPress = () => {
    if (isStartRecording) {
      setOnStop('Stopped');
    } else {
      startStopRecording && startStopRecording(true);
      recorderStart();
      timeId = setTimeout(() => {
        setOnStop('Stopped');
      }, 8000);
    }
  };
  return (
    <View style={styles.containerStyles}>
      <StackItem verticalAlign="center" childrenGap={10}>
        {isStartRecording ? (
          <LottieView
            autoPlay={true}
            style={styles.microphoneWidth}
            loop={true}
            source={lottieSources.speechAnimation}
          />
        ) : (
          <Stack center>
            <Recorder width={105} height={80} style={styles.ml} />
          </Stack>
        )}
        <Stack>
          <TextView
            variant={20}
            weight="bold"
            textAlign="center"
            style={styles.ml}>
            {recordTime}
          </TextView>
        </Stack>
        <StackItem
          horizontal
          horizontalAlign={onStop === 'Stopped' ? 'flex-start' : 'space-around'}
          style={styles.btnWidth}>
          <TouchableOpacity
            disabled={onStop !== 'Stopped' || isLoading || titleError}
            onPress={() => {
              onSave && onSave();
              clearTimeout(timeId);
            }}
            style={[
              styles.buttonContainer,
              {
                backgroundColor:
                  onStop === 'Stopped' ? colors.primary : colors.primary_005,
              },
            ]}>
            <TextView
              variant={16}
              weight="medium"
              style={styles.textColorWhite}>
              {isLoading ? (
                <Loader isFooterLoader={true} color={colors.white} />
              ) : (
                'Save'
              )}
            </TextView>
          </TouchableOpacity>
          {onStop !== 'Stopped' ? (
            <TouchableOpacity
              style={styles.startStopBtnContainer}
              onPress={onStartStopPress}>
              <TextView variant={16} weight="medium" style={styles.textColor}>
                {isStartRecording ? 'Stop' : 'Start'}
              </TextView>
            </TouchableOpacity>
          ) : null}
        </StackItem>
      </StackItem>
    </View>
  );
};

export default AddVoiceRecorder;
