import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import DeleteModal from 'components/DeleteModal';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {PopupMenu, MenuModel} from 'components/PopupMenu';
import {Stack} from 'components/Stack';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
// import Modal from 'react-native-modal';
import {useDeleteVoiceNoteMutation} from 'request/VoiceNote';
import Waveform from 'screens/AddTask/components/Waveform';
import Share from '../../../../assets/svgs/share.svg';
import {Styles} from './index.styles';
import {VoiceNotesStrings} from 'screens/VoiceNotes/constants';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';

export interface voiceNoteData {
  _id: string;
  createdAt: string;
  employeeId: string;
  hasShared: boolean;
  link: string;
  timeLength: number;
  title: string;
  buffer: number[] | [];
  timeLengthInSec: number;
}

interface VoiceNotesItemProps {
  VoiceListData: voiceNoteData;
  index: number;
  selectedNote: string | null;
  setSelectedNote: (value: string | null) => void;
  onDelete: (
    itemId: string,
    isEdit: boolean,
    voiceTitle: string,
    selectedItemObj?: voiceNoteData,
  ) => void;
  onAccessLogsPress: (itemId: string) => void;
  onSharePress: (itemId: string) => void;
  selectedOption: string;
  addAccessLog: (_id: string) => void;
  onSetReminderPress: (_id: string) => void;
}

export interface VoiceNotesModel {
  name: string;
  date: string;
  duration: string;
}

export const VoiceNotesItem: React.FC<VoiceNotesItemProps> = ({
  VoiceListData,
  index,
  selectedNote,
  setSelectedNote,
  onDelete,
  onAccessLogsPress,
  onSharePress,
  selectedOption,
  addAccessLog,
  onSetReminderPress,
}) => {
  const {t} = useTranslation();
  const {
    _id,
    title,
    // createdAt,
    timeLength,
    hasShared,
    buffer,
    link,
    timeLengthInSec,
    formattedDate,
    formattedTime,
  } = VoiceListData;
  // const [isLongPressed, setIsLongPressed] = useState<boolean>(false);

  const [deleteVoiceItem, {isSuccess, data, isError, error}] =
    useDeleteVoiceNoteMutation();

  const [reopenModal, setReopenModal] = useState<boolean>(false);
  useEffect(() => {
    if (isError && error) {
      const err: any = error;
      if (err?.error) {
        showToast(err.error);
      } else {
        showToast(err.data.error[0].msg);
      }
    }
    if (isSuccess && data?.message) {
      showToast(data.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  const isPlayAudio = _id === selectedNote ? true : false;
  const styles = Styles();
  const onDeletePress = () => {
    setReopenModal(true);
  };
  const onRenamePress = () => {
    onDelete(_id, true, title, VoiceListData);
  };

  const menuData: MenuModel[] = [
    {
      name: t('voiceNotes:setReminder'),
      onClick: () => onSetReminderPress(_id),
    },
    {
      name: t('voiceNotes:Share'),
      onClick: () => onSharePress(_id),
    },
    {
      name: t('voiceNotes:rename'),
      onClick: () => onRenamePress(),
    },
    {
      name: t('voiceNotes:delete'),
      onClick: () => onDeletePress(),
    },
    {
      name: t('voiceNotes:accessLogs'),
      onClick: () => onAccessLogsPress(_id),
    },
  ];

  const sharedMenuData: MenuModel[] = [
    {
      name: t('voiceNotes:Share'),
      onClick: () => onSharePress(_id),
    },
  ];

  const PlayPauseButton = () => {
    return (
      <Stack style={styles.fileIcon}>
        {isPlayAudio ? (
          <TouchableOpacity
            onPress={() => {
              setSelectedNote(null);
            }}>
            <Icon
              name="pause_circle_outline"
              size={35}
              color={colors.primary}
              style={styles.pausePlayIcon}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setSelectedNote(_id);
              addAccessLog(_id);
            }}>
            <Icon
              name="play_circle_outline"
              size={35}
              color={colors.primary}
              style={styles.pausePlayIcon}
            />
          </TouchableOpacity>
        )}
        {hasShared && selectedOption === VoiceNotesStrings.my && (
          <Stack style={styles.share}>
            <Share />
          </Stack>
        )}
      </Stack>
    );
  };

  const voiceListing = () => {
    return (
      <>
        {/* <TouchableOpacity
          key={`${index}_${_id}`}
          onLongPress={() => {
            setIsLongPressed(!isLongPressed);
          }}> */}
        <Stack style={styles.container} spaceBelow={16} key={`${index}_${_id}`}>
          <Stack horizontal horizontalAlign="space-between">
            <Stack horizontal>
              {selectedOption === VoiceNotesStrings.my && <PlayPauseButton />}
              {selectedOption === VoiceNotesStrings.shared && (
                <Stack horizontalAlign="center">
                  <Persona
                    name={VoiceListData?.name}
                    image={VoiceListData?.profileUrl || ''}
                    size={40}
                  />
                </Stack>
              )}
              <Stack style={styles.view}>
                <Stack
                  horizontal
                  verticalAlign="center"
                  horizontalAlign="space-between">
                  <Stack style={styles.nameWidth}>
                    <TextView
                      weight="medium"
                      variant={FontSizes.medium}
                      numberOfLines={1}
                      truncate>
                      {title}
                    </TextView>
                  </Stack>
                  <Stack style={styles.dateWidth}>
                    <TextView
                      weight="regular"
                      variant={FontSizes.xSmall}
                      numberOfLines={1}
                      style={[styles.text, styles.duration]}>
                      {/* {moment(createdAt).format('MMM DD, YYYY; hh:mm A')} */}
                      {/* {formattedDate + '; ' + formattedTime} */}
                      {formattedDate + '; ' + formattedTime}
                    </TextView>
                  </Stack>
                </Stack>
                <Stack
                  horizontal
                  verticalAlign="center"
                  horizontalAlign="space-between">
                  <Stack horizontal style={styles.waveformWidth}>
                    {selectedOption === VoiceNotesStrings.shared && (
                      <PlayPauseButton />
                    )}
                    <Waveform
                      bufferData={buffer}
                      waveFormUri={link}
                      timeMS={Number(timeLength)}
                      // isAudioPlay={isPlay}
                      setAudioPlay={value => setSelectedNote(value)}
                      hideIcon={true}
                      id={_id}
                      selectedNote={selectedNote}
                    />
                  </Stack>
                  <TextView
                    weight="regular"
                    variant={FontSizes.xSmall}
                    style={[
                      styles.text,
                      styles.duration,
                      styles.durationWidth,
                    ]}>
                    {moment
                      .utc(timeLengthInSec * 1000)
                      .format(DateTimeFormats.minutesSeconds)}
                  </TextView>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        {/* </TouchableOpacity> */}
        {reopenModal && (
          <DeleteModal
            Title={t('voiceNotes:deleteAlert')}
            reopenModal={reopenModal}
            setReopenModal={value => setReopenModal(value)}
            onDeleteClick={() => {
              setReopenModal(false);
              deleteVoiceItem({contacts: [_id]});
              onDelete(_id, false, title);
              setSelectedNote(null);
            }}
          />
        )}

        <Divider />
      </>
    );
  };

  return (
    <>
      <PopupMenu
        data={
          selectedOption === VoiceNotesStrings.my ? menuData : sharedMenuData
        }
        height={selectedOption === VoiceNotesStrings.my ? 280 : 50}
        width={125}
        Component={voiceListing}
        // menuStyle={styles.moreIcon}
      />
    </>
  );
};
