import EmptyComponent from 'components/EmptyComponent';
import Loader from 'components/Loader';
import {t} from 'i18next';
import React from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {activityLogsObjModal} from 'request/ActivityLogs';
import {ActivityLogItem} from '../ActivityLogItem';

interface ActivityLogListProps {
  data: activityLogsObjModal[];
  onEndReach?: () => void;
  getRefresh?: () => void;
  loading: boolean;
  refresh: boolean;
  pageNo: number;
  searchText: number;
}
export const ActivityLogList: React.FC<ActivityLogListProps> = ({
  data,
  onEndReach,
  getRefresh,
  loading,
  refresh,
  pageNo,
  searchText,
}) => {
  return pageNo === 1 && loading && searchText <= 0 && !refresh ? (
    <Loader />
  ) : data.length > 0 ? (
    <FlatList
      data={data}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <ActivityLogItem data={item} />
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() =>
        pageNo > 1 && loading ? <Loader isFooterLoader /> : null
      }
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={() => getRefresh?.()} />
      }
      onEndReached={() => onEndReach?.()}
    />
  ) : (
    <EmptyComponent message={t('activityLogs:noLogFound')} />
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 10,
    },
  });
  return mergeStyles;
};
