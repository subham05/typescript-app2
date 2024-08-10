import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    swipableView: {
      marginTop: '10%',
      marginLeft: 25,
    },
    swipableModalDivide: {
      height: 1.5,
      width: '100%',
      backgroundColor: colors.grey_002,
      marginVertical: 20,
    },
    swipableShareText: {
      marginLeft: 10,
      textAlign: 'center',
      color: colors.black,
    },
  });
  return shareStyles;
};
