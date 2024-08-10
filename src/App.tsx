/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {colors} from 'common/theme/colors';
import {FirebaseWrapper} from 'components/Firebase/FirebaseWrapper';
import {NetworkProvider} from 'components/NetworkProvider';
import Router from 'navigation/router';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import {store} from 'store/store';

import messaging from '@react-native-firebase/messaging';
import {toastConfig} from 'common/utils/ToastMessage/config';
import PushNotification from 'react-native-push-notification';
import '../src/translation/Localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STR_KEYS} from 'common/storage';

const App = () => {
  // useEffect(() => {
  //   crashlytics().crash()
  // }, []);
  // async function onMessageReceived(message) {
  //   console.log('notification', message);
  // }

  // messaging().onMessage(onMessageReceived);
  // messaging().setBackgroundMessageHandler(onMessageReceived);

  // notifee.onBackgroundEvent(async ({type, detail}) => {
  //   const {notification, pressAction} = detail;
  //   console.log('Kill state');
  //   if (type === EventType.PRESS) {
  //     console.log('Kill state called');
  //     // notification?.id && (await notifee.cancelNotification(notification.id));
  //   }
  // });

  useEffect(() => {
    // requestUserPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const chatId =
        (await AsyncStorage.getItem(STR_KEYS.ACTIVE_CHAT_ID)) || '';
      const detailObj = JSON.parse(remoteMessage?.data?.detail || '');

      if (
        detailObj !== '' &&
        (detailObj.chatId === chatId || detailObj.groupId === chatId)
      ) {
        /**
         * @description this condition is fine. Nothing to do here.
         */
      } else {
        PushNotification.localNotification({
          channelId: 'com.formanagement.app',
          title: remoteMessage?.data?.title,
          message: remoteMessage?.data!.body!,
          userInfo: remoteMessage.data,
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <MenuProvider customStyles={menuProviderStyles}>
        <NetworkProvider>
          <FirebaseWrapper>
            <Router />
          </FirebaseWrapper>
        </NetworkProvider>
        <Toast config={toastConfig} position={'bottom'} />
      </MenuProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.black,
    opacity: 0.5,
  },
});

const menuProviderStyles = {
  backdrop: styles.backdrop,
};

export default App;
