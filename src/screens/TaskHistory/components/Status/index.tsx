import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import EmptyComponent from 'components/EmptyComponent';
import React from 'react';
import {RefreshControl, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {TaskHistory} from 'request/ManageTask';
import {taskHistoryModel} from 'screens/TaskHistory/mockData';
import {Stack} from 'stack-container';
import {Styles} from '../../index.styles';
import {TaskHistoryCard} from '../Card';

interface TaskHistoryStatusProps {
  taskHistoryData: taskHistoryModel[];
  pageNo?: () => void;
  currentData?: TaskHistory;
  isSuccess?: boolean;
  dataLength?: number;
  onScrollHandler?: any;
  onRefresh?: () => void;
}
export const TaskHistoryStatus: React.FC<TaskHistoryStatusProps> = ({
  taskHistoryData,
  pageNo,
  currentData,
  isSuccess,
  dataLength,
  onScrollHandler,
  onRefresh,
}) => {
  const styles = Styles();
  return (
    <Stack spacing={16}>
      <Animated.FlatList
        data={taskHistoryData}
        onScroll={onScrollHandler}
        contentContainerStyle={styles.HistoryContainerStyle}
        ListHeaderComponent={() => {
          return <TaskHistoryCard taskProps={currentData!} />;
        }}
        renderItem={({item, index}) => {
          const verticalInlineStyle = {
            height: index + 1 === taskHistoryData.length ? 0 : 100,
          };
          return (
            <Stack key={index.toString()}>
              <TextView
                weight="regular"
                variant={FontSizes.xSmall}
                style={styles.day}>
                {item.day}
              </TextView>
              {item.data?.map((dataItem, dataIndex) => {
                const childVerticalStyle = {
                  height: dataIndex + 1 === item.data.length ? 0 : 24,
                };
                return (
                  <Stack key={dataIndex.toString()}>
                    <Stack
                      horizontal
                      verticalAlign="center"
                      style={[styles.status]}>
                      <Stack horizontal style={styles.timeStyle}>
                        <TextView weight="regular" variant={FontSizes.xxSmall}>
                          {dataItem.time}
                        </TextView>
                      </Stack>
                      <View style={styles.circle} />
                      <TextView weight="regular" variant={FontSizes.regular}>
                        {dataItem.status}
                      </TextView>
                    </Stack>
                    <Stack style={[styles.verticalLine, childVerticalStyle]} />
                  </Stack>
                );
              })}
              <Stack style={[styles.verticalLine, verticalInlineStyle]} />
            </Stack>
          );
        }}
        onEndReached={() => {
          console.log('reaching end');
          pageNo?.();
        }}
        ListEmptyComponent={() =>
          !dataLength && isSuccess ? <EmptyComponent /> : <></>
        }
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              onRefresh?.();
            }}
          />
        }
      />
      {/* {taskHistoryData.map((item, index) => {
        const verticalInlineStyle = {
          height: index + 1 === taskHistoryData.length ? 0 : 100,
        };
        return (
          <Stack key={index.toString()}>
            <TextView
              weight="regular"
              variant={FontSizes.xSmall}
              style={styles.day}>
              {item.day}
            </TextView>
            {item.data?.map((dataItem, dataIndex) => {
              const childVerticalStyle = {
                height: dataIndex + 1 === item.data.length ? 0 : 24,
              };
              return (
                <Stack key={dataIndex.toString()}>
                  <Stack
                    horizontal
                    verticalAlign="center"
                    style={[styles.status]}>
                    <Stack horizontal style={styles.timeStyle}>
                      <TextView weight="regular" variant={FontSizes.xxSmall}>
                        {dataItem.time}
                      </TextView>
                    </Stack>
                    <View style={styles.circle} />
                    <TextView weight="regular" variant={FontSizes.regular}>
                      {dataItem.status}
                    </TextView>
                  </Stack>
                  <Stack style={[styles.verticalLine, childVerticalStyle]} />
                </Stack>
              );
            })}
            <Stack style={[styles.verticalLine, verticalInlineStyle]} />
          </Stack>
        );
      })} */}
    </Stack>
  );
};
