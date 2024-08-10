import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
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
    arrow: {
      top: 10,
    },
    count: {
      color: colors.white,
      padding: 1,
      backgroundColor: colors.primary,
      textAlign: 'center',
      borderRadius: 10,
      height: 20,
      width: 20,
      top: 9,
      left: 9,
    },
  });
  return shareStyles;
};
