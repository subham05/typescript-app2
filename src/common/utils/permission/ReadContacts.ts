import {Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import {checkPermission, getMultiplePermissions} from './common';

const contactPermission =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.CONTACTS
    : PERMISSIONS.ANDROID.READ_CONTACTS;

export const checkContactPermission = async () => {
  const {isPermissionGranted, result} = await checkPermission(
    contactPermission,
  );
  return {isPermissionGranted, result};
};

export const getContactPermission = async () => {
  const {isPermissionGranted, statuses} = await getMultiplePermissions([
    contactPermission,
  ]);

  return {isPermissionGranted, statuses};
};
