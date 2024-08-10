import EmptyComponent from 'components/EmptyComponent';
import React from 'react';
import {RefreshControl, StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {inviteList} from 'request/Message/constants';
import {GroupAddMembersItem} from '../GroupAddMembersItem';
import {FooterComponent} from 'components/FooterComponent';

interface GroupAddMembersProps {
  data: inviteList[];
  onPress: (item: inviteList) => void;
  selectedMemberArray: inviteList[];
  onScrollHandler?: any;
  refreshing?: boolean;
  isLoading?: boolean;
  pageNo?: () => void;
  getRefresh?: () => void;
  currentPageNo?: number;
}
export const GroupAddMembersList: React.FC<GroupAddMembersProps> = ({
  data,
  onPress,
  selectedMemberArray,
  onScrollHandler,
  getRefresh,
  isLoading,
  refreshing,
  pageNo,
  currentPageNo,
}) => {
  return (
    <Animated.FlatList
      scrollEventThrottle={16}
      onScroll={onScrollHandler}
      showsVerticalScrollIndicator={false}
      data={data}
      contentContainerStyle={styles().contentContainer}
      renderItem={({item, index}) => {
        const selected =
          selectedMemberArray.findIndex(row => row._id === item._id) !== -1;
        return (
          <View key={index} style={styles().container}>
            <GroupAddMembersItem
              index={index}
              item={item}
              onPress={onPress}
              selected={selected}
            />
          </View>
        );
      }}
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={() => (!isLoading ? <EmptyComponent /> : null)}
      ListFooterComponent={() => (
        <View style={styles().spacing}>
          {currentPageNo && currentPageNo > 1 && (
            <FooterComponent isLoading={isLoading} size={10} />
          )}
        </View>
      )}
      onEndReached={() => {
        pageNo?.();
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing!}
          onRefresh={() => getRefresh?.()}
        />
      }
    />
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    contentContainer: {
      paddingBottom: 110,
    },
    spacing: {
      paddingVertical: 10,
    },
  });
  return mergeStyles;
};
