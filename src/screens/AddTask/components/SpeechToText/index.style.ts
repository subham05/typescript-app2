import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    ModalContainer: {
      margin: 0,
      justifyContent: 'flex-end',
      borderRadius: 10,
    },
    ViewContainer: {
      backgroundColor: 'white',
      paddingVertical: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    TextView: {
      // bottom: 50,
      paddingHorizontal: 10,
    },
    LottieAnimation: {
      // marginTop: 50,
      width: '50%',
    },
  });
  return mergeStyles;
};
