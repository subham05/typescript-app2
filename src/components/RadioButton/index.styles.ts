import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    gender: {
      marginRight: 35,
    },
    icon: {
      marginTop: 3,
      marginRight: 10,
    },
    genderText: {
      color: colors.primary_003,
    },
    label: {
      marginTop: 15,
    },
  });
  return mergeStyles;
};
