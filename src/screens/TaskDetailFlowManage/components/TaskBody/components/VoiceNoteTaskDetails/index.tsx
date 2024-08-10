import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {IconButton} from 'components/IconButtons';
import {Stack} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {TaskDetails} from 'request/ManageTask';
import VoiceNotes from 'screens/AddTask/components/VoiceNotes';
import Waveform from 'screens/AddTask/components/Waveform';
import {Styles} from 'screens/AddTask/index.styles';
import {Styles as StyleDetails} from '../../index.styles';
import Modal from 'react-native-modal';
import {View} from 'react-native';
import {Styles as StylesModal} from '../../index.styles';
import {t} from 'i18next';

interface VoiceNotesTaskDetailProps {
  isEditable?: boolean;
  taskProps?: TaskDetails;
  onVoiceRecorded?: (
    value: string,
    bufferData: number[],
    timeMs: number,
  ) => void;
  isDeleted?: (value: boolean) => void;
}

export const VoiceNoteTaskDetails: React.FC<VoiceNotesTaskDetailProps> = ({
  isEditable,
  taskProps,
  onVoiceRecorded,
  isDeleted,
}) => {
  const styles = Styles();
  const stylesModal = StylesModal();
  const styleDetails = StyleDetails();
  const [voicePath, setVoicePath] = useState<string | undefined>();
  const [linkPath, setLinkPath] = useState<string | undefined>();
  const [bufferData, setBufferData] = useState<number[]>([]);
  const [timeMSState, setTimeMSState] = useState(0);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const setAudioStates = (
    voiceResult: string | undefined,
    voiceBuffer: number[],
    timeMS: number,
  ) => {
    setVoicePath(voiceResult);
    setBufferData(voiceBuffer);
    setTimeMSState(timeMS * 100);
    onVoiceRecorded?.(voiceResult!, voiceBuffer, timeMS);
  };

  useEffect(() => {
    if (taskProps?.voiceNote?.link && taskProps?.voiceNote?._id) {
      setLinkPath(taskProps?.voiceNote?.link!);
    }
  }, [taskProps]);

  useEffect(() => {
    if (!isEditable && taskProps?.voiceNote?._id) {
      setLinkPath(taskProps?.voiceNote?.link!);
    }
  }, [isEditable, taskProps]);

  useEffect(() => {
    if (!isEditable) {
      setVoicePath(undefined);
    }
  }, [isEditable]);
  return (
    <Stack style={styles.BoxStyle}>
      {linkPath && taskProps?.voiceNote?.buffer ? (
        // || voicePath
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          style={styleDetails.voiceNoteStackStyle}>
          <Waveform
            waveFormUri={linkPath}
            bufferData={taskProps?.voiceNote?.buffer!}
            timeMS={taskProps?.voiceNote?.timeLength!}
          />
          {isEditable && (
            <IconButton
              size={24}
              style={styles.CloseIconStyle}
              name="close"
              color={colors.black}
              onPress={() => {
                setConfirmDeleteModal(true);
              }}
            />
          )}
        </Stack>
      ) : isEditable && !voicePath ? (
        <Stack style={styleDetails.voiceNoteStackStyle}>
          <VoiceNotes
            onResult={(voiceResult, voiceBuffer, timeMS) => {
              setAudioStates(voiceResult, voiceBuffer, timeMS);
            }}
          />
        </Stack>
      ) : (
        <>
          {!isEditable && (
            <Stack center style={styleDetails.NoVoiceFound}>
              <TextView variant={FontSizes.regular} weight={'medium'}>
                No voice note found
              </TextView>
            </Stack>
          )}
        </>
      )}
      {/* {isEditable && !voicePath && (
        <Stack style={styleDetails.voiceNoteStackStyle}>
          <VoiceNotes
            onResult={(voiceResult, voiceBuffer, timeMS) => {
              setAudioStates(voiceResult, voiceBuffer, timeMS);
            }}
          />
        </Stack>
      )} */}
      {isEditable && voicePath && !linkPath && (
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          style={styles.BoxStyle}>
          <Waveform bufferData={bufferData} timeMS={timeMSState} />
          <IconButton
            size={24}
            style={styles.CloseIconStyle}
            name="close"
            color={colors.black}
            onPress={() => setVoicePath(undefined)}
          />
        </Stack>
      )}
      {confirmDeleteModal && (
        <Modal isVisible={confirmDeleteModal}>
          <View style={stylesModal.centeredView}>
            <View style={stylesModal.modalView}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={stylesModal.shareVia}>
                {t('taskDetails:alertRemoveVoiceNote')}
              </TextView>
              <Stack horizontal style={stylesModal.modal}>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={stylesModal.reopenModal}
                  onPress={() => setConfirmDeleteModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={stylesModal.reopenModal}
                  onPress={() => {
                    setLinkPath(undefined);
                    isDeleted?.(true);
                    setConfirmDeleteModal(false);
                  }}>
                  {t('yes')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
    </Stack>
  );
};
