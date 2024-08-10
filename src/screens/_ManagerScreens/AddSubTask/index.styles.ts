import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    companiesContainer: {
      paddingBottom: 40,
    },
    inputDate: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      backgroundColor: colors.white,
      borderColor: colors.grey_008,
      justifyContent: 'space-between',
      // alignItems: 'flex-start',
      borderRadius: 3,
    },
    calendar: {
      right: 10,
    },
    date: {
      color: colors.grey_005,
    },
    inputRow: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.small,
      width: '47%',
    },
    dropdown: {
      padding: 10,
      borderWidth: 1,
      height: 40,
      fontSize: 15,
      borderColor: colors.white,
      backgroundColor: colors.white,
      borderRadius: 5,
    },
    dropdownContainer: {
      borderColor: colors.grey_004,
    },
    modalContainer: {
      height: 400,
    },
    error: {
      fontSize: FontSizes.regular,
      color: colors.red_002,
    },
    label: {
      marginTop: 15,
    },
    fieldView: {
      width: '47%',
      borderRadius: 3,
    },
    attachFile: {
      color: colors.primary,
      marginTop: 16,
      marginBottom: 10,
    },
    icon: {
      marginTop: 20,
      right: 5,
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
    bottomModalView: {
      backgroundColor: 'white',
      paddingTop: 15,
      maxHeight: '60%',
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderColor: colors.grey_008,
      borderWidth: 1,
      marginTop: 16,
      borderRadius: 3,
      // width: '90%',
    },
  });
  return mergeStyles;
};
