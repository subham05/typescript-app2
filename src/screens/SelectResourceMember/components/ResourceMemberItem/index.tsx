import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {selectMember} from 'request/Calendar';

interface ResourceMembersItemProps {
  item: selectMember;
  onPress?: (selectedItem: selectMember) => void;
}

export const ResourceMembersItem: React.FC<ResourceMembersItemProps> = ({
  item,
  onPress,
}) => {
  // const [isSelected, setIsSelected] = useState<boolean>(item.isSelected);
  const onSelection = () => {
    onPress?.(item);
  };
  return (
    <>
      <TouchableOpacity onPress={onSelection} style={styles().container}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal>
            <Persona name={item.name} image={item?.profile} />
            <Stack style={styles().view}>
              <TextView weight="medium" variant={FontSizes.regular} truncate>
                {item.name}
              </TextView>
              <TextView weight="regular" variant={FontSizes.small}>
                {item.role}
              </TextView>
            </Stack>
          </Stack>
        </Stack>
      </TouchableOpacity>
      <View style={styles().horizontalLine} />
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
    horizontalLine: {
      height: 1,
      backgroundColor: colors.grey_002,
      width: '100%',
    },
  });
  return mergeStyles;
};
