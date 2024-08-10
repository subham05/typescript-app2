import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    view: {
      flex: 1,
    },
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
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
    selectAll: {
      justifyContent: 'flex-end',
      marginBottom: 16,
      right: 5,
    },
    selectAllText: {
      color: colors.primary_002,
      marginRight: 5,
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
    shareButtonView: {
      flex: 0.1,
      backgroundColor: colors.grey_001,
    },
    modalDevide: {
      marginVertical: 10,
    },
    shareText: {
      textAlign: 'center',
      color: colors.black,
    },
    iconManager: {
      justifyContent: 'center',
      // marginLeft: 10,
      // marginLeft: 26,
      marginRight: 20,
      marginTop: 2,
    },
    iconEmployee: {
      justifyContent: 'center',
      // marginLeft: 10,
      // marginLeft: 20,
      marginRight: 20,
      marginTop: 2,
    },
    // icon: {
    //   justifyContent: 'center',
    //   marginLeft: 20,
    // },
    option: {
      // alignItems: 'center',
      marginLeft: 10,
      paddingVertical: 10,
    },
    menuOptions: {
      width: 150,
      marginLeft: Dimensions.get('screen').width * 0.55,
      marginTop: 20,
    },
    bottomModalView: {
      backgroundColor: 'white',
      paddingTop: 15,
      maxHeight: 380,
      borderTopRightRadius: 6,
      borderTopLeftRadius: 6,
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    dot: {
      padding: 1,
      backgroundColor: colors.primary,
      borderRadius: 10,
      height: 8,
      width: 8,
      top: 4,
      left: 8,
    },
    apply: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    applyButton: {
      marginTop: 15,
      backgroundColor: colors.primary,
      width: '47%',
      borderRadius: 3,
    },
    close: {
      padding: 15,
      textAlign: 'center',
      color: colors.primary,
    },
    closeButton: {
      height: 50,
      marginTop: 15,
      backgroundColor: colors.white,
      width: '47%',
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 3,
    },
    buttonView: {
      justifyContent: 'space-between',
      paddingBottom: 10,
    },
  });
  return shareStyles;
};
