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
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.small,
    },
    gender: {
      marginRight: 35,
    },
    icon: {
      marginTop: 3,
      marginRight: 10,
    },
    genderText: {
      color: colors.grey_005,
    },
    error: {
      fontSize: FontSizes.small,
      color: colors.red_002,
    },
    label: {
      marginTop: 15,
    },
    save: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    saveButton: {
      marginTop: 15,
      backgroundColor: colors.primary,
      width: '47%',
      marginBottom: 16,
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
      marginBottom: 16,
    },
    inputDate: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      justifyContent: 'space-between',
    },
    calendar: {
      right: 10,
    },
    date: {
      color: colors.primary_003,
    },
    genderLabel: {marginTop: 14},
    pendingTask: {
      // textAlign: 'center',
      color: colors.black,
      // padding: 10,
      // paddingHorizontal: 23,
    },
    moreIcon: {marginTop: 3},
    moreContainer: {
      width: 80,
      alignItems: 'center',
      height: 32,
      justifyContent: 'center',
      marginTop: 22,
    },
    centeredView: {},
    modalView: {
      backgroundColor: 'white',
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
    marginAbove: {marginTop: 16},
  });
  return mergeStyles;
};
