import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    eventsContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    arrow: {
      top: 10,
    },
    chartBackground: {
      backgroundColor: colors.white,
      marginBottom: 16,
      paddingLeft: 10,
      paddingTop: 10,
      paddingBottom: 10,
    },
    assignedDot: {
      height: 12,
      width: 12,
      backgroundColor: colors.grey_008,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
    },
    completedDot: {
      height: 12,
      width: 12,
      backgroundColor: colors.green_002,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
    },
    inprogressDot: {
      height: 12,
      width: 12,
      backgroundColor: colors.blue_002,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
    },
    resolvedDot: {
      height: 12,
      width: 12,
      backgroundColor: colors.primary_002,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
    },
    reopenedDot: {
      height: 12,
      width: 12,
      backgroundColor: colors.primary,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
    },
    overdueDot: {
      height: 12,
      width: 12,
      backgroundColor: colors.orange,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
    },
  });
  return mergeStyles;
};
