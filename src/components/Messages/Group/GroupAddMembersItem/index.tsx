import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
// import {groupProps} from 'screens/CreateGroup';
import {inviteList} from 'request/Message/constants';
import Check_circle from '../../../../assets/svgs/check_circle.svg';
import {colors} from 'common/theme/colors';

interface GroupAddMembersItemProps {
  item: inviteList;
  onPress: (item: inviteList) => void;
  index: number;
  selected: boolean;
}

export const GroupAddMembersItem: React.FC<GroupAddMembersItemProps> = ({
  item,
  onPress,
  selected,
}) => {
  const onItemPress = () => {
    onPress(item);
  };
  return (
    <Stack>
      <TouchableOpacity
        onPress={onItemPress}
        style={[styles().container]}
        disabled={item.alreadyAdded}>
        <Stack horizontal horizontalAlign="space-between">
          <StackItem childrenGap={10} horizontal verticalAlign="center">
            <Stack>
              <Persona name={item.name} image={item.profileUrl} />
              {selected && (
                <Check_circle
                  height={22}
                  width={22}
                  style={styles().iconImage}
                />
              )}
            </Stack>
            <Stack center>
              <TextView
                weight="medium"
                variant={FontSizes.medium}
                truncate
                style={{
                  color: item.alreadyAdded ? colors.grey_003 : colors.black,
                }}>
                {item.name}
              </TextView>
            </Stack>
          </StackItem>
        </Stack>
      </TouchableOpacity>
      <Stack style={styles().horizontalLine}>
        <Divider width={'91%'} />
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
      marginTop: 10,
      // justifyContent: 'center',
      // width: '60%',
    },
    icon: {
      justifyContent: 'center',
    },
    iconImage: {
      top: 33,
      right: 0,
      position: 'absolute',
    },
    horizontalLine: {
      marginTop: 2,
      marginLeft: 16,
    },
  });
  return mergeStyles;
};
