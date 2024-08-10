import {colors} from 'common/theme/colors';
import {AlertPermission} from 'common/utils/permission/Alert';
import {getMicStoragePermission} from 'common/utils/permission/ReadMicStorage';
import {DefaultButton} from 'components/Buttons';
import {IconButton} from 'components/IconButtons';
import {t} from 'i18next';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import VoiceRecorder from '../VoiceRecorder';
import {VoiceNotesProps} from './interface';

const VoiceNotes: React.FC<VoiceNotesProps> = ({
  onResult,
  recordingVoiceNote,
  chatScreen,
}) => {
  const [voiceModal, setVoiceModal] = useState<boolean>(false);

  const permission = () =>
    getMicStoragePermission().then(res => {
      if (res.isPermissionGranted) {
        setVoiceModal(true);
        recordingVoiceNote?.(true);
      } else {
        AlertPermission(t('permissions:microphone_storage'));
      }
    });

  return (
    <View>
      {voiceModal ? (
        <VoiceRecorder
          chatScreen={chatScreen}
          onDone={(result, metering, recordTime) => {
            onResult(result, metering, recordTime);
            setVoiceModal(false);
            recordingVoiceNote?.(false);
          }}
        />
      ) : chatScreen ? (
        <IconButton
          name="mic"
          size={24}
          color={colors.white}
          style={styles.micIconChat}
          onPress={() => permission()}
        />
      ) : (
        <DefaultButton
          iconPosition="right"
          title={'Add voice note'}
          onPress={() => permission()}
          iconProps={{name: 'mic'}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  micIconChat: {
    backgroundColor: colors.primary,
    padding: 4,
    borderRadius: 16,
    marginBottom: 8,
    marginLeft: 10,
    overflow: 'hidden',
  },
});

export default VoiceNotes;
