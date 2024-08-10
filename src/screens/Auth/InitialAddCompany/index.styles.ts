import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    companiesContainer: {
      paddingBottom: 40,
    },
    inputRow: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.small,
      width: '47%',
    },
    contactContainerStyle: {
      height: 50,
      width: '100%',
      backgroundColor: colors.white,
    },
    gpsIcon: {width: 20, height: 20, tintColor: colors.primary_003},
    locationTitle: {
      color: colors.black,
      marginHorizontal: 20,
      marginBottom: 8,
    },
    headerContainer: {height: 50},
    closeStyle: {
      position: 'absolute',
      top: -7,
      left: 57,
      backgroundColor: colors.grey_001,
      borderRadius: 8,
      borderColor: colors.grey_003,
      borderWidth: 0.3,
    },
    companyLogoStyle: {
      width: 65,
      height: 65,
      position: 'relative',
    },
    dropdown: {
      padding: 10,
      borderWidth: 1,
      height: 40,
      fontSize: 15,
      borderColor: colors.white,
      backgroundColor: colors.white,
      borderRadius: 5,
      color: '#565656',
    },
    dropdownContainer: {
      borderColor: colors.grey_004,
    },
    modalContainer: {
      height: 400,
    },
    error: {
      fontSize: FontSizes.small,
      color: colors.red_002,
    },
    save: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    saveButton: {
      marginTop: 15,
      // backgroundColor: colors.primary,
      width: '47%',
      marginBottom: 16,
      borderRadius: 3,
    },
    addMore: {
      padding: 13,
      textAlign: 'center',
      color: colors.primary,
    },
    addMoreButton: {
      marginTop: 15,
      // backgroundColor: colors.grey_001,
      width: '47%',
      // borderWidth: 1,
      // borderColor: colors.primary,
      marginBottom: 16,
      borderRadius: 3,
    },
    fieldView: {
      width: '47%',
    },
    rowVerticalStyle: {alignItems: 'flex-start'},
    item: {
      padding: 17,
      // flexDirection: 'row',
      // justifyContent: 'space-between',
      // alignItems: 'center',
    },
    PlaceholderStyle: {
      fontSize: FontSizes.small,
    },
    label: {
      marginTop: 15,
      marginBottom: 5,
      color: colors.primary_003,
    },
    companyLogo: {
      height: 65,
      width: 65,
      borderRadius: 5,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.black,
      borderStyle: 'dashed',
      marginTop: 5,
    },
    saveEditBtn: {
      marginTop: 15,
      // backgroundColor: colors.primary,
      // width: '47%',
      marginHorizontal: 20,
      marginBottom: 16,
      borderRadius: 3,
    },
  });
  return mergeStyles;
};
