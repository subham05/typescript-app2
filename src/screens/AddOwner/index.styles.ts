import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Dimensions, Platform, StyleSheet} from 'react-native';

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
    companyLogoStyle: {
      width: 65,
      height: 65,
      position: 'relative',
    },
    closeStyle: {
      position: 'absolute',
      top: -7,
      left: 57,
      backgroundColor: colors.grey_001,
      borderRadius: 8,
      borderColor: colors.grey_003,
      borderWidth: 0.3,
    },
    dropdown: {
      padding: 10,
      borderWidth: 1,
      height: 40,
      fontSize: 15,
      borderColor: colors.white,
      backgroundColor: colors.white,
      borderRadius: 5,
    },
    dropdownContainer: {
      borderColor: colors.grey_004,
    },
    extensionAlign: {alignItems: 'flex-start'},
    extensionWidth: {width: '73%'},
    companyExtWidth: {width: '25%'},
    gpsIcon: {width: 20, height: 20, tintColor: colors.primary_003},
    headerContainer: {height: 50},
    locationTitle: {
      color: colors.black,
      marginHorizontal: 20,
      marginBottom: 8,
    },
    modalContainer: {
      height: 400,
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
      marginTop: 10,
      marginBottom: 10,
      color: colors.primary_003,
      textAlign: 'left',
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
      borderWidth: 1,
      // borderColor: colors.primary,
      marginBottom: 16,
      borderRadius: 3,
    },
    fieldView: {
      width: '47%',
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
    inputDate: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      justifyContent: 'space-between',
    },
    calendar: {
      right: 10,
    },
    date: {
      color: colors.primary_003,
    },
    datePickerMargin: {marginTop: 16},
    pendingTask: {
      // textAlign: 'center',
      color: colors.black,
      // padding: 10,
      // paddingHorizontal: 23,
    },
    moreIcon: {marginTop: 3},
    moreContainer: {
      width: 80,
      alignItems: 'center',
      height: 32,
      justifyContent: 'center',
      marginTop: 22,
    },
    centeredView: {},
    modalView: {
      backgroundColor: 'white',
      padding: 15,
    },
    shareVia: {
      padding: 15,
    },
    modal: {
      alignSelf: 'flex-end',
    },
    reopenModal: {
      padding: 15,
      color: colors.primary,
    },
    image: {
      height: 47,
      width: 47,
    },
    shareText: {
      textAlign: 'center',
      color: colors.black,
    },
    cancel: {
      marginTop: 30,
    },
    genderLabel: {color: colors.primary_003},
    headerTextColor: {color: colors.primary_003},
    companyLogo: {
      height: 65,
      width: 65,
      borderRadius: 5,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.grey_008,
      borderStyle: 'dashed',
    },
    rowVerticalStyle: {alignItems: 'flex-start'},
    modalViewImage: {
      marginLeft: 20,
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    bottomModalView: {
      backgroundColor: 'white',
      paddingTop: 15,
      maxHeight: '60%',
      height: Platform.OS === 'ios' ? '45%' : undefined,
      paddingBottom: 60,
    },
    attachmentView: {
      marginBottom: 16,
      marginTop: 16,
    },
    companyView: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginRight: 8,
      paddingHorizontal: 5,
      borderRadius: 5,
      paddingVertical: 2,
      zIndex: 999999999999,
      backgroundColor: colors.grey_002,
    },
    containerEmptyStyle: {
      alignItems: 'center',
      height: Dimensions.get('screen').height / 4,
      justifyContent: 'center',
    },
    modalStyle: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    listingStackStyle: {
      paddingVertical: 5,
    },
    textViewStyle: {
      paddingHorizontal: 10,
    },
    saveButtonEdit: {
      marginTop: 15,
      // backgroundColor: colors.primary,
      width: '100%',
      marginBottom: 16,
      borderRadius: 3,
    },
  });
  return mergeStyles;
};
