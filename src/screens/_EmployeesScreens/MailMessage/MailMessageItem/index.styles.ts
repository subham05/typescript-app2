import {StyleSheet} from 'react-native';
import {colors} from 'common/theme/colors';
export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    time: {
      marginTop: 5,
    },
    borderView: {
      borderColor: colors.grey_008,
      borderWidth: 2,
      borderRadius: 5,
    },
    borderTop: {
      marginTop: 16,
    },
    borderBottom: {
      marginBottom: 16,
    },
    openFlex: {
      flex: 0.3,
    },
    dateFlex: {
      flex: 0.23,
    },
    createTask: {
      textAlign: 'center',
      color: colors.white,
    },
    createTaskButton: {
      backgroundColor: colors.primary,
      height: 40,
      width: '50%',
      marginRight: 10,
      justifyContent: 'center',
    },
    relatedTask: {
      textAlign: 'center',
      color: colors.primary,
    },
    relatedTaskButton: {
      backgroundColor: colors.grey_001,
      height: 40,
      width: '40%',
      borderWidth: 1,
      borderColor: colors.primary,
      justifyContent: 'center',
    },
    childrenGap: {
      marginBottom: -20,
    },
    bottomGap: {
      marginBottom: 20,
    },

    toName: {
      width: 100,
    },
  });
  return mergeStyles;
};
