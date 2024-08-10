import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Dimensions, StyleSheet} from 'react-native';

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
      padding: 8,
      borderRadius: 200,
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
    name: {
      width: Dimensions.get('screen').width * 0.62,
    },
    share: {
      padding: 10,
      textAlign: 'center',
      color: colors.white,
    },
    shareButton: {
      alignSelf: 'center',
      marginTop: 15,
      backgroundColor: colors.primary,
      width: 115,
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
    centeredView: {},
    modalView: {
      backgroundColor: 'white',
      padding: 15,
    },
    shareVia: {
      padding: 15,
    },
    inputText: {
      height: 80,
      borderWidth: 1,
      paddingTop: 10,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.grey_002,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.regular,
      textAlignVertical: 'top',
      color: colors.primary_003,
      width: Dimensions.get('screen').width - 70,
    },
    cancel: {
      marginTop: 30,
    },
    item: {
      padding: 17,
      // flexDirection: 'row',
      // justifyContent: 'space-between',
      // alignItems: 'center',
    },
    placeholderStyle: {
      fontSize: FontSizes.small,
    },
  });
  return mergeStyles;
};
