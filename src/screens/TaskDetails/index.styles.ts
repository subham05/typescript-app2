import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    companiesContainer: {
      paddingBottom: 40,
    },
    input: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.regular,
      color: colors.primary_003,
    },
    inputDescription: {
      borderWidth: 1,
      paddingTop: 0,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.regular,
      alignItems: 'flex-start',
      color: colors.primary_003,
    },
    inputRow: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.small,
      width: '47%',
    },
    dropdown: {
      padding: 10,
      borderWidth: 1,
      marginTop: 10,
      height: 40,
      fontSize: 15,
      borderColor: colors.white,
      backgroundColor: colors.white,
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
      color: colors.red,
    },
    label: {
      marginTop: 15,
    },
    buttonView: {
      justifyContent: 'space-between',
    },
    fieldView: {
      backgroundColor: colors.white,
    },
    icon: {
      justifyContent: 'center',
      backgroundColor: colors.white,
      height: 40,
      marginTop: 5,
      padding: 5,
      paddingLeft: '10%',
    },
    iconTime: {
      justifyContent: 'center',
      backgroundColor: colors.white,
      height: 40,
      marginTop: 5,
      padding: 5,
      paddingLeft: '16%',
    },
    attachmentView: {
      backgroundColor: colors.white,
      justifyContent: 'space-between',
    },
    attachment: {
      padding: 10,
    },
    attachmentIcon: {
      marginTop: 3,
      marginRight: 10,
    },
    downloadIcon: {
      marginTop: 3,
      padding: 10,
    },
    attachmentName: {
      color: colors.primary_003,
    },
    share: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    shareButton: {
      marginBottom: 15,
      marginHorizontal: 16,
      backgroundColor: colors.primary,
    },
    centeredView: {},
    bottomModalView: {
      backgroundColor: 'white',
      paddingVertical: 15,
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    shareVia: {
      padding: 15,
      textAlign: 'center',
      color: colors.black,
    },
    image: {
      height: 47,
      width: 47,
    },
    shareText: {
      textAlign: 'center',
      color: colors.black,
      marginTop: 5,
    },
    cancel: {
      marginTop: 30,
    },
  });
  return mergeStyles;
};
