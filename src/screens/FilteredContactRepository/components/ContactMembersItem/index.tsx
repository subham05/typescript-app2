import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {StyleSheet, View} from 'react-native';

interface ContactMembersItemProps {
  item: ContactMembersProps;
}

export interface ContactMembersProps {
  id: number;
  name: string;
  number: string;
}

export const ContactMembersItem: React.FC<ContactMembersItemProps> = ({
  item,
}) => {
  return (
    <Stack style={styles().container}>
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
      </Stack>
      <View style={styles().horizontalLine} />
    </Stack>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      paddingVertical: 10,
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
