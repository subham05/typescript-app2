import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {Dimensions, RefreshControl, StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {chatModal} from 'request/Message/constants';
import {MessagesItem} from '../MessagesItem';

interface MessagesViewProps {
  data: chatModal[];
  type: string;
  onPress?: (item: chatModal) => void;
  viewContact?: boolean;
  // commonGroup?: boolean;
  refreshing?: boolean;
  isLoading?: boolean;
  pageNo?: number;
  getRefresh?: () => void;
  onEndReach?: () => void;
  onScrollHandler?: any;
  chatListLength?: number;
}
export const MessagesView: React.FC<MessagesViewProps> = ({
  data,
  type,
  onPress,
  onEndReach,
  getRefresh,
  refreshing,
  isLoading,
  viewContact,
  // commonGroup,
  onScrollHandler,
  chatListLength,
  pageNo = 1,
}) => {
  return (
    <Animated.FlatList
      data={data}
      onScroll={onScrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles().messageContainer}
      // contentContainerStyle={styles().listBottom}
      renderItem={({item, index}) => {
        return (
          <View key={index} style={styles().container}>
            <MessagesItem
              item={item}
              type={type}
              onPress={onPress}
              viewContact={viewContact}
              // commonGroup={commonGroup}
            />
          </View>
        );
      }}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => {
        return pageNo > 1 ? <FooterComponent isLoading={isLoading} /> : <></>;
      }}
      ListEmptyComponent={() =>
        !chatListLength && !isLoading ? <EmptyComponent /> : <></>
      }
      onEndReached={() => onEndReach?.()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing!}
          onRefresh={() => getRefresh?.()}
        />
      }
    />
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      paddingBottom: 10,
    },
    messageContainer: {
      paddingBottom: Dimensions.get('screen').height / 20,
    },
  });
  return mergeStyles;
};
