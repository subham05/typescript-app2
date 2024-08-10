import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const inviteStyles = StyleSheet.create({
    head: {marginBottom: 16},
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderRadius: 3,
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
    arrow: {
      top: 10,
    },
    icon: {
      height: 20,
      width: 20,
      borderRadius: 20,
      borderWidth: 2,
      // marginRight: 20,
    },
    companyName: {
      width: 160,
    },
    shareText: {
      color: colors.black,
      paddingVertical: 10,
      marginLeft: 20,
    },
    filterWidth: {
      width: 166,
      height: 177,
      justifyContent: 'center',
      marginTop: 22,
    },
    configureWidth: {
      width: 166,
      height: 74,
      justifyContent: 'center',
      marginTop: 22,
    },
    leftContainer: {right: -7},
  });
  return inviteStyles;
};
