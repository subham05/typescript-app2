import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import moment from 'moment';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {messageModal} from 'request/Message/constants';
import Waveform from 'screens/AddTask/components/Waveform';
// import WaveForm from 'react-native-audiowaveform';
import {Styles} from 'screens/ChattingScreenFooter/index.styles';

interface AudioMessageViewProps {
  currentMessage: messageModal;
  onLongPress?: () => void;
}
export const AudioMessageView: React.FC<AudioMessageViewProps> = ({
  currentMessage,
  onLongPress,
}) => {
  const {voiceNote, attachmentUrl} = currentMessage;
  const styles = Styles();
  return (
    <TouchableOpacity onLongPress={onLongPress} style={styles.audioView}>
      <Stack horizontal horizontalAlign="space-between">
        <Stack horizontal style={styles.waveView}>
          <Stack style={[styles.fileIconAudio]}>
            <Persona
              // name={'ABCD'}
              name={currentMessage.senderName}
              image={currentMessage?.senderProfile}
              // image={
              //   'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY'
              // }
              size={48}
            />
            <Icon
              name="mic_filled"
              size={20}
              color={colors.primary_002}
              style={styles.micAudio}
            />
          </Stack>
          <Stack style={styles.viewAudio}>
            <Stack horizontal>
              <Waveform
                bufferData={voiceNote?.buffer || []}
                waveFormUri={attachmentUrl}
                timeMS={Number(voiceNote?.timeLength)}
                reducedLength={30}
                // isAudioPlay={isPlay}
                // setAudioPlay={value => setSelectedNote(value)}
                // hideIcon={true}
                // id={_id}
                // selectedNote={selectedNote}
              />
            </Stack>
            {/* <Stack
              horizontal
              horizontalAlign="space-around"
              verticalAlign="center"
              style={styles.audioFooter}>
              <TextView
                weight="regular"
                variant={FontSizes.xxSmall}
                style={styles.receiverFileSize}>
                00:50
              </TextView>
              <StackItem horizontal style={styles.audioTime}>
                <TextView
                  weight="regular"
                  variant={FontSizes.xxSmall}
                  style={styles.receiverFileSize}>
                  12:10 AM
                </TextView>
                <Icon
                  name="sent_tick"
                  size={16}
                  color={colors.primary}
                  style={styles.tickIcon}
                />
              </StackItem>
            </Stack> */}
          </Stack>
        </Stack>
      </Stack>
      <TextView variant={FontSizes.xxSmall} style={styles.timeStyleAudio}>
        {moment
          .utc(currentMessage?.voiceNote?.timeLengthInSec! * 1000)
          .format('mm:ss')}
      </TextView>
    </TouchableOpacity>
  );
};
