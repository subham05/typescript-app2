import EmptyComponent from 'components/EmptyComponent';
import Loader from 'components/Loader';
import {t} from 'i18next';
import React from 'react';
import {RefreshControl, StyleSheet, View} from 'react-native';
import {accessLogsObjModal} from 'request/AccessLogs';
import {AccessLogsItem} from '../AccessLogsItem';
import Animated from 'react-native-reanimated';

interface AccessLogsListProps {
  data: accessLogsObjModal[];
  isLoading: boolean;
  refresh: boolean;
  pageNo: number;
  onEndReach?: () => void;
  getRefresh?: () => void;
  onScrollHandler?: any;
}
export const AccessLogsList: React.FC<AccessLogsListProps> = ({
  data,
  isLoading,
  refresh,
  pageNo,
  onEndReach,
  getRefresh,
  onScrollHandler,
}) => {
  return data?.length > 0 ? (
    <Animated.FlatList
      onScroll={onScrollHandler}
      scrollEventThrottle={16}
      data={data}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <AccessLogsItem data={item} />
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      onEndReached={() => onEndReach?.()}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={() => getRefresh?.()} />
      }
      ListFooterComponent={() =>
        pageNo > 1 && isLoading ? <Loader isFooterLoader /> : null
      }
    />
  ) : isLoading && pageNo === 1 && !refresh ? (
    <Loader />
  ) : (
    <EmptyComponent message={t('document:noAccessLogsMsg')} />
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
  });
  return mergeStyles;
};
