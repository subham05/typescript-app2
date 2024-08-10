import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    view: {
      marginTop: 5,
    },
    smallLabel: {
      color: colors.primary_003,
      marginBottom: 5,
      width: 60,
    },
    smallIcon: {
      marginRight: 5,
    },
    date: {
      marginTop: 3,
    },
    priority: {
      marginLeft: 4,
    },
  });
  return mergeStyles;
};
