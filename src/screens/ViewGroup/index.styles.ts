import {colors} from 'common/theme/colors';
import {_isIOS} from 'common/utils/PlatformCheck';
import {globalScreenHeight} from 'common/utils/ScreenDimensions';
import {Dimensions, StyleSheet} from 'react-native';
import {respHeight} from 'screens/Calendar/utils/responsive';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    groupIcon: {
      height: Dimensions.get('screen').height / 2.5,
      width: '100%',
      backgroundColor: colors.grey_008,
      alignItems: 'center',
      paddingTop: '8%',
      marginLeft: 0,
    },
    moreMenu: {
      width: 93,
      height: 54,
      justifyContent: 'center',
      paddingLeft: 16,
      marginTop: 22,
    },
    header: {
      position: 'absolute',
      width: '100%',
      // marginTop: 45,
      // zIndex: 1000,
      backgroundColor: colors.white,
      height: _isIOS ? 50 : 60,
      paddingTop: 10,
    },
    stickHeader: {
      width: '100%',
      height: _isIOS ? 50 : 60,
      zIndex: 1,
      top: _isIOS ? -10 : undefined,

      // backgroundColor: colors.white,
      // zIndex: -50,
    },
    backIconView: {
      position: 'absolute',
      top: 47,
      width: '100%',
      marginTop: _isIOS ? undefined : respHeight(-37),
      zIndex: _isIOS ? undefined : 1000,
      backgroundColor: colors.white,
      height: _isIOS ? 50 : 60,
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
    swipableModalDivide: {
      height: 1.5,
      width: '100%',
      backgroundColor: colors.grey_002,
      marginVertical: 20,
    },
    swipableShareText: {
      // marginLeft: 20,
      // textAlign: 'center',
      color: colors.black,
    },
    bottomModalView: {
      backgroundColor: 'white',
      paddingVertical: 15,
    },
    searchModalView: {
      backgroundColor: colors.white,
      // paddingTop: 16,
      // marginHorizontal: 0,
      // marginBottom: 0,
      // zIndex: 5000,
      // maxHeight: Dimensions.get('screen').height * 0.8,
      justifyContent: 'flex-end',
      margin: 0,
      marginTop: globalScreenHeight / 5,
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
      alignItems: 'center',
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    modalBack: {
      top: 2,
      marginLeft: 16,
    },
    extraHeight: {
      height: respHeight(50),
    },
    iconBackground: {
      backgroundColor: colors.primary_004,
      height: 48,
      width: 48,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30,
    },
    verticalMargin: {
      marginVertical: 8,
    },
    container: {
      marginBottom: 0,
    },
    listBottom: {
      paddingBottom: 50,
    },
  });
  return shareStyles;
};
