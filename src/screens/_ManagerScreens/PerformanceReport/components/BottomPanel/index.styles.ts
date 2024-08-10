import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    clearAll: {
      color: colors.primary_002,
      right: -8,
    },
    horizontalLine: {
      marginTop: 5,
    },
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderColor: colors.grey_008,
      borderWidth: 1,
      width: '90%',
      borderRadius: 3,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    input: {
      height: 35,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.small,
    },
    spaceAbove: {
      marginTop: 5,
    },
    selected: {
      paddingVertical: 15,
      paddingRight: 75,
      paddingLeft: 5,
      marginVertical: 1,
    },
    notSelected: {
      backgroundColor: colors.grey_009,
      paddingVertical: 15,
      paddingRight: 75,
      paddingLeft: 5,
      marginVertical: 1,
    },
    selectedOption: {
      paddingVertical: 15,
      right: 15,
      paddingLeft: 15,
      marginVertical: 1,
      width: 100,
    },
    notSelectedOption: {
      backgroundColor: colors.grey_009,
      paddingVertical: 15,
      right: 15,
      paddingLeft: 15,
      marginVertical: 1,
      width: 100,
    },
    subOptions: {
      marginLeft: 16,
    },
    dot: {
      backgroundColor: colors.primary,
      height: 15,
      width: 15,
      borderRadius: 15,
      alignSelf: 'center',
      marginRight: 10,
    },
    blankDot: {
      height: 20,
      width: 20,
      borderRadius: 15,
      alignSelf: 'center',
      marginRight: 10,
    },
    icon: {
      marginTop: 3,
      marginRight: 10,
    },
    genderText: {
      color: colors.primary_003,
    },
    error: {
      fontSize: FontSizes.small,
      color: 'red',
    },
    label: {
      marginTop: 15,
    },
    login: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    loginButton: {
      marginTop: 15,
      backgroundColor: colors.primary,
      width: '47%',
    },
    addMore: {
      padding: 15,
      textAlign: 'center',
      color: colors.primary,
    },
    addMoreButton: {
      marginTop: 15,
      backgroundColor: colors.grey_001,
      width: '47%',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    buttonView: {
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    filterDot: {
      height: 8,
      width: 8,
      borderRadius: 8,
      backgroundColor: colors.primary,
      marginTop: 23,
      left: 15,
    },
    filterDotBlankSelected: {
      // backgroundColor: colors.grey_009,
      width: 35,
      right: 15,
      height: 53,
      marginVertical: 1,
    },
    filterDotBlankNotSelected: {
      backgroundColor: colors.grey_009,
      width: 35,
      right: 15,
      height: 53,
      marginVertical: 1,
    },
    filterDotSelected: {
      width: 35,
      right: 15,
    },
    filterDotNotSelected: {
      backgroundColor: colors.grey_009,
      paddingBottom: 22,
      right: 15,
      width: 35,
      height: 53,
      marginVertical: 1,
    },
  });
  return mergeStyles;
};
