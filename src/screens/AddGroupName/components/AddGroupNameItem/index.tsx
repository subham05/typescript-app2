import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import React from 'react';
import {Image, StyleSheet} from 'react-native';

interface AddGroupNameItemProps {
  item: AddGroupNameProps;
}

export interface AddGroupNameProps {
  _id: string;
  name: string;
  profileUrl: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  chatId: string;
}
export const AddGroupNameItem: React.FC<AddGroupNameItemProps> = ({item}) => {
  return (
    <Stack style={styles().container}>
      <Stack spaceBelow={10} center>
        {item.profileUrl ? (
          <Image source={{uri: item.profileUrl}} style={styles().photoView} />
        ) : (
          <Persona name={item.name} />
        )}
      </Stack>
      <Stack spaceBelow={10}>
        <TextView
          weight="regular"
          variant={FontSizes.xSmall}
          style={styles().name}
          truncate>
          {item.name}
        </TextView>
      </Stack>
    </Stack>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      paddingVertical: 10,
      paddingRight: 20,
      borderRadius: 3,
      // alignItems: 'center',
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
    iconImage: {
      top: 33,
      right: 0,
      position: 'absolute',
    },
    name: {
      // marginLeft: 5,
      width: 50,
      textAlign: 'center',
      flexWrap: 'wrap',
    },
    photoView: {
      height: 48,
      width: 48,
      borderRadius: 36,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      alignSelf: 'center',
    },
  });
  return mergeStyles;
};
