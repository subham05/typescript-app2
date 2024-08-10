import {Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import {checkMultiplePermissions, getMultiplePermissions} from './common';

const galleryPermission =
  Platform.OS === 'ios'
    ? [PERMISSIONS.IOS.MICROPHONE, PERMISSIONS.IOS.SPEECH_RECOGNITION]
    : [PERMISSIONS.ANDROID.RECORD_AUDIO];

export const checkMicSpeechToTextPermission = async () => {
  const {isPermissionGranted, result} = await checkMultiplePermissions(
    galleryPermission,
  );
  return {isPermissionGranted, result};
};

export const getMicSpeechToTextPermission = async () => {
  const {isPermissionGranted, statuses} = await getMultiplePermissions(
    galleryPermission,
  );

  return {isPermissionGranted, statuses};
};
