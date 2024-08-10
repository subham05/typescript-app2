import Toast from 'react-native-simple-toast';

export const Gravities = {
  CENTER: Toast.CENTER,
  BOTTOM: Toast.BOTTOM,
  TOP: Toast.TOP,
};
export const showToast1 = (
  message = 'Something went wrong',
  gravity = Gravities.BOTTOM,
) => {
  Toast.showWithGravity(message, Toast.SHORT, gravity);
};
