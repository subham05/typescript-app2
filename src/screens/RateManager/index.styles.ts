import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    viewContact: {
      marginLeft: 10,
      marginTop: 3,
      marginBottom: 10,
      width: '75%',
    },
    editButton: {
      right: 10,
      top: 13,
    },

    showInput: {
      height: 40,
      borderWidth: 1,
      paddingLeft: 10,
      paddingTop: 6,
      marginTop: 5,
      backgroundColor: colors.grey_012,
      borderColor: colors.grey_012,
      // fontFamily: AppFonts.medium,
      // fontSize: FontSizes.small,
      color: colors.primary_003,
      borderRadius: 3,
    },
    showDOBInput: {
      height: 40,
      borderWidth: 1,
      paddingLeft: 10,
      paddingTop: 6,
      marginTop: 5,
      backgroundColor: colors.grey_012,
      borderColor: colors.grey_012,
      // fontFamily: AppFonts.medium,
      // fontSize: FontSizes.small,
      color: colors.primary_003,
      borderRadius: 3,
    },
    inputDescription: {
      borderWidth: 1,
      paddingLeft: 10,
      paddingTop: 6,
      marginTop: 5,
      backgroundColor: colors.grey_012,
      borderColor: colors.grey_012,
      // fontFamily: AppFonts.medium,
      // fontSize: FontSizes.regular,
      alignItems: 'flex-start',
      color: colors.primary_003,
    },
    icon: {
      justifyContent: 'center',
      backgroundColor: colors.grey_012,
      height: 40,
      marginTop: 3,
      right: 10,
    },
    label: {
      marginBottom: -7,
      color: colors.primary_003,
    },
    dob: {
      backgroundColor: colors.grey_012,
      borderRadius: 3,
    },
    genderLabel: {marginBottom: -10, color: colors.primary_003},
    switchContainer: {
      width: 32,
      height: 20,
      borderRadius: 15,
    },
    switchContainerOff: {
      width: 31,
      height: 20,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.black,
    },
    switchCircle: {
      width: 16,
      height: 16,
      borderRadius: 8,
    },
  });
  return mergeStyles;
};
