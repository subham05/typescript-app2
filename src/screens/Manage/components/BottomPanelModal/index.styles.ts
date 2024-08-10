import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    flex: {flex: 1},
    container: {
      flex: 1,
      backgroundColor: colors.white,
      bottom: 0,
    },
    clearAll: {
      color: colors.primary_002,
      right: -8,
    },
    horizontalLine: {
      marginTop: 5,
    },
    attachmentView: {
      marginBottom: 16,
      // width: Dimensions.get('screen').width,
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
      paddingVertical: 15,
      paddingRight: 75,
      paddingLeft: 5,
      marginVertical: 1,
      backgroundColor: colors.grey_009,
    },
    selectedOption: {
      paddingVertical: 15,
      right: 15,
      paddingLeft: 15,
      marginVertical: 1,
      width: 100,
      borderRadius: 3,
      backgroundColor: colors.grey_009,
    },
    notSelectedOption: {
      paddingVertical: 15,
      right: 15,
      paddingLeft: 15,
      marginVertical: 1,
      width: 100,
      borderRadius: 3,
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
      padding: 13,
      textAlign: 'center',
      color: colors.white,
    },
    loginButton: {
      height: 47,
      marginTop: 15,
      backgroundColor: colors.primary,
      width: '47%',
      borderRadius: 3,
    },
    addMore: {
      padding: 11,
      textAlign: 'center',
      color: colors.primary,
    },
    addMoreButton: {
      height: 47,
      marginTop: 15,
      backgroundColor: colors.white,
      width: '47%',
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 3,
    },
    buttonView: {
      justifyContent: 'space-between',
      // marginBottom: 16,
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
      backgroundColor: colors.grey_009,
      width: 35,
      right: 15,
      height: 53,
      marginVertical: 1,
    },
    filterDotBlankNotSelected: {
      // backgroundColor: colors.grey_009,
      width: 35,
      right: 15,
      height: 53,
      marginVertical: 1,
    },
    filterDotSelected: {
      width: 35,
      right: 15,
      backgroundColor: colors.grey_009,
    },
    filterDotNotSelected: {
      paddingBottom: 22,
      right: 15,
      width: 35,
      height: 53,
      marginVertical: 1,
    },
    bottomModalView: {
      flex: 1,
      backgroundColor: 'white',
      paddingVertical: 15,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
      marginTop: 50,
    },
  });
  return mergeStyles;
};
