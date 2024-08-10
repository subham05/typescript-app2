import {colors} from 'common/theme/colors';
import {globalScreenHeight} from 'common/utils/ScreenDimensions';
import EmptyComponent from 'components/EmptyComponent';
import {ReportItem} from 'components/Report/ReportItem';
import {TextView} from 'components/TextView';
import React from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {workloadListNodes} from 'request/WorkloadReport/types';
import {respHeight} from 'screens/Calendar/utils/responsive';
import {pageInfo} from 'screens/Contacts';

interface ReportListProps {
  data: workloadListNodes[];
  onPress?: (item: workloadListNodes) => void;
  workload?: boolean;
  onNextClick?: () => void;
  isLoading?: boolean;
  pages?: pageInfo;
  scrollHandler?:
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | Animated.Node<
        ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined
      >
    | undefined;
}
export const ReportList: React.FC<ReportListProps> = ({
  data,
  onPress,
  workload,
  onNextClick,
  scrollHandler,
  isLoading,
  pages,
}) => {
  return (
    <Animated.FlatList
      data={data}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <ReportItem data={item} onPress={onPress} workload={workload} />
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => {
        return (
          <>
            {pages?.hasNextPage && !isLoading && (
              <TouchableOpacity onPress={onNextClick} style={styles().moreView}>
                <TextView style={{color: colors.primary}}>View more</TextView>
              </TouchableOpacity>
            )}

            <View style={styles().bottomPadding} />
          </>
        );
      }}
      ListEmptyComponent={() => (
        <EmptyComponent
          isVisible={!isLoading && !data.length}
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
      marginBottom: respHeight(500),
    },
    emptyComponent: {
      alignItems: 'center',
      height: globalScreenHeight / 3.5,
      justifyContent: 'center',
    },
    moreView: {
      alignSelf: 'center',
    },
  });
  return mergeStyles;
};
