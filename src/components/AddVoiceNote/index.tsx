import {colors} from 'common/theme/colors';
import {getUploadDocument} from 'common/utils/Amazon-S3';
import {showToast} from 'common/utils/ToastMessage';
import {Icon} from 'components/Icon';
import {NetworkContext} from 'components/NetworkProvider';
import {StackItem} from 'components/Stack';
import {TextField} from 'components/TextField';
import {TextView} from 'components/TextView';
import {t} from 'i18next';
import moment from 'moment';
import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {useLazyAddVoiceNoteQuery} from 'request/VoiceNote';
import {Stack} from 'stack-container';
import AddVoiceRecorder from './AddVoiceRecorder';
import {Styles} from './index.styles';

interface VoiceModal {
  navigation: any;
  showModal: boolean;
  onClose: () => void;
}
const styles = Styles();
const pattern = /[~`!@#$%^&*+=\-[\]\\';,._©®™✓°¥€¢£√π÷¶•∆/{}()|\\":<>?\s]/;

const AddVoiceNotes: React.FC<VoiceModal> = ({
  showModal,
  onClose,
  navigation,
}) => {
  const [voiceNoteTitle, setVoiceNoteTitle] = useState(
    `Myvoicenote${moment().format('YYMMDDHHSS')}`,
  );
  const [startRecording, setStartRecording] = useState(false);
  const [voicePath, setVoicePath] = useState<string | void>('');
  const [bufferData, setBufferData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTitleError, setIsTitleError] = useState(false);
  const [timeMSState, setTimeMSState] = useState(0);
  const {netStatus} = useContext(NetworkContext);

  const [addVoiceNote, {currentData, isSuccess, error, isError}] =
    useLazyAddVoiceNoteQuery();

  useEffect(() => {
    netStatus && showModal && bufferData.length > 0 && isLoading && onSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [netStatus]);

  useEffect(() => {
    if (error && !isSuccess && isError) {
      setIsLoading(false);
      const err: any = error;
      if (err?.error) {
        showToast(err.error);
      } else {
        showToast(err.data.error[0].msg);
      }
    }
    if (isSuccess && currentData?.message) {
      setIsLoading(false);
      showToast(currentData?.message);
      resetData();
      navigation.navigate('VoiceNotes');
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData, error]);

  const resetData = () => {
    setVoiceNoteTitle(`Myvoicenote${moment().format('YYMMDDHHSS')}`);
    setStartRecording(false);
    setIsLoading(false);
    setVoicePath('');
    setBufferData([]);
    setTimeMSState(0);
  };
  const setAudioStates = (
    voiceResult: string | void,
    voiceBuffer: number[],
    timeMS: number,
  ) => {
    setVoicePath(voiceResult);
    setBufferData(voiceBuffer);
    setTimeMSState(timeMS * 100);
  };

  const getName = () => {
    const date = moment().format();
    return `${voiceNoteTitle}_${date}.mp4`;
  };

  const onSave = async () => {
    setIsLoading(true);
    const voiceObject = {
      uri: voicePath,
      name: voiceNoteTitle ? getName() : 'voice.mp4',
      type: 'audio/mp4',
    };
    if (netStatus) {
      const VoiceNoteUrl = await getUploadDocument(
        voiceObject,
        `voiceNote${moment().format()}`,
      );
      if (VoiceNoteUrl) {
        const addVoiceNoteObj = {
          title: voiceNoteTitle,
          link: VoiceNoteUrl as string,
          timeLength: `${timeMSState}`,
          buffer: bufferData,
        };
        addVoiceNote(addVoiceNoteObj);
      }
    }
  };
  const onModalClose = () => {
    onClose();
    setStartRecording(false);
    setIsLoading(false);
    setIsTitleError(false);
    setBufferData([]);
    setVoiceNoteTitle(`Myvoicenote${moment().format('YYMMDDHHSS')}`);
  };
  const onChangeText = (value: string) => {
    value.match(pattern) || value.trim() === '' || value.trim().length < 3
      ? setIsTitleError(true)
      : setIsTitleError(false);
    setVoiceNoteTitle(value);
  };
  return (
    <Modal
      avoidKeyboard
      isVisible={showModal}
      onBackButtonPress={onModalClose}
      onBackdropPress={onModalClose}
      style={styles.margin}>
      <Stack style={[styles.addVoiceContainer]}>
        <TouchableOpacity onPress={onModalClose} style={styles.closeStyle}>
          <Icon name="close" size={22} color={colors.black} />
        </TouchableOpacity>
        <StackItem>
          <TextView weight="medium" variant={20} style={styles.titleStyle}>
            {t('voiceNotes:addVoiceNote')}
          </TextView>
          <StackItem>
            <TextView weight="regular" variant={16} style={styles.mb}>
              {t('voiceNotes:title')}
            </TextView>

            <TextField
              value={voiceNoteTitle}
              style={styles.title}
              containerStyles={[
                isTitleError ? styles.isError : null,
                styles.containerWidth,
              ]}
              maxLength={50}
              onChangeText={onChangeText}
              placeholderTextColor={colors.grey_005}
              placeholder={'Voice note title'}
              keyboardType="email-address"
            />
            <Stack style={styles.titleHeight}>
              {isTitleError && (
                <TextView
                  variant={16}
                  weight={'regular'}
                  style={{color: colors.red, textAlign: 'left'}}>
                  {t('voiceNotes:titleError')}
                </TextView>
              )}
            </Stack>
          </StackItem>
        </StackItem>
        <StackItem center spaceBelow={25}>
          <TextView variant={16} weight="regular" style={styles.colorStyle}>
            {t('voiceNotes:VoiceRec')}
          </TextView>

          <AddVoiceRecorder
            onDone={(result, metering, recordTime) => {
              setAudioStates(result, metering, recordTime);
              setStartRecording(false);
            }}
            startStopRecording={value =>
              value ? setStartRecording(true) : onClose()
            }
            isStartRecording={startRecording}
            isLoading={isLoading}
            titleError={isTitleError}
            onSave={() => {
              onSave();
            }}
          />
        </StackItem>
      </Stack>
    </Modal>
  );
};
export default AddVoiceNotes;
