import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    showInput: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.small,
      color: colors.primary_003,
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
    labelDob: {marginBottom: 5},
  });
  return mergeStyles;
};
