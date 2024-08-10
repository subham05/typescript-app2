import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {VoiceNoteProps} from 'screens/VoiceNotes';

interface VoiceNotesItemProps {
  data: SharedVoiceNotesModel;
  VoiceNoteItemProps: VoiceNoteProps;
}

export interface SharedVoiceNotesModel {
  name: string;
  date: string;
  duration: string;
}

export const SharedVoiceItem: React.FC<VoiceNotesItemProps> = ({
  data,
  VoiceNoteItemProps,
}) => {
  const {t} = useTranslation();

  const [isLongPressed, setIsLongPressed] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);

  const onReminderPress = () => {
    VoiceNoteItemProps.navigation.navigate('Reminder', {voiceNotes: true});
    setIsLongPressed(false);
  };
  const onSharePress = () => {
    VoiceNoteItemProps.navigation.navigate('ShareContactVoiceNotes');
    setIsLongPressed(false);
  };
  return (
    <>
      <TouchableOpacity
        onLongPress={() => {
          setIsLongPressed(prevState => !prevState);
        }}>
        {isLongPressed && (
          <Modal
            isVisible={isLongPressed}
            onBackdropPress={() => setIsLongPressed(false)}>
            <StackItem childrenGap={16} style={styles.modal}>
              <TouchableOpacity onPress={onReminderPress}>
                <TextView weight="regular" variant={FontSizes.regular}>
                  {t('voiceNotes:setReminder')}
                </TextView>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSharePress}>
                <TextView weight="regular" variant={FontSizes.regular}>
                  {t('voiceNotes:share')}
                </TextView>
              </TouchableOpacity>
            </StackItem>
          </Modal>
        )}
        <Stack style={styles.container} spaceBelow={16}>
          <Stack horizontal horizontalAlign="space-between">
            <Stack horizontal>
              <Stack style={styles.fileIcon}>
                <Persona
                  name={data.name}
                  image={
                    'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY'
                  }
                />
                <Icon
                  name="mic_filled"
                  size={20}
                  color={colors.primary_002}
                  style={styles.mic}
                />
              </Stack>
              <Stack style={styles.view}>
                <Stack
                  horizontal
                  verticalAlign="center"
                  horizontalAlign="space-between">
                  <Stack verticalAlign="center">
                    <TextView
                      weight="medium"
                      variant={FontSizes.medium}
                      truncate>
                      {data.name}
                    </TextView>
                  </Stack>
                  <TextView
                    weight="regular"
                    variant={FontSizes.xSmall}
                    style={[styles.text, styles.duration]}>
                    {data.date}
                  </TextView>
                </Stack>
                <Stack
                  horizontal
                  verticalAlign="center"
                  horizontalAlign="space-between">
                  <Stack horizontal>
                    {isPlay ? (
                      <Icon
                        name="pause_circle_outline"
                        size={24}
                        color={colors.primary}
                        style={styles.pausePlayIcon}
                        onPress={() => setIsPlay(prevState => !prevState)}
                      />
                    ) : (
                      <Icon
                        name="play_circle_outline"
                        size={24}
                        color={colors.primary}
                        style={styles.pausePlayIcon}
                        onPress={() => setIsPlay(prevState => !prevState)}
                      />
                    )}
                  </Stack>
                  <TextView
                    weight="regular"
                    variant={FontSizes.xSmall}
                    style={[styles.text, styles.duration]}>
                    {data.duration}
                  </TextView>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </TouchableOpacity>
      <Divider />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 3,
  },
  fileIcon: {
    alignSelf: 'center',
  },
  view: {
    marginLeft: 10,
    marginTop: 3,
    width: Dimensions.get('screen').width - 94,
  },
  text: {
    color: colors.grey_003,
  },
  duration: {right: 10},
  mic: {position: 'absolute', right: -2, bottom: -7},
  modal: {
    height: 97,
    width: 166,
    backgroundColor: colors.white,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    justifyContent: 'center',
    paddingLeft: 20,
    marginLeft: Dimensions.get('screen').width / 3,
    position: 'absolute',
    // top: 77,
  },
  waveForm: {
    height: 20,
    width: Dimensions.get('screen').width / 2.5,
  },
  line: {
    height: 1,
    width: Dimensions.get('screen').width / 2,
    backgroundColor: colors.primary,
  },
  pausePlayIcon: {marginRight: 10},
});
