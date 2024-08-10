import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const selectMemberStyles = StyleSheet.create({
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderRadius: 3,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    selectAll: {
      justifyContent: 'flex-end',
      marginBottom: 16,
    },
    selectAllText: {
      color: colors.primary_002,
      marginRight: 5,
    },
    invite: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    inviteButton: {
      marginBottom: 15,
      marginHorizontal: 16,
      backgroundColor: colors.primary,
    },
    modalDevide: {
      marginVertical: 10,
    },
    centeredView: {
      flex: 1,
      backgroundColor: colors.black_001,
    },
    modalMainView: {
      alignSelf: 'flex-end',
      marginTop: 25,
      marginRight: 25,
    },
    modalView: {
      backgroundColor: 'white',
      padding: 15,
      width: Dimensions.get('screen').width - 250,
    },
    view: {
      alignItems: 'center',
    },
    shareText: {
      textAlign: 'center',
      color: colors.black,
    },
    iconManager: {
      justifyContent: 'center',
      // marginLeft: 10,
      // marginLeft: 26,
      marginRight: 20,
      marginTop: 2,
    },
    iconEmployee: {
      justifyContent: 'center',
      // marginLeft: 10,
      // marginLeft: 20,
      marginRight: 20,
      marginTop: 2,
    },
    option: {
      // alignItems: 'center',
      marginLeft: 10,
      paddingVertical: 10,
    },
    menuOptions: {
      width: 150,
      marginLeft: Dimensions.get('screen').width * 0.55,
      marginTop: 20,
    },
    bottomModalView: {
      backgroundColor: 'white',
      paddingVertical: 35,
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    dot: {
      padding: 1,
      backgroundColor: colors.primary,
      borderRadius: 10,
      height: 8,
      width: 8,
      top: 4,
      left: 8,
    },
    apply: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    applyButton: {
      marginTop: 15,
      backgroundColor: colors.primary,
      width: '47%',
    },
    close: {
      padding: 15,
      textAlign: 'center',
      color: colors.primary,
    },
    closeButton: {
      height: 50,
      marginTop: 15,
      backgroundColor: colors.grey_001,
      width: '47%',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    buttonView: {
      justifyContent: 'space-between',
    },
  });
  return selectMemberStyles;
};
