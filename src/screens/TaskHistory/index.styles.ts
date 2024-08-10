import {colors} from 'common/theme/colors';
import {Spacing} from 'common/theme/spacing';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    card: {backgroundColor: colors.white, padding: 16},
    taskName: {color: colors.primary, marginTop: 5},
    dueDate: {alignItems: 'flex-end', paddingRight: 16},
    lineView: {marginLeft: '18%'},
    verticalLine: {
      position: 'absolute',
      left: 72.5,
      top: -20,
      width: 3,
      backgroundColor: colors.primary_005,
    },
    circle: {
      borderRadius: 7,
      height: 15,
      width: 15,
      backgroundColor: colors.primary_007,
      marginHorizontal: Spacing.basic,
      zIndex: 9999,
    },
    timeStyle: {
      maxWidth: 50,
      width: 50,
    },
    HistoryContainerStyle: {
      paddingBottom: 100,
    },
    status: {marginBottom: 16},
    day: {marginLeft: '28%', marginVertical: 10, color: colors.primary_003},
  });
  return mergeStyles;
};
