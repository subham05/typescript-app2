import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';
import {Stack} from 'components/Stack';
import React from 'react';
import {RefreshControl, StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {respHeight} from 'screens/Calendar/utils/responsive';
import {ReallocationTaskItem, TaskInterface} from '../TaskItem';

interface TaskListViewProps {
  data: TaskInterface[] | undefined;
  onPress?: (item: TaskInterface) => void;
  minimal?: boolean;
  vendors?: boolean;
  inProgress?: boolean;
  manage?: boolean;
  notShowAssignee?: boolean;
  staffTasks?: boolean;
  pageNo?: () => void;
  isLoading?: boolean;
  isSuccess?: boolean;
  isUninitialized?: boolean;
  dataLength?: number;
  onRefresh?: () => void;
  fromMail?: boolean;
  onScrollHandler?: any;
  pageNumber?: number;
}

export const ReallocationTaskListView: React.FC<TaskListViewProps> = ({
  data,
  onPress,
  minimal,
  vendors,
  inProgress,
  manage,
  notShowAssignee,
  pageNo,
  isLoading,
  isSuccess,
  dataLength,
  onScrollHandler,
  pageNumber,
  onRefresh,
  // isUninitialized,
}) => {
  const ListEmptyComponent = () => (
    <EmptyComponent isVisible={!dataLength && isSuccess} />
  );
  return (
    <>
      <Animated.FlatList
        data={data}
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <Stack spaceBelow={20}>
            <ReallocationTaskItem
              key={index}
              item={item}
              onPress={onPress!}
              index={index}
              minimal={minimal}
              vendors={vendors}
              inProgress={inProgress}
              manage={manage}
              notShowAssignee={notShowAssignee}
            />
          </Stack>
        )}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              onRefresh?.();
            }}
            enabled={!!onRefresh}
          />
        }
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={() => (
          <View style={styles.spacing}>
            {pageNumber! > 1 && (
              <FooterComponent isLoading={isLoading} size={10} />
            )}
          </View>
        )}
        ListEmptyComponent={ListEmptyComponent}
        onEndReached={() => {
          pageNo?.();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  spacing: {
    marginBottom: respHeight(350),
    paddingVertical: 10,
  },
});
