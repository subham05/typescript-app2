import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {managerListNode} from 'request/AddManager/constant';

interface VendorSuppliersItemProps {
  data: managerListNode;
  onPress: (data: managerListNode) => void;
}

export interface VendorSuppliersProps {
  name: string;
}

export const VendorSuppliersItem: React.FC<VendorSuppliersItemProps> = ({
  data,
  onPress,
}) => {
  const onSelection = () => {
    onPress(data);
  };
  return (
    <>
      <TouchableOpacity style={styles().container} onPress={onSelection}>
        <StackItem childrenGap={10} horizontal verticalAlign="center">
          {data?.profileUrl ? (
            <Image source={{uri: data.profileUrl}} style={styles().photoView} />
          ) : (
            data.name && <Persona name={data.name} />
          )}
          <Stack center>
            <TextView weight="medium" variant={FontSizes.medium} truncate>
              {data.name}
            </TextView>
          </Stack>
        </StackItem>
      </TouchableOpacity>
      <Divider size={1.5} />
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
      justifyContent: 'center',
    },
    icon: {
      justifyContent: 'center',
    },
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
  });
  return mergeStyles;
};
