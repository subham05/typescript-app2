import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    scrollview: {
      backgroundColor: colors.white,
      flex: 1,
      marginVertical: 20,
    },
    marginTopView: {
      marginTop: 10,
    },
  });
  return mergeStyles;
};
