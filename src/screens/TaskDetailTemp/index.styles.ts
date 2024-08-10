import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    companiesContainer: {
      paddingBottom: 40,
    },
    topsmallview: {
      justifyContent: 'space-between',
    },
    view: {
      marginTop: 5,
    },
    reopen: {
      height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.white,
      borderColor: colors.primary,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.xSmall,
      color: colors.primary,
    },
    inprogress: {
      height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.white,
      borderColor: colors.blue_003,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.xSmall,
      color: colors.blue_003,
    },
    resolve: {
      height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.white,
      borderColor: colors.primary_002,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.xSmall,
      color: colors.primary_002,
    },
    completed: {
      height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.white,
      borderColor: colors.completedText,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.xSmall,
      color: colors.completedText,
    },
    emergency: {
      height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.white,
      borderColor: colors.emergencyText,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.xSmall,
      color: colors.emergencyText,
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
    smallLabel: {
      marginTop: 15,
      color: colors.primary_003,
      marginBottom: 5,
    },
    approve: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    approveButton: {
      marginTop: 15,
      backgroundColor: colors.primary,
      width: '47%',
    },
    disapprove: {
      padding: 14,
      textAlign: 'center',
      color: colors.primary,
    },
    disapproveButton: {
      marginTop: 15,
      backgroundColor: colors.white,
      width: '47%',
      borderWidth: 1,
      borderColor: colors.primary,
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
    share: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    shareButton: {
      marginBottom: 15,
      marginHorizontal: '30%',
      backgroundColor: colors.primary,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.black_001,
    },
    modalView: {
      backgroundColor: 'white',
      padding: 15,
      width: Dimensions.get('screen').width - 30,
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
    image: {
      height: 47,
      width: 47,
    },
    shareText: {
      textAlign: 'center',
      color: colors.black,
    },
    cancel: {
      marginTop: 30,
    },
    centeredViewTop: {
      flex: 1,
      backgroundColor: colors.black_001,
    },
    modalMainViewTop: {
      alignSelf: 'flex-end',
      marginTop: 25,
      marginRight: 25,
    },
    modalViewTop: {
      backgroundColor: 'white',
      padding: 15,
      width: Dimensions.get('screen').width - 200,
    },
    viewTop: {
      alignItems: 'center',
    },
    linkedSubtask: {
      textAlign: 'center',
      color: colors.black,
      padding: 10,
      paddingHorizontal: 23,
    },
    iconTop: {
      justifyContent: 'center',
      marginLeft: 20,
    },
  });
  return mergeStyles;
};
