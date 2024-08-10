import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {_isAndroid, _isIOS} from 'common/utils/PlatformCheck';
import {globalScreenWidth} from 'common/utils/ScreenDimensions';
import {isIPhoneX} from 'navigation/Stacks/MainTabNavigation';
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
      backgroundColor: colors.white,
      borderColor: colors.grey_008,
      justifyContent: 'space-between',
      // alignItems: 'flex-start',
      borderRadius: 3,
    },
    calendar: {
      right: 10,
    },
    date: {
      color: colors.grey_005,
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
    modalContainer: {
      height: 400,
    },
    error: {
      fontSize: FontSizes.regular,
      color: colors.red_002,
    },
    label: {
      marginBottom: -5,
      color: colors.primary_003,
    },
    fieldView: {
      width: '47%',
      borderRadius: 3,
    },
    attachFile: {
      color: colors.primary,
      marginTop: 16,
      marginBottom: 10,
    },
    icon: {
      marginTop: 20,
      right: 5,
      marginLeft: 5,
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
    bottomModalView: {
      backgroundColor: 'white',
      paddingTop: 15,
      maxHeight: '60%',
      height: _isIOS ? '45%' : undefined,
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    attachmentView: {
      marginBottom: 16,
      marginTop: 16,
      // width: '90%',
    },
    view: {
      marginLeft: 10,
      marginTop: 5,
      // width: '75%',
    },
    assignReportTo: {
      backgroundColor: colors.white,
      padding: 10,
      borderRadius: 3,
    },
    markAsCritical: {color: colors.primary},
    mic: {paddingTop: 14},
    containerStyles: {alignItems: 'flex-start'},
    spacingTilte: {marginTop: 10},
    buttonView: {
      justifyContent: 'space-between',
    },
    headerTextColor: {color: colors.primary_003, marginTop: -5},
    CloseIconStyle: {
      paddingHorizontal: 16,
    },
    BoxStyle: {
      backgroundColor: colors.white,
      borderRadius: 3,
      height: 70,
      flex: 1,
      paddingHorizontal: 4,
    },
    AddButton: {
      paddingBottom: isIPhoneX() ? 50 : _isAndroid ? 20 : 0,
    },
    assignView: {marginTop: -30},
    addVoiceNoteView: {marginTop: -20},
    priorityView: {marginTop: -15},
    timeStyle: {
      paddingLeft: _isIOS ? globalScreenWidth / 7.5 : globalScreenWidth / 6.7,
      color: colors.primary_003,
      // marginBottom: 10,
      position: 'absolute',
      bottom: 0,
    },
    currentTimeStyle: {
      paddingLeft: _isIOS ? globalScreenWidth / 1.45 : globalScreenWidth / 1.34,
      color: colors.primary_003,
      // marginBottom: 10,
      position: 'absolute',
      bottom: 0,
    },
  });
  return mergeStyles;
};
