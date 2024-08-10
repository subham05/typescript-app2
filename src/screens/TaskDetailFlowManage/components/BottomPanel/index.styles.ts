import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    swipable: {
      marginTop: '5%',
    },
    line: {
      height: 1,
      backgroundColor: colors.grey_002,
      marginTop: 10,
    },
    icon: {
      marginTop: 10,
    },
  });
  return mergeStyles;
};
