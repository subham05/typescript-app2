import {useFocusEffect} from '@react-navigation/native';
import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import EmptyComponent from 'components/EmptyComponent';
import Loader from 'components/Loader';
import React, {useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useLazyDeleteContactQuery} from 'request/ContactRepository';
import {getTitle, showTitle} from 'screens/ContactRepository/CommonFunction';
import {ContactModal} from 'screens/Contacts';
import {Stack} from 'stack-container';
import {PrivateContactRepositoryItem} from '../PrivateContactRepositoryItem';

interface PrivateContactRepositoryProps {
  data: ContactModal[] | undefined;
  sortedArray?: ContactModal[];
  props: any;
  searchText: string;
  pageCount: number;
  isLoading: boolean;
  isSuccess: boolean;
  isFetching: boolean;
  refreshing: boolean;
  isGotError: boolean;
  isSortEnabled?: boolean;
  sortBy: string;
  dataLength: number;
  longPressed: (value: boolean, itemId?: string[]) => void;
  count: number;
  selectedItemIds: string[] | [];
  onEndReached: () => void;
  getRefresh: (fromFocus?: boolean) => void;
  onMarkPublicClick: (selectedItem: ContactModal) => void;
  onDeleteClick: (item: ContactModal) => void;
  onShareClick: (id: string) => void;
  onLogClick?: (id: string) => void;
}
export const PrivateContactRepositoryList: React.FC<
  PrivateContactRepositoryProps
> = ({
  data,
  props,
  searchText,
  longPressed,
  count,
  dataLength,
  isLoading,
  isSuccess,
  isFetching,
  // refreshing,
  isGotError,
  pageCount,
  isSortEnabled,
  sortedArray,
  sortBy,
  selectedItemIds,
  onEndReached,
  getRefresh,
  onMarkPublicClick,
  onDeleteClick,
  onShareClick,
  onLogClick,
}) => {
  const [deleteContact, {currentData, isError, error}] =
    useLazyDeleteContactQuery();
  useFocusEffect(
    useCallback(() => {
      getRefresh(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  useEffect(() => {
    if (isError && error) {
      const err: any = error;
      if (err?.error) {
        showToast(err.error);
      } else {
        showToast(err?.data?.error[0]?.msg);
      }
    }
    if (currentData?.message) {
      showToast(currentData.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData, selectedItemIds, error]);
  const renderItem = (item: ContactModal) => {
    return (
      <PrivateContactRepositoryItem
        item={item}
        props={props}
        selectedItemIds={selectedItemIds}
        isPressedLong={(value: boolean, itemId: string) => {
          const idArray: string[] = selectedItemIds;
          const getIdx = selectedItemIds.findIndex(id => id === itemId);
          value ? idArray?.push(itemId) : idArray?.splice(getIdx, 1);
          longPressed(value, idArray);
        }}
        count={count}
        onMarkPublicPress={selectedItem => onMarkPublicClick(selectedItem)}
        onDeleteClick={itemId => {
          onDeleteClick(item);
          deleteContact({contacts: [itemId]});
        }}
        onShareClick={id => onShareClick?.(id)}
        onLogClick={id => onLogClick?.(id)}
      />
    );
  };
  return (isLoading ||
    (isFetching && !searchText.length && pageCount <= 1) ||
    ((isSortEnabled ? sortedArray?.length! <= 0 : !dataLength) &&
      !searchText &&
      (isSortEnabled ? isSuccess : !isSuccess) &&
      pageCount <= 1)) &&
    !isGotError ? (
    <Loader />
  ) : (
      isSortEnabled
        ? sortedArray?.length! > 0
        : dataLength > 0 || data?.length! > 0
    ) ? (
    <Stack spaceBelow={200}>
      <FlatList
        data={isSortEnabled ? sortedArray : data}
        ListHeaderComponent={() => <View style={styles().header} />}
        renderItem={({item, index}) => (
          <View>
            {isSortEnabled && showTitle(sortBy, index, item, sortedArray) && (
              <Stack>
                <TextView
                  weight="medium"
                  variant={FontSizes.medium}
                  truncate
                  style={styles().titleSpace}>
                  {getTitle(sortBy, index, item)}
                </TextView>
                <View style={styles().viewDivide} />
              </Stack>
            )}
            <View key={index} style={styles().container}>
              {renderItem(item)}
            </View>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={() => {
        //       getRefresh();
        //     }}
        //   />
        // }
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
    viewDivide: {
      height: 2,
      width: '100%',
      backgroundColor: colors.grey_002,
    },
    titleSpace: {paddingVertical: 10},
    mainStyle: {
      backgroundColor: colors.white,
      borderRadius: 3,
      paddingHorizontal: 5,
    },
  });
  return mergeStyles;
};
