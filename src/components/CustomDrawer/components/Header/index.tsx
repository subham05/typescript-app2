// import {DrawerActions} from '@react-navigation/native';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
// import {userTypes} from 'common/users/userTypes';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useAppSelector} from 'store/hooks';
import {Styles} from './index.styles';

const CustomDrawerHeader = (props: any) => {
  const {userData} = useAppSelector(state => state.formanagement);
  const styles = Styles();

  return (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate('AccountScreen');
      }}>
      <Stack horizontal horizontalAlign="space-between">
        <Stack horizontal>
          <Persona
            name={userData?.name || ''}
            image={userData?.profileUrl || ''}
            size={72}
          />
          <StackItem style={styles.middleView}>
            <TextView weight="medium" variant={FontSizes.xMedium} truncate>
              {userData?.name}
            </TextView>
            <TextView weight="regular" variant={FontSizes.regular} truncate>
              {userData?.role.type}
            </TextView>
            <TextView weight="light" variant={FontSizes.xSmall} truncate>
              {userData?.companies?.name || 'NA'}
            </TextView>
          </StackItem>
        </Stack>
        <Icon name="edit" size={20} color={colors.black} style={styles.edit} />
      </Stack>
    </TouchableOpacity>
  );
};

export default CustomDrawerHeader;
