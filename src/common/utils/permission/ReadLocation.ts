import {Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import {checkPermission, getMultiplePermissions} from './common';

const locationPermission =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

export const checkLocationPermission = async () => {
  const {isPermissionGranted, result} = await checkPermission(
    locationPermission,
  );
  return {isPermissionGranted, result};
};

export const getLocationPermission = async () => {
  const {isPermissionGranted, statuses} = await getMultiplePermissions([
    locationPermission,
  ]);

  return {isPermissionGranted, statuses};
};
