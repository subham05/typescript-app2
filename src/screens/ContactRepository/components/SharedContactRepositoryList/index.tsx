import EmptyComponent from 'components/EmptyComponent';
import Loader from 'components/Loader';
import React from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {shareContactData} from 'screens/CreateContact/types';
import {Stack} from 'stack-container';
import {SharedContactRepositoryItem} from '../SharedContactRepositoryItem';

interface SharedContactRepositoryProps {
  data: shareContactData[];
  pageNo: number;
  isLoading: boolean;
  refreshing: boolean;
  SharedContactDetailsNavigation: (id?: string) => void;
  onEndReach?: () => void;
  getRefresh?: () => void;
}
export const SharedContactRepositoryList: React.FC<
  SharedContactRepositoryProps
> = ({
  data,
  pageNo,
  isLoading,
  // refreshing,
  SharedContactDetailsNavigation,
  onEndReach,
  // getRefresh,
}) => {
  return data?.length > 0 ? (
    <Stack spaceBelow={30}>
      <FlatList
        data={data}
        contentContainerStyle={styles().bottomSpace}
        ListHeaderComponent={() => <View style={styles().header} />}
        renderItem={({item, index}) => (
          <View key={index} style={styles().container}>
            <SharedContactRepositoryItem
              item={item}
              SharedContactDetails={SharedContactDetailsNavigation}
            />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() =>
          pageNo > 1 && isLoading ? <Loader isFooterLoader /> : null
        }
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={getRefresh} />
        // }
        onEndReached={() => onEndReach?.()}
      />
    </Stack>
  ) : isLoading && pageNo <= 1 ? (
    <Loader />
  ) : (
    <EmptyComponent />
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    header: {height: 16},
    bottomSpace: {
      paddingBottom: Dimensions.get('screen').height / 5,
    },
  });
  return mergeStyles;
};
