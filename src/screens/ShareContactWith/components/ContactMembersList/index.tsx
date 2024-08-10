import {FooterComponent} from 'components/FooterComponent';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ContactMembersItem, ContactMembersProps} from '../ContactMembersItem';

interface ContactMembersListProps {
  data: ContactMembersProps[];
  isAllSelected: boolean;
  onSelect: (value: boolean) => void;
}
export const ContactMembersList: React.FC<ContactMembersListProps> = ({
  data,
  isAllSelected,
  onSelect,
}) => {
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<number>>(
    new Set<number>(),
  );

  useEffect(() => {
    if (isAllSelected) {
      selectedMemberIds.clear();
      setSelectedMemberIds(new Set(selectedMemberIds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllSelected]);

  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <ContactMembersItem
            item={item}
            isAllSelected={isAllSelected!}
            selectedMember={selectedMemberIds!}
            onPress={itemm => {
              if (!selectedMemberIds.has(itemm.id)) {
                setSelectedMemberIds(new Set(selectedMemberIds.add(itemm.id!)));
              } else {
                selectedMemberIds.delete(itemm.id!);
                setSelectedMemberIds(new Set(selectedMemberIds));
              }
            }}
            onSelect={onSelect}
          />
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
