import {lottieSources} from 'assets/lottie';
import {colors} from 'common/theme/colors';
import {useAudioRecord} from 'common/utils/useAudioRecord';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {Styles} from './index.styles';
import {VoiceInterfaceProps} from './interface';
import {globalScreenWidth} from 'common/utils/ScreenDimensions';
const styles = Styles();

const VoiceRecorder: React.FC<VoiceInterfaceProps> = ({onDone, chatScreen}) => {
  const [audioData, recorderStart, recordStop] = useAudioRecord();
  const [autoDone, setAutoDone] = useState(false);
  const _recordingDone = () => {
    recordStop().then(item =>
      onDone?.(item.voicePath, item.meteringData, item.timeMS),
    );
  };
  const {recordTime} = {...audioData};
  useEffect(() => {
    recorderStart();
    setTimeout(() => {
      setAutoDone(true);
    }, 8000);
    return () => {
      recordStop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (autoDone) {
      _recordingDone();
      setAutoDone(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDone]);

  return (
    <View
      style={[
        styles.containerStyles,
        {width: chatScreen ? globalScreenWidth - 95 : undefined},
      ]}>
      <Stack
        horizontal
        horizontalAlign="space-between"
        style={styles.stackWidth}>
        <Icon name="pause_circle_outline" size={22} color={colors.white} />
        <TextView style={{color: colors.white}} weight="medium">
          {recordTime}
        </TextView>
      </Stack>
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        style={styles.stackWidth}>
        <LottieView
          autoPlay
          style={styles.microphoneWidth}
          loop={true}
          source={lottieSources.micAnimation}
        />
        <Ripple rippleColor={colors.white} onPress={_recordingDone}>
          <TextView style={{color: colors.white}} weight="medium">
            Done
          </TextView>
        </Ripple>
      </Stack>
    </View>
  );
};

export default VoiceRecorder;
