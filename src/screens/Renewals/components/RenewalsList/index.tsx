import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {RefreshControl, StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {renewalInterface} from 'request/Renewals';
import {RenewalsItem} from '../RenewalsItem';

interface RenewalsListProps {
  data?: renewalInterface[];
  onPress: (id: string) => void;
  dataLength?: number;
  isLoading?: boolean;
  setPageNo?: () => void;
  onRefresh?: () => void;
  isSuccess?: boolean;
  stateDataLength?: number;
  onScrollHandler?: any;
}
export const RenewalsList: React.FC<RenewalsListProps> = ({
  data,
  onPress,
  dataLength,
  isLoading,
  setPageNo,
  onRefresh,
  isSuccess,
  onScrollHandler,
  // stateDataLength,
}) => {
  return (
    <Animated.FlatList
      data={data}
      onScroll={onScrollHandler}
      contentContainerStyle={styles().listBottom}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <RenewalsItem data={item} onPress={() => onPress(item._id)} />
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
