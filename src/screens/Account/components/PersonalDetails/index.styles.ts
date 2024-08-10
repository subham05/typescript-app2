import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    showInput: {
      fontFamily: AppFonts.regular,
      fontSize: FontSizes.regular,
      color: colors.black,
    },
    disabledInput: {
      height: 48,
      borderWidth: 1,
      padding: 13,
      marginTop: 5,
      backgroundColor: colors.grey_012,
      borderColor: colors.grey_012,
      fontFamily: AppFonts.regular,
      fontSize: FontSizes.regular,
      color: colors.black,
    },
    showDate: {
      height: 36,
      borderWidth: 1,
      paddingLeft: 10,
      paddingTop: 7,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.small,
      color: colors.primary_003,
    },
    icon: {
      justifyContent: 'center',
      backgroundColor: colors.white,
      // height: 36,
      // marginTop: 5,
      right: 10,
    },
    label: {
      marginTop: 15,
      color: colors.primary_003,
    },
    labelHead: {
      marginTop: 25,
    },
    save: {
      padding: 10,
      textAlign: 'center',
      color: colors.white,
    },
    saveButton: {
      marginTop: 15,
      // backgroundColor: colors.primary,
      alignSelf: 'flex-end',
      width: '40%',
    },
    buttonView: {
      justifyContent: 'space-between',
    },
    fieldView: {
      width: '48%',
    },
    dob: {
      backgroundColor: colors.white,
    },
    inputNumber: {width: 170},
    labelDob: {marginBottom: 0, marginLeft: 20},
    editIcon: {marginTop: 6},
    dobView: {marginLeft: 20},
    nonEditView: {marginBottom: 16},
  });
  return mergeStyles;
};
