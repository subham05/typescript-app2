import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    commonStyleOutlined: {
      height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      borderRadius: 2,
    },
    commonStyle: {
      height: 25,
      padding: 4,
      paddingHorizontal: 10,
    },
    emergency: {
      backgroundColor: colors.emergencyBackground,
      // borderColor: colors.emergencyBackground,
      color: colors.emergencyText,
    },
    high: {
      backgroundColor: colors.highBackground,
      // borderColor: colors.highBackground,
      color: colors.red,
    },
    medium: {
      backgroundColor: colors.mediumBackground,
      // borderColor: colors.mediumBackground,
      color: colors.yellow,
    },
    low: {
      backgroundColor: colors.lowBackground,
      // borderColor: colors.lowBackground,
      color: colors.primary,
    },
    emergencyOutlined: {
      borderColor: colors.emergencyText,
      color: colors.emergencyText,
    },
    highOutlined: {
      borderColor: colors.red,
      color: colors.red,
    },
    mediumOutlined: {
      borderColor: colors.yellow,
      color: colors.yellow,
    },
    lowOutlined: {
      borderColor: colors.primary,
      color: colors.primary,
    },
  });
  return mergeStyles;
};
