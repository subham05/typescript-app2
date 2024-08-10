import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {globalScreenWidth} from 'common/utils/ScreenDimensions';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {chatInviteeModal} from 'request/Message';

interface MessageContactItemProps {
  item: chatInviteeModal;
  onPress: (item: chatInviteeModal) => void;
}
export interface MessageContactProps {
  name: string;
  image?: string;
}

export const MessageContactItem: React.FC<MessageContactItemProps> = ({
  item,
  onPress,
}) => {
  const onSelect = () => {
    onPress(item);
  };
  return (
    <>
      <TouchableOpacity onPress={onSelect} style={styles().container}>
        <Stack horizontal horizontalAlign="space-between">
          <StackItem childrenGap={10} horizontal verticalAlign="center">
            <Stack>
              {item?.name === 'Add member' ? (
                <Stack style={styles().iconBackground}>
                  <Icon name="add_member" size={24} color={colors.white} />
                </Stack>
              ) : item?.name === 'Create new group' ? (
                <Stack style={styles().iconBackground}>
                  <Icon name="group_add" size={24} color={colors.white} />
                </Stack>
              ) : (
                <Persona name={item?.name} image={item?.profileUrl} />
              )}
            </Stack>
            <Stack center>
              <TextView
                weight="medium"
                variant={FontSizes.medium}
                truncate
                style={styles().memberName}>
                {item.name}
              </TextView>
            </Stack>
          </StackItem>
        </Stack>
      </TouchableOpacity>
      <Divider />
    </>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      padding: 10,
      borderRadius: 3,
    },
    groupIcon: {
      height: 50,
      width: 50,
      padding: 13,
      borderRadius: 40,
      backgroundColor: colors.primary_004,
    },
    icon: {
      justifyContent: 'center',
    },
    iconImage: {
      top: 33,
      right: 0,
      position: 'absolute',
    },
    iconBackground: {
      backgroundColor: colors.primary_004,
      height: 48,
      width: 48,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30,
    },
    memberName: {
      width: globalScreenWidth / 1.3,
    },
  });
  return mergeStyles;
};
