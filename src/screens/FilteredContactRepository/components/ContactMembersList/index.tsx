import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ContactMembersItem, ContactMembersProps} from '../ContactMembersItem';

interface FilteredContactMembersListProps {
  data: ContactMembersProps[];
}
export const FilteredContactMembersList: React.FC<
  FilteredContactMembersListProps
> = ({data}) => {
  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <ContactMembersItem item={item} />
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      // ListFooterComponent={() => <FooterComponent />}
    />
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
  });
  return mergeStyles;
};
