/**
 * @format
 */

import {AppRegistry} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
import {name as appName} from './app.json';
import App from './src/App';

PushNotification.createChannel(
  {
    channelId: 'com.formanagement.app', // (required)
    channelName: 'com.formanagement.app', // (required)
    channelDescription: 'Sheer Exchange channel', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: false, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

//** Notifee code */
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   await onMessageReceived(remoteMessage);
// });

// if (Platform.OS === 'ios') {
//   messaging()
//     .getInitialNotification()
//     .then(res => console.log('test->', res));
// }

// notifee.onBackgroundEvent(async ({ type, detail }) => {
//   const { pressAction } = detail;
//   if (type === EventType.PRESS && pressAction?.id) {
//     AsyncStorage.setItem('BackgroundNotification', JSON.stringify(detail));
//     // notification?.id && (await notifee.cancelNotification(notification.id));
//   }
// });

// if (Platform.OS === 'ios') {
//   notifee.onForegroundEvent(({ type, detail }) => {
//     const { pressAction } = detail;
//     if (type === EventType.PRESS && pressAction?.id) {
//       AsyncStorage.setItem('BackgroundNotification', JSON.stringify(detail));
//     }
//   });
// }

// function HeadlessCheck({isHeadless}) {
//   if (isHeadless) {
//     // App has been launched in the background by iOS, ignore
//     return null;
//   }

//   return App;
// }

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', handler);
