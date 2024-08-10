// import {FooterComponent} from 'components/FooterComponent';
import EmptyComponent from 'components/EmptyComponent';
import Loader from 'components/Loader';
import React from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {managerListNode} from 'request/AddManager/constant';
import {Stack} from 'stack-container';
import {ContactMembersItem} from '../ContactMembersItem';

interface ContactMembersListProps {
  data: managerListNode[];
  onPress: (data: managerListNode) => void;
  getRefresh: (isRefresh: boolean) => void;
  isLoading: boolean;
  isFetching: boolean;
  refreshing: boolean;
  pageNo: number;
  searchText: number;
}
export const ContactMembersList: React.FC<ContactMembersListProps> = ({
  data,
  isLoading,
  isFetching,
  refreshing,
  pageNo,
  onPress,
  getRefresh,
  searchText,
}) => {
  return isLoading &&
    pageNo === 1 &&
    !searchText &&
    !refreshing &&
    isFetching ? (
    <Loader />
  ) : data.length > 0 ? (
    <Stack spaceBelow={150}>
      <FlatList
        data={data}
        renderItem={({item, index}) => (
          <View key={index} style={styles().container}>
            <ContactMembersItem item={item} onPress={onPress} />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={() => getRefresh(false)}
        // onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => getRefresh(true)}
          />
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() =>
          isFetching && pageNo > 1 ? <Loader isFooterLoader /> : null
        }
      />
    </Stack>
  ) : (
    <Stack style={styles().emptyCompoHeight}>
      <EmptyComponent />
    </Stack>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    emptyCompoHeight: {height: Dimensions.get('screen').height},
  });
  return mergeStyles;
};
