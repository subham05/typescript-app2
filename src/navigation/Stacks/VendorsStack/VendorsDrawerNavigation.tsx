import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from 'components/CustomDrawer';
import React from 'react';
import {VendorsBottomTabNavigation} from './VendorsMainTabNavigation';

export type VendorsDrawerNavParamList = {
  BottomTabs: undefined;
};

const Drawer = createDrawerNavigator<VendorsDrawerNavParamList>();

export const VendorsDrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '82%',
        },
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen name="BottomTabs" component={VendorsBottomTabNavigation} />
    </Drawer.Navigator>
  );
};
