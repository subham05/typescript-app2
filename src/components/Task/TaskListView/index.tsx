import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';
import {Stack} from 'components/Stack';
import React from 'react';
import {
  RefreshControl,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {respHeight} from 'screens/Calendar/utils/responsive';
import {TaskInterface, TaskItem} from '../TaskItem';
import {TextView} from 'components/TextView';
import {FontSizes} from 'common/theme/font';

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
  dashboard?: boolean;
  customFooterStyle?: ViewStyle;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  data,
  onPress,
  minimal,
  vendors,
  inProgress,
  manage,
  notShowAssignee,
  staffTasks,
  pageNo,
  // hasPage,
  isLoading,
  isSuccess,
  dataLength,
  onRefresh,
  fromMail,
  onScrollHandler,
  pageNumber,
  dashboard,
  customFooterStyle,
  // isUninitialized,
}) => {
  const ListEmptyComponent = () =>
    dashboard ? (
      <TextView
        variant={FontSizes.medium}
        weight={'semibold'}
        style={styles.emptyComponent}>
        No task found
      </TextView>
    ) : (
      <EmptyComponent isVisible={!dataLength && isSuccess} />
    );

  const footerStyle: StyleProp<ViewStyle> = {
    marginBottom: respHeight(100),
  };
  return (
    <>
      <Animated.FlatList
        data={data}
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <Stack spaceBelow={20}>
            <TaskItem
              key={index}
              item={item}
              fromMail={fromMail}
              onPress={onPress!}
              index={index}
              minimal={minimal}
              vendors={vendors}
              inProgress={inProgress}
              manage={manage}
              notShowAssignee={notShowAssignee}
              staffTasks={staffTasks}
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
        // refreshing={refreshing}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={() => (
          <View
            style={[!dashboard ? footerStyle : undefined, customFooterStyle]}>
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
  emptyComponent: {paddingTop: 30, textAlign: 'center'},
});
