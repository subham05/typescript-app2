import {useFocusEffect} from '@react-navigation/native';
import {colors} from 'common/theme/colors';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import EmptyComponent from 'components/EmptyComponent';
import Loader from 'components/Loader';
import {TextField} from 'components/TextField';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  usePlaySharedVoiceNoteMutation,
  useRenameVoiceNoteMutation,
} from 'request/VoiceNote';
import {Stack} from 'stack-container';
import {voiceNoteData, VoiceNotesItem} from '../VoiceNotesItem';

interface VoiceNotesListProps {
  VoiceListData: voiceNoteData[];
  searchText: string;
  isLoadingList: boolean;
  isFetching: boolean;
  refreshing: boolean;
  pageNumber: number;
  getRefresh: () => void;
  getMoreList: () => void;
  onDelete: (itemId?: string, isEdit?: boolean, voiceTitle?: string) => void;
  onAccessLogsPress: (itemId: string) => void;
  onSharePress: (itemId: string) => void;
  selectedOption: string;
  myVoiceSuccess: boolean;
  shareVoiceSuccess: boolean;
  shareDataLength: number;
  onSetReminderPress: (_id: string) => void;
}
export const VoiceNotesList: React.FC<VoiceNotesListProps> = ({
  VoiceListData,
  // props,
  searchText,
  isLoadingList,
  isFetching,
  refreshing,
  pageNumber,
  getMoreList,
  getRefresh,
  onDelete,
  onAccessLogsPress,
  onSharePress,
  selectedOption,
  shareVoiceSuccess,
  shareDataLength,
  myVoiceSuccess,
  onSetReminderPress,
}) => {
  const {t} = useTranslation();
  const pattern = /[~`!@#$₹%^&*+=\-[\]\\';,._©®™✓°¥€¢£√π÷¶•∆/{}()|\\":<>?\s]/;
  const pattern2 = /^[ A-Za-z0-9]*$/;
  const [voiceTitle, setVoiceTitle] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<voiceNoteData | undefined>();
  const [isRename, setIsRename] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isTitleError, setIsTitleError] = useState<boolean>(false);
  const [renameVoiceItem, {data, isSuccess, error, isError, isLoading}] =
    useRenameVoiceNoteMutation();

  const [addVoiceNoteAccessLogs] = usePlaySharedVoiceNoteMutation();

  const onUpdatePress = () => {
    voiceTitle !== selectedItem?.title &&
      voiceTitle !== '' &&
      renameVoiceItem({
        voiceNoteId: selectedItem?._id,
        voiceNoteTitle: voiceTitle,
      });
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSelectedNote(null);
        setSelectedItem(undefined);
        setVoiceTitle('');
        setIsRename(false);
        setIsTitleError(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]),
  );
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
      showToast(data?.message);
      setIsRename(false);
      onDelete(selectedItem?._id, true, voiceTitle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onChange = (value: string) => {
    value.match(pattern) || value.trim() === ''
      ? setIsTitleError(true)
      : setIsTitleError(false);
    setVoiceTitle(value);
  };
  const renderRenameModal = () => {
    return (
      <Modal
        isVisible={isRename}
        onBackdropPress={() => {
          setIsRename(false);
          setIsTitleError(false);
        }}>
        <Stack style={styles().renameModal} spacing={35}>
          <Stack verticalAlign="flex-start" style={styles().titleContainer}>
            <TextField
              value={voiceTitle}
              placeholder="Voice note title"
              onChangeText={onChange}
              maxLength={100}
              // style={[styles().renameTextFiled]}
              containerStyles={[
                styles().renameTextFiled,
                isTitleError && styles().titleError,
              ]}
              keyboardType={'email-address'}
            />
            {isTitleError && (
              <TextView style={styles().errorMsg} variant={14} weight="regular">
                {t('voiceNotes:errorMessage')}
              </TextView>
            )}
          </Stack>
          <TouchableOpacity
            style={[
              styles().updateStyle,
              voiceTitle.trim() === '' || voiceTitle === selectedItem?.title
                ? styles().opacityLess
                : styles().opacityFull,
            ]}
            disabled={
              voiceTitle === '' ||
              voiceTitle === selectedItem?.title ||
              isTitleError
            }
            onPress={onUpdatePress}>
            {isLoading ? (
              <Loader isFooterLoader color={colors.white} />
            ) : (
              <TextView
                weight="medium"
                variant={16}
                style={styles().updateText}>
                Update
              </TextView>
            )}
          </TouchableOpacity>
        </Stack>
      </Modal>
    );
  };

  const addAccessLog = (id: string) => {
    const requestObj = {
      documentId: id,
      typeOfAction: selectedOption === 'Shared' ? 'SHARE' : 'READ',
      documentCollection: 'voicenotes',
      documentDescription:
        selectedOption === 'Shared'
          ? 'From Shared Listing to View'
          : 'From Listing to View',
    };
    addVoiceNoteAccessLogs(requestObj);
  };

  const isEditCall = (
    itemId: string,
    isEdit: boolean,
    title: string,
    selectedItemObj: voiceNoteData,
  ) => {
    setVoiceTitle(title);
    setIsRename(true);
    setSelectedItem(selectedItemObj);
  };
  return (VoiceListData?.length <= 0 &&
    !searchText &&
    isLoadingList &&
    isFetching) ||
    (isFetching && pageNumber === 1) ? (
    <Loader />
  ) : VoiceListData?.length! > 0 && searchText.match(pattern2!) ? (
    <Stack spaceBelow={200}>
      <FlatList
        data={VoiceListData}
        contentContainerStyle={{
          paddingBottom: Dimensions.get('screen').height / 7,
        }}
        ListHeaderComponent={() => <View style={styles().header} />}
        renderItem={({item, index}) => (
          <View key={index} style={styles().container}>
            <VoiceNotesItem
              selectedOption={selectedOption}
              VoiceListData={item}
              index={index}
              selectedNote={selectedNote}
              setSelectedNote={value => setSelectedNote(value)}
              onDelete={(itemId, isEdit, title, selectedItemObj) => {
                isEdit
                  ? isEditCall(itemId, isEdit, title, selectedItemObj!)
                  : onDelete(itemId, isEdit, title);
              }}
              onAccessLogsPress={itemId => onAccessLogsPress(itemId)}
              onSharePress={itemId => onSharePress(itemId)}
              addAccessLog={addAccessLog}
              onSetReminderPress={onSetReminderPress}
            />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => getRefresh()}
          />
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() =>
          isFetching || isLoadingList ? <Loader isFooterLoader={true} /> : null
        }
        onEndReachedThreshold={0.3}
        onEndReached={() => getMoreList()}
      />
      {renderRenameModal()}
    </Stack>
  ) : selectedOption === 'Shared' && shareVoiceSuccess && !shareDataLength ? (
    <EmptyComponent />
  ) : selectedOption !== 'Shared' && myVoiceSuccess ? (
    <EmptyComponent />
  ) : (
    <></>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    header: {height: 16},
    titleContainer: {height: 100},
    renameTextFiled: {
      marginHorizontal: 15,
      // paddingHorizontal: 10,
      marginTop: 20,
      width: Dimensions.get('screen').width - 140,
      backgroundColor: colors.grey_009,
      color: colors.black,
      borderRadius: 3,
    },
    titleError: {borderColor: colors.red_001, borderWidth: 0.5},
    errorMsg: {
      color: colors.red_001,
      marginHorizontal: 28,
    },
    renameModal: {
      backgroundColor: colors.white,
      justifyContent: 'center',
      // alignItems: 'center',
      borderRadius: 5,
    },
    updateText: {color: colors.white, textAlign: 'center'},
    opacityFull: {opacity: 1},
    opacityLess: {opacity: 0.5},
    updateStyle: {
      height: 35,
      width: 80,
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      // paddingVertical: 5,
      borderRadius: 5,
      marginBottom: 10,
      marginHorizontal: 15,
      alignSelf: 'flex-end',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  return mergeStyles;
};
