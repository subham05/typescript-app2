import {Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import {checkPermission, getMultiplePermissions} from './common';

const galleryPermission =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.PHOTO_LIBRARY
    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

export const checkGalleryPermission = async () => {
  const {isPermissionGranted, result} = await checkPermission(
    galleryPermission,
  );
  return {isPermissionGranted, result};
};

export const getGalleryPermission = async () => {
  const {isPermissionGranted, statuses} = await getMultiplePermissions([
    galleryPermission,
  ]);

  return {isPermissionGranted, statuses};
};
