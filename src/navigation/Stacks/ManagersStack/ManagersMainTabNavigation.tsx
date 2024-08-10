import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors} from 'common/theme/colors';
import {AppFonts} from 'common/theme/font';
import {IconView} from 'components/Icon';
import React from 'react';
import {CalendarScreen} from 'screens/Calendar';
import {InboxScreen} from 'screens/Inbox';
import {ManagersHomeScreen} from 'screens/_ManagerScreens/Home';
import {ManagerManageTaskScreen} from 'screens/_ManagerScreens/Manage';
import {MessagesScreen} from 'screens/Messages';

export type ManagersBottomNavParamList = {
  Home: undefined;
  Calender: undefined;
  Inbox: undefined;
  Message: undefined;
  ManageTask: undefined;
};

const BottomTabs = createBottomTabNavigator<ManagersBottomNavParamList>();

export const ManagersBottomTabNavigation = () => {
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
            case 'Inbox':
              iconName = focused ? 'inbox_selected' : 'inbox';
              break;
            case 'Message':
              iconName = focused ? 'message_selected' : 'message';
              break;
            default:
              iconName = focused ? 'calendar_selected' : 'calendar';
          }

          return <IconView name={iconName} size={size} color={color} />;
        },
      })}
      initialRouteName={'Home'}>
      <BottomTabs.Screen name="Calender" component={CalendarScreen} />
      <BottomTabs.Screen name="Inbox" component={InboxScreen} />
      <BottomTabs.Screen name="Home" component={ManagersHomeScreen} />
      <BottomTabs.Screen name="Message" component={MessagesScreen} />
      <BottomTabs.Screen
        name="ManageTask"
        options={{title: 'Manage Task'}}
        component={ManagerManageTaskScreen}
      />
    </BottomTabs.Navigator>
  );
};
