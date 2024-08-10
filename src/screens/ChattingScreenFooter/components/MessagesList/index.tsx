import React from 'react';
import {FlatList, LayoutChangeEvent} from 'react-native';
import {MessageView} from '../MessageView';
import {Stack} from 'components/Stack';
import {messageModal} from 'request/Message/constants';
import {coordinatesProps} from 'screens/ChattingScreenFooter';
import {Styles} from 'screens/ChattingScreenFooter/index.styles';
interface MessagesListModal {
  messages: messageModal[];
  setXCoordinates?: (value: coordinatesProps) => void;
  xCoordinate?: coordinatesProps[];
  type?: string;
  headerHeight?: number;
  selectedMsg?: messageModal;
  setSelectedMsg: (val: messageModal | undefined) => void;
  setSelectedMsgIndex: (val: number | undefined) => void;
  onEndReached?: () => void;
  onMessageSelect?: (message: messageModal) => void;
}
const MessagesList: React.FC<MessagesListModal> = ({
  messages,
  setXCoordinates,
  xCoordinate,
  type,
  headerHeight,
  selectedMsg,
  setSelectedMsg,
  setSelectedMsgIndex,
  onEndReached,
  onMessageSelect,
}) => {
  const styles = Styles();
  return (
    <FlatList
      data={messages}
      contentContainerStyle={styles.flatlistStyle}
      inverted
      onEndReached={onEndReached}
      renderItem={({item, index}) => {
        const onLayout = (event: LayoutChangeEvent) => {
          const {x, y, height} = event.nativeEvent.layout;
          // xCoordinate.push({x: x, y: y, height: height});
          setXCoordinates?.({x: x, y: y, height: height});
        };
        return (
          <Stack key={index.toString()} onLayout={onLayout}>
            <MessageView
              currentMessage={item}
              type={type}
              coordinates={xCoordinate![index]}
              headerHeight={headerHeight}
              isMsgSelected={selectedMsg?._id === item._id ? true : false}
              setSelectedMsg={setSelectedMsg}
              setSelectedMsgIndex={setSelectedMsgIndex}
              completeMessages={messages}
              index={index}
              onMessageSelect={onMessageSelect}
            />
          </Stack>
        );
      }}
    />
  );
};
export default MessagesList;
