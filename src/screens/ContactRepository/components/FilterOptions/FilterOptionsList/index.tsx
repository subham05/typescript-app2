import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import EmptyComponent from 'components/EmptyComponent';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import React from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {FilterModal} from 'screens/Contacts';
import FilterOptionsItem from '../FilterOptionsItem';

interface FilterOptionsList {
  data: FilterModal[];
  refreshing: boolean;
  getRefresh: () => void;
  isFetching: boolean;
  hideBusinessCard?: boolean;
  pageCount: number;
  serachTextLength: number;
  onEndReached: () => void;
  onSelect?: (value?: FilterModal) => void;
}
const FilterOptionsList: React.FC<FilterOptionsList> = ({
  data,
  refreshing,
  getRefresh,
  isFetching,
  hideBusinessCard = false,
  pageCount,
  serachTextLength,
  onEndReached,
  onSelect,
}) => {
  return pageCount <= 1 &&
    isFetching &&
    !refreshing &&
    serachTextLength <= 0 ? (
    <Loader />
  ) : data.length > 0 ? (
    <Stack spaceBelow={160}>
      <FlatList
        data={data}
        ListHeaderComponent={() => <View style={styles().header} />}
        contentContainerStyle={styles().listBottomPadding}
        renderItem={({item, index}) => (
          <View key={index} style={styles().container}>
            <FilterOptionsItem
              item={item}
              onSelect={selectedItem => onSelect?.(selectedItem)}
              hideBusinessCard={hideBusinessCard}
            />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => getRefresh()}
          />
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() =>
          isFetching && pageCount > 1 ? <Loader isFooterLoader={true} /> : null
        }
        onEndReachedThreshold={0.5}
        onEndReached={() => onEndReached()}
      />
    </Stack>
  ) : (
    <EmptyComponent />
  );
};
export default FilterOptionsList;
const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    header: {height: 16},
    rowStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
    },
    textStyle: {
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.regular,
    },
    mainStyle: {
      backgroundColor: colors.white,
      borderRadius: 3,
      paddingHorizontal: 5,
    },
    viewDivide: {
      height: 2,
      width: '100%',
      backgroundColor: colors.grey_002,
    },
    titleSpace: {paddingVertical: 10},
    listBottomPadding: {paddingBottom: 30},
  });
  return mergeStyles;
};
