import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    companiesContainer: {
      paddingBottom: 40,
    },
    image: {
      height: 92,
      width: 92,
      borderRadius: 45,
    },
    view: {
      marginLeft: 15,
      marginTop: 7,
    },
    input: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.small,
    },
    showInput: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.small,
      color: colors.primary_003,
    },
    icon: {
      justifyContent: 'center',
      backgroundColor: colors.white,
      height: 40,
      marginTop: 5,
      right: 10,
    },
    iconImage: {
      top: 62,
      left: 55,
      position: 'absolute',
      padding: 7,
      height: 32,
      width: 32,
      overflow: 'hidden',
      borderRadius: 16,
      backgroundColor: colors.primary,
    },
    dropdown: {
      padding: 10,
      borderWidth: 1,
      marginTop: 5,
      height: 40,
      fontSize: 15,
      borderColor: colors.white,
      backgroundColor: colors.white,
      borderRadius: 5,
      color: colors.grey_004,
    },
    dropdownContainer: {
      borderColor: colors.grey_005,
    },
    modalContainer: {
      height: 400,
    },
    label: {
      marginTop: 15,
    },
    labelHead: {
      marginTop: 25,
    },
    name: {marginTop: 16},
    share: {
      padding: 10,
      textAlign: 'center',
      color: colors.white,
    },
    shareButton: {
      marginTop: 15,
      // backgroundColor: colors.primary,
      width: 150,
    },
    saveButton: {
      marginTop: 15,
      backgroundColor: colors.primary,
      alignSelf: 'flex-end',
      width: '40%',
    },
    buttonView: {
      justifyContent: 'space-between',
    },
    fieldView: {
      width: '48%',
    },
    dob: {
      backgroundColor: colors.white,
    },
    divider: {
      marginTop: 36,
    },
    header: {alignItems: 'center'},
    noData: {textAlign: 'center', marginTop: 50},
    marginTop: {marginTop: 16},
    companyLabel: {
      marginTop: 15,
      marginBottom: 10,
    },
  });
  return mergeStyles;
};
