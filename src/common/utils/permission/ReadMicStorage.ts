import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {PERMISSIONS, Permission} from 'react-native-permissions';
import {checkMultiplePermissions, getMultiplePermissions} from './common';

let micPermission: Permission[];
if (Platform.OS === 'ios') {
  micPermission = [PERMISSIONS.IOS.MICROPHONE];
} else if (parseInt(DeviceInfo.getSystemVersion(), 10) < 13) {
  micPermission = [
    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
  ];
} else {
  micPermission = [PERMISSIONS.ANDROID.RECORD_AUDIO];
}
export const checkMicStoragePermission = async () => {
  const {isPermissionGranted, result} = await checkMultiplePermissions(
    micPermission,
  );
  return {isPermissionGranted, result};
};

export const getMicStoragePermission = async () => {
  const {isPermissionGranted, statuses} = await getMultiplePermissions(
    micPermission,
  );

  return {isPermissionGranted, statuses};
};
