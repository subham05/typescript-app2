import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {inviteList} from 'request/Message/constants';

interface GroupAddedMembersItemProps {
  item: inviteList;
  onPress: (item: inviteList) => void;
  index: number;
}

export const GroupAddedMembersItem: React.FC<GroupAddedMembersItemProps> = ({
  item,
  onPress,
}) => {
  const onItemPress = () => {
    onPress(item);
  };
  return (
    <>
      <TouchableOpacity onPress={onItemPress} style={styles().container}>
        <Stack>
          <Persona name={item.name} image={item.profileUrl} />
          <Icon
            name="close"
            size={18}
            color={colors.primary}
            style={styles().iconImage}
          />
        </Stack>
        <TextView
          weight="regular"
          variant={FontSizes.xSmall}
          style={styles().name}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          {item.name.split(' ', 1)}
        </TextView>
      </TouchableOpacity>
    </>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      paddingVertical: 10,
      borderRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',
      paddingRight: 20,
    },

    view: {
      marginLeft: 10,
      marginTop: 3,
    },
    iconImage: {
      top: 33,
      left: 30,
      position: 'absolute',
      padding: 1,
      borderRadius: 9,
      backgroundColor: colors.grey_008,
      overflow: 'hidden',
    },
    name: {
      marginTop: 6,
    },
  });
  return mergeStyles;
};
