import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {MailItem} from '../MailItem';
import {emailListDataModal} from 'request/Inbox';
import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';

interface MailListViewProps {
  data: emailListDataModal[];
  onPress?: (value: emailListDataModal) => void;
  onLongPress?: (val: emailListDataModal) => void;
  isSelected?: boolean;
  isRefresh?: boolean;
  isLoading?: boolean;
  selectedView?: string;
  onRefresh?: () => void;
  onEndReach?: () => void;
}
export const MailListView: React.FC<MailListViewProps> = ({
  data,
  onPress,
  onLongPress,
  onRefresh,
  onEndReach,
  isSelected,
  isRefresh,
  isLoading,
  selectedView,
}) => {
  return data.length > 0 ? (
    <FlatList
      data={data}
      renderItem={({item, index}) => (
        <MailItem
          item={item}
          index={index}
          onPress={onPress}
          isSelectedVal={isSelected}
          selectedView={selectedView}
          onLongPress={val => onLongPress?.(val)}
        />
      )}
      ListFooterComponent={() => (
        <FooterComponent isLoading={isLoading && data?.length > 9} size={50} />
      )}
      keyExtractor={(_, index) => index.toString()}
      refreshControl={
        <RefreshControl
          refreshing={isRefresh!}
          onRefresh={() => onRefresh?.()}
        />
      }
      onEndReached={() => onEndReach?.()}
    />
  ) : !isLoading ? (
    <EmptyComponent />
  ) : null;
};
