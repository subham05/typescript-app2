import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
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
      borderRadius: 3,
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
    login: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    loginButton: {
      marginTop: 15,
      backgroundColor: colors.primary,
      width: '100%',
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
    },
  });
  return mergeStyles;
};
