import EmptyComponent from 'components/EmptyComponent';
import React from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {attendanceReportData} from 'request/AttendanceReport/types';
import {AttendanceReportItem} from '../AttendanceItem';
import {respHeight} from 'screens/Calendar/utils/responsive';
import {Moment} from 'moment';

interface AttendanceReportListProps {
  data: attendanceReportData[];
  currentDate?: {date: string | undefined};
  isDisabled: boolean;
  isLoading: boolean;
  onLeaveApply: (val: string) => void;
  selectedDate: Moment;
  scrollHandler?:
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | Animated.Node<
        ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined
      >
    | undefined;
}
export const AttendanceReportList: React.FC<AttendanceReportListProps> = ({
  data,
  currentDate,
  isDisabled,
  isLoading,
  scrollHandler,
  onLeaveApply,
  selectedDate,
}) => {
  return (
    <Animated.FlatList
      data={data}
      onScroll={scrollHandler}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <AttendanceReportItem
            data={item}
            currentDate={currentDate}
            isDisabled={isDisabled}
            onLeaveApply={onLeaveApply}
            selectedDate={selectedDate}
          />
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => {
        return !isLoading ? <View style={styles().bottomPadding} /> : <></>;
      }}
      ListEmptyComponent={() => {
        return <EmptyComponent isVisible={!isLoading} />;
      }}
    />
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 10,
    },
    bottomPadding: {
      marginBottom: respHeight(200),
    },
  });
  return mergeStyles;
};
