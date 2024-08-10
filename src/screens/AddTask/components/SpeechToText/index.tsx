import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from '@react-native-voice/voice';
import {lottieSources} from 'assets/lottie';
import {AlertPermission} from 'common/utils/permission/Alert';
import {getMicSpeechToTextPermission} from 'common/utils/permission/ReadMicSpeechToText';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import {t} from 'i18next';
import LottieView from 'lottie-react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import Modal from 'react-native-modal';
import {Styles} from './index.style';
import {SpeechToTextProps} from './interface';
const styles = Styles();
let closingTime: number;

export const SpeechToText: React.FC<SpeechToTextProps> = ({close, text}) => {
  const [speechText, setSpeechText] = useState<string>('');
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [currentVoiceState, setCurrentVoiceState] = useState('');
  const speechRef = useRef(speechText);
  const partialSpeechRef = useRef('');
  speechRef.current = speechText;

  const stopRecording = useCallback(async () => {
    try {
      await Voice.stop();
      Voice.destroy().then(() => Voice.removeAllListeners());
      close();
      if (speechRef.current.length) {
        text(speechRef.current);
      } else if (partialSpeechRef.current.length) {
        text(partialSpeechRef.current);
      } else if (
        !speechRef.current.length &&
        !partialSpeechRef.current.length
      ) {
        text(speechRef.current);
        showToast('Not recognized please try again');
      }
      clearTimeout(closingTime);
    } catch (e) {}
  }, [close, text]);

  const startRecording = useCallback(async () => {
    try {
      let permissionStatus = getMicSpeechToTextPermission();
      permissionStatus.then(async item => {
        if (item.isPermissionGranted) {
          setSpeechText('');
          setIsPermissionGranted(true);
          await Voice.start('en-US');

          closingTime = setTimeout(() => {
            stopRecording();
          }, 10000);
        } else {
          close();
          AlertPermission(t('permissions:microphone'));
        }
      });
    } catch (e) {}
  }, [stopRecording, close]);

  const onSpeechStart = useCallback(() => {
    setCurrentVoiceState('Listening...');
  }, []);

  const onSpeechStop = useCallback(() => {
    setTimeout(async () => {
      const isRecognizing = await Voice.isRecognizing();
      if (!isRecognizing) {
        stopRecording();
      }
    }, 500);
  }, [stopRecording]);

  const onSpeechResultHandler = useCallback(
    (e: SpeechResultsEvent) => {
      if (e.value) {
        setSpeechText(e.value[0]);
        setCurrentVoiceState('Recognizing...');
        if (Platform.OS === 'android') {
          stopRecording();
        }
      }
    },
    [stopRecording],
  );

  const onSpeechErrorHandler = useCallback((e: SpeechErrorEvent) => {
    if (e.error?.code === '7') {
      showToast('Not recognized please try again');
    }
  }, []);

  const onSpeechPartialResult = useCallback((e: SpeechResultsEvent) => {
    if (e.value) {
      partialSpeechRef.current = e.value[0];
      setCurrentVoiceState('Recognizing...');
    }
  }, []);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechResults = onSpeechResultHandler;
    Voice.onSpeechEnd = onSpeechStop;
    Voice.onSpeechError = onSpeechErrorHandler;
    Voice.onSpeechPartialResults = onSpeechPartialResult;
    startRecording();
    return () => {
      Voice.destroy().then(() => Voice.removeAllListeners());
      clearTimeout(closingTime);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      isVisible={isPermissionGranted}
      onBackdropPress={stopRecording}
      style={styles.ModalContainer}>
      <View style={styles.ViewContainer}>
        <View style={styles.TextView}>
          <TextView weight="medium" variant={20}>
            {currentVoiceState}
          </TextView>
        </View>
        <LottieView
          autoPlay
          loop={true}
          style={styles.LottieAnimation}
          source={lottieSources.speechAnimation}
        />
      </View>
    </Modal>
  );
};
