import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {ResourceMembersItem} from '../ResourceMemberItem';
import {selectMember} from 'request/Calendar';
import EmptyComponent from 'components/EmptyComponent';

interface ResourceMembersListProps {
  data: selectMember[];
  onPress: (value: selectMember) => void;
  onRefresh?: () => void;
  setPageNo?: () => void;
  isLoading: boolean;
  isRefresh?: boolean;
  pageNumber: number;
  dataLength?: number;
  isSuccess?: boolean;
}
export const ResourceMembersList: React.FC<ResourceMembersListProps> = ({
  data,
  isLoading,
  // pageNumber,
  isRefresh,
  onPress,
  onRefresh,
  setPageNo,
  dataLength,
  isSuccess,
}) => {
  return (
    <FlatList
      data={data}
      renderItem={({item}) => (
        <ResourceMembersItem item={item} onPress={onPress} />
      )}
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={() => <FooterComponent isLoading={isLoading} />}
      refreshControl={
        <RefreshControl
          refreshing={isRefresh!}
          onRefresh={() => {
            onRefresh?.();
          }}
        />
      }
      ListEmptyComponent={() =>
        !dataLength && isSuccess ? <EmptyComponent /> : <></>
      }
      onEndReached={() => setPageNo?.()}
    />
  );
};
