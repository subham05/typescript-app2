import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
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
    icon: {
      justifyContent: 'center',
      marginLeft: 20,
    },
    contactView: {
      marginLeft: 16,
    },
    contactSelected: {
      marginRight: 20,
      borderBottomWidth: 3,
      borderBottomColor: colors.primary,
      width: '47%',
      paddingBottom: 10,
    },
    contactNotSelected: {
      marginRight: 20,
      width: '47%',
      paddingBottom: 10,
    },
    contactText: {
      textAlign: 'center',
    },
  });
  return shareStyles;
};
