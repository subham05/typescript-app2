import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {attendanceListData} from 'request/AttendanceReport/types';
import {AttendanceItem} from '../AttendanceItem';
import {respHeight} from 'screens/Calendar/utils/responsive';
import EmptyComponent from 'components/EmptyComponent';

interface AttendanceListProps {
  data: attendanceListData[];
  onPress?: (item: attendanceListData) => void;
  scrollHandler?:
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | Animated.Node<
        ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined
      >
    | undefined;
  onEndReached?: () => void;
  isLoading: boolean;
  pageNumber: number;
  onRefresh?: () => void;
}
export const AttendanceList: React.FC<AttendanceListProps> = ({
  data,
  onPress,
  scrollHandler,
  onEndReached,
  isLoading,
  pageNumber,
  onRefresh,
}) => {
  return (
    <Animated.FlatList
      data={data}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <AttendanceItem data={item} onPress={onPress} />
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => (
        <View style={{paddingBottom: respHeight(190)}}>
          {pageNumber && pageNumber > 1 && (
            <FooterComponent isLoading={isLoading} size={30} />
          )}
        </View>
      )}
      ListEmptyComponent={() => <EmptyComponent isVisible={!isLoading} />}
      onEndReached={onEndReached}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={() => onRefresh?.()} />
      }
    />
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 10,
    },
    bottomPadding: {
      marginBottom: 200,
    },
  });
  return mergeStyles;
};
