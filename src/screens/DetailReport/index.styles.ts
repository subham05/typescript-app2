import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const inviteStyles = StyleSheet.create({
    stack: {
      backgroundColor: colors.white,
      paddingVertical: 16,
      marginVertical: 10,
      paddingBottom: 16,
    },
    text: {
      color: colors.primary_003,
    },
    number: {
      color: colors.primary,
      marginRight: '10%',
    },
    heading: {
      marginTop: 16,
      marginBottom: 8,
    },
    assigned: {
      textAlign: 'center',
    },
    completed: {
      textAlign: 'center',
      color: colors.green,
    },
    inProgress: {
      textAlign: 'center',
      color: colors.blue_002,
    },
    resolved: {
      textAlign: 'center',
      color: colors.primary_002,
    },
    reOpened: {
      textAlign: 'center',
      color: colors.primary,
    },
    overdue: {
      textAlign: 'center',
      color: colors.orange,
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
    horizontalView: {marginLeft: 16, marginRight: 16},
    marginHorizontal: {marginRight: 16},
    lottieViewContainer: {width: 40, height: 40, marginLeft: -5},
    redZoneText: {color: colors.red, marginTop: 8},
  });
  return inviteStyles;
};
