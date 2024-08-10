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
      marginTop: 15,
    },
    dob: {
      backgroundColor: colors.grey_012,
      borderRadius: 3,
    },
    genderLabel: {marginTop: 14},
  });
  return mergeStyles;
};
