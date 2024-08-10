import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    companiesContainer: {
      paddingBottom: 40,
    },
    input: {
      height: 48,
      borderWidth: 1,
      paddingLeft: 10,
      paddingTop: 10,
      marginTop: 5,
      backgroundColor: colors.grey_012,
      borderColor: colors.grey_012,
      // fontFamily: AppFonts.medium,
      // fontSize: FontSizes.regular,
      color: colors.primary_003,
    },
    inputDescription: {
      borderWidth: 1,
      // paddingTop: 0,
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
    inputRow: {
      height: 40,
      borderWidth: 1,
      paddingLeft: 10,
      paddingTop: 6,
      marginTop: 5,
      backgroundColor: colors.grey_012,
      borderColor: colors.grey_012,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.small,
      width: '47%',
    },
    inputDate: {
      height: 40,
      borderWidth: 1,
      paddingLeft: 10,
      paddingTop: 6,
      marginTop: 5,
      // paddingTop: 5,
      backgroundColor: colors.grey_012,
      borderColor: colors.grey_012,
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      color: colors.primary_003,
    },
    inputVenue: {
      height: 80,
      borderWidth: 1,
      paddingLeft: 10,
      paddingTop: 6,
      marginTop: 5,
      backgroundColor: colors.grey_012,
      borderColor: colors.grey_012,
      // fontFamily: AppFonts.medium,
      // fontSize: FontSizes.regular,
      color: colors.primary_003,
    },
    calendar: {
      right: 10,
    },
    date: {
      color: colors.primary_003,
    },
    dropdown: {
      padding: 10,
      borderWidth: 1,
      marginTop: 10,
      height: 40,
      fontSize: 15,
      borderColor: colors.grey_012,
      backgroundColor: colors.grey_012,
      borderRadius: 5,
      color: colors.grey_004,
    },
    dropdownContainer: {
      borderColor: colors.grey_005,
    },
    modalContainer: {
      height: 400,
    },
    error: {
      fontSize: FontSizes.small,
      color: 'red',
    },
    label: {
      marginTop: 15,
      marginBottom: 5,
      color: colors.primary_003,
    },
    login: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    loginButton: {
      marginTop: 15,
      backgroundColor: colors.primary,
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
    fieldView: {
      backgroundColor: colors.grey_012,
      justifyContent: 'space-between',
      width: '48%',
      borderRadius: 3,
    },
    icon: {
      justifyContent: 'center',
      backgroundColor: colors.grey_012,
      height: 40,
      marginTop: 5,
      padding: 5,
    },
    iconTime: {
      justifyContent: 'center',
      backgroundColor: colors.grey_012,
      height: 40,
      marginTop: 5,
      padding: 5,
      paddingLeft: '16%',
    },
    share: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    shareButton: {
      bottom: 5,
      marginHorizontal: 16,
      backgroundColor: colors.primary,
    },
    item: {
      padding: 17,
      // flexDirection: 'row',
      // justifyContent: 'space-between',
      // alignItems: 'center',
    },
    placeholderStyle: {
      fontSize: FontSizes.small,
    },
    menuContainer: {
      marginTop: 22,
      height: 126,
      width: 166,
      justifyContent: 'center',
    },
    linkedSubtask: {
      color: colors.black,
      padding: 10,
      paddingHorizontal: 23,
    },
    centeredView: {},
    modalView: {
      backgroundColor: colors.white,
      padding: 15,
    },
    shareVia: {
      padding: 15,
    },
    modal: {
      alignSelf: 'flex-end',
    },
    reopenModal: {
      padding: 15,
      color: colors.primary,
    },
    subjectView: {
      overflow: 'hidden',
      borderColor: colors.grey_012,
      borderWidth: 1,
      backgroundColor: colors.grey_012,
      height: 50,
    },
    descriptionView: {
      borderColor: colors.grey_012,
      borderWidth: 1,
      backgroundColor: colors.grey_012,
      maxHeight: Dimensions.get('screen').height / 7,
    },
    subjectText: {
      paddingHorizontal: 15,
      fontSize: FontSizes.medium,
      fontFamily: AppFonts.regular,
      borderRadius: 3,
      paddingVertical: 9,
      color: colors.primary_003,
    },
  });
  return mergeStyles;
};
