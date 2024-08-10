import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {Dimensions, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {managerListNode} from 'request/AddManager/constant';

interface ContactMembersItemProps {
  item: managerListNode;
  onPress: (data: managerListNode) => void;
}

export const ContactMembersItem: React.FC<ContactMembersItemProps> = ({
  item,
  onPress,
}) => {
  const onSelection = () => {
    onPress(item);
  };

  return (
    <>
      <TouchableOpacity onPress={onSelection} style={styles().container}>
        <Stack horizontal horizontalAlign="space-between">
          <StackItem childrenGap={10} horizontal>
            {item?.profile ? (
              <Image source={{uri: item.profile}} style={styles().photoView} />
            ) : (
              item.name && <Persona name={item.name} />
            )}

            <Stack>
              <TextView
                weight="medium"
                variant={FontSizes.medium}
                truncate
                style={{
                  width: Dimensions.get('screen').width - 100,
                }}
                numberOfLines={1}>
                {item.name}
              </TextView>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles().number}>
                {item.companyNumber ? item.companyNumber : item.mobile}
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
    photoView: {
      height: 48,
      width: 48,
      borderRadius: 36,
      backgroundColor: colors.primary_003,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      alignSelf: 'center',
    },
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
      color: colors.grey_003,
    },
  });
  return mergeStyles;
};
