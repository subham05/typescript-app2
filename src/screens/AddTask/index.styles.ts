import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {isIPhoneX} from 'navigation/Stacks/MainTabNavigation';
import {Dimensions, Platform, StyleSheet} from 'react-native';

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
      borderRadius: 3,
    },
    calendar: {
      right: 10,
    },
    icon: {
      marginTop: 20,
      right: 5,
      marginLeft: 5,
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
      marginBottom: -5,
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
    priority: {
      marginTop: 5,
    },
    attachFile: {
      marginTop: 16,
      // marginBottom: 10,
    },
    subtask: {
      marginRight: '10%',
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
      height: Platform.OS === 'ios' ? '45%' : undefined,
    },
    bottomPadding: {
      paddingBottom: Dimensions.get('screen').height / 7,
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
    headerTextColor: {color: colors.primary_003},
    markAsCritical: {color: colors.primary},
    mic: {paddingTop: 14},
    containerStyles: {alignItems: 'flex-start'},
    modalView: {
      backgroundColor: 'white',
      padding: 15,
      width: Dimensions.get('screen').width - 30,
      height: Dimensions.get('screen').height / 4,
    },
    shareVia: {
      padding: 15,
      textAlign: 'center',
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
    closeIcon: {alignSelf: 'flex-end'},
    BoxStyle: {
      backgroundColor: colors.white,
      borderRadius: 3,
      height: 70,
      flex: 1,
      paddingHorizontal: 4,
    },

    CloseIconStyle: {
      paddingHorizontal: 16,
    },
    AddButton: {
      paddingBottom: isIPhoneX() ? 50 : Platform.OS === 'android' ? 20 : 0,
    },
    relatedTaskView: {
      marginLeft: 10,
    },
    timeStyle: {
      paddingLeft:
        Platform.OS === 'ios'
          ? Dimensions.get('screen').width / 7.5
          : Dimensions.get('screen').width / 6.7,
      color: colors.primary_003,
      // marginBottom: 10,
      position: 'absolute',
      bottom: 0,
    },
    currentTimeStyle: {
      paddingLeft:
        Platform.OS === 'ios'
          ? Dimensions.get('screen').width / 1.45
          : Dimensions.get('screen').width / 1.34,
      color: colors.primary_003,
      // marginBottom: 10,
      position: 'absolute',
      bottom: 0,
    },
  });
  return mergeStyles;
};
