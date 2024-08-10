import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    groupIcon: {
      height: Dimensions.get('screen').height / 2.5,
      width: '100%',
      backgroundColor: colors.grey_008,
      alignItems: 'center',
      paddingTop: '7%',
      marginLeft: 0,
    },
    groupImage: {marginLeft: 40},
    moreMenu: {width: 80, alignItems: 'center'},
    header: {
      position: 'absolute',
      width: '100%',
      top: 5,
      // zIndex: 1000,
      backgroundColor: colors.white,
      height: 35,
    },
    stickHeader: {
      width: '100%',
      height: 35,
      backgroundColor: colors.white,
      zIndex: -50,
    },
    footer: {
      top: -8,
      left: 1,
      position: 'absolute',
      width: '100%',
    },
    addMember: {
      // position: 'absolute',
      right: 16,
      top: 5,
    },
    back: {
      top: 5,
      left: 16,
    },
    search: {
      left: 15,
    },
    groupName: {
      position: 'absolute',
      // marginTop: 16,
      marginLeft: -10,
    },
    edit: {
      position: 'absolute',
      right: 35,
      top: Dimensions.get('screen').height / 2.8,
    },
    head: {
      marginTop: 10,
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
    swipablemodalDevide: {
      height: 1.5,
      width: '100%',
      backgroundColor: colors.grey_002,
      marginVertical: 20,
    },
    swipableshareText: {
      // marginLeft: 20,
      // textAlign: 'center',
      color: colors.black,
    },
    bottomModalView: {
      backgroundColor: 'white',
      paddingVertical: 15,
    },
    searchModalView: {
      backgroundColor: 'white',
      paddingTop: 16,
      // zIndex: 5000,
      // maxHeight: Dimensions.get('screen').height * 0.8,
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderBottomColor: colors.grey_008,
      borderBottomWidth: 1,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    modalBack: {
      top: 7,
      marginLeft: 16,
    },
  });
  return shareStyles;
};
