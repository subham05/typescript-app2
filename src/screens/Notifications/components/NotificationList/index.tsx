import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {RefreshControl, StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {NotificationNode} from 'request/Notification';
import {NotificationItem} from '../NotificationItem';

interface NotificationListProps {
  data: NotificationNode[];
  onPress: () => void;
  onPressTask: (item: NotificationNode) => void;
  pageNo?: () => void;
  isLoading: boolean;
  dataLength?: number;
  isSuccess?: boolean;
  onRefresh?: () => void;
  onScrollHandler?: any;
}
export const NotificationList: React.FC<NotificationListProps> = ({
  data,
  onPress,
  onPressTask,
  pageNo,
  isLoading,
  dataLength,
  isSuccess,
  onRefresh,
  onScrollHandler,
}) => {
  console.log('the data-->', data);
  return (
    <Animated.FlatList
      data={data}
      onScroll={onScrollHandler}
      contentContainerStyle={styles().listContainer}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <NotificationItem
            data={item}
            index={index.toString()}
            onPress={onPress}
            onPressTask={onPressTask}
          />
        </View>
      )}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            onRefresh?.();
          }}
        />
      }
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => <FooterComponent isLoading={isLoading} />}
      ListEmptyComponent={() =>
        !dataLength && isSuccess ? <EmptyComponent /> : <></>
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
      marginBottom: 5,
    },
    listContainer: {
      paddingBottom: 15,
    },
  });
  return mergeStyles;
};
