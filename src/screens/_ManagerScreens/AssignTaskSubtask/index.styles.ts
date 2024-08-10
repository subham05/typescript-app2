import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    companiesContainer: {
      paddingBottom: 40,
    },
    inputDate: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.grey_008,
      justifyContent: 'space-between',
      // alignItems: 'flex-start',
      borderRadius: 3,
    },
    calendar: {
      right: 10,
    },
    icon: {
      marginTop: 20,
      right: 5,
    },
    date: {
      color: colors.primary_003,
    },
    dropdown: {
      padding: 10,
      borderWidth: 1,
      marginTop: 5,
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
    error: {
      fontSize: FontSizes.small,
      color: colors.red,
    },
    label: {
      marginTop: 15,
    },
    add: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    addButton: {
      marginTop: 15,
      backgroundColor: colors.primary,
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
    buttonView: {
      justifyContent: 'space-between',
    },
    fieldView: {
      width: '47%',
      borderRadius: 3,
    },
    attachFile: {
      color: colors.primary,
      marginTop: 16,
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
    contactView: {
      marginLeft: 16,
      marginVertical: 10,
    },
    contactSelected: {
      marginRight: 20,
      borderBottomWidth: 3,
      borderBottomColor: colors.primary,
      width: '45%',
      paddingBottom: 10,
    },
    contactNotSelected: {
      marginRight: 20,
      width: '45%',
      paddingBottom: 10,
    },
    contactText: {
      textAlign: 'center',
    },
    bottomModalView: {
      backgroundColor: 'white',
      paddingTop: 15,
      maxHeight: '60%',
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderColor: colors.grey_008,
      borderWidth: 1,
      marginTop: 16,
      borderRadius: 3,
      // width: '90%',
    },
  });
  return mergeStyles;
};
