import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Divider} from 'components/Divider';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import CustomDrawerFirstList from './components/FirstList';
import CustomDrawerHeader from './components/Header';
import CustomDrawerSecondList from './components/SecondList';
import {Styles} from './index.styles';

const CustomDrawer = (props: any) => {
  const styles = Styles();
  return (
    <Stack style={styles.scrollview}>
      <DrawerContentScrollView {...props}>
        <StackItem childrenGap={20} spacing={16}>
          <CustomDrawerHeader {...props} />
          <Stack style={styles.marginTopView}>
            <CustomDrawerFirstList {...props} />
          </Stack>

          <Divider />

          <CustomDrawerSecondList {...props} />
        </StackItem>
      </DrawerContentScrollView>
    </Stack>
  );
};

export default CustomDrawer;
