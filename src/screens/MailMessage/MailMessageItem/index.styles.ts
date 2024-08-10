import {StyleSheet} from 'react-native';
import {colors} from 'common/theme/colors';
export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    time: {
      marginTop: 5,
    },
    borderView: {
      borderColor: colors.grey_008,
      borderWidth: 0.5,
      borderRadius: 5,
    },
    borderTop: {
      marginTop: 16,
    },
    borderBottom: {
      marginBottom: 16,
    },
    openFlex: {
      width: 35,
    },
    dateFlex: {
      flex: 0.23,
    },
    createTask: {
      textAlign: 'center',
      color: colors.white,
    },
    createTaskButton: {
      // backgroundColor: colors.primary,
      height: 38,
      width: '40%',
      marginRight: 10,
      // justifyContent: 'center',
      borderRadius: 3,
    },
    relatedTask: {
      textAlign: 'center',
      color: colors.primary,
    },
    relatedTaskButton: {
      height: 38,
      borderWidth: 1,
      borderRadius: 3,
    },
    childrenGap: {
      marginBottom: -20,
      marginTop: 16,
    },
    bottomGap: {
      marginBottom: 20,
    },

    toName: {
      width: 100,
    },
    status: {
      position: 'absolute',
      right: 0,
      top: -30,
      backgroundColor: colors.grey_001,
      borderWidth: 1,
      padding: 1,
      paddingHorizontal: 10,
      borderRadius: 3,
      height: 25,
    },
    buttonSpacing: {
      paddingVertical: 8,
    },
  });
  return mergeStyles;
};
