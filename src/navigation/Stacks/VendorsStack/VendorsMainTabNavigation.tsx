import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors} from 'common/theme/colors';
import {AppFonts} from 'common/theme/font';
import {IconView} from 'components/Icon';
import React from 'react';
import {MessagesScreen} from 'screens/Messages';
import {VendorsHomeScreen} from 'screens/_VendorsScreens/Home';
import {VendorManageTaskScreen} from 'screens/_VendorsScreens/Manage';

export type VendorsBottomNavParamList = {
  Home: undefined;
  Calender: undefined;
  Inbox: undefined;
  Message: undefined;
  ManageTask: undefined;
};

const BottomTabs = createBottomTabNavigator<VendorsBottomNavParamList>();

export const VendorsBottomTabNavigation = () => {
  return (
    <BottomTabs.Navigator
      screenOptions={({route}) => ({
        tabBarAllowFontScaling: true,
        tabBarShowLabel: true,
        headerShown: false,

        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          // borderTopColor: AppColors.black,
          // backgroundColor: AppColors.black,
        },
        tabBarLabelStyle: {fontFamily: AppFonts.bold},
        // tabBarActiveBackgroundColor: AppColors.black,
        // tabBarInactiveBackgroundColor: AppColors.black,
        tabBarActiveTintColor: colors.primary,
        // tabBarInactiveTintColor: AppColors.grey005,
        tabBarIcon: props => {
          let iconName: string = 'home';
          const {color, size, focused} = {...props};
          const {name} = {...route};
          switch (name) {
            case 'ManageTask':
              iconName = focused ? 'manage_task_selected' : 'manage_task';
              break;
            case 'Home':
              iconName = focused ? 'home_selected' : 'home';
              break;
            case 'Message':
              iconName = focused ? 'message_selected' : 'message';
              break;
            default:
              iconName = focused ? 'home_selected' : 'home';
          }

          return <IconView name={iconName} size={size} color={color} />;
        },
      })}
      initialRouteName={'Home'}>
      <BottomTabs.Screen name="Message" component={MessagesScreen} />
      <BottomTabs.Screen name="Home" component={VendorsHomeScreen} />
      <BottomTabs.Screen
        name="ManageTask"
        options={{title: 'Manage Task'}}
        component={VendorManageTaskScreen}
      />
    </BottomTabs.Navigator>
  );
};
