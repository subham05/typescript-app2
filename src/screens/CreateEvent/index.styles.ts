import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {globalScreenWidth} from 'common/utils/ScreenDimensions';
import {isIPhoneX} from 'navigation/Stacks/MainTabNavigation';
import {Dimensions, Platform, StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    companiesContainer: {
      paddingBottom: 40,
    },
    input: {
      borderWidth: 1,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      color: colors.black,
    },
    inputDate: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    calendar: {
      right: 10,
    },
    date: {
      color: colors.primary_003,
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
    error: {
      fontSize: FontSizes.small,
      color: colors.red,
    },
    label: {
      top: 10,
      color: colors.primary_003,
    },
    invitedLabel: {
      marginTop: 10,
      marginBottom: 5,
      color: colors.primary_003,
    },
    save: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    saveButton: {
      marginTop: 15,
      backgroundColor: colors.primary,
      width: '47%',
      borderRadius: 3,
    },
    invite: {
      padding: FontSizes.small,
      textAlign: 'center',
      color: colors.primary,
    },
    inviteButton: {
      marginTop: 15,
      backgroundColor: colors.grey_001,
      width: '47%',
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 3,
    },
    buttonView: {
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    dateView: {
      justifyContent: 'space-between',
      marginBottom: 0,
    },
    fieldView: {
      width: '47%',
      borderRadius: 3,
    },
    priority: {
      marginTop: 5,
    },
    emergency: {
      borderWidth: 1,
      borderColor: colors.emergencyText,
      backgroundColor: colors.emergency,
      padding: 10,
      marginRight: 10,
    },
    emergencyText: {
      color: colors.emergencyText,
    },
    high: {
      borderWidth: 1,
      borderColor: colors.grey_001,
      padding: 10,
      marginRight: 10,
    },
    highText: {
      color: colors.red,
    },
    medium: {
      borderWidth: 1,
      borderColor: colors.grey_001,
      padding: 10,
      marginRight: 10,
    },
    mediumText: {
      color: colors.mediumText,
    },
    low: {
      borderWidth: 1,
      borderColor: colors.grey_001,
      padding: 10,
    },
    lowText: {
      color: colors.primary,
    },
    attachFile: {
      color: colors.primary,
      marginTop: 16,
    },
    toggle: {color: colors.primary_003},
    toggleWidth: {
      width: globalScreenWidth / 3.2,
    },
    headerStyle: {width: globalScreenWidth - 36},
    switchContainer: {
      width: 31,
      height: 20,
      borderRadius: 15,
      marginTop: 2,
    },
    switchContainerOff: {
      width: 31,
      height: 20,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.black,
    },
    switchCircle: {
      width: 16,
      height: 16,
      borderRadius: 8,
    },
    modalView: {
      backgroundColor: 'white',
      padding: 15,
      paddingVertical: 26,
      height:
        Platform.OS === 'ios'
          ? Dimensions.get('screen').height / 1.7
          : undefined,
      width: Dimensions.get('screen').width - 40,
      borderRadius: 3,
    },
    modalHeader: {textAlign: 'center'},
    inputModal: {
      backgroundColor: colors.grey_001,
      color: colors.black,
      fontSize: FontSizes.regular,
      fontFamily: AppFonts.regular,
      borderRadius: 3,
      width: Dimensions.get('screen').width - 73,
    },
    inputModalError: {
      backgroundColor: colors.grey_001,
      // color: colors.black,
      fontSize: FontSizes.regular,
      fontFamily: AppFonts.regular,
      borderRadius: 3,
      borderWidth: 0.5,
      borderColor: colors.red,
      width: Dimensions.get('screen').width - 73,
    },
    modalButton: {width: '48%', alignSelf: 'center'},
    view: {
      // marginLeft: 10,
      // marginTop: 5,
      // width: '75%',
    },
    bottom: {
      paddingBottom: 16,
    },
    bottomSpace: {
      paddingBottom: isIPhoneX() ? 50 : Platform.OS === 'android' ? 20 : 0,
    },
    timezone: {zIndex: 5, paddingBottom: 16},
    viewStyle: {zIndex: 5, paddingBottom: 16},
    modalError: {
      fontSize: FontSizes.small,
      color: colors.red,
      marginTop: -10,
    },
    showParticipants: {
      marginTop: 15,
    },
  });
  return mergeStyles;
};
