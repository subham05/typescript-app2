import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {StyleProp} from 'react-native';
import {messageModal} from 'request/Message/constants';
import {CHAT_TYPE, coordinatesProps} from 'screens/ChattingScreenFooter';
import {Styles} from 'screens/ChattingScreenFooter/index.styles';
import {DateView} from '../DateView';
import {
  AudioMessageView,
  DocxMessageView,
  ImageMessageView,
  PdfMessageView,
  ReceiverPersona,
  SenderPersona,
} from './components';

interface MessageViewProps {
  currentMessage: messageModal;
  type: string | undefined;
  coordinates: coordinatesProps;
  headerHeight: number | undefined;
  isMsgSelected?: boolean;
  setSelectedMsg: (val: messageModal | undefined) => void;
  setSelectedMsgIndex: (val: number | undefined) => void;
  completeMessages: messageModal[];
  index: number;
  onMessageSelect?: (message: messageModal) => void;
}

interface ShowMoreLessProps {
  truncatedText: string;
}

export const MessageView: React.FC<MessageViewProps> = ({
  currentMessage,
  type,
  // coordinates,
  // headerHeight,
  isMsgSelected,
  setSelectedMsg,
  setSelectedMsgIndex,
  completeMessages,
  index,
  onMessageSelect,
}) => {
  const {t} = useTranslation();
  // const [isClicked, setIsClicked] = useState<boolean>(false);
  const {
    isOwn,
    isAttachment,
    message,
    updatedAt,
    messageType,
    isDeleted,
    attachmentUrlDetails,
  } = currentMessage;
  const [messageTypeState, setMessageTypeState] = useState('');
  const [showMore, setShowMore] = useState(false);
  // const setIsClickedFalse = () => {
  //   setIsClicked(false);
  // };

  const menuData: MenuModel[] = [
    {
      name: t('messagePage:addToTask'),
      onClick: () => onMessageSelect?.(currentMessage),
    },
  ];

  useEffect(() => {
    isAttachment && messageType !== 'mp3'
      ? setMessageTypeState(
          attachmentUrlDetails?.url
            ?.substring(attachmentUrlDetails?.url.lastIndexOf('.') + 1)
            .toLowerCase(),
        )
      : setMessageTypeState(messageType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMessage]);

  const MoreLessComponent = ({truncatedText}: ShowMoreLessProps) => {
    return (
      <>
        <TextView
          variant={FontSizes.small}
          style={isAttachment ? styles.text : styles.noAttachmentTextStyle}>
          {truncatedText}
          {/* {truncatedText.length > 50 && (
            <TouchableOpacity onPress={() => setShowMore(!showMore)}>
              <TextView style={styles.seeMoreText}>
                {showMore ? 'See less' : 'See more'}
              </TextView>
            </TouchableOpacity>
          )} */}
          {truncatedText?.length >= 250 && (
            <TextView
              style={styles.seeMoreText}
              onPress={() => setShowMore(!showMore)}>
              {showMore ? ' Read less' : ' Read more'}
            </TextView>
          )}
        </TextView>
      </>
    );
  };

  const RenderDeletedMsg = () => {
    return (
      <View style={styles.deletedMsgView}>
        <TextView variant={FontSizes.small} weight="light">
          {t('messagePage:messageDeleted')}
        </TextView>
      </View>
    );
  };

  const RenderMessageType = () => {
    if (isDeleted) {
      return <RenderDeletedMsg />;
    } else {
      switch (messageTypeState) {
        case 'docx':
        case 'xls':
        case 'xlsx':
          return (
            <DocxMessageView
              currentMessage={currentMessage}
              onLongPress={selectOnLongPress}
            />
          );
        case 'pdf':
          return (
            <PdfMessageView
              currentMessage={currentMessage}
              onLongPress={selectOnLongPress}
            />
          );
        case 'png':
        case 'jpeg':
        case 'jpg':
        case 'gif':
        case 'heic':
          return (
            <ImageMessageView
              currentMessage={currentMessage}
              type={type}
              onLongPress={selectOnLongPress}
            />
          );
        case 'mp3':
          return (
            <AudioMessageView
              currentMessage={currentMessage}
              onLongPress={selectOnLongPress}
            />
          );
        default:
          return (
            <Stack>
              <MoreLessComponent
                truncatedText={showMore ? message : message?.substring(0, 250)}
                // fullText={message}
              />
              {/* <TextView
              variant={FontSizes.small}
              style={isAttachment ? styles.text : styles.noAttachmentTextStyle}>
              {message || ''}
              {showMore && (
                <TextView
                  style={{color: 'blue'}}
                  onPress={() => {
                    //Read more text action
                    setShowMore(!showMore);
                  }}>
                  {!showMore ? 'Read less...' : 'Read more...'}
                </TextView>
              )}
            </TextView> */}
            </Stack>
          );
      }
    }
  };

  const selectOnLongPress = () => {
    if (isMsgSelected) {
      setSelectedMsg(undefined);
      setSelectedMsgIndex(undefined);
    } else {
      setSelectedMsg(currentMessage);
      setSelectedMsgIndex(index);
    }
  };

  const styles = Styles();

  const receiverUser = !isOwn;
  const senderUser = isOwn;
  // const isDocxFile =
  //   isAttachment &&
  //   attachmentUrl?.substring(attachmentUrl?.lastIndexOf('.') + 1) === 'docx';
  const isNotDocxFile =
    isAttachment &&
    attachmentUrlDetails?.url?.substring(
      attachmentUrlDetails?.url.lastIndexOf('.') + 1,
    ) !== 'docx';
  // const isPdfFile =
  //   isAttachment &&
  //   attachmentUrl?.substring(attachmentUrl?.lastIndexOf('.') + 1) === 'pdf';
  // const isAudioFile =
  //   isAttachment &&
  //   attachmentUrl?.substring(attachmentUrl?.lastIndexOf('.') + 1) === 'mp3';
  const isImage = isAttachment
    ? attachmentUrlDetails?.url.substring(
        attachmentUrlDetails?.url.lastIndexOf('.') + 1,
      ) === 'png' ||
      'jpeg' ||
      'jpg' ||
      'gif'
    : false;

  let receiverUserText = [
    styles.textViewRight,
    isImage
      ? styles.imageMargin
      : isNotDocxFile
      ? styles.textMargin
      : undefined,
  ];

  /**
   * @description
   * Check if last message then show date title &
   * if not last then match current message with next message date if different then show date title
   */
  const RenderDate = () => {
    if (
      (index + 1 !== completeMessages.length &&
        completeMessages[index].formattedDate !==
          completeMessages[index + 1].formattedDate) ||
      completeMessages.length === index + 1
    ) {
      const todaysDate = new Date();
      let day = currentMessage.formattedDate;
      if (
        moment(todaysDate).format(DateTimeFormats.MonthSingleDateYear) ===
        currentMessage.formattedDate
      ) {
        day = 'Today';
      } else if (
        moment(todaysDate)
          .subtract(1, 'day')
          .format(DateTimeFormats.MonthSingleDateYear) ===
        currentMessage.formattedDate
      ) {
        day = 'Yesterday';
      }
      return <DateView day={day} />;
    }
    return null;
  };

  const shouldRenderName =
    type === CHAT_TYPE.GROUP
      ? (index + 1 !== completeMessages.length &&
          completeMessages[index]?.senderId !==
            completeMessages[index + 1]?.senderId) ||
        completeMessages.length === index + 1
      : true;

  const RenderName = () => {
    if (shouldRenderName && type === CHAT_TYPE.GROUP) {
      return (
        <View>
          {receiverUser && (
            <TextView
              style={[
                styles.receiverName,
                {
                  color: isMsgSelected ? colors.grey_004 : colors.grey_003,
                },
              ]}
              numberOfLines={1}>
              {currentMessage.senderName}
            </TextView>
          )}
        </View>
      );
    }
    return <></>;
  };

  const receiverMessageView: StyleProp<ViewStyle> = {
    marginLeft: !shouldRenderName ? 48 : 16,
    marginTop: !shouldRenderName ? 0 : type === CHAT_TYPE.GROUP ? 20 : 16,
    marginBottom: !shouldRenderName ? 5 : type === CHAT_TYPE.GROUP ? 5 : 10,
    width: Dimensions.get('screen').width / 1.4,
  };

  const personaTop: StyleProp<ViewStyle> = {
    top: shouldRenderName && type === CHAT_TYPE.GROUP ? -10 : 0,
  };

  return (
    <>
      <RenderDate />
      <View
        style={isMsgSelected ? styles.selectedReceiverMessageView : undefined}>
        <Stack style={receiverUser ? styles.bubble : styles.bubbleRight}>
          {isMsgSelected && !currentMessage.isAttachment ? (
            <PopupMenu
              data={menuData}
              height={50}
              width={125}
              menuTriggerStyle={{width: Dimensions.get('screen').width}}
              onLongPress={() => {
                setSelectedMsg(undefined);
                setSelectedMsgIndex(undefined);
              }}
              RenderView={() => {
                return (
                  <StackItem
                    horizontal
                    childrenGap={10}
                    style={
                      receiverUser
                        ? receiverMessageView
                        : styles.senderMessageView
                    }
                    verticalAlign={senderUser ? 'flex-end' : undefined}>
                    {receiverUser && shouldRenderName && (
                      <View style={personaTop}>
                        <ReceiverPersona
                          currentMessage={currentMessage}
                          type={type}
                        />
                      </View>
                    )}
                    <>
                      <RenderName />
                      <Stack
                        style={
                          receiverUser
                            ? [
                                styles.textViewLeft,
                                {
                                  backgroundColor:
                                    messageTypeState === ''
                                      ? undefined
                                      : colors.white,
                                },
                              ]
                            : receiverUserText
                        }>
                        <RenderMessageType />
                        {/* {isImage ? (
                    <ImageMessageView
                      currentMessage={currentMessage}
                      type={type}
                    />
                  ) : isDocxFile ? (
                    <DocxMessageView currentMessage={currentMessage} />
                  ) : isPdfFile ? (
                    <PdfMessageView currentMessage={currentMessage} />
                  ) : isAudioFile ? (
                    <AudioMessageView currentMessage={currentMessage} />
                  ) : null} */}
                        {/* <TextView
                    variant={FontSizes.small}
                    style={
                      isAttachment ? styles.text : styles.noAttachmentTextStyle
                    }>
                    {message || ''}
                  </TextView> */}
                        {receiverUser &&
                          (!isImage || messageType === 'mp3') && (
                            <Stack
                              horizontal
                              verticalAlign="flex-end"
                              style={styles.timeTick}>
                              <TextView
                                variant={FontSizes.xxSmall}
                                style={
                                  receiverUser
                                    ? styles.leftNameTime
                                    : styles.nameTime
                                }>
                                {/* {moment(props.currentMessage.createdAt).format('hh:mm A')} */}
                                {moment(updatedAt).format(
                                  DateTimeFormats.TimeAMPM,
                                )}
                              </TextView>
                            </Stack>
                          )}

                        {senderUser && (!isImage || messageType === 'mp3') && (
                          <Stack
                            horizontal
                            verticalAlign="flex-end"
                            style={styles.timeTick}>
                            <TextView
                              variant={FontSizes.xxSmall}
                              style={
                                receiverUser
                                  ? styles.leftNameTime
                                  : styles.nameTime
                              }>
                              {/* {moment(props.currentMessage.createdAt).format('hh:mm A')} */}
                              {moment(updatedAt).format(
                                DateTimeFormats.TimeAMPM,
                              )}
                            </TextView>
                            <Icon
                              name="sent_tick"
                              size={18}
                              color={colors.primary_003}
                              style={styles.tickIcon}
                            />
                          </Stack>
                        )}
                      </Stack>
                    </>
                    {senderUser && (
                      <SenderPersona currentMessage={currentMessage} />
                    )}
                  </StackItem>
                );
              }}
              marginTop={receiverUser ? 65 : 55}
              isReceiver={receiverUser}
              // menuStyle={styles.moreIcon}
              menuStyle={{borderWidth: 2, backgroundColor: 'red'}}
            />
          ) : (
            <TouchableOpacity
              onLongPress={selectOnLongPress}
              disabled={isDeleted}>
              <StackItem
                horizontal
                childrenGap={10}
                style={
                  receiverUser ? receiverMessageView : styles.senderMessageView
                }
                verticalAlign={senderUser ? 'flex-end' : undefined}>
                {receiverUser && shouldRenderName && (
                  <View style={personaTop}>
                    <ReceiverPersona
                      currentMessage={currentMessage}
                      type={type}
                    />
                  </View>
                )}
                <>
                  <RenderName />
                  <Stack
                    style={
                      receiverUser
                        ? [
                            styles.textViewLeft,
                            {
                              backgroundColor:
                                messageTypeState === ''
                                  ? undefined
                                  : colors.white,
                            },
                          ]
                        : receiverUserText
                    }>
                    <RenderMessageType />
                    {/* {isImage ? (
                    <ImageMessageView
                      currentMessage={currentMessage}
                      type={type}
                    />
                  ) : isDocxFile ? (
                    <DocxMessageView currentMessage={currentMessage} />
                  ) : isPdfFile ? (
                    <PdfMessageView currentMessage={currentMessage} />
                  ) : isAudioFile ? (
                    <AudioMessageView currentMessage={currentMessage} />
                  ) : null} */}
                    {/* <TextView
                    variant={FontSizes.small}
                    style={
                      isAttachment ? styles.text : styles.noAttachmentTextStyle
                    }>
                    {message || ''}
                  </TextView> */}
                    {receiverUser && (!isImage || messageType === 'mp3') && (
                      <Stack
                        horizontal
                        verticalAlign="flex-end"
                        style={styles.timeTick}>
                        <TextView
                          variant={FontSizes.xxSmall}
                          style={
                            receiverUser ? styles.leftNameTime : styles.nameTime
                          }>
                          {/* {moment(props.currentMessage.createdAt).format('hh:mm A')} */}
                          {moment(updatedAt).format(DateTimeFormats.TimeAMPM)}
                        </TextView>
                      </Stack>
                    )}

                    {senderUser &&
                      (!isImage || messageType === 'mp3' || isDeleted) && (
                        <Stack
                          horizontal
                          verticalAlign="flex-end"
                          style={styles.timeTick}>
                          <TextView
                            variant={FontSizes.xxSmall}
                            style={
                              receiverUser
                                ? styles.leftNameTime
                                : styles.nameTime
                            }>
                            {/* {moment(props.currentMessage.createdAt).format('hh:mm A')} */}
                            {moment(updatedAt).format(DateTimeFormats.TimeAMPM)}
                          </TextView>
                          <Icon
                            name="sent_tick"
                            size={18}
                            color={colors.primary_003}
                            style={styles.tickIcon}
                          />
                        </Stack>
                      )}
                  </Stack>
                </>
                {senderUser && (
                  <SenderPersona currentMessage={currentMessage} />
                )}
              </StackItem>
            </TouchableOpacity>
          )}
        </Stack>
      </View>

      {/* {isClicked && (
        <Modal
          isVisible={isSelected}
          onBackdropPress={() => {
            setIsClickedFalse();
            // onLongPress(false);
          }}>
          <View
            style={
              receiverUser
                ? style(coordinates, headerHeight).leftModal
                : style(coordinates, headerHeight).rightModal
            }>
            <View>
              <StackItem style={styles.modalView}>
                <TouchableOpacity
                  onPress={() => {
                    onMessageSelect?.(currentMessage);
                  }}>
                  <TextView variant={FontSizes.regular} style={styles.shareVia}>
                    {t('messagePage:addToTask')}
                  </TextView>
                </TouchableOpacity>
                <></>
                <Stack spacing={16}>
                  <Divider size={2} />
                </Stack>
                <TouchableOpacity onPress={() => {}}>
                  <TextView variant={FontSizes.regular} style={styles.shareVia}>
                    {t('messagePage:addToSubTask')}
                  </TextView>
                </TouchableOpacity>
              </StackItem>
            </View>
          </View>
        </Modal>
      )} */}
    </>
  );
};

export const style = (
  coordinates: coordinatesProps,
  headerHeight: number | undefined,
) => {
  const shareStyles = StyleSheet.create({
    leftModal: {
      position: 'absolute',
      left: coordinates!.x,
      top: coordinates!.y + coordinates!.height + headerHeight!,
    },
    rightModal: {
      position: 'absolute',
      right: coordinates!.x,
      top: coordinates!.y + coordinates!.height + headerHeight!,
    },
  });
  return shareStyles;
};
