import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import React from 'react';
import {StyleSheet} from 'react-native';

interface modalItemProps {
  item: membersProps;
  isEmail?: boolean;
}

export interface membersProps {
  id: number;
  name: string;
  position: string;
  email?: string;
}

export const ModalItem: React.FC<modalItemProps> = ({item, isEmail}) => {
  return (
    <Stack style={styles().container}>
      <Stack horizontal horizontalAlign="space-between">
        <Stack horizontal>
          <Persona name={item.name} />
          <Stack style={styles().view}>
            <TextView weight="medium" variant={FontSizes.medium} truncate>
              {item.name}
            </TextView>
            <TextView weight="regular" variant={FontSizes.small}>
              {isEmail ? item.email : item.position}
            </TextView>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
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
      width: '75%',
    },
    icon: {
      justifyContent: 'center',
    },
  });
  return mergeStyles;
};
