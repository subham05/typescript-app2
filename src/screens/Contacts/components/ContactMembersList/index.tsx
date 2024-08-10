import {FooterComponent} from 'components/FooterComponent';
import Loader from 'components/Loader';
import React from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {Contact} from 'react-native-contacts';
import {ContactMembersItem} from '../ContactMembersItem';

interface ContactMembersListProps {
  data: Contact[];
  loader?: boolean;
  showCheckBox?: boolean;
  isAllSelected?: boolean;
  selectedMemberIds?: string[] | [];
  onSelect?: (selectedItem: Contact) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}
export const ContactMembersList: React.FC<ContactMembersListProps> = ({
  data,
  isAllSelected,
  loader,
  showCheckBox,
  selectedMemberIds,
  refreshing = false,
  onSelect,
  onRefresh,
}) => {
  // const [refreshing, setRefreshing] = useState(false);

  return loader ? (
    <Loader />
  ) : (
    <FlatList
      data={data}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <ContactMembersItem
            item={item}
            isAllSelected={isAllSelected!}
            showCheckBox={showCheckBox!}
            selectedMember={selectedMemberIds!}
            onPress={itemm => onSelect?.(itemm)}
            onSelect={() => {}}
          />
        </View>
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => onRefresh?.()}
        />
      }
      refreshing={refreshing}
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
