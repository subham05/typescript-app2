import {FooterComponent} from 'components/FooterComponent';
import {MessageContactProps} from 'components/Messages/MessageContactItem';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {SearchContactItem} from '../MessageContactItem';
import {TouchableOpacity} from 'react-native';
import EmptyComponent from 'components/EmptyComponent';

interface MessageContactListProps {
  data: MessageContactProps[];
  onEndReached?: () => void;
  isLoading?: boolean;
  onMemberPress?: (val: MessageContactProps) => void;
}
export const SearchMessageContactList: React.FC<MessageContactListProps> = ({
  data,
  onEndReached,
  isLoading,
  onMemberPress,
}) => {
  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => {
        return (
          <TouchableOpacity
            key={index}
            style={styles().container}
            onPress={() => {
              onMemberPress?.(item);
            }}>
            <SearchContactItem item={item} />
          </TouchableOpacity>
        );
      }}
      keyExtractor={(_, index) => index.toString()}
      onEndReached={onEndReached}
      ListEmptyComponent={() => (!isLoading ? <EmptyComponent /> : null)}
      ListFooterComponent={() => (
        <View style={styles().verticalSpace}>
          <FooterComponent isLoading={isLoading} size={10} />
        </View>
      )}
    />
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    verticalSpace: {
      paddingVertical: 20,
    },
  });
  return mergeStyles;
};
