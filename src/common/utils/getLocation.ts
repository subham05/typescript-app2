import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import {showToast} from 'common/utils/ToastMessage';
import {GOOGLE_API_KEY} from '@env';

export const getLocation = () => {
  return new Promise(resolve => {
    Geocoder.init(GOOGLE_API_KEY);
    Geolocation.getCurrentPosition(
      position => {
        const {coords} = position;
        Geocoder.from({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }).then(resp => {
          const {results} = resp;
          const {formatted_address} = results[0];
          const location = {
            lat: coords.latitude,
            lng: coords.longitude,
          };
          resolve({
            location: location,
            formatted_address: formatted_address,
            complete_address: results[0].address_components,
          });
        });
      },
      error => {
        // See error code charts below.
        showToast(error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 100,
        timeout: 15000,
        maximumAge: 10000,
        // enableHighAccuracy: true, // Note: -  Need to disable for production
        // distanceFilter: 100,
        // timeout: 15000,
        // // maximumAge: 10000,
      },
    );
  });
};
