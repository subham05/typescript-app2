import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ForgotPasswordScreen} from 'screens/Auth/ForgotPassword';
import {LoginScreen} from 'screens/Auth/Login';
import {LoginWithMobileScreen} from 'screens/Auth/LoginWithMobile';
import {SetPasswordScreen} from 'screens/Auth/SetPassword';
import {VerifyOTPScreen} from 'screens/Auth/VerifyOTP';
import CMSScreen from 'screens/cms';

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  VerifyOTP?: {
    mobile?: boolean;
    country?: string;
    number?: string;
    email?: string;
  };
  SetPassword: {email: string};
  LoginWithMobileScreen: undefined;
  CMSScreen: {cameFrom: string};
};

const Stack = createNativeStackNavigator<AuthStackParamList>();
export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="LoginWithMobileScreen"
        component={LoginWithMobileScreen}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
      <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
      <Stack.Screen name="CMSScreen" component={CMSScreen} />
    </Stack.Navigator>
  );
};
