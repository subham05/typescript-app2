import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MessageContactItem} from '../MessageContactItem';
import {chatInviteeModal} from 'request/Message';
import EmptyComponent from 'components/EmptyComponent';
import Animated from 'react-native-reanimated';
import {RefreshControl} from 'react-native';
import {FooterComponent} from 'components/FooterComponent';

interface MessageContactListProps {
  data: chatInviteeModal[];
  onPress: (item: chatInviteeModal) => void;
  pageNo?: () => void;
  currentPageNo?: number;
  isLoading?: boolean;
  onScrollHandler?: any;
  onRefresh?: () => void;
}
export const MessageContactList: React.FC<MessageContactListProps> = ({
  data,
  onPress,
  currentPageNo,
  pageNo,
  isLoading,
  onScrollHandler,
  onRefresh,
}) => {
  return (
    <Animated.FlatList
      onScroll={onScrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={styles().listBottom}
      data={data}
      renderItem={({item, index}) => {
        return (
          <View key={index} style={styles().container}>
            <MessageContactItem item={item} onPress={onPress} />
          </View>
        );
      }}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            onRefresh?.();
          }}
        />
      }
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={() =>
        data.length <= 0 && !isLoading ? <EmptyComponent /> : <></>
      }
      ListFooterComponent={() =>
        currentPageNo && currentPageNo > 1 ? (
          <FooterComponent isLoading={isLoading} />
        ) : null
      }
      onEndReached={() => {
        pageNo?.();
      }}
    />
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    listBottom: {
      paddingBottom: 100,
    },
  });
  return mergeStyles;
};
