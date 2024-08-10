import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
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
    icon: {
      justifyContent: 'center',
      backgroundColor: colors.white,
      height: 40,
      marginTop: 5,
      right: 10,
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
    item: {
      padding: 17,
      // flexDirection: 'row',
      // justifyContent: 'space-between',
      // alignItems: 'center',
    },
    placeholderStyle: {
      fontSize: FontSizes.small,
    },
    label: {
      marginTop: 15,
      marginBottom: 10,
    },
    labelHead: {
      marginTop: 25,
    },
    save: {
      padding: 10,
      textAlign: 'center',
      color: colors.white,
    },
    loginButton: {
      marginTop: 15,
      backgroundColor: colors.primary,
    },
    saveButton: {
      marginTop: 15,
      // backgroundColor: colors.primary,
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
    editIcon: {marginTop: 6},
    noData: {textAlign: 'center', marginTop: 50},
    marginTop: {marginTop: 16},
  });
  return mergeStyles;
};
