import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

interface membersItemProps {
  item: membersProps;
  showCheckBox?: boolean;
  isAllSelected: boolean;
  selectedMember: membersProps;
  onPress: (selectedItem: membersProps) => void;
  onSelect: (value: boolean) => void;
  selection?: boolean;
  isEmail?: boolean;
}

export interface membersProps {
  id: number;
  name: string;
  position: string;
  email?: string;
}

export const MembersItem: React.FC<membersItemProps> = ({
  item,
  showCheckBox,
  isAllSelected,
  selectedMember,
  onPress,
  onSelect,
  selection,
  isEmail,
}) => {
  // const [isSelected, setIsSelected] = useState<boolean>(item.isSelected);
  const onSelection = () => {
    onSelect(false);
    onPress(item);
  };
  const isSelected = item.id === selectedMember?.id;
  return (
    <>
      <TouchableOpacity
        onPress={selection ? undefined : onSelection}
        style={styles().container}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal>
            <Persona name={item.name} />
            <Stack style={styles().view}>
              <TextView weight="semibold" variant={FontSizes.regular} truncate>
                {item.name}
              </TextView>
              <TextView weight="regular" variant={FontSizes.small}>
                {isEmail ? item.email : item.position}
              </TextView>
            </Stack>
          </Stack>
          {showCheckBox && (
            <Stack style={styles().icon}>
              {isAllSelected || isSelected ? (
                <Icon name="check_box" size={20} />
              ) : (
                <Icon name="check_box_blank" size={20} />
              )}
            </Stack>
          )}
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
