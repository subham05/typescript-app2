import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    label: {
      marginTop: 15,
      color: colors.primary_003,
    },
    emergency: {
      borderWidth: 1,
      padding: 8,
      borderColor: colors.grey_001,
      borderRadius: 3,
    },
    emergencyText: {
      color: colors.emergencyText,
    },
    high: {
      borderWidth: 1,
      borderColor: colors.grey_001,
      padding: 8,
      borderRadius: 3,
    },
    highText: {
      color: colors.red,
    },
    medium: {
      borderWidth: 1,
      borderColor: colors.grey_001,
      padding: 8,
      borderRadius: 3,
    },
    mediumText: {
      color: colors.mediumText,
    },
    low: {
      borderWidth: 1,
      borderColor: colors.grey_001,
      padding: 8,
      borderRadius: 3,
    },
    lowText: {
      color: colors.primary,
    },
    emergencySelected: {
      borderWidth: 1,
      borderColor: colors.emergencyText,
      backgroundColor: colors.emergencyBackground,
      padding: 8,
      borderRadius: 3,
    },
    highSelected: {
      borderWidth: 1,
      borderColor: colors.red,
      backgroundColor: colors.highBackground,
      padding: 8,
      borderRadius: 3,
    },
    mediumSelected: {
      borderWidth: 1,
      borderColor: colors.mediumText,
      backgroundColor: colors.mediumBackground,
      padding: 8,
      borderRadius: 3,
    },
    lowSelected: {
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.lowBackground,
      padding: 8,
      borderRadius: 3,
    },
  });
  return mergeStyles;
};
