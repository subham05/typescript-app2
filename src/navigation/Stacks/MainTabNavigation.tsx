import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {AppFonts} from 'common/theme/font';
import {IconView} from 'components/Icon';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Platform} from 'react-native';
import {CalendarScreen} from 'screens/Calendar';
import {HomeScreen} from 'screens/Home';
import {ManageTaskScreen} from 'screens/Manage';
import {MessagesScreen} from 'screens/Messages';
import {EmailStack} from './InboxEmailStack';
import {selectMember} from 'request/Calendar';
import {emailListDataModal} from 'request/Inbox';

export type BottomNavParamList = {
  Home: undefined;
  Calender?: {user?: selectMember};
  Inbox: undefined;
  Message: undefined;
  ManageTask?: {deleted_Id?: string};
  emailType: undefined;
  MailMessage?: {
    data: emailListDataModal;
    searchText?: string;
    setSearchTextVal?: (val: string) => void;
  };
};

const BottomTabs = createBottomTabNavigator<BottomNavParamList>();
const X_WIDTH = 375;
const X_HEIGHT = 812;
const I12_WIDTH = 390;
const I12_HEIGHT = 844;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;
const {height, width} = Dimensions.get('window');
export const isIPhoneX = () =>
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    ? (width === X_WIDTH && height === X_HEIGHT) ||
      (width === I12_WIDTH && height === I12_HEIGHT) ||
      (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
    : false;

export const BottomTabNavigation = () => {
  const {t} = useTranslation();
  const [isMailLoggedIn, setIsMailLoggedIn] = useState<string | null>('false');

  useEffect(() => {
    getMailOptions();
  }, []);
  const getMailOptions = async () => {
    let loginData = await AsyncStorage.getItem(STR_KEYS.LOGINUSERDATA);
    AsyncStorage.getItem(STR_KEYS.Mail_LoggedIn).then(res => {
      if (res === 'true') {
        setIsMailLoggedIn(res);
      } else {
        loginData = JSON.parse(loginData!);
        const isMail = loginData?.isGmailSettings;
        setIsMailLoggedIn(isMail.toString());
      }
    });
  };
  return (
    <BottomTabs.Navigator
      screenOptions={({route}) => ({
        tabBarAllowFontScaling: true,
        tabBarShowLabel: true,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: isIPhoneX() ? 70 : 60,
          paddingBottom: isIPhoneX() ? 20 : 10,
          // height: 60,
          // paddingBottom: 10,
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
      <BottomTabs.Screen
        name="Calender"
        component={CalendarScreen}
        options={{title: t('calendar')}}
      />
      <BottomTabs.Screen
        name="Inbox"
        children={() => <EmailStack isMailLoggedIn={isMailLoggedIn} />}
        // component={EmailStack}
        options={{title: t('inbox')}}
      />
      {/* <BottomTabs.Screen name="AddEmail" component={EmailStack} /> */}
      <BottomTabs.Screen
        name="Home"
        component={HomeScreen}
        options={{title: t('home')}}
      />
      <BottomTabs.Screen
        name="Message"
        component={MessagesScreen}
        options={{title: t('message')}}
      />
      <BottomTabs.Screen
        name="ManageTask"
        options={{title: t('manageTask')}}
        component={ManageTaskScreen}
      />
    </BottomTabs.Navigator>
  );
};
