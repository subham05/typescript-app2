import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';
import {MembersItem, membersProps} from 'components/Members/MembersItem';
import React from 'react';
import {RefreshControl} from 'react-native';
import Animated from 'react-native-reanimated';
import {InviteeUserData} from 'request/Calendar';

interface MembersListProps {
  data: InviteeUserData[] | membersProps[];
  showCheckBox?: boolean;
  isAllSelected?: boolean;
  onSelect?: (value: boolean) => void;
  selection?: boolean;
  isEmail?: boolean;
  dataLength?: number;
  isLoading?: boolean;
  setPageNo?: () => void;
  onRefresh?: () => void;
  onInviteeSelect?: (value: string | number) => void;
  onScrollHandler?: any;
  inviteeSelected?: Set<string | number>;
  search?: string;
  isShare?: boolean;
  userId?: string;
  showCrossIcon?: boolean;
}
export const MembersList: React.FC<MembersListProps> = ({
  data,
  showCheckBox,
  isAllSelected,
  onSelect,
  selection,
  isEmail,
  dataLength,
  isLoading,
  setPageNo,
  onRefresh,
  onInviteeSelect,
  inviteeSelected,
  onScrollHandler,
  // search,
  isShare,
  userId,
  showCrossIcon,
}) => {
  const ListEmptyComponent = () => <EmptyComponent isVisible={!dataLength} />;
  return data.length > 0 ? (
    <Animated.FlatList
      data={data}
      onScroll={onScrollHandler}
      renderItem={({item}) => {
        return item._id !== userId ? (
          <MembersItem
            item={item}
            showCheckBox={showCheckBox}
            isAllSelected={isAllSelected!}
            selectedMember={inviteeSelected!}
            isShare={isShare}
            onPress={itemm => {
              onInviteeSelect?.(itemm._id);
            }}
            onSelect={onSelect!}
            selection={selection}
            isEmail={isEmail}
            showCrossIcon={showCrossIcon}
          />
        ) : null;
      }}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => <FooterComponent isLoading={isLoading} />}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            onRefresh?.();
          }}
        />
      }
      ListEmptyComponent={ListEmptyComponent}
      onEndReached={() => setPageNo?.()}
      onEndReachedThreshold={0.2}
    />
  ) : (
    !isLoading && <EmptyComponent />
  );
};
