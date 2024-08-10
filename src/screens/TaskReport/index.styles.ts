import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';
import {respHeight} from 'screens/Calendar/utils/responsive';

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
      paddingVertical: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chart: {
      marginLeft: -20,
      marginRight: 30,
    },
    assignedDot: {
      height: 12,
      width: 12,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
    },
    completedDot: {
      height: 12,
      width: 12,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
    },
    inprogressDot: {
      height: 12,
      width: 12,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
    },
    resolvedDot: {
      height: 12,
      width: 12,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
    },
    reopenedDot: {
      height: 12,
      width: 12,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
    },
    overdueDot: {
      height: 12,
      width: 12,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
    },
    spacing: {
      paddingBottom: respHeight(250),
    },
  });
  return mergeStyles;
};
