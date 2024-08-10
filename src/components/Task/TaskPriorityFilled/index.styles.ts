import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    emergency: {
      height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.emergencyBackground,
      borderColor: colors.emergencyBackground,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.xSmall,
      color: colors.emergencyText,
    },
    high: {
      height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.highBackground,
      borderColor: colors.highBackground,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.xSmall,
      color: colors.red,
    },
    medium: {
      height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.mediumBackground,
      borderColor: colors.mediumBackground,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.xSmall,
      color: colors.yellow,
    },
    low: {
      height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.lowBackground,
      borderColor: colors.lowBackground,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.xSmall,
      color: colors.primary,
    },
  });
  return mergeStyles;
};
