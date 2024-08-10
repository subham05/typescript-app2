import {
  checkLocationPermission,
  getLocationPermission,
} from '../permission/ReadLocation';

export const takeLocationPermission = (
  showAlert: () => void,
  openModal: (isWorkAddressClicked: boolean) => void,
  isWorkAddressClick?: boolean,
) => {
  checkLocationPermission().then(res => {
    if (!res.isPermissionGranted) {
      if (res.result === 'denied') {
        getLocationPermission().then(resp => {
          (resp.statuses['android.permission.ACCESS_FINE_LOCATION'] ===
            'blocked' ||
            resp.statuses['ios.permission.LOCATION_WHEN_IN_USE'] ===
              'blocked') &&
            showAlert();
          resp.isPermissionGranted && openModal(isWorkAddressClick!);
        });
      } else if (res.result === 'blocked') {
        showAlert();
      }
    } else {
      openModal(isWorkAddressClick!);
    }
  });
};
