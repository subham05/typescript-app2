import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    commonStyles: {
      // height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      borderRadius: 3,

      // width: Dimensions.get('screen').width / 4.2,
      // backgroundColor: colors.white,
    },
    reopen: {
      borderColor: colors.primary,
      color: colors.primary,
    },
    inprogress: {
      borderColor: colors.blue_003,
      color: colors.blue_003,
    },
    resolve: {
      borderColor: colors.primary_002,
      color: colors.primary_002,
    },
    completed: {
      borderColor: colors.completedText,
      color: colors.completedText,
    },
    assigned: {
      borderColor: colors.black,
      color: colors.black,
    },
    overdue: {
      borderColor: colors.orange,
      color: colors.orange,
    },
    reject: {
      borderColor: colors.primary,
      color: colors.primary,
    },
    awaitingApproval: {
      width: Dimensions.get('screen').width / 4.2,
      textAlign: 'center',
      borderColor: colors.primary_002,
      color: colors.primary_002,
    },
  });
  return mergeStyles;
};
