import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

interface ContactMembersItemProps {
  item: ContactMembersProps;
  isAllSelected: boolean;
  selectedMember: Set<number>;
  onPress: (selectedItem: ContactMembersProps) => void;
  onSelect: (value: boolean) => void;
}

export interface ContactMembersProps {
  id: number;
  name: string;
  number: string;
}

export const ContactMembersItem: React.FC<ContactMembersItemProps> = ({
  item,
  isAllSelected,
  selectedMember,
  onPress,
  onSelect,
}) => {
  const onSelection = () => {
    onSelect(false);
    onPress(item);
  };
  const isSelected = selectedMember.has(item.id);
  return (
    <TouchableOpacity onPress={onSelection} style={styles().container}>
      <Stack horizontal horizontalAlign="space-between">
        <StackItem childrenGap={10} horizontal>
          <Persona name={item.name} />
          <Stack>
            <TextView weight="medium" variant={FontSizes.medium} truncate>
              {item.name}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles().number}>
              {item.number}
            </TextView>
          </Stack>
        </StackItem>
        <Stack style={styles().icon}>
          {isAllSelected || isSelected ? (
            <Icon name="check_box" size={20} />
          ) : (
            <Icon name="check_box_blank" size={20} />
          )}
        </Stack>
      </Stack>
      <View style={styles().horizontalLine} />
    </TouchableOpacity>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      padding: 10,
      borderRadius: 3,
    },
    image: {
      height: 50,
      width: 50,
      borderRadius: 25,
    },
    view: {
      marginLeft: 10,
      marginTop: 3,
    },
    icon: {
      justifyContent: 'center',
    },
    number: {
      color: colors.grey_005,
    },
    horizontalLine: {
      height: 1,
      backgroundColor: colors.grey_002,
      width: '100%',
      marginTop: 7,
    },
  });
  return mergeStyles;
};
