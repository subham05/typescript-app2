import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {getUploadDocument, uploadDocument} from 'common/utils/Amazon-S3';
import {showToast} from 'common/utils/ToastMessage';
import {AlertPermission} from 'common/utils/permission/Alert';
import {
  checkCameraPermission,
  getCameraPermission,
} from 'common/utils/permission/ReadCamera';
import {Container, TextView} from 'components';
import DeleteModal from 'components/DeleteModal';
import {Divider} from 'components/Divider';
import FileDocumentUploading from 'components/FileDocumentsUploading';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import {t} from 'i18next';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  MentionInput,
  MentionSuggestionsProps,
} from 'react-native-controlled-mentions';
import {
  Asset,
  ImageLibraryOptions,
  launchCamera,
} from 'react-native-image-picker';
import Ripple from 'react-native-material-ripple';
import {useSharedValue} from 'react-native-reanimated';
import {
  chatInviteeModal,
  useChatAddMutation,
  useDeleteMessageMutation,
  useGroupMessageListMutation,
  useMessageListMutation,
  useSendMessageMutation,
} from 'request/Message';
import {
  deleteMessageModal,
  groupObj,
  messageModal,
  sendMessageModal,
} from 'request/Message/constants';
import {UploadedFileModal} from 'screens/AddTask';
import {SpeechToText} from 'screens/AddTask/components/SpeechToText';
import VoiceNotes from 'screens/AddTask/components/VoiceNotes';
import {useAppSelector} from 'store/hooks';
import {pageInfo} from 'screens/Contacts';
import MessagesList from './components/MessagesList';
import {Styles} from './index.styles';
import Clipboard from '@react-native-clipboard/clipboard';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {
  emitSeen,
  subscribeToChannel,
  unSubscribeToChannel,
} from 'common/utils/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STR_KEYS} from 'common/storage';
import {formatBytes, setMessageType} from './utils';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {
  FormattedAttachmentModal,
  mediaObjFormat,
} from 'common/utils/mediaObjFormat';

const suggestions = [
  {id: '1', name: 'All'},
  {id: '2', name: 'Esther Howard'},
  {id: '3', name: 'Kristin Watson'},
  {id: '4', name: 'Jenny Wilson'},
  {id: '5', name: 'Leslie Alexander'},
  {id: '6', name: 'Marvin McKinney'},
  {id: '7', name: 'John Doe'},
  {id: '8', name: 'Robert Fox'},
  {id: '9', name: 'Kristin Watson'},
  {id: '10', name: 'Jenny Wilson'},
  {id: '11', name: 'Leslie Alexander'},
  {id: '12', name: 'Kristin Watson'},
  {id: '13', name: 'Jenny Wilson'},
  {id: '14', name: 'Leslie Alexander'},
];

const renderSuggestions: React.FC<MentionSuggestionsProps> = ({
  keyword,
  onSuggestionPress,
}) => {
  if (keyword == null) {
    return null;
  }

  const styles = Styles();
  return (
    <View style={styles.mentionBox}>
      <ScrollView style={styles.suggestionBox}>
        {suggestions
          .filter(one =>
            one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()),
          )
          .map(one => (
            <>
              <StackItem
                horizontal
                verticalAlign="center"
                key={one.id.toString()}>
                <Persona name={one.name} size={32} />
                <Pressable
                  key={one.id}
                  onPress={() => onSuggestionPress(one)}
                  style={styles.pressableOption}>
                  <TextView weight="regular" variant={FontSizes.regular}>
                    {one.name}
                  </TextView>
                  {/* <Text>{one.name}</Text> */}
                </Pressable>
              </StackItem>
              <Stack style={styles.suggestionDivider}>
                <Divider size={1.5} />
              </Stack>
            </>
          ))}
      </ScrollView>
    </View>
  );
};

interface modifiedAsset extends Asset {
  size?: number;
}

export interface messageProps {
  _id: number;
  text: string;
  image?: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string | undefined;
    avatar: string | undefined;
  };
}
export interface coordinatesProps {
  x: number;
  y: number;
  height: number;
}

export interface socketMessageModal {
  createdAt: string;
  isAttachment: string;
  message: string;
  messageId: string;
  messageType: string;
  user: string;
  attachmentUrl?: string;
  name: string;
  profileUrl: string;
  size?: string;
  voiceNote?: {
    buffer: number[];
    timeLength: number;
    timeLengthInSec: number;
  };
  attachmentUrlDetails: FormattedAttachmentModal;
}

