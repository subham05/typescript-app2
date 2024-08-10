import {
  check,
  RESULTS,
  requestMultiple,
  checkMultiple,
  Permission,
} from 'react-native-permissions';
import {units} from '../sizeEnum';

// This function can be used anywhere as it supports multiple permissions.
// It checks for permissions and then requests for it.

export const getMultiplePermissions = async (permissions: Permission[]) => {
  let isPermissionGranted = false;
  const statuses = await requestMultiple(permissions);
  for (var index in permissions) {
    if (
      statuses[permissions[index]] === RESULTS.GRANTED ||
      statuses[permissions[index]] === RESULTS.LIMITED
    ) {
      isPermissionGranted = true;
    } else {
      isPermissionGranted = false;
      break;
    }
  }

  return {isPermissionGranted, statuses};
};

// In case you want to check a single permission
export const checkPermission = async (permission: Permission) => {
  var isPermissionGranted = false;
  const result = await check(permission);
  switch (result) {
    case RESULTS.GRANTED:
      isPermissionGranted = true;
      break;
    case RESULTS.LIMITED:
      isPermissionGranted = true;
      break;
    case RESULTS.DENIED:
      isPermissionGranted = false;
      break;
    case RESULTS.BLOCKED:
      isPermissionGranted = false;
      break;
    case RESULTS.UNAVAILABLE:
      isPermissionGranted = false;
      break;
  }

  return {isPermissionGranted, result};
};

export const checkMultiplePermissions = async (permissions: Permission[]) => {
  const result = await checkMultiple([...permissions]);
  var isPermissionGranted = false;
  for (var index in permissions) {
    if (result[permissions[index]] === RESULTS.GRANTED) {
      isPermissionGranted = true;
    } else {
      isPermissionGranted = false;
      break;
    }
  }
  return {isPermissionGranted, result};
};

export const toConvertKB = (x: string) => {
  let l = 0,
    n = parseInt(x, 10) || 0;
  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
};
