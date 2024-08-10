import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

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
    bottomModalView: {
      backgroundColor: 'white',
      paddingTop: 15,
      maxHeight: 350,
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    apply: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    applyButton: {
      height: 47,
      marginTop: 15,
      backgroundColor: colors.primary,
      width: '47%',
      borderRadius: 3,
    },
    close: {
      padding: 13,
      textAlign: 'center',
      color: colors.primary,
    },
    closeButton: {
      height: 47,
      marginTop: 15,
      backgroundColor: colors.grey_001,
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