export enum CHAT_TYPE {
  GROUP = 'Groups',
  CHAT = 'Chats',
  PEOPLE = 'People',
}

type Props = NativeStackScreenProps<SignedInStackParamList, 'ChattingScreen'>;
export const ChattingScreen = (props: Props) => {
  const translateY = useSharedValue(0);

  const [value, setValue] = useState<string>('');
  const {
    type,
    data: userData,
    isCreateScreen = false,
    isShortKey,
  } = props.route.params!;
  const [messages, setMessages] = useState<messageModal[]>([]);
  const [isheader, setIsHeader] = useState<boolean>(false);
  const [selectedMsg, setSelectedMsg] = useState<messageModal>();
  const [selectedMsgIndex, setSelectedMsgIndex] = useState<number>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [socketMsg, setSocketMsg] = useState<socketMessageModal>();

  const [xCoordinate, setXCoordinates] = useState<coordinatesProps[]>([]);
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);
  const [data, setData] = useState<any>(userData);
  const {userData: loggedInUserDetails} = useAppSelector(
    state => state.formanagement,
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addChat, {isSuccess, data: createChatData}] = useChatAddMutation();
  const [pageNo, setPageNo] = useState<number>(1);
  const [pages, setPages] = useState<pageInfo>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [membersCount, setMembersCount] = useState<number>(0);
  const [groupInfo, setGroupInfo] = useState<groupObj>();
  const [channelId, setChannelId] = useState<string>('');

  const isFocused = useIsFocused();

  const [getMessages, {data: messageData, isSuccess: isMessageSuccess}] =
    useMessageListMutation();
  const [
    getGroupMessages,
    {
      data: groupMessageData,
      isSuccess: isGroupMessageSuccess,
      isLoading: groupMessageLoading,
    },
  ] = useGroupMessageListMutation();
  const [sentMessage, {isSuccess: isSendMessageSuccess, data: sendMsgData}] =
    useSendMessageMutation();

  const deviceWidth = Dimensions.get('window').width;

  const [
    deleteMessage,
    {
      isSuccess: isDeleteMsgSuccess,
      data: deleteMsgData,
      isLoading: deleteMsgLoading,
    },
  ] = useDeleteMessageMutation();

  const commonLoader = deleteMsgLoading || isLoading || groupMessageLoading;

  const addChatRequest = useMemo(() => {
    setData(userData);
    return {
      chatWith: data?._id!,
    };
  }, [userData, data]);

  //Chat messages
  const messageRequest = useMemo(() => {
    return {
      pageNo: pageNo,
      chatId: channelId,
    };
  }, [channelId, pageNo]);

  //Group messages
  const groupMessageRequest = useMemo(() => {
    return {
      pageNo: pageNo,
      groupId: data?._id,
    };
  }, [data, pageNo]);

  /**
   * @description check if chat id exists for user
   */
  useEffect(() => {
    if (isCreateScreen) {
      addChat(addChatRequest);
    } else {
      setChannelId(data?.chatId || data?._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const socketMessages = (res: string) => {
    const message = JSON.parse(res?.replace(/,$/, '')) as socketMessageModal;
    setSocketMsg(message);
  };

  useEffect(() => {
    if (socketMsg) {
      const obj: messageModal = {
        _id: socketMsg.messageId!,
        message: socketMsg.message!,
        isAttachment: socketMsg.isAttachment === 'true' ? true : false,
        attachmentUrl: socketMsg.attachmentUrl || '',
        attachmentUrlDetails: socketMsg.attachmentUrlDetails,
        messageType: socketMsg.messageType!,
        senderId: socketMsg.user!,
        recieverId: '',
        senderRole: '',
        createdAt: socketMsg.createdAt!,
        updatedAt: socketMsg.createdAt!,
        isOwn: loggedInUserDetails?._id === socketMsg.user ? true : false,
        formattedTime: moment(socketMsg.createdAt).format('hh:mm A'),
        formattedDate: moment(socketMsg.createdAt).format('MMM D,YYYY'),
        senderName: socketMsg.name || '',
        senderProfile: socketMsg.profileUrl || '',
        size: socketMsg.size,
        voiceNote: {
          buffer: socketMsg.voiceNote?.buffer || [],
          timeLength: socketMsg.voiceNote?.timeLength || 0,
          timeLengthInSec: socketMsg.voiceNote?.timeLengthInSec || 0,
        },
        isDeleted: false,
      };
      let tempArr = [...messages];
      tempArr.unshift(obj);
      setMessages(tempArr);

      if (loggedInUserDetails?._id !== socketMsg.user) {
        emitSeen(channelId, loggedInUserDetails?._id!, type!);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketMsg]);

  useEffect(() => {
    if (channelId !== '') {
      if (isFocused) {
        subscribeToChannel(socketMessages, channelId);
        AsyncStorage.setItem(STR_KEYS.ACTIVE_CHAT_ID, channelId);
      } else {
        unSubscribeToChannel(channelId);
        AsyncStorage.setItem(STR_KEYS.ACTIVE_CHAT_ID, '');
      }
    }

    return () => {
      unSubscribeToChannel(channelId);
      AsyncStorage.setItem(STR_KEYS.ACTIVE_CHAT_ID, '');
    };
  }, [isFocused, channelId]);

  useEffect(() => {
    if (isSuccess && createChatData) {
      setChannelId(createChatData.data._id);
    }
  }, [isSuccess, createChatData]);

  //Api call for Chat
  useEffect(() => {
    if (
      (type === CHAT_TYPE.CHAT || type === CHAT_TYPE.PEOPLE) &&
      channelId !== '' &&
      isFocused
    ) {
      getMessages(messageRequest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageRequest, channelId, isFocused]);

  //Api call for Group
  useEffect(() => {
    if (type !== CHAT_TYPE.CHAT && type !== CHAT_TYPE.PEOPLE && isFocused) {
      getGroupMessages(groupMessageRequest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, groupMessageRequest]);

  useEffect(() => {
    if (isFocused) {
      setMessages([]);
      setPageNo(1);
    }
  }, [isFocused]);

  useEffect(() => {
    if (type === CHAT_TYPE.PEOPLE) {
      setIsHeader(true);
    }
  }, [type]);

  //Group message get and set
  useEffect(() => {
    if (isGroupMessageSuccess && groupMessageData) {
      const {record} = groupMessageData.data;
      setMessages(prev => prev.concat(record as messageModal[]));
      setPages(groupMessageData.data.pageInfo);
      setIsAdmin(groupMessageData?.data?.addRemoveAccess!);
      setMembersCount(groupMessageData?.data?.groupMembersNumber!);
      setGroupInfo(groupMessageData.data.groupInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGroupMessageSuccess]);

  //Chat meesage get and set
  useEffect(() => {
    if (isMessageSuccess && messageData) {
      setIsLoading(false);
      const {record} = messageData.data;
      setMessages(prev => prev.concat(record as messageModal[]));
      setPages(messageData.data.pageInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMessageSuccess]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSelectedMsgIndex(undefined);
        setSelectedMsg(undefined);
      };
    }, []),
  );

  const chooseFileCamera = () => {
    if (true) {
      let option: ImageLibraryOptions = {
        mediaType: 'photo',
      };
      launchCamera(option, response => {
        if (!response.didCancel) {
          const {assets} = response;
          if (
            [
              'image/jpeg',
              'image/jpg',
              'image/png',
              'image/heic',
              'image/heif',
              'image/gif',
            ].includes(assets![0]?.type!)
          ) {
            let newObj = {...assets![0], name: assets![0]?.fileName};
            sendMessage([newObj]!);
          } else {
            showToast(t('addManager:imageError'));
          }
        }
      });
    }
  };

  const takePermissionCamera = () => {
    checkCameraPermission().then(res => {
      if (!res.isPermissionGranted) {
        if (res.result === 'denied') {
          getCameraPermission().then(resp => {
            const {statuses, isPermissionGranted} = resp;
            (statuses['ios.permission.CAMERA'] === 'blocked' ||
              statuses['android.permission.CAMERA'] === 'blocked') &&
              AlertPermission(t('permissions:camera'));
            isPermissionGranted && chooseFileCamera();
          });
        } else if (res.result === 'blocked') {
          AlertPermission(t('permissions:camera'));
        }
      } else {
        chooseFileCamera();
      }
    });
  };

  const renderMainContainer = () => {
    return (
      <>
        {!selectedMsg ? (
          <Stack style={styles.header}>
            {type === CHAT_TYPE.CHAT || type === CHAT_TYPE.PEOPLE ? (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('ViewContact', {
                    data: data as chatInviteeModal,
                    isCreateScreen: isCreateScreen,
                  });
                }}>
                <Stack horizontal>
                  <Persona
                    name={isShortKey ? data?.name : data.username}
                    image={isShortKey ? data?.profileUrl : data.userImage}
                    // image={'https://picsum.photos/200/300'}
                  />
                  <Stack style={styles.name}>
                    <TextView
                      weight="medium"
                      variant={FontSizes.regular}
                      numberOfLines={1}
                      style={[styles.headName, {width: deviceWidth / 2}]}>
                      {isShortKey ? data?.name : data?.username}
                    </TextView>
                  </Stack>
                </Stack>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('ViewGroup', {
                    data: data,
                    isAdmin: isAdmin,
                  });
                }}>
                <Stack horizontal>
                  {/* <Icon
                name="groups"
                size={24}
                color={colors.white}
                style={styles.groupIcon}
              /> */}
                  <Persona
                    name={
                      isShortKey
                        ? data?.name
                        : type === CHAT_TYPE.CHAT || type === CHAT_TYPE.PEOPLE
                        ? data?.username
                        : groupInfo?.groupName ?? ''
                    }
                    image={
                      isShortKey
                        ? data?.profileUrl
                        : type === CHAT_TYPE.CHAT || type === CHAT_TYPE.PEOPLE
                        ? data?.userImage
                        : groupInfo?.groupImage ?? ''
                    }
                    style={styles.groupIcon}
                  />
                  <Stack style={styles.groupName}>
                    <TextView
                      weight="medium"
                      variant={FontSizes.regular}
                      numberOfLines={1}
                      style={{width: deviceWidth / 2}}>
                      {isShortKey
                        ? data?.name
                        : type === CHAT_TYPE.CHAT || type === CHAT_TYPE.PEOPLE
                        ? data?.username
                        : groupInfo?.groupName ?? ''}
                    </TextView>
                    <TextView weight="regular" variant={FontSizes.small}>
                      {`${membersCount} Members`}
                    </TextView>
                  </Stack>
                </Stack>
              </TouchableOpacity>
            )}
          </Stack>
        ) : null}
      </>
    );
  };
  const renderLeftContainer = () => {
    return (
      <>
        {selectedMsg ? (
          <StackItem horizontal childrenGap={5}>
            {selectedMsg && selectedMsg.isOwn && (
              <IconButton
                name="delete"
                size={24}
                color={colors.black}
                style={styles.headerTop}
                onPress={() => {
                  setDeleteModal(true);
                }}
              />
            )}

            {selectedMsg && !selectedMsg.attachmentUrl && (
              <IconButton
                name="file_copy"
                size={24}
                color={colors.black}
                style={styles.headerTop}
                onPress={() => {
                  Clipboard.setString(messages[selectedMsgIndex!].message);
                  setSelectedMsgIndex(undefined);
                  setSelectedMsg(undefined);
                }}
              />
            )}
          </StackItem>
        ) : (
          <Stack horizontal>
            {type === CHAT_TYPE.GROUP && isAdmin && (
              <IconButton
                name="add_member"
                size={24}
                color={colors.black}
                style={styles.headerTop}
                onPress={() =>
                  props.navigation.navigate('AddMember', {groupId: data._id})
                }
              />
            )}
            <View style={styles.verticalSpace}>
              <PopupMenu data={menuData} height={54} width={116} />
            </View>
          </Stack>
        )}
      </>
    );
  };

  const menuData: MenuModel[] = [
    {
      name: t('manageTask:relatedTask'),
      onClick: () => {
        props.navigation.navigate('RelatedTask', {
          taskIds: type === CHAT_TYPE.CHAT ? [channelId] : [data?._id],
          isChat: true,
          chatType: type,
        });
      },
    },
  ];

  const [headerHeight, setHeaderHeight] = useState<number>();
  const onLayoutHeader = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  const sendVoiceNote = async (
    voiceResult: string | undefined,
    voiceBuffer: number[],
    timeMS: number,
  ) => {
    if (voiceResult?.length) {
      let date = new Date();
      let timeFormat = date.valueOf().toString();
      const voiceObj = {
        name: `voiceNote_${timeFormat}.mp4`,
        type: 'audio/mp4',
        uri: voiceResult,
      };
      let addVoiceNoteResult = await getUploadDocument(
        voiceObj,
        `voiceNote${moment().format()}`,
      );
      let receiverCheck = isCreateScreen
        ? data._id
        : loggedInUserDetails?._id === data?.chatWith
        ? data?.chatOwner
        : data?.chatWith;
      let obj: sendMessageModal = {
        // message: value,
        isAttachment: true,
        messageType: 'mp3',
        recieverId: receiverCheck,
        attachmentUrl: addVoiceNoteResult,
        voiceNote: {
          timeLength: timeMS * 100,
          timeLengthInSec: timeMS / 10,
          buffer: voiceBuffer,
        },
        senderProfileUrl: loggedInUserDetails?.profileUrl,
      };
      if (type === CHAT_TYPE.CHAT || type === CHAT_TYPE.PEOPLE) {
        obj.chatId = channelId;
      } else if (type === CHAT_TYPE.GROUP) {
        obj.groupId = channelId;
      }
      sentMessage(obj);
      setValue('');
    }
  };

  const sendMessage = async (assets?: modifiedAsset[]) => {
    let attachFile;
    let docResult;
    if (assets) {
      // setIsLoading(true);
      let tempArray: UploadedFileModal[] = [];
      assets?.map(file =>
        file.uri?.includes('https://formanagement.s3.amazonaws')
          ? null
          : tempArray.push(file),
      );
    }

    docResult = await uploadDocument(assets, `sendMessage/${new Date()}/`);

    let receiverCheck = isCreateScreen
      ? data._id
      : loggedInUserDetails?._id === data?.chatWith
      ? data?.chatOwner
      : data?.chatWith;
    let attachmentObj = mediaObjFormat(assets, docResult, true);
    let obj: sendMessageModal = {
      message: docResult.length ? '' : value.trim(),
      // voiceNote: {
      //   timeLength: 50,
      //   timeLengthInSec: 500,
      //   buffer: [12, 2342, 34, 54565, 65675675, 6, 23, 34, 34343, 424323, 2],
      // },
      isAttachment: !!docResult.length,
      messageType: setMessageType(docResult[0]),
      recieverId: receiverCheck,
      attachmentUrl: docResult[0],
      attachmentUrlDetails: attachmentObj[0],
      senderProfileUrl: loggedInUserDetails?.profileUrl,
      size: assets?.[0].size ? formatBytes(assets[0].size) : '',
    };
    if (type === CHAT_TYPE.CHAT || type === CHAT_TYPE.PEOPLE) {
      obj.chatId = channelId;
    } else {
      obj.groupId = data?._id;
      obj.groupName = data?.groupName;
      obj.groupImage = data?.groupImage;
    }
    if (!docResult.length) {
      delete obj.attachmentUrl;
    }
    if (attachFile) {
      obj = {...obj, attachmentUrl: attachFile};
    }
    sentMessage(obj);

    setValue('');
  };
  const setAudioStates = (
    voiceResult: string | undefined,
    voiceBuffer: number[],
    timeMS: number,
  ) => {
    sendVoiceNote(voiceResult, voiceBuffer, timeMS);
  };
  const styles = Styles();

  useEffect(() => {
    if (isSendMessageSuccess && sendMsgData) {
      setIsLoading(false);
    }
  }, [isSendMessageSuccess, sendMsgData]);

  const deleteSelectedMsg = () => {
    if (selectedMsgIndex !== undefined) {
      const bodyObj: deleteMessageModal = {
        chatId: messages[selectedMsgIndex]._id,
        body: {
          isLastMessage: selectedMsgIndex === 0 ? true : false,
          deletedAttachments: messages[selectedMsgIndex].isAttachment
            ? [messages[selectedMsgIndex].attachmentUrl]
            : [],
          taskId: messages[selectedMsgIndex]?.taskId,
        },
      };
      deleteMessage(bodyObj);
    }
  };

  useEffect(() => {
    if (deleteMsgData && isDeleteMsgSuccess) {
      let tempMessages = [...messages];
      tempMessages[selectedMsgIndex!] = {
        ...tempMessages[selectedMsgIndex!],
        isDeleted: true,
      };
      setMessages(tempMessages);
      showToast(deleteMsgData.message);
      setSelectedMsg(undefined);
      setSelectedMsgIndex(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteMsgData, isDeleteMsgSuccess]);

  const onEndReached = () => {
    if (pages?.hasNextPage) {
      setPageNo((prev: number) => prev + 1);
    }
  };
  return (
    <Container noSpacing>
      <View onLayout={onLayoutHeader}>
        <Header
          navigationType="STACK"
          translateY={translateY}
          RenderMainContainer={renderMainContainer}
          RenderLeftContainer={renderLeftContainer}
          disableDefaultStyle
          preventDefault={isheader}
          onBackPress={() => {
            if (type === CHAT_TYPE.PEOPLE) {
              props.navigation.pop(2);
            }
            setSelectedMsg(undefined);
          }}
        />
        <Stack style={styles.horizontalLine}>
          <Divider size={2} color={colors.grey_008} />
        </Stack>
      </View>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? undefined : 30}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.containerStyle}>
        <MessagesList
          messages={messages}
          setXCoordinates={coordinateValue =>
            setXCoordinates([...xCoordinate, coordinateValue])
          }
          xCoordinate={xCoordinate}
          type={type}
          headerHeight={headerHeight}
          selectedMsg={selectedMsg}
          setSelectedMsg={setSelectedMsg}
          setSelectedMsgIndex={setSelectedMsgIndex}
          onEndReached={onEndReached}
          onMessageSelect={message => {
            props.navigation.navigate('AddTask', {
              subTask: true,
              messageData: message,
              channelId: type === CHAT_TYPE.CHAT ? channelId : data._id,
              chatType: type,
            });
          }}
        />
        <Stack horizontal verticalAlign="flex-end">
          <Stack
            horizontal
            style={styles.renderInputToolBar}
            verticalAlign="flex-end">
            <Stack>
              <VoiceNotes
                chatScreen={true}
                recordingVoiceNote={setIsRecording}
                onResult={(voiceResult, voiceBuffer, timeMS) => {
                  setAudioStates(voiceResult, voiceBuffer, timeMS);
                }}
              />
            </Stack>
            {/* <Ripple style={styles.mic} rippleColor={colors.white}> */}

            {/* <Stack
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
                  onPress={() => setVoicePath('')}
                />
              </Stack> */}
            {/* <Icon name="mic" size={24} color={colors.white} /> */}
            {/* </Ripple> */}
            <Stack style={styles.TextInput}>
              <MentionInput
                placeholder={
                  isRecording ? '' : t('group:typeSomethingPlaceholder')
                }
                placeholderTextColor={colors.grey_003}
                value={isRecording ? '' : value}
                editable={!commonLoader}
                onChange={setValue}
                partTypes={[
                  {
                    trigger: '@', // Should be a single character like '@' or '#'
                    renderSuggestions,
                    textStyle: {
                      fontFamily: AppFonts.regular,
                      fontSize: FontSizes.regular,
                      color: 'blue',
                    }, // The mention style in the input
                  },
                ]}
                // containerStyle={{
                // backgroundColor: colors.white,
                // }}
                style={styles.mentionInput}
                multiline={true}
                // numberOfLines={5}
              />
            </Stack>
            {(value === '' || !isRecording) && (
              <IconButton
                name="camera"
                size={24}
                color={colors.primary_003}
                style={styles.iconsBottom}
                onPress={() => takePermissionCamera()}
              />
            )}
            {!isRecording && (
              <View style={styles.fileUploadingBottom}>
                <FileDocumentUploading
                  iconColor={colors.primary_003}
                  // title={t('addTask:attach')}
                  setUploadedFileData={files => {
                    sendMessage(files);
                  }}
                  iconStyle={styles.attachIconStyle}
                />
              </View>
            )}
            {/* <IconButton
              name="attach_file"
              size={24}
              color={colors.primary_003}
              style={value === '' ? styles.iconsBottom : styles.attachFile}
              onPress={() => {}}
            /> */}
          </Stack>
          <Ripple
            rippleColor={colors.white}
            style={[
              styles.sendButton,
              {
                backgroundColor:
                  value.trim().length > 0 ? colors.primary : colors.grey_004,
              },
            ]}
            disabled={value.trim().length > 0 ? false : true}
            onPress={() => {
              sendMessage();
            }}>
            <Icon name="send" size={24} color={colors.white} />
          </Ripple>
        </Stack>
      </KeyboardAvoidingView>
      {isSpeechModalOpen && (
        <SpeechToText
          close={() => setIsSpeechModalOpen(false)}
          text={text =>
            setValue(value.length ? value + ' ' + text : value + text)
          }
        />
      )}
      {deleteModal && (
        <DeleteModal
          reopenModal={deleteModal}
          setReopenModal={val => setDeleteModal(val)}
          Title={t('messagePage:confirmDelete')}
          onDeleteClick={deleteSelectedMsg}
        />
      )}
      {commonLoader && <Loader color={colors.white} />}
    </Container>
  );
};
