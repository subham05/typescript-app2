import {Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import {checkPermission, getMultiplePermissions} from './common';

const cameraPermission =
  Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

export const checkCameraPermission = async () => {
  const {isPermissionGranted, result} = await checkPermission(cameraPermission);
  return {isPermissionGranted, result};
};

export const getCameraPermission = async () => {
  const {isPermissionGranted, statuses} = await getMultiplePermissions([
    cameraPermission,
  ]);

  return {isPermissionGranted, statuses};
};
