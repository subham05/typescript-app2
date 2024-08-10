import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    eventsContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    companyName: {
      width: 160,
    },
    bellIcon: {
      marginTop: -5,
    },
    count: {
      color: colors.white,
      padding: 2,
      backgroundColor: colors.primary,
      textAlign: 'center',
      borderRadius: 10,
      height: 20,
      width: 20,
      top: 12,
      left: 12,
      overflow: 'hidden',
    },
    icon: {
      marginTop: 10,
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
    chartView: {
      backgroundColor: colors.white,
      marginBottom: 16,
    },
    chart: {
      marginLeft: -17,
    },
    statusView: {
      top: -10,
      left: 7,
    },
    overdue: {
      left: -12,
    },
    reOpened: {
      left: -5,
    },
  });
  return mergeStyles;
};
