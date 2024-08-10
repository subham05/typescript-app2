import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    view: {
      marginTop: 5,
    },
    smallLabel: {
      color: colors.primary_003,
      marginBottom: 5,
      width: 65,
    },
    smallIcon: {
      marginRight: 5,
    },
    date: {
      marginTop: 3,
    },
    priority: {
      marginLeft: 4,
    },
    button: {
      width: '30%',
      alignSelf: 'flex-end',
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
    attachFile: {
      color: colors.primary,
      marginBottom: 22,
      // marginTop: 16,
      // marginBottom: 10,
    },
    subtask: {
      marginRight: '10%',
    },
    icon: {
      // marginTop: 20,
      right: 5,
      marginBottom: 22,
    },
    buttonsGroup: {marginVertical: 10},
    groupButton: {
      width: '30%',
      alignSelf: 'flex-end',
      top: -10,
    },
    save: {
      padding: 11.5,
      textAlign: 'center',
      color: colors.white,
    },
    saveButton: {
      marginTop: 15,
      backgroundColor: colors.primary,
      width: 100,
      marginBottom: 16,
      left: -100,
    },
    addMore: {
      padding: 10,
      textAlign: 'center',
      color: colors.primary,
    },
    addMoreButton: {
      marginTop: 15,
      backgroundColor: colors.grey_001,
      width: 100,
      borderWidth: 1,
      borderColor: colors.primary,
      marginBottom: 16,
      left: -100,
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
    inputText: {
      height: 80,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.grey_002,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.regular,
      color: colors.primary_003,
      textAlignVertical: 'top',
      width: Dimensions.get('screen').width - 70,
    },
  });
  return mergeStyles;
};
