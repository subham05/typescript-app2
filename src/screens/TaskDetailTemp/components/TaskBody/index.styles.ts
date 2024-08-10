import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
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
    inputText: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.grey_002,
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
    inputComment: {
      height: 30,
      padding: 1,
      borderWidth: 1,
      width: '70%',
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.regular,
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
    label: {
      marginTop: 15,
    },
    buttonView: {
      justifyContent: 'space-between',
      marginBottom: 20,
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
      borderRadius: 3,
    },
    attachment: {
      padding: 10,
    },
    attachmentIcon: {
      marginTop: 3,
      marginRight: 10,
    },
    commentIcon: {
      marginTop: 6,
      marginRight: 10,
    },
    smallIcon: {
      marginRight: 5,
    },
    downloadIcon: {
      marginTop: 3,
      padding: 10,
    },
    attachmentName: {
      color: colors.primary_003,
    },
  });
  return mergeStyles;
};
