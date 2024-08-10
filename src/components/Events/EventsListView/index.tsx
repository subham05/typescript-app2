import {FontSizes} from 'common/theme/font';
import {globalScreenWidth} from 'common/utils/ScreenDimensions';
import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';
import {TextView} from 'components/TextView';
import React, {useState} from 'react';
import {RefreshControl, StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {TodaysEvent} from 'request/Dashboard';
import {EventItem} from '../EventItem';

interface EventListViewProps {
  data: TodaysEvent[] | undefined;
  horizontal?: boolean | undefined;
  onPress?: (item: TodaysEvent | undefined) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  onReachEnd?: () => void;
  pageNo?: number;
  disableRefresh?: boolean;
  scrollHandler?: any;
}
export const EventListView: React.FC<EventListViewProps> = ({
  data,
  horizontal,
  onPress,
  isLoading,
  onReachEnd,
  pageNo,
  onRefresh,
  disableRefresh = false,
  scrollHandler,
}) => {
  const [visibleCount, setVisibleCount] = useState<boolean[]>([]);
  const ListEmptyComponent = () => <EmptyComponent isVisible={!data?.length} />;
  const ListEmptyComponentDashboard = () => (
    <TextView
      variant={FontSizes.medium}
      weight={'semibold'}
      style={
        !visibleCount.includes(false) && horizontal && data?.length
          ? styles(horizontal).emptyComponentWithData
          : styles(horizontal).emptyComponent
      }>
      No events found
    </TextView>
  );
  return (
    <View>
      <Animated.FlatList
        data={horizontal ? data?.slice(0, 5) : data}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal={horizontal ? true : false}
        renderItem={({item, index}) => {
          visibleCount.push(item?.isPassed);
          setVisibleCount(visibleCount);
          return (
            <View key={index} style={styles(horizontal).container}>
              <EventItem
                item={item}
                onPress={onPress!}
                horizontal={horizontal}
              />
            </View>
          );
        }}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={() => {
          return (
            <>
              {!horizontal ? (
                <FooterComponent isLoading={pageNo! > 1 ? isLoading : false} />
              ) : undefined}
            </>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              onRefresh?.();
            }}
            enabled={!disableRefresh}
          />
        }
        ListEmptyComponent={() => {
          return horizontal ? (
            <ListEmptyComponentDashboard />
          ) : (
            <ListEmptyComponent />
          );
        }}
        onEndReached={() => {
          onReachEnd?.();
        }}
        onEndReachedThreshold={0.2}
      />
      {!visibleCount.includes(false) && horizontal && !!data?.length && (
        <ListEmptyComponentDashboard />
      )}
    </View>
  );
};

const styles = (horizontal: boolean | undefined) => {
  const mergeStyles = StyleSheet.create({
    container: !horizontal
      ? {
          marginBottom: 10,
        }
      : {
          paddingRight: 20,
        },
    emptyComponent: {
      paddingTop: 30,
      textAlign: 'center',
      paddingLeft: globalScreenWidth / 3.5,
    },
    emptyComponentWithData: {
      paddingTop: 30,
      textAlign: 'center',
    },
  });
  return mergeStyles;
};
