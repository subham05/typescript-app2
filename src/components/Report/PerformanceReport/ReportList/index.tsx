import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {StyleSheet, View, RefreshControl} from 'react-native';
import Animated from 'react-native-reanimated';
import {ReportItem, ReportProps} from '../ReportItem';

interface PerformanceReportListProps {
  data: ReportProps[];
  onPress?: (item: ReportProps) => void;
  workload?: boolean;
  pageNo?: () => void;
  dataLength?: number;
  isSuccess?: boolean;
  onScrollHandler?: any;
  onRefresh?: () => void;
  isLoading?: boolean;
}
export const PerformanceReportList: React.FC<PerformanceReportListProps> = ({
  data,
  onPress,
  workload,
  pageNo,
  dataLength,
  isSuccess,
  onScrollHandler,
  isLoading,
  onRefresh,
}) => {
  const ListEmptyComponent = () => (
    <EmptyComponent isVisible={!dataLength && isSuccess} />
  );
  return (
    <Animated.FlatList
      data={data}
      onScroll={onScrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles().listBottom}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <ReportItem data={item} onPress={onPress} workload={workload} />
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            onRefresh?.();
          }}
        />
      }
      ListFooterComponent={() => <FooterComponent isLoading={isLoading} />}
      onEndReached={() => {
        pageNo?.();
      }}
      ListEmptyComponent={ListEmptyComponent}
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
    listBottom: {
      paddingBottom: 50,
    },
  });
  return mergeStyles;
};
