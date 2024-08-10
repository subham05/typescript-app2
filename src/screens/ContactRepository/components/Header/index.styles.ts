import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Dimensions, StyleSheet} from 'react-native';

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
      // marginLeft: 16,
    },
    contactSelected: {
      marginHorizontal: 10,
      borderBottomWidth: 4,
      borderBottomColor: colors.primary,
      width: Dimensions.get('screen').width / 3.5,
      paddingBottom: 10,
    },
    contactNotSelected: {
      marginHorizontal: 10,
      width: Dimensions.get('screen').width / 3.5,
      paddingBottom: 10,
    },
    contactText: {
      textAlign: 'center',
    },
  });
  return shareStyles;
};
