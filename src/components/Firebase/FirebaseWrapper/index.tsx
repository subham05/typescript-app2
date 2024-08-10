import notifee, {AuthorizationStatus} from '@notifee/react-native';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import messaging, {firebase} from '@react-native-firebase/messaging';
import {STR_KEYS} from 'common/storage';
import React, {useCallback} from 'react';
// import PushNotification from 'react-native-push-notification';

interface FirebaseWrapperProps {
  children: React.ReactNode;
}

export const FirebaseWrapper: React.FC<FirebaseWrapperProps> = ({children}) => {
  const getToken = async () => {
    let fcmToken = await AsyncStorageLib.getItem(STR_KEYS.FCM_TOKEN);
    console.log('TOKEN RETRIEVED', fcmToken);
    if (!fcmToken) {
      // await firebase.messaging().registerDeviceForRemoteMessages();
      const firebaseFcmToken = await firebase.messaging().getToken();
      console.log('TOKEN CREATED', firebaseFcmToken);

      if (firebaseFcmToken) {
        await AsyncStorageLib.setItem(STR_KEYS.FCM_TOKEN, firebaseFcmToken);
      }
    }
  };

  const CheckPermission = useCallback(async () => {
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      console.log('Permission settings:', settings);
    } else {
      console.log('User declined permissions');
    }
    const enabled = await firebase.messaging().hasPermission();

    if (enabled) {
      getToken();
    } else {
      try {
        await firebase.messaging().requestPermission();
        getToken();
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(() => {
      // onMessageReceived(remoteMessage);
    });

    return () => {
      unsubscribe;
    };
  }, []);

  // PushNotification.configure({
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   onNotification: function (notification) {
  //     // when receive new notification
  //   },
  //   permissions: {
  //     alert: true,
  //     badge: true,
  //     sound: true,
  //   },
  //   popInitialNotification: true,
  //   requestPermissions: true,
  // });

  React.useEffect(() => {
    CheckPermission();
  }, [CheckPermission]);

  return <>{children}</>;
};
