import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ContactMembersItem, ContactMembersProps} from '../ContactMembersItem';

interface ContactLogsMembersListProps {
  data: ContactMembersProps[];
  onPress: () => void;
}
export const ContactLogsMembersList: React.FC<ContactLogsMembersListProps> = ({
  data,
  onPress,
}) => {
  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <ContactMembersItem item={item} onPress={onPress} />
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => <FooterComponent />}
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
