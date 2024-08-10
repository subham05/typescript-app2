import {Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import {checkPermission, getMultiplePermissions} from './common';

const storagePermission =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.PHOTO_LIBRARY
    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

export const checkStoragePermission = async () => {
  const {isPermissionGranted, result} = await checkPermission(
    storagePermission,
  );
  return {isPermissionGranted, result};
};

export const getStoragePermission = async () => {
  const {isPermissionGranted, statuses} = await getMultiplePermissions([
    storagePermission,
  ]);

  return {isPermissionGranted, statuses};
};
