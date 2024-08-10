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
      marginTop: 2,
    },
    priority: {
      marginLeft: 4,
    },
    centeredView: {},
    modalView: {
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 3,
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
      width: '40%',
      alignSelf: 'center',
      borderRadius: 3,
    },
    button: {
      width: '30%',
      alignSelf: 'flex-end',
    },
    attachFile: {
      color: colors.primary,
      // marginTop: 16,
      // marginBottom: 10,
    },
    subtask: {
      marginRight: '10%',
    },
    icon: {
      // marginTop: 20,
      right: 5,
    },
    buttonsGroup: {marginVertical: 10},
    share: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    shareButton: {
      marginBottom: 15,
      marginHorizontal: '30%',
      backgroundColor: colors.primary,
      borderRadius: 3,
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
    contentStyle: {
      backgroundColor: 'transparent',
      height: 40,
    },
    tooltipText: {
      backgroundColor: colors.white,
      color: colors.primary_002,
      borderColor: colors.primary_002,
      borderRadius: 4,
      borderWidth: 1,
      paddingHorizontal: 10,
    },
  });
  return mergeStyles;
};
