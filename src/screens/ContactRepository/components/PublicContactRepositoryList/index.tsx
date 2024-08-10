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
import {PublicContactRepositoryItem} from '../PublicContactRepositoryItem';

interface PublicContactRepositoryListProps {
  data: ContactModal[] | undefined;
  sortedArray?: ContactModal[] | undefined;
  longPressed: (value: boolean, itemId?: string[]) => void;
  count: number;
  props: any;
  pageCount: number;
  searchText: string;
  isLoading: boolean;
  isFetching: boolean;
  refreshing: boolean;
  isSuccess: boolean;
  isGotError: boolean;
  isSortEnabled?: boolean;
  dataLength: number;
  sortBy: string;
  selectedItemIds: string[] | [];
  onEndReached: () => void;
  getRefresh: (fromFocus?: boolean) => void;
  onMarkPrivateClick: (selectedItem: ContactModal) => void;
  onDeleteClick: (itemId: ContactModal) => void;
  onShareClick: (id: string) => void;
  onLogClick?: (id: string) => void;
}
export const PublicContactRepositoryList: React.FC<
  PublicContactRepositoryListProps
> = ({
  data,
  searchText,
  longPressed,
  count,
  props,
  pageCount,
  isSuccess,
  dataLength,
  isLoading,
  isFetching,
  // refreshing,
  isGotError,
  isSortEnabled,
  sortedArray,
  sortBy,
  onEndReached,
  getRefresh,
  onMarkPrivateClick,
  selectedItemIds,
  onDeleteClick,
  onShareClick,
  onLogClick,
}) => {
  const [deleteContact, {currentData, error, isError}] =
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
    // if (currentData?.message) {
    //   showToast(currentData.message);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // currentData,
    selectedItemIds,
    error,
  ]);

  useEffect(() => {
    if (currentData?.message) {
      showToast(currentData.message);
    }
  }, [currentData]);

  const renderItem = (item: ContactModal) => {
    return (
      <PublicContactRepositoryItem
        item={item}
        selectedItemIds={selectedItemIds}
        isPressedLong={(value: boolean, itemId: string) => {
          const idArray: string[] = selectedItemIds;
          const getIdx = selectedItemIds.findIndex(id => id === itemId);
          value ? idArray?.push(itemId) : idArray?.splice(getIdx, 1);
          longPressed(value, idArray);
        }}
        count={count}
        props={props}
        onMarkPrivatePress={selectedItem => onMarkPrivateClick(selectedItem)}
        onDeleteClick={itemId => {
          // onDeleteClick(item);
          deleteContact({contacts: [itemId]}).then(res => {
            if (res.isSuccess) {
              onDeleteClick(item);
            }
          });
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
      pageCount <= 1 &&
      (isSortEnabled ? isSuccess : !isSuccess))) &&
    !isGotError ? (
    <Loader />
  ) : (
      isSortEnabled
        ? sortedArray?.length! > 0
        : dataLength > 0 || data?.length! > 0
    ) ? (
    <Stack spaceBelow={150}>
      <FlatList
        data={isSortEnabled ? sortedArray : data}
        ListHeaderComponent={() => <View style={styles().header} />}
        contentContainerStyle={styles().listBottomPadding}
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
        //     onRefresh={() => getRefresh(true)}
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

// <FlatList
//   data={sortedArray}
//   ListHeaderComponent={() => <View style={styles().header} />}
//   renderItem={({item, index}) => (
//     <View key={`${index}_${item._id}`} style={styles().container}>
//       <TextView weight="semibold">{item._id}</TextView>
//       <FlatList
//         data={item.contacts}
//         renderItem={({item: contactItem}) => renderItem(contactItem)}
//       />
//     </View>
//   )}
//   keyExtractor={(_, index) => index.toString()}
//   refreshControl={
//     <RefreshControl
//       refreshing={refreshing}
//       onRefresh={() => getRefresh(true)}
//     />
//   }
//   showsVerticalScrollIndicator={false}
// />;
