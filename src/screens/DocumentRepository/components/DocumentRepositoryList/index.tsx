import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {docInterface} from 'request/DocumentRepository';
import {DocumentRepositoryItem} from '../DocumentRepositoryItem';

interface DocumentRepositoryListProps {
  data?: docInterface[];
  onPress: (id: string) => void;
  dataLength?: number;
  isLoading?: boolean;
  setPageNo?: () => void;
  onRefresh?: () => void;
  isSuccess?: boolean;
  stateDataLength?: number;
  isShareWithMeTab?: boolean;
}
export const DocumentRepositoryList: React.FC<DocumentRepositoryListProps> = ({
  data,
  onPress,
  dataLength,
  isLoading,
  setPageNo,
  onRefresh,
  isSuccess,
  isShareWithMeTab,
  // stateDataLength,
}) => {
  return (
    <FlatList
      data={data}
      contentContainerStyle={styles().listBottom}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <DocumentRepositoryItem
            isShareWithMeTab={isShareWithMeTab}
            data={item}
            onPress={() => onPress(item._id)}
          />
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            onRefresh?.();
          }}
        />
      }
      ListFooterComponent={() => <FooterComponent isLoading={isLoading} />}
      ListEmptyComponent={() =>
        // dataLength === 0 && stateDataLength === 0 && isSuccess && !isLoading ? (
        //   <EmptyComponent />
        // ) : (
        //   <></>
        // )
        !dataLength && isSuccess ? <EmptyComponent /> : <></>
      }
      onEndReached={() => setPageNo?.()}
    />
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    listBottom: {
      paddingBottom: 100,
    },
  });
  return mergeStyles;
};
