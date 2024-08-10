import {globalScreenHeight} from 'common/utils/ScreenDimensions';
import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {StaffListNode} from 'request/StaffReport/types';
import {workloadListNodes} from 'request/WorkloadReport/types';
import {respHeight} from 'screens/Calendar/utils/responsive';
import {StaffReportItem} from '../StaffReportItem';

interface StaffReportListProps {
  data: StaffListNode[];
  onPress?: (item: workloadListNodes) => void;
  workload?: boolean;
  onEndReached?: () => void;
  isLoading?: boolean;
  pageNo?: number;
  scrollHandler?:
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | Animated.Node<
        ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined
      >
    | undefined;
}
export const StaffReportList: React.FC<StaffReportListProps> = ({
  data,
  onPress,
  workload,
  onEndReached,
  scrollHandler,
  isLoading,
  pageNo,
}) => {
  return (
    <Animated.FlatList
      data={data}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <StaffReportItem data={item} onPress={onPress} workload={workload} />
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      onEndReached={onEndReached}
      ListFooterComponent={() => {
        return (
          <>
            {pageNo !== 1 && <FooterComponent isLoading={isLoading} />}
            <View style={{paddingBottom: respHeight(50)}} />
          </>
        );
      }}
      ListEmptyComponent={() => (
        <EmptyComponent
          isVisible={!isLoading}
          containerStyle={styles().emptyComponent}
        />
      )}
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
    emptyComponent: {
      alignItems: 'center',
      height: globalScreenHeight / 1.5,
      justifyContent: 'center',
    },
  });
  return mergeStyles;
};
