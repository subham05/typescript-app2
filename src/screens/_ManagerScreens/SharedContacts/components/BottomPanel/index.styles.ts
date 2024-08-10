import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    swipableView: {
      marginTop: '10%',
      marginLeft: 25,
    },
    swipablemodalDevide: {
      height: 1.5,
      width: '100%',
      // backgroundColor: colors.grey_002,
      marginVertical: 20,
    },
    swipableshareText: {
      marginLeft: 10,
      textAlign: 'center',
      color: colors.black,
    },
  });
  return shareStyles;
};
