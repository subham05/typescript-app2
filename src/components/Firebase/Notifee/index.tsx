import notifee from '@notifee/react-native';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';

export const onMessageReceived = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  const channelId = await notifee.createChannel({
    id: 'com.for.management',
    name: 'For Management',
  });

  try {
    await notifee.displayNotification({
      title: remoteMessage.data?.title,
      body: remoteMessage.data?.body,
      data: remoteMessage?.data,
      // ios: {
      //   attachments: [
      //     {
      //       url: remoteMessage?.data?.url || '',
      //     },
      //   ],
      // },
      android: {
        channelId,
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
          launchActivity: 'default',
          // mainComponent: 'ManageTask',
        },
        // actions: [
        //   {
        //     title: 'Reply',
        //     pressAction: {
        //       id: 'reply',
        //     },
        //     input: true,
        //   },
        //   {
        //     title: 'Mark as read',
        //     pressAction: {
        //       id: 'mark-as-read',
        //     },
        //   },
        // ],
      },
    });
  } catch (error) {
    console.log('error-->', error);
  }
};
