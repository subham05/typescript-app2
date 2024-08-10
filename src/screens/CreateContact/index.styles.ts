import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    photoView: {
      height: 72,
      width: 72,
      borderRadius: 36,
      backgroundColor: colors.primary_003,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      alignSelf: 'center',
    },
    photoText: {color: colors.primary_003, textAlign: 'center'},
    contactContainerStyle: {
      height: 50,
      width: '100%',
      backgroundColor: colors.white,
    },
    errorContainerStyle: {
      height: 50,
      width: '100%',
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: 'red',
    },
    contactTextInputStyles: {
      paddingVertical: 0,
      backgroundColor: colors.white,
    },
    labelStyles: {color: colors.primary_003},
    error: {
      fontSize: FontSizes.small,
      color: colors.red_002,
    },
  });
  return mergeStyles;
};
