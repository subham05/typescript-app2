import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {InboxScreen} from 'screens/Inbox';
import {AccountType} from 'screens/Inbox/InitialScreens/AccountType';
import {AddEmail} from 'screens/Inbox/InitialScreens/AddEmail';
import {AddEmailPassword} from 'screens/Inbox/InitialScreens/AddPassword';
import EmailType from 'screens/Inbox/InitialScreens/EmailType';
import LoginWithGoogle from 'screens/Inbox/InitialScreens/LoginWithGoogle';
import {ServerSettings} from 'screens/Inbox/InitialScreens/ServerSettings';

export type EmailStackParamList = {
  AddEmail: undefined;
  AccountType: {email?: String};
  AddEmailPassword: {email?: String};
  Inbox: undefined;
  ServerSetting: {email?: String};
  emailType: undefined;
  loginWithGoogle: undefined;
};
type emailStackProp = {
  isMailLoggedIn: string | null;
};
const Stack = createNativeStackNavigator<EmailStackParamList>();
export const EmailStack: React.FC<emailStackProp> = ({isMailLoggedIn}) => {
  return (
    <Stack.Navigator
      initialRouteName={isMailLoggedIn === 'true' ? 'Inbox' : 'emailType'}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="emailType" component={EmailType} />
      <Stack.Screen name="loginWithGoogle" component={LoginWithGoogle} />
      <Stack.Screen name="AddEmail" component={AddEmail} />
      <Stack.Screen name="AccountType" component={AccountType} />
      <Stack.Screen name="AddEmailPassword" component={AddEmailPassword} />
      <Stack.Screen name="ServerSetting" component={ServerSettings} />
      <Stack.Screen name="Inbox" component={InboxScreen} />
    </Stack.Navigator>
  );
};
