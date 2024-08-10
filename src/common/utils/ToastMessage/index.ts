import Toast from 'react-native-toast-message';

export const showToast = (message = 'Something went wrong') => {
  Toast.show({type: 'success', text1: message});
};
