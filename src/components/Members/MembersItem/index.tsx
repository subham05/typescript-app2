import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Role} from 'request/AddTask';
import {InviteeUserData} from 'request/Calendar';

interface membersItemProps {
  item: membersProps | InviteeUserData;
  showCheckBox?: boolean;
  isAllSelected: boolean;
  selectedMember: Set<string | number>;
  onPress: (selectedItem: membersProps) => void;
  onSelect: (value: boolean) => void;
  selection?: boolean;
  isEmail?: boolean;
  isShare?: boolean;
  showCrossIcon?: boolean;
}

export interface membersProps {
  _id: string | number;
  profile?: string;
  profilePic?: string;
  profileUrl?: string;
  name: string;
  position: string;
  email?: string;
  userId?: string;
  role?: Role;
  designation?: string;
}

export const MembersItem: React.FC<membersItemProps> = ({
  item,
  showCheckBox,
  selectedMember,
  onPress,
  onSelect,
  selection,
  isEmail,
  isShare,
  showCrossIcon = false,
}) => {
  const onSelection = () => {
    onSelect(false);
    onPress(item as membersProps);
  };
  const isSelected = selectedMember?.has(item._id);
  return (
    <>
      <TouchableOpacity
        onPress={selection ? undefined : onSelection}
        style={styles().container}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal>
            <Persona name={item?.name} image={item?.profileUrl} />
            <Stack style={styles().view}>
              <TextView
                weight="medium"
                variant={FontSizes.regular}
                truncate
                style={styles(isShare).nameStyle}>
                {item?.name}
              </TextView>
              {!isShare && (
                <TextView weight="regular" variant={FontSizes.small}>
                  {isEmail ? item.email : item.position || item?.role}
                </TextView>
              )}
            </Stack>
          </Stack>
          {showCheckBox && (
            <Stack style={styles().icon}>
              {isSelected ? (
                <Icon name="check_box" size={20} />
              ) : (
                <Icon name="check_box_blank" size={20} />
              )}
            </Stack>
          )}
          {showCrossIcon && (
            <Stack style={styles().icon}>
              <Icon
                onPress={() => {
                  onPress(item);
                }}
                name="close"
                size={20}
              />
            </Stack>
          )}
        </Stack>
      </TouchableOpacity>
      <View style={styles().horizontalLine} />
    </>
  );
};

const styles = (isShare?: boolean) => {
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
    nameStyle: {
      textAlignVertical: isShare ? 'center' : 'top',
      marginBottom: isShare ? 2 : 0,
    },

    icon: {
      justifyContent: 'center',
    },
    horizontalLine: {
      height: 1,
      backgroundColor: colors.grey_002,
      width: '100%',
    },
  });
  return mergeStyles;
};
