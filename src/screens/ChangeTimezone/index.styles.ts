import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    flex: {flex: 1, marginTop: 10},
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
    error: {
      fontSize: FontSizes.small,
      color: colors.red,
    },
    label: {
      // marginTop: 15,
      marginBottom: 5,
      color: colors.primary_003,
    },
    icon: {
      justifyContent: 'center',
      backgroundColor: colors.white,
      height: 40,
      marginTop: 5,
      padding: 5,
      paddingLeft: '10%',
    },
    attachmentView: {
      backgroundColor: colors.white,
      justifyContent: 'space-between',
      borderRadius: 3,
    },
    attachment: {
      padding: 10,
      paddingVertical: 20,
    },
    attachmentIcon: {
      marginTop: 3,
      marginRight: 10,
    },
    downloadIcon: {
      marginTop: 3,
      padding: 10,
      paddingVertical: 20,
    },
    attachmentName: {
      color: colors.black,
    },
    share: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    shareButton: {
      marginTop: 15,
      marginHorizontal: '30%',
    },
    save: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    saveButton: {
      marginTop: 15,
      // backgroundColor: colors.primary,
      width: '47%',
      marginBottom: 16,
      borderRadius: 3,
    },
    addMore: {
      padding: 13,
      textAlign: 'center',
      color: colors.primary,
    },
    addMoreButton: {
      marginTop: 15,
      // backgroundColor: colors.grey_001,
      width: '47%',
      // width: '94%',
      // borderWidth: 1,
      // borderColor: colors.primary,
      marginBottom: 16,
      borderRadius: 3,
    },
    saveButtonStack: {
      flex: 1,
      justifyContent: 'flex-end',
      // marginTop: isIPhoneX()
      //   ? Dimensions.get('screen').height / 2.5
      //   : Dimensions.get('screen').height / 3,
    },
    fixedDescriptionHeight: {height: 100},
    scrollView: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    flexOne: {
      flex: 1,
    },
  });
  return mergeStyles;
};
